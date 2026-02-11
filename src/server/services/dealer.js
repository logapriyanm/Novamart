/**
 * Dealer Service
 * Logic for regional inventory, retail pricing, and fulfillment.
 */

import { Inventory, Product, Dealer, MarginRule, Manufacturer, DealerRequest, Notification, User, DealerSubscription } from '../models/index.js';
import userService from './userService.js';
import mongoose from 'mongoose';

class DealerService {
    /**
     * Get Dealer's localized inventory.
     */
    async getInventory(dealerId) {
        return await Inventory.find({ dealerId })
            .populate('productId')
            .lean();
    }

    /**
     * Get specific inventory item with details.
     */
    async getInventoryItem(inventoryId, dealerId) {
        const inv = await Inventory.findById(inventoryId)
            .populate({
                path: 'productId',
                populate: { path: 'manufacturerId', select: 'companyName' }
            })
            .lean();

        if (!inv || inv.dealerId.toString() !== dealerId.toString()) {
            throw new Error('UNAUTHORIZED_INVENTORY_ACCESS');
        }

        return inv;
    }

    /**
     * Update Retail Price (Margin Control).
     * Ensures price fits within manufacturer constraints or platform rules.
     */
    async updateRetailPrice(inventoryId, dealerId, newPrice) {
        const inv = await Inventory.findById(inventoryId).populate('productId');

        if (!inv || inv.dealerId.toString() !== dealerId.toString()) {
            throw new Error('UNAUTHORIZED_INVENTORY_ACCESS');
        }

        const requestedPrice = Number(newPrice);
        const wholesalePrice = Number(inv.dealerBasePrice || inv.productId.basePrice);

        // Fetch Dealer's active subscription for benefits
        const activeSub = await DealerSubscription.findOne({
            dealerId,
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

        return await Inventory.findByIdAndUpdate(inventoryId, { price: requestedPrice }, { new: true });
    }


    /**
     * Toggle public listing status.
     */
    async toggleListing(inventoryId, dealerId, isListed) {
        const inv = await Inventory.findById(inventoryId);

        if (!inv || inv.dealerId.toString() !== dealerId.toString()) {
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
    async updateStock(inventoryId, dealerId, newStock) {
        const inv = await Inventory.findById(inventoryId);

        if (!inv || inv.dealerId.toString() !== dealerId.toString()) {
            throw new Error('UNAUTHORIZED_INVENTORY_ACCESS');
        }

        return await Inventory.findByIdAndUpdate(inventoryId, { stock: Number(newStock) }, { new: true });
    }

    /**
     * Source a product from a manufacturer.
     * Enforces Phase 4 allocation limits and applies Phase 6 subscription benefits.
     */
    async sourceProduct(dealerId, productId, region, quantity, initialPrice) {
        // 0. Profile Completion Gating
        const dealer = await Dealer.findById(dealerId);
        const isComplete = dealer?.businessName &&
            dealer?.gstNumber &&
            dealer?.businessAddress &&
            dealer?.bankDetails;

        if (!isComplete) {
            throw new Error('PROFILE_INCOMPLETE: Please complete your Business Info, GST, Address, and Bank sections before sourcing products.');
        }

        // 1. Verify allocation exists
        const allocation = await Inventory.findOne({
            dealerId,
            productId,
            region,
            isAllocated: true
        }).populate('productId');

        if (!allocation) {
            throw new Error('PRODUCT_NOT_ALLOCATED: This product has not been allocated to you by the manufacturer.');
        }

        // 2. Validate allocation limits
        const requestedQty = Number(quantity);
        if (requestedQty > allocation.allocatedStock) {
            throw new Error(`EXCEEDS_ALLOCATION: You are only allocated ${allocation.allocatedStock} units of this product.`);
        }

        if (requestedQty < (allocation.dealerMoq || 1)) {
            throw new Error(`BELOW_MOQ: Minimum order quantity is ${allocation.dealerMoq} units.`);
        }

        // 3. Apply Phase 6 Subscription Benefits (Wholesale Discount)
        let finalPrice = Number(allocation.dealerBasePrice || allocation.productId.basePrice);
        const activeSub = await DealerSubscription.findOne({ dealerId, status: 'ACTIVE' }).populate('planId');

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
     * Get Dealer Sales Report.
     */
    async getSalesReport(dealerId) {
        const { Order } = await import('../models/index.js');
        const orders = await Order.find({ dealerId, status: 'SETTLED' }).lean();

        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
        const totalTax = orders.reduce((sum, o) => sum + Number(o.taxAmount || 0), 0);
        const marginEarned = orders.reduce((sum, o) => {
            const retail = Number(o.totalAmount);
            const base = retail - Number(o.commissionAmount || 0) - Number(o.taxAmount || 0);
            return sum + (retail - base);
        }, 0);

        return {
            totalRevenue,
            totalTax,
            marginEarned,
            settledOrders: orders.length
        };
    }

    /**
     * Get full Dealer Profile.
     */
    async getProfile(dealerId) {
        return await Dealer.findById(dealerId)
            .populate('userId', 'email status mfaEnabled');
    }

    /**
     * Update Dealer Profile Sections.
     */
    async updateProfile(dealerId, section, data) {
        const dealer = await Dealer.findById(dealerId);
        if (!dealer) throw new Error('DEALER_NOT_FOUND');

        return await userService.updateFullProfile(dealer.userId, 'DEALER', section, data);
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
    async requestAccess(dealerId, manufacturerId, metadata = {}) {
        const { message, expectedQuantity, region, priceExpectation } = metadata;

        const existing = await DealerRequest.findOne({ dealerId, manufacturerId });

        if (existing) {
            if (existing.status === 'PENDING') throw new Error('Request already sent. Please wait for approval.');
            if (existing.status === 'APPROVED') throw new Error('You are already an approved dealer for this manufacturer.');

            return await DealerRequest.findByIdAndUpdate(existing._id, {
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
            const request = await DealerRequest.create([{
                dealerId,
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
                const dealer = await Dealer.findById(dealerId);
                await Notification.create([{
                    userId: manufacturer.userId._id,
                    type: 'DEALER_REQUEST',
                    title: 'New Dealer Partnership Request',
                    message: `${dealer.businessName} has requested access to your products.`,
                    link: '/manufacturer/dealers/requests'
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
     * Get Dealer's own requests.
     */
    async getMyAccessRequests(dealerId) {
        return await DealerRequest.find({ dealerId })
            .populate('manufacturerId', 'companyName factoryAddress logo')
            .sort({ createdAt: -1 })
            .lean();
    }
}

export default new DealerService();
