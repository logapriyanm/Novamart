/**
 * Manufacturer Service
 * Logic for seller network management, allocations, and analytics.
 */

import { Manufacturer, Seller, User, SellerRequest, Order, Escrow, Product } from '../models/index.js';
import userService from './userService.js';
import mongoose from 'mongoose';

class ManufacturerService {
    /**
     * Approve or Reject a Seller's request to join the network.
     */
    async handleDealerRequest(mfgId, sellerId, status) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const requestStatus = status === 'APPROVED' ? 'APPROVED' : 'REJECTED';

            // 1. Upsert the SellerRequest record
            await SellerRequest.findOneAndUpdate(
                { sellerId, manufacturerId: mfgId },
                { status: requestStatus, message: 'Updated via dashboard' },
                { upsert: true, session }
            );

            // 2. If approved, connect in the many-to-many relation
            if (status === 'APPROVED') {
                await Manufacturer.findByIdAndUpdate(mfgId, {
                    $addToSet: { approvedBy: sellerId }
                }, { session });

                // Mark seller as verified globally if this is the main authority
                const seller = await Seller.findByIdAndUpdate(sellerId, { isVerified: true }, { session });

                if (seller && seller.userId) {
                    // Ensure the User is ACTIVE
                    await User.findByIdAndUpdate(seller.userId, { status: 'ACTIVE' }, { session });
                }
            } else {
                await Manufacturer.findByIdAndUpdate(mfgId, {
                    $pull: { approvedBy: sellerId }
                }, { session });
            }

            await session.commitTransaction();
            return { mfgId, sellerId, status: requestStatus };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Get pending or processed seller requests for a manufacturer.
     */
    async getDealerRequests(mfgId, statusFilter = 'PENDING') {
        const requests = await SellerRequest.find({
            manufacturerId: mfgId,
            status: statusFilter
        })
            .populate({
                path: 'sellerId',
                populate: { path: 'userId', select: 'email phone' }
            })
            .sort({ createdAt: -1 })
            .lean();

        // Format to match old output (dealer instead of dealerId)
        const formattedRequests = requests.map(r => ({
            ...r,
            id: r._id,
            dealer: r.sellerId, // Maintaining 'dealer' key for frontend compatibility
            seller: r.sellerId
        }));

        if (statusFilter === 'PENDING') {
            const explicitSellerIds = requests.map(r => r.sellerId?._id);

            const implicitSellers = await Seller.find({
                isVerified: false,
                _id: { $nin: explicitSellerIds }
            })
                .populate('userId', 'email phone createdAt')
                .lean();

            const implicitRequests = implicitSellers.map(seller => ({
                id: `temp-${seller._id}`,
                dealerId: seller._id, // Deprecated key for compatibility
                sellerId: seller._id,
                manufacturerId: mfgId,
                status: 'PENDING',
                message: 'New Registration (Pending Verification)',
                createdAt: seller.userId?.createdAt || new Date(),
                dealer: { // Deprecated key for compatibility
                    ...seller,
                    user: seller.userId
                },
                seller: {
                    ...seller,
                    user: seller.userId
                }
            }));

            return [...formattedRequests, ...implicitRequests];
        }

        return formattedRequests;
    }

    /**
     * Get Sales Analytics for Manufacturer.
     */
    async getSalesAnalytics(mfgId) {
        const orders = await Order.find({
            status: 'SETTLED',
            'items.product': { $exists: true } // Simplified check
        }).populate('items.product').lean();

        let totalRevenue = 0;
        const regionalSales = {};
        const productStats = {};

        for (const order of orders) {
            let orderHasMfgItems = false;
            for (const item of order.items) {
                if (item.product?.manufacturerId?.toString() === mfgId.toString()) {
                    orderHasMfgItems = true;
                    const lineTotal = Number(item.price) * item.quantity;
                    totalRevenue += lineTotal;

                    const region = item.product.category || 'General';
                    regionalSales[region] = (regionalSales[region] || 0) + lineTotal;
                    productStats[item.product._id] = (productStats[item.product._id] || 0) + item.quantity;
                }
            }
        }

        return {
            totalRevenue,
            totalOrders: orders.filter(o => o.items.some(i => i.product?.manufacturerId?.toString() === mfgId.toString())).length,
            regionalSales,
            topProducts: Object.entries(productStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
        };
    }

    /**
     * Credit & Escrow Tracking.
     */
    async getCreditStatus(mfgId) {
        const escrows = await Escrow.find({
            status: { $in: ['HOLD', 'FROZEN'] }
        }).populate({
            path: 'orderId',
            populate: { path: 'items.product' }
        }).lean();

        let pendingSettle = 0;
        let frozenCount = 0;

        for (const escrow of escrows) {
            if (!escrow.orderId) continue;

            let mfgItemsInOrder = false;
            for (const item of escrow.orderId.items) {
                if (item.product?.manufacturerId?.toString() === mfgId.toString()) {
                    mfgItemsInOrder = true;
                    pendingSettle += Number(item.price) * item.quantity;
                }
            }

            if (mfgItemsInOrder && escrow.status === 'FROZEN') {
                frozenCount++;
            }
        }

        return {
            pendingSettlement: pendingSettle,
            activeHoldRecords: escrows.filter(e => e.orderId?.items.some(i => i.product?.manufacturerId?.toString() === mfgId.toString())).length,
            frozenCount
        };
    }

    /**
     * Get full Manufacturer Profile.
     */
    async getProfile(mfgId) {
        return await Manufacturer.findById(mfgId)
            .populate('userId', 'email status mfaEnabled')
            .populate('approvedBy');
    }

    /**
     * Update Manufacturer Profile Sections.
     */
    async updateProfile(mfgId, section, data) {
        const mfg = await Manufacturer.findById(mfgId);
        if (!mfg) throw new Error('MANUFACTURER_NOT_FOUND');

        return await userService.updateFullProfile(mfg.userId, 'MANUFACTURER', section, data);
    }
}

export default new ManufacturerService();

