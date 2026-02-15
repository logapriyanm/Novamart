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
    async handleSellerRequest(mfgId, sellerId, status) {
        const MAX_RETRIES = 3;
        let attempt = 0;

        while (attempt < MAX_RETRIES) {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                const requestStatus = status === 'APPROVED' ? 'APPROVED' : 'REJECTED';

                // 1. Fetch Existing Request to check for Product Specifics
                // Use findOne to handle the compound index lookup correctly
                // Note: The controller passes sellerId, but if we have multiple requests (different products), 
                // we actually need the request ID or productId to distinguish.
                // CURRENT LIMITATION: The controller only passes sellerId. 
                // IF there are multiple pending requests, this might be ambiguous.
                // HOWEVER, the user asked to FIX "Request already sent".
                // If the UI sends `sellerId` only, we might approve ALL pending requests for that seller?
                // OR we should assume the UI sends `requestId` or `productId`.
                // Checking controller... `handleSellerNetwork` takes `sellerId`.
                // Assuming for now we approve the *General Partnership* OR *All Pending Requests*?
                // Let's look up ALL pending requests for this seller/mfg combo.

                const pendingRequests = await SellerRequest.find({
                    sellerId,
                    manufacturerId: mfgId,
                    status: 'PENDING'
                }).session(session);

                let updatedRequests = [];

                if (pendingRequests.length > 0) {
                    // Approve/Reject ALL pending requests for this seller
                    // (Simplest approach given the controller signature)
                    for (const req of pendingRequests) {
                        req.status = requestStatus;
                        req.message = 'Updated via dashboard';
                        await req.save({ session });
                        updatedRequests.push(req);
                    }
                } else {
                    // Fallback: Upsert a general one if none exist (legacy behavior)
                    // But with new unique index, we should be careful.
                    // If no pending request exists, maybe we are just changing status of an existing one?
                    // Or creating a brand new partnership.
                    const generalRequest = await SellerRequest.findOneAndUpdate(
                        { sellerId, manufacturerId: mfgId, productId: null }, // Target general
                        {
                            $set: { status: requestStatus, message: 'Updated via dashboard' },
                            $setOnInsert: { sellerId, manufacturerId: mfgId }
                        },
                        { upsert: true, session, new: true }
                    );
                    updatedRequests.push(generalRequest);
                }

                // 2. Partnership Logic (General)
                if (status === 'APPROVED') {
                    await Manufacturer.findByIdAndUpdate(mfgId, {
                        $addToSet: { approvedBy: sellerId }
                    }, { session });

                    await Seller.findByIdAndUpdate(sellerId, {
                        isVerified: true,
                        verificationStatus: 'VERIFIED',
                        $addToSet: { approvedBy: mfgId }
                    }, { new: true, session });

                    if (sellerId) {
                        // We need to resolve User ID from Seller
                        const sellerDoc = await Seller.findById(sellerId).session(session);
                        if (sellerDoc?.userId) {
                            await User.findByIdAndUpdate(sellerDoc.userId, { status: 'ACTIVE' }, { session });
                        }
                    }

                    // 3. Handle Product Specific Allocations
                    const { Inventory, Allocation } = await import('../models/index.js');

                    for (const req of updatedRequests) {
                        if (req.productId) {
                            // Create Inventory & Allocation
                            const product = await Product.findById(req.productId).session(session);
                            if (product) {
                                const metadata = req.metadata || {};
                                const requestedQty = Number(metadata.expectedQuantity) || 0;
                                // const priceExpectation = metadata.priceExpectation;

                                // Create Allocation
                                const [newAllocation] = await Allocation.create([{
                                    type: 'DIRECT',
                                    sellerId,
                                    manufacturerId: mfgId,
                                    productId: req.productId,
                                    allocatedQuantity: requestedQty, // Grant requested/expected
                                    remainingQuantity: requestedQty,
                                    soldQuantity: 0,
                                    negotiatedPrice: product.basePrice, // Default to base price
                                    status: 'ACTIVE',
                                    region: metadata.region || 'Global'
                                }], { session });

                                // Create/Update Inventory
                                await Inventory.findOneAndUpdate(
                                    { sellerId, productId: req.productId },
                                    {
                                        $set: {
                                            allocationStatus: 'APPROVED',
                                            isAllocated: true,
                                            allocationId: newAllocation._id,
                                            stock: requestedQty,
                                            allocatedStock: requestedQty,
                                            remainingQuantity: requestedQty,
                                            isListed: true,
                                            price: product.basePrice * 1.2, // Default markup
                                            originalPrice: product.basePrice,
                                            sellerBasePrice: product.basePrice
                                        }
                                    },
                                    { upsert: true, session, new: true }
                                );
                            }
                        }
                    }

                } else {
                    // REJECTED
                    await Manufacturer.findByIdAndUpdate(mfgId, {
                        $pull: { approvedBy: sellerId }
                    }, { session });

                    await Seller.findByIdAndUpdate(sellerId, {
                        $pull: { approvedBy: mfgId }
                    }, { session });
                }

                await session.commitTransaction();
                return { mfgId, sellerId, status: requestStatus, updatedCount: updatedRequests.length };
            } catch (error) {
                await session.abortTransaction();

                const isTransient = error.hasErrorLabel && error.hasErrorLabel('TransientTransactionError');
                const isWriteConflict = error.code === 112 || (error.message && error.message.includes('Write conflict'));

                if ((isTransient || isWriteConflict) && attempt < MAX_RETRIES - 1) {
                    attempt++;
                    console.log(`Retrying transaction due to conflict (Attempt ${attempt})...`);
                    await new Promise(resolve => setTimeout(resolve, 100 * attempt));
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
    async getSellerRequests(userId, statusFilter = 'PENDING') {
        // Resolve Manufacturer Profile
        const manufacturer = await Manufacturer.findOne({ userId });
        if (!manufacturer) {
            throw new Error('MANUFACTURER_PROFILE_NOT_FOUND');
        }
        const mfgId = manufacturer._id;

        const requests = await SellerRequest.find({
            manufacturerId: mfgId,
            status: statusFilter
        })
            .populate({
                path: 'sellerId',
                populate: { path: 'userId', select: 'email phone' }
            })
            .populate('productId', 'name images basePrice') // NEW: Populate Product Info
            .sort({ createdAt: -1 })
            .lean();

        // Safe map with filter for valid sellers
        const formattedRequests = requests
            .filter(r => r.sellerId) // Ensure seller exists
            .map(r => ({
                ...r,
                id: r._id,
                seller: {
                    ...r.sellerId,
                    id: r.sellerId._id
                }
            }));

        if (statusFilter === 'PENDING') {
            const explicitSellerIds = formattedRequests
                .map(r => r.seller.id)
                .filter(id => id); // Filter out any undefined IDs

            const implicitSellers = await Seller.find({
                isVerified: false,
                _id: { $nin: explicitSellerIds }
            })
                .populate('userId', 'email phone createdAt')
                .lean();

            const implicitRequests = implicitSellers.map(seller => ({
                id: `temp-${seller._id}`,
                sellerId: seller._id,
                manufacturerId: mfgId,
                status: 'PENDING',
                message: 'New Registration (Pending Verification)',
                createdAt: seller.userId?.createdAt || new Date(),
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
        console.log('[DEBUG] getPendingProductRequests - mfgId:', mfgId);
        const products = await Product.find({ manufacturerId: mfgId }).select('_id');
        const productIds = products.map(p => p._id);
        console.log('[DEBUG] Found', products.length, 'products for this manufacturer, productIds:', productIds);

        // Also check ALL inventory records for these products (regardless of status)
        const allInventory = await Inventory.find({
            productId: { $in: productIds }
        }).select('productId sellerId allocationStatus createdAt').lean();
        console.log('[DEBUG] ALL inventory records for these products:', JSON.stringify(allInventory, null, 2));

        const requests = await Inventory.find({
            productId: { $in: productIds },
            allocationStatus: 'PENDING'
        })
            .populate('sellerId', 'businessName city logo contactInfo')
            .populate('productId', 'name basePrice images')
            .sort({ createdAt: -1 })
            .lean();

        console.log('[DEBUG] PENDING requests found:', requests.length);
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

    /**
     * Reject Product Request (Inventory)
     */
    async rejectProductRequest(mfgId, inventoryId, reason) {
        const inventory = await Inventory.findById(inventoryId).populate('productId');
        if (!inventory) throw new Error('REQUEST_NOT_FOUND');
        if (inventory.productId.manufacturerId.toString() !== mfgId.toString()) throw new Error('UNAUTHORIZED');

        // Delete the pending inventory record
        await Inventory.findByIdAndDelete(inventoryId);

        // Notify the seller
        const { Notification, Seller } = await import('../models/index.js');
        const seller = await Seller.findById(inventory.sellerId).populate('userId');
        if (seller?.userId) {
            await Notification.create([{
                userId: seller.userId._id,
                type: 'PRODUCT_REJECTED',
                title: 'Product Request Rejected',
                message: `Your request for ${inventory.productId.name} was rejected.${reason ? ` Reason: ${reason}` : ''}`,
                link: '/seller/discovery'
            }]);
        }

        return { success: true };
    }
}

export default new ManufacturerService();

