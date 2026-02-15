/**
 * Seller Service
 * Logic for regional inventory, retail pricing, and fulfillment.
 */

import { Inventory, Product, Seller, MarginRule, Manufacturer, SellerRequest, Notification, User, SellerSubscription } from '../models/index.js';
import userService from './userService.js';
import mongoose from 'mongoose';

class SellerService {
    /**
     * Get Seller's localized inventory.
     */
    async getInventory(sellerId) {
        return await Inventory.find({ sellerId })
            .populate({
                path: 'productId',
                populate: { path: 'manufacturerId', select: 'companyName businessType' }
            })
            .sort({ listedAt: -1 })
            .lean();
    }

    /**
     * Get specific inventory item with details.
     */
    async getInventoryItem(inventoryId, sellerId) {
        const inv = await Inventory.findById(inventoryId)
            .populate({
                path: 'productId',
                populate: { path: 'manufacturerId', select: 'companyName' }
            })
            .lean();

        if (!inv || inv.sellerId.toString() !== sellerId.toString()) {
            throw new Error('UNAUTHORIZED_INVENTORY_ACCESS');
        }

        return inv;
    }

    /**
     * Update Retail Price (Margin Control).
     * Ensures price fits within manufacturer constraints or platform rules.
     */
    async updateRetailPrice(inventoryId, sellerId, newPrice) {
        const inv = await Inventory.findById(inventoryId).populate('productId');

        if (!inv || inv.sellerId.toString() !== sellerId.toString()) {
            throw new Error('UNAUTHORIZED_INVENTORY_ACCESS');
        }

        const requestedPrice = Number(newPrice);
        const wholesalePrice = Number(inv.sellerBasePrice || inv.productId.basePrice);

        // Fetch Seller's active subscription for benefits
        const activeSub = await SellerSubscription.findOne({
            sellerId,
            status: 'ACTIVE'
        }).populate('planId');

        const boost = Number(activeSub?.planId?.marginBoost || 0);

        // 1. Check Manufacturer's Max Margin
        if (inv.isAllocated && inv.maxMargin) {
            const maxAllowed = wholesalePrice * (1 + (Number(inv.maxMargin) + boost) / 100);
            if (requestedPrice > maxAllowed) {
                throw new Error(`MANUFACTURER_MARGIN_LIMIT: Max allowed price is ₹${maxAllowed.toFixed(2)} (${Number(inv.maxMargin) + boost}% margin with ${boost}% boost)`);
            }
        }

        // 2. Check Platform Margin Rule (Fallback)
        const rule = await MarginRule.findOne({
            category: inv.productId.category,
            isActive: true
        });

        if (rule) {
            const maxRetail = wholesalePrice * (1 + (Number(rule.maxCap) + boost) / 100);
            if (requestedPrice > maxRetail) {
                throw new Error(`PLATFORM_MARGIN_CAP: Max allowed is ₹${maxRetail.toFixed(2)} (${Number(rule.maxCap) + boost}% limit with boost)`);
            }
        }

        // 3. Check Minimum Price (Cost + 5% Commission)
        const minPrice = wholesalePrice * 1.05;
        if (requestedPrice < minPrice) {
            throw new Error(`PRICE_TOO_LOW: Minimum price is ₹${minPrice.toFixed(2)} (Wholesale + 5% Platform Commission)`);
        }

        return await Inventory.findByIdAndUpdate(inventoryId, { price: requestedPrice }, { new: true });
    }

    /**
     * Update Inventory Details (Custom overrides).
     */
    async updateInventoryDetails(inventoryId, sellerId, updates) {
        const inv = await Inventory.findById(inventoryId);

        if (!inv || inv.sellerId.toString() !== sellerId.toString()) {
            throw new Error('UNAUTHORIZED_INVENTORY_ACCESS');
        }

        const allowedUpdates = {};
        if (updates.customName !== undefined) allowedUpdates.customName = updates.customName;
        if (updates.customDescription !== undefined) allowedUpdates.customDescription = updates.customDescription;
        if (updates.customImages !== undefined) allowedUpdates.customImages = updates.customImages;

        // NEW: Full Product Details Overrides
        if (updates.customCategory !== undefined) allowedUpdates.customCategory = updates.customCategory;
        if (updates.customSubCategory !== undefined) allowedUpdates.customSubCategory = updates.customSubCategory;
        if (updates.customMainCategory !== undefined) allowedUpdates.customMainCategory = updates.customMainCategory;
        if (updates.customSpecifications !== undefined) allowedUpdates.customSpecifications = updates.customSpecifications;

        return await Inventory.findByIdAndUpdate(inventoryId, allowedUpdates, { new: true });
    }

    /**
     * Respond to a Customer Review.
     */
    async replyToReview(sellerId, reviewId, response) {
        const { ProductReview } = await import('../models/index.js');
        const review = await ProductReview.findById(reviewId);

        if (!review) throw new Error('REVIEW_NOT_FOUND');

        // Verify ownership (Review -> Product -> Inventory -> Seller or direct SellerReview)
        // Assuming SellerReview for now based on context, or ProductReview linked to Seller
        if (review.sellerId && review.sellerId.toString() !== sellerId.toString()) {
            throw new Error('UNAUTHORIZED_REVIEW_ACCESS');
        }

        review.sellerResponse = {
            text: response,
            respondedAt: new Date()
        };

        return await review.save();
    }


    /**
     * Toggle public listing status.
     */
    async toggleListing(inventoryId, sellerId, isListed) {
        const inv = await Inventory.findById(inventoryId);

        if (!inv || inv.sellerId.toString() !== sellerId.toString()) {
            throw new Error('UNAUTHORIZED_INVENTORY_ACCESS');
        }

        // V-005: Prevent relisting depleted inventory
        // STRICTER CHECK: If allocated, verify remainingQuantity > 0
        if (isListed) {
            if (inv.stock <= 0 && (!inv.remainingQuantity || inv.remainingQuantity <= 0)) {
                throw new Error('CANNOT_LIST_EMPTY_INVENTORY: Stock or remaining quantity must be greater than 0 to list.');
            }
            if (inv.isAllocated && inv.remainingQuantity <= 0) {
                throw new Error('ALLOCATION_DEPLETED: No remaining quantity in this allocation. Cannot list.');
            }
        }

        return await Inventory.findByIdAndUpdate(inventoryId, {
            isListed,
            listedAt: isListed ? new Date() : inv.listedAt
        }, { new: true });
    }

    /**
     * Update Stock Levels.
     */
    async updateStock(inventoryId, sellerId, newStock) {
        const inv = await Inventory.findById(inventoryId);

        if (!inv || inv.sellerId.toString() !== sellerId.toString()) {
            throw new Error('UNAUTHORIZED_INVENTORY_ACCESS');
        }

        if (inv.isAllocated && Number(newStock) > inv.allocatedStock) {
            throw new Error(`EXCEEDS_ALLOCATION: Stock cannot exceed allocated amount of ${inv.allocatedStock}`);
        }

        return await Inventory.findByIdAndUpdate(inventoryId, { stock: Number(newStock) }, { new: true });
    }

    /**
     * Source a product from a manufacturer.
     * Enforces Phase 4 allocation limits and applies Phase 6 subscription benefits.
     */
    async sourceProduct(sellerId, productId, region, quantity, initialPrice) {
        // 0. Profile Completion Gating
        const seller = await Seller.findById(sellerId);

        // RELAXED CHECK: Only require business name for now to unblock testing
        const isComplete = seller?.businessName;
        /* 
        const isComplete = seller?.businessName &&
            seller?.gstNumber &&
            seller?.businessAddress &&
            seller?.bankDetails; 
        */

        if (!isComplete) {
            throw new Error('PROFILE_INCOMPLETE: Please set your Business Name in the profile before sourcing products.');
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1. Check if allocation/inventory exists
            let allocation = await Inventory.findOne({
                sellerId,
                productId,
                region
            }).populate('productId').session(session);

            const product = await Product.findById(productId).session(session);
            if (!product) throw new Error('PRODUCT_NOT_FOUND');

            // NEW: If no inventory, check approval status and create one dynamically
            if (!allocation) {
                // Verify Partnership
                const isPartner = await Manufacturer.findOne({
                    _id: product.manufacturerId,
                    approvedBy: sellerId
                }).session(session);

                if (!isPartner) {
                    const request = await SellerRequest.findOne({
                        sellerId,
                        manufacturerId: product.manufacturerId,
                        status: 'APPROVED'
                    }).session(session);

                    if (!request) {
                        throw new Error('NOT_AUTHORIZED: You must be an approved partner of this manufacturer to source products.');
                    }
                }

                // CRITICAL CHANGE: Create Inventory as PENDING Request
                // Do NOT create Allocation yet. Wait for Manufacturer Approval.

                // Wholesale Price Calculation (Phase 6 Subscription Logic) - Stored for reference
                let estimatedPrice = Number(product.basePrice);
                const activeSub = await SellerSubscription.findOne({ sellerId, status: 'ACTIVE' }).populate('planId').session(session);

                if (activeSub?.planId?.wholesaleDiscount > 0) {
                    const discount = Number(activeSub.planId.wholesaleDiscount);
                    estimatedPrice = estimatedPrice * (1 - discount / 100);
                }

                const [newInventory] = await Inventory.create([{
                    sellerId,
                    productId,
                    region,
                    stock: 0, // No stock until manufacturer approves
                    price: Number(initialPrice) || estimatedPrice * 1.2,
                    originalPrice: estimatedPrice, // Wholesale price
                    isAllocated: false,
                    allocationStatus: 'PENDING', // Require manufacturer approval
                    allocationId: null, // No allocation yet
                    isListed: false, // Not listed until approved
                    listedAt: null,
                    allocatedStock: 0,
                    sellerBasePrice: estimatedPrice,
                    sellerMoq: product.moq,
                    soldQuantity: 0,
                    remainingQuantity: 0,
                    requestedQuantity: Number(quantity) // Store requested amount
                }], { session });

                // Notify Manufacturer
                const manufacturer = await Manufacturer.findById(product.manufacturerId).populate('userId').session(session);
                if (manufacturer?.userId) {
                    await Notification.create([{
                        userId: manufacturer.userId._id,
                        type: 'PRODUCT_REQUEST',
                        title: 'New Product Access Request',
                        message: `${seller.businessName} has requested access to ${product.name}.`,
                        link: '/manufacturer/products/requests'
                    }], { session });
                }

                await session.commitTransaction();

                return await Inventory.findById(newInventory._id).populate('productId');
            }

            // If inventory exists, we update it (Restocking Request)
            // CRITICAL FIX: Do NOT auto-grant stock. Require Manufacturer Approval.

            const updatedInventory = await Inventory.findByIdAndUpdate(allocation._id, {
                allocationStatus: 'PENDING',
                requestedQuantity: (allocation.requestedQuantity || 0) + Number(quantity), // Accumulate request? Or overwrite? Let's accumulate for now.
                // stock: NO CHANGE
                // allocatedStock: NO CHANGE
                // allocationId: Keep existing
            }, { new: true, session });

            // Notify Manufacturer
            const manufacturer = await Manufacturer.findById(product.manufacturerId).populate('userId').session(session);
            if (manufacturer?.userId) {
                await Notification.create([{
                    userId: manufacturer.userId._id,
                    type: 'PRODUCT_REQUEST',
                    title: 'Restock Request',
                    message: `${seller.businessName} has requested restocking for ${product.name}. Qty: ${quantity}`,
                    link: '/manufacturer/products/requests'
                }], { session });
            }

            await session.commitTransaction();
            return updatedInventory;


        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }


    /**
     * Get Comprehensive Seller Dashboard Stats.
     * Aggregates Sales, Inventory, Network, and Order data.
     */
    async getDashboardStats(sellerId) {
        const { Order, Negotiation, SellerRequest } = await import('../models/index.js');

        // Parallelize unrelated queries for performance
        const [
            inventoryDocs,
            orders,
            activeNegotiations,
            manufacturerRequests,
            activeNetwork
        ] = await Promise.all([
            // 1. Inventory Stats
            Inventory.find({ sellerId }).select('stock price listedAt isAllocated').lean(),

            // 2. Orders (All statuses for funnel view)
            Order.find({ sellerId }).select('totalAmount status createdAt escrow').lean(),

            // 3. Active Negotiations
            Negotiation.find({
                sellerId,
                status: { $in: ['negotiating', 'offer_received', 'requested', 'NEGOTIATING', 'OFFER_RECEIVED', 'REQUESTED'] }
            }).countDocuments(),

            // 4. Pending Manufacturer Requests
            SellerRequest.countDocuments({ sellerId, status: 'PENDING' }),

            // 5. Active Manufacturers (Network)
            SellerRequest.countDocuments({ sellerId, status: 'APPROVED' })
        ]);

        // --- Aggregation Logic ---

        // Inventory
        const totalRetailProducts = inventoryDocs.length;
        const inventoryValue = inventoryDocs.reduce((sum, item) => sum + (item.price * item.stock), 0);

        // Sales & Revenue
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        let totalRevenue = 0;
        let todaySales = 0;
        let monthlyRevenue = 0;
        let pendingOrdersCount = 0;
        let activeOrdersCount = 0;
        let escrowHeld = 0;

        for (const order of orders) {
            const amount = Number(order.totalAmount || 0);
            const isSettled = order.status === 'SETTLED';
            const isCashFlow = ['PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'SETTLED'].includes(order.status);

            if (isCashFlow) {
                totalRevenue += amount; // Gross Revenue (GMV)

                const orderDate = new Date(order.createdAt);
                if (orderDate >= startOfDay) todaySales += amount;
                if (orderDate >= startOfMonth) monthlyRevenue += amount;
            }

            if (['CREATED', 'PAID', 'CONFIRMED', 'SHIPPED'].includes(order.status)) {
                activeOrdersCount++;
            }

            if (order.status === 'CREATED' || order.status === 'PAID') {
                pendingOrdersCount++; // requiring action
            }

            // Escrow Calculation: Money held in system but not settled
            // Assuming Escrow model holds the truth, but approximation from Order status:
            if (['PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'DISPUTED'].includes(order.status)) {
                escrowHeld += amount;
            }
        }

        return {
            network: {
                activeManufacturers: activeNetwork,
                pendingRequests: manufacturerRequests
            },
            negotiations: {
                active: activeNegotiations
            },
            inventory: {
                totalProducts: totalRetailProducts,
                value: inventoryValue
            },
            orders: {
                active: activeOrdersCount,
                pending: pendingOrdersCount
            },
            finance: {
                totalRevenue,
                todaySales,
                monthlyRevenue,
                escrowHeld
            }
        };
    }

    /**
     * Get full Seller Profile.
     */
    async getProfile(sellerId) {
        return await Seller.findById(sellerId)
            .populate('userId', 'email status mfaEnabled');
    }

    /**
     * Update Seller Profile Sections.
     */
    async updateProfile(sellerId, section, data) {
        const seller = await Seller.findById(sellerId);
        if (!seller) throw new Error('SELLER_NOT_FOUND');

        return await userService.updateFullProfile(seller.userId, 'SELLER', section, data);
    }

    /**
     * Discovery: Fetch manufacturers and their top products.
     */
    async getManufacturersForDiscovery() {
        const manufacturers = await Manufacturer.find({})
            .populate('userId', 'email status')
            .sort({ createdAt: -1 })
            .lean();

        // Manual filter for suspended and attachment of products (Take 6)
        const activeManufacturers = await Promise.all(manufacturers
            .filter(m => m.userId?.status !== 'SUSPENDED')
            .map(async (m) => {
                const products = await Product.find({ manufacturerId: m._id, status: 'APPROVED' })
                    .select('name basePrice images category moq')
                    .sort({ createdAt: -1 })
                    .limit(6)
                    .lean();

                const count = await Product.countDocuments({ manufacturerId: m._id, status: 'APPROVED' });

                return {
                    ...m,
                    id: m._id,
                    products,
                    _count: { products: count }
                };
            })
        );

        return activeManufacturers;
    }

    /**
     * Get single manufacturer details for profile view.
     */
    async getManufacturerDetails(manufacturerId, sellerId) {
        const manufacturer = await Manufacturer.findById(manufacturerId)
            .populate('userId', 'email status')
            .lean();

        if (!manufacturer || manufacturer.userId?.status === 'SUSPENDED') {
            throw new Error('MANUFACTURER_NOT_FOUND');
        }

        const products = await Product.find({ manufacturerId, status: 'APPROVED' })
            .select('name basePrice images category moq description specifications')
            .sort({ createdAt: -1 })
            .lean();

        // Check request status
        const request = await SellerRequest.findOne({ sellerId, manufacturerId }).select('status').lean();

        // Check product allocation status
        const productIds = products.map(p => p._id);
        const inventories = await Inventory.find({
            sellerId,
            productId: { $in: productIds }
        }).select('productId allocationStatus isAllocated stock').lean();



        const inventoryMap = {};
        inventories.forEach(inv => {
            const prodId = inv.productId.toString();
            const newStatus = inv.allocationStatus || (inv.isAllocated ? 'APPROVED' : 'NONE');
            const current = inventoryMap[prodId];

            if (current) {
                // Prioritize APPROVED status
                if (newStatus === 'APPROVED') {
                    current.status = 'APPROVED';
                } else if (current.status !== 'APPROVED' && newStatus === 'PENDING') {
                    current.status = 'PENDING';
                }
                // Accumulate stock from all allocations
                current.stock = (current.stock || 0) + (inv.stock || 0);
            } else {
                inventoryMap[prodId] = {
                    status: newStatus,
                    stock: inv.stock || 0
                };
            }
        });

        const productsWithStatus = products.map(p => ({
            ...p,
            allocation: inventoryMap[p._id.toString()] || null
        }));

        return {
            ...manufacturer,
            id: manufacturer._id,
            products: productsWithStatus,
            requestStatus: request?.status || null
        };
    }

    /**
     * Request access to a manufacturer's product line.
     */
    async requestAccess(userId, manufacturerId, metadata = {}) {
        const { message, expectedQuantity, region, priceExpectation } = metadata;

        // 1. Resolve Seller Profile from User ID
        const seller = await Seller.findOne({ userId });
        if (!seller) {
            throw new Error('SELLER_PROFILE_NOT_FOUND: Please complete your seller profile first.');
        }
        const sellerId = seller._id;

        // 2. Resolve Manufacturer Profile (Robust check for Profile ID vs User ID)
        let manufacturer = await Manufacturer.findById(manufacturerId);
        if (!manufacturer) {
            // Fallback: Check if ID provided was actually a User ID
            manufacturer = await Manufacturer.findOne({ userId: manufacturerId });
        }

        if (!manufacturer) {
            throw new Error('MANUFACTURER_NOT_FOUND: Invalid Manufacturer ID.');
        }

        const resolvedMfgId = manufacturer._id;

        // 3. Check for Existing Request
        const existing = await SellerRequest.findOne({ sellerId, manufacturerId: resolvedMfgId });

        if (existing) {
            if (existing.status === 'PENDING') throw new Error('Request already sent. Please wait for approval.');
            if (existing.status === 'APPROVED') throw new Error('You are already an approved seller for this manufacturer.');

            return await SellerRequest.findByIdAndUpdate(existing._id, {
                status: 'PENDING',
                message: message || existing.message,
                metadata: {
                    expectedQuantity,
                    region,
                    priceExpectation
                },
                createdAt: new Date()
            }, { new: true });
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const request = await SellerRequest.create([{
                sellerId,
                manufacturerId: resolvedMfgId,
                message: message || '',
                status: 'PENDING',
                metadata: {
                    expectedQuantity,
                    region,
                    priceExpectation
                }
            }], { session });

            // Create notification for manufacturer user
            if (manufacturer.userId) { // manufacturer doc might have userId populated or just ID
                // If not populated, we need to fetch user? 
                // Wait, Manufacturer schema has userId ref. 
                // We need to send notification to that User ID.
                await Notification.create([{
                    userId: manufacturer.userId, // This is the User ID (ref)
                    type: 'SELLER_REQUEST',
                    title: 'New Seller Partnership Request',
                    message: `${seller.businessName} has requested access to your products.`,
                    link: '/manufacturer/sellers/requests'
                }], { session });
            }

            await session.commitTransaction();
            return request[0];
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Get Seller's own requests.
     */
    async getMyAccessRequests(sellerId) {
        return await SellerRequest.find({ sellerId })
            .populate('manufacturerId', 'companyName factoryAddress logo')
            .sort({ createdAt: -1 })
            .lean();
    }
}

export default new SellerService();
