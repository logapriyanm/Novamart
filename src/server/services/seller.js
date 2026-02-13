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
            .populate('productId')
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
        const isComplete = seller?.businessName &&
            seller?.gstNumber &&
            seller?.businessAddress &&
            seller?.bankDetails;

        if (!isComplete) {
            throw new Error('PROFILE_INCOMPLETE: Please complete your Business Info, GST, Address, and Bank sections before sourcing products.');
        }

        // 1. Verify allocation exists
        const allocation = await Inventory.findOne({
            sellerId,
            productId,
            region,
            isAllocated: true
        }).populate('productId');

        if (!allocation) {
            throw new Error('PRODUCT_NOT_ALLOCATED: This product has not been allocated to you by the manufacturer.');
        }

        // 2. Validate allocation limits
        const requestedQty = Number(quantity);
        const currentStock = allocation.stock || 0;

        if (allocation.isAllocated && (currentStock + requestedQty) > allocation.allocatedStock) {
            throw new Error(`EXCEEDS_ALLOCATION: You cannot source more than your allocated limit. Current: ${currentStock}, Allocated: ${allocation.allocatedStock}.`);
        }

        if (requestedQty < (allocation.sellerMoq || 1)) {
            throw new Error(`BELOW_MOQ: Minimum order quantity is ${allocation.sellerMoq} units.`);
        }

        // 3. Apply Phase 6 Subscription Benefits (Wholesale Discount)
        let finalPrice = Number(allocation.sellerBasePrice || allocation.productId.basePrice);
        const activeSub = await SellerSubscription.findOne({ sellerId, status: 'ACTIVE' }).populate('planId');

        if (activeSub?.planId?.wholesaleDiscount > 0) {
            const discount = Number(activeSub.planId.wholesaleDiscount);
            finalPrice = finalPrice * (1 - discount / 100);
        }

        // 4. Update the existing allocation record
        return await Inventory.findByIdAndUpdate(allocation._id, {
            $inc: { stock: requestedQty },
            price: Number(initialPrice) || finalPrice,
            originalPrice: finalPrice,
            isListed: true,
            listedAt: new Date()
        }, { new: true });
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
            .sort({ companyName: 1 })
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
     * Request access to a manufacturer's product line.
     */
    async requestAccess(sellerId, manufacturerId, metadata = {}) {
        const { message, expectedQuantity, region, priceExpectation } = metadata;

        const existing = await SellerRequest.findOne({ sellerId, manufacturerId });

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
                manufacturerId,
                message: message || '',
                status: 'PENDING',
                metadata: {
                    expectedQuantity,
                    region,
                    priceExpectation
                }
            }], { session });

            // Create notification for manufacturer
            const manufacturer = await Manufacturer.findById(manufacturerId).populate('userId');
            if (manufacturer?.userId) {
                const seller = await Seller.findById(sellerId);
                await Notification.create([{
                    userId: manufacturer.userId._id,
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
