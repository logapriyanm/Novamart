/**
 * Manufacturer Service
 * Logic for seller network management, allocations, and analytics.
 */

import Manufacturer from '../models/Manufacturer.js';
import Seller from '../models/Seller.js';
import User from '../models/User.js';
import SellerRequest from '../models/SellerRequest.js';
import Order from '../models/Order.js';
import Escrow from '../models/Escrow.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import userService from './userService.js';
import mongoose from 'mongoose';

class ManufacturerService {
    /**
     * Approve or Reject a Seller's request to join the network.
     */
    async handleDealerRequest(mfgId, sellerId, status) {
        const MAX_RETRIES = 3;
        let attempt = 0;

        while (attempt < MAX_RETRIES) {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                const requestStatus = status === 'APPROVED' ? 'APPROVED' : 'REJECTED';

                // 1. Upsert the SellerRequest record
                // 1. Upsert the SellerRequest record with explicit field setting
                await SellerRequest.findOneAndUpdate(
                    { sellerId, manufacturerId: mfgId },
                    {
                        $set: { status: requestStatus, message: 'Updated via dashboard' },
                        $setOnInsert: { sellerId, manufacturerId: mfgId }
                    },
                    { upsert: true, session, new: true }
                );

                // 2. If approved, connect in the many-to-many relation
                if (status === 'APPROVED') {
                    await Manufacturer.findByIdAndUpdate(mfgId, {
                        $addToSet: { approvedBy: sellerId }
                    }, { session });

                    // Add Manufacturer to Seller's approvedBy list (Bidirectional)
                    // Also mark as verified globally and update status
                    const seller = await Seller.findByIdAndUpdate(sellerId, {
                        isVerified: true,
                        verificationStatus: 'VERIFIED',
                        $addToSet: { approvedBy: mfgId }
                    }, { new: true, session });

                    if (seller && seller.userId) {
                        // Ensure the User is ACTIVE
                        await User.findByIdAndUpdate(seller.userId._id || seller.userId, { status: 'ACTIVE' }, { session });
                    }
                } else {
                    await Manufacturer.findByIdAndUpdate(mfgId, {
                        $pull: { approvedBy: sellerId }
                    }, { session });

                    // Remove Manufacturer from Seller's approvedBy list
                    await Seller.findByIdAndUpdate(sellerId, {
                        $pull: { approvedBy: mfgId }
                    }, { session });
                }

                await session.commitTransaction();
                return { mfgId, sellerId, status: requestStatus };
            } catch (error) {
                await session.abortTransaction();

                // Check for transient transaction errors or write conflicts
                const isTransient = error.hasErrorLabel && error.hasErrorLabel('TransientTransactionError');
                const isWriteConflict = error.code === 112 || (error.message && error.message.includes('Write conflict'));

                if ((isTransient || isWriteConflict) && attempt < MAX_RETRIES - 1) {
                    attempt++;
                    console.log(`Retrying transaction due to conflict (Attempt ${attempt})...`);
                    await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // Exponential backoff
                    continue;
                }

                throw error;
            } finally {
                session.endSession();
            }
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
            dealer: {
                ...r.sellerId,
                id: r.sellerId?._id
            },
            seller: {
                ...r.sellerId,
                id: r.sellerId?._id
            }
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
                    id: seller._id,
                    user: seller.userId
                },
                seller: {
                    ...seller,
                    id: seller._id,
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

    async updateProfile(mfgId, section, data) {
        const mfg = await Manufacturer.findById(mfgId);
        if (!mfg) throw new Error('MANUFACTURER_NOT_FOUND');

        return await userService.updateFullProfile(mfg.userId, 'MANUFACTURER', section, data);
    }

    /**
     * Get Pending Product Requests (Inventory Approvals)
     */
    async getPendingProductRequests(mfgId) {
        console.log('getPendingProductRequests called for mfgId:', mfgId);
        // Find inventory items for this manufacturer that are pending
        const products = await Product.find({ manufacturerId: mfgId }).select('_id');
        console.log('Found products count:', products.length);
        const productIds = products.map(p => p._id);

        const requests = await Inventory.find({
            productId: { $in: productIds },
            allocationStatus: 'PENDING'
        })
            .populate('sellerId', 'businessName city logo contactInfo')
            .populate('productId', 'name basePrice images')
            .sort({ createdAt: -1 })
            .lean();

        console.log('Found pending requests:', requests.length);
        return requests;
    }

    /**
     * Approve Product Request (Inventory)
     */
    async approveProductRequest(mfgId, inventoryId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const inventory = await Inventory.findById(inventoryId).populate('productId').session(session);

            if (!inventory) throw new Error('REQUEST_NOT_FOUND');
            if (inventory.productId.manufacturerId.toString() !== mfgId.toString()) throw new Error('UNAUTHORIZED');

            // 1. Create Allocation Record
            const { Allocation } = await import('../models/index.js');
            const requestedQty = inventory.requestedQuantity || 0; // Ensure requestedQuantity is saved in Inv loop

            // Re-calculate price or use stored
            const wholesalePrice = inventory.sellerBasePrice || inventory.productId.basePrice;

            const [newAllocation] = await Allocation.create([{
                type: 'DIRECT',
                sellerId: inventory.sellerId,
                manufacturerId: mfgId,
                productId: inventory.productId._id,
                allocatedQuantity: requestedQty,
                remainingQuantity: requestedQty,
                soldQuantity: 0,
                negotiatedPrice: wholesalePrice,
                minRetailPrice: wholesalePrice * 1.05,
                status: 'ACTIVE',
                region: inventory.region || 'Global'
            }], { session });

            // 2. Activate Inventory & Link Allocation
            const updated = await Inventory.findByIdAndUpdate(inventoryId, {
                allocationStatus: 'APPROVED',
                isAllocated: true,
                allocationId: newAllocation._id,
                stock: requestedQty, // Grant requested stock
                allocatedStock: requestedQty,
                remainingQuantity: requestedQty,
                isListed: true // Auto-list or keep hidden? User said "approved functionality", auto-list is smoother.
            }, { new: true, session });

            // 3. Notify Seller
            const { Notification, Seller } = await import('../models/index.js');
            const seller = await Seller.findById(inventory.sellerId).populate('userId').session(session);
            if (seller?.userId) {
                await Notification.create([{
                    userId: seller.userId._id,
                    type: 'PRODUCT_APPROVED',
                    title: 'Product Request Approved',
                    message: `Your request for ${inventory.productId.name} has been approved. Stock allocated: ${requestedQty}.`,
                    link: '/seller/inventory'
                }], { session });
            }

            await session.commitTransaction();
            return updated;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

export default new ManufacturerService();

