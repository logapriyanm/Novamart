/**
 * Manufacturer Controller
 * Management for product lifecycle and dealer network.
 */

import manufacturerService from '../services/manufacturer.js';
import stockAllocationService from '../services/stockAllocationService.js';
import auditService from '../services/audit.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';
import logger from '../lib/logger.js';
import mongoose from 'mongoose';

/**
 * Handle Seller Application (Approve/Reject)
 */
export const handleSellerNetwork = async (req, res) => {
    const { sellerId, status } = req.body;
    const targetSellerId = sellerId;
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const result = await manufacturerService.handleSellerRequest(mfgId, targetSellerId, status);

        await auditService.logAction('SELLER_NETWORK_UPDATE', 'MANUFACTURER', mfgId, {
            userId: req.user.id,
            newData: { sellerId: targetSellerId, status },
            req
        });

        // Notify seller of decision
        const { Seller, Notification } = await import('../models/index.js');
        const seller = await Seller.findById(targetSellerId).populate('userId');

        if (seller?.userId) {
            const notifyPayload = {
                userId: seller.userId._id,
                type: 'PARTNERSHIP',
                title: `Partnership Request ${status}`,
                message: status === 'APPROVED'
                    ? 'Congratulations! Your partnership request has been approved. You can now start sourcing products.'
                    : 'Your partnership request was not approved at this time. You can reach out to the manufacturer for more details.',
                link: status === 'APPROVED' ? '/seller/inventory' : '/seller/marketplace'
            };
            logger.debug('Notification.create payload: %o', notifyPayload);
            await Notification.create(notifyPayload);
        }

        res.json({ success: true, message: `Seller request ${status}`, data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Get Seller Requests
 */
export const getSellerRequests = async (req, res) => {
    const userId = req.user._id; // Use Requesting User ID
    const { status } = req.query;

    try {
        const requests = await manufacturerService.getSellerRequests(userId, status || 'PENDING');
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_REQUESTS' });
    }
};

/**
 * Allocate Stock to Region/Seller
 */
export const allocateInventory = async (req, res) => {
    const { productId, sellerId, region, quantity, sellerBasePrice, sellerMoq, maxMargin } = req.body;
    const targetSellerId = sellerId;
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const result = await stockAllocationService.allocateStock(mfgId, {
            productId,
            sellerId: targetSellerId,
            region,
            quantity,
            sellerBasePrice,
            sellerMoq,
            maxMargin
        });
        res.status(201).json({ success: true, message: 'Stock allocated successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Get All Stock Allocations
 */
export const getAllocations = async (req, res) => {
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const allocations = await stockAllocationService.getManufacturerAllocations(mfgId);
        res.json({ success: true, data: allocations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Update Stock Allocation
 */
export const updateAllocation = async (req, res) => {
    const { allocationId } = req.params;
    const updates = req.body;
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const result = await stockAllocationService.updateAllocation(mfgId, allocationId, updates);
        res.json({ success: true, message: 'Allocation updated successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Revoke Stock Allocation
 */
export const revokeAllocation = async (req, res) => {
    const { allocationId } = req.params;
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        await stockAllocationService.revokeAllocation(mfgId, allocationId);
        res.json({ success: true, message: 'Allocation revoked successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Get Manufacturer Statistics
 */
export const getManufacturerStats = async (req, res) => {
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const { Product, Order, Seller } = await import('../models/index.js');

        // Total products
        const totalProducts = await Product.countDocuments({ manufacturerId: mfgId });
        const approvedProducts = await Product.countDocuments({ manufacturerId: mfgId, status: 'APPROVED' });

        // Network Stats
        const totalSellers = await Seller.countDocuments({
            approvedBy: mfgId
        });

        // Pending Requests
        const { default: SellerRequest } = await import('../models/SellerRequest.js');
        const pendingSellerRequests = await SellerRequest.countDocuments({
            manufacturerId: mfgId,
            status: 'PENDING'
        });

        // Orders Stats via Aggregation (Performance Optimized)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const stats = await Order.aggregate([
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $match: {
                    "product.manufacturerId": new mongoose.Types.ObjectId(mfgId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                    uniqueOrderIds: { $addToSet: "$_id" },
                    recentOrderIds: {
                        $addToSet: {
                            $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, "$_id", "$$REMOVE"]
                        }
                    }
                }
            },
            {
                $project: {
                    totalRevenue: 1,
                    totalOrders: { $size: "$uniqueOrderIds" },
                    recentOrders: { $size: "$recentOrderIds" }
                }
            }
        ]);

        const orderStats = stats[0] || { totalRevenue: 0, totalOrders: 0, recentOrders: 0 };

        res.json({
            success: true,
            data: {
                products: {
                    total: totalProducts,
                    approved: approvedProducts,
                    pending: totalProducts - approvedProducts
                },
                network: {
                    totalSellers,
                    pendingSellerRequests
                },
                orders: {
                    total: orderStats.totalOrders,
                    recent: orderStats.recentOrders,
                    totalRevenue: orderStats.totalRevenue
                }
            }
        });
    } catch (error) {
        logger.error('Error fetching manufacturer stats:', error);
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_STATS' });
    }
};

/**
 * Get My Dealers/Sellers Network
 */
export const getMySellers = async (req, res) => {
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const { Seller } = await import('../models/index.js');

        // Query sellers who have this manufacturer in their approvedBy array
        // (set by handleSellerRequest when manufacturer approves the seller)
        const sellers = await Seller.find({
            approvedBy: mfgId
        })
            .populate('userId', 'email')
            .select('businessName contactInfo userId city approvedBy')
            .lean();

        res.json({ success: true, data: sellers });
    } catch (error) {
        logger.error('Error fetching seller network:', error);
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_SELLERS' });
    }
};

/**
 * Get Manufacturer Profile
 */
export const getProfile = async (req, res) => {
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const { Manufacturer } = await import('../models/index.js');
        const profile = await Manufacturer.findById(mfgId)
            .populate('userId', 'email status')
            .lean();

        if (!profile) {
            return res.status(404).json({ success: false, error: 'PROFILE_NOT_FOUND' });
        }

        res.json({ success: true, data: profile });
    } catch (error) {
        logger.error('Error fetching manufacturer profile:', error);
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_PROFILE' });
    }
};

/**
 * Update Manufacturer Profile
 */
export const updateProfile = async (req, res) => {
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const { Manufacturer } = await import('../models/index.js');

        // Remove fields that shouldn't be updated directly
        const { _id, userId, createdAt, __v, isVerified, verificationStatus, ...updateData } = req.body;

        // Check for critical field changes that require re-verification
        const criticalFields = ['companyName', 'gstNumber', 'registrationNo', 'bankDetails'];
        const hasCriticalUpdates = criticalFields.some(field => Object.keys(updateData).includes(field));

        if (hasCriticalUpdates) {
            updateData.isVerified = false;
            updateData.verificationStatus = 'PENDING';
            // Optionally notify admin or user
        }

        const updatedProfile = await Manufacturer.findByIdAndUpdate(
            mfgId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('userId', 'email status');

        if (!updatedProfile) {
            return res.status(404).json({ success: false, error: 'PROFILE_NOT_FOUND' });
        }

        // Check if we need to update User status as well (e.g. if REJECTED -> PENDING)
        if (hasCriticalUpdates) {
            const User = (await import('../models/index.js')).User;
            await User.findByIdAndUpdate(userId, { isVerified: false });
        }

        await auditService.logAction('PROFILE_UPDATE', 'MANUFACTURER', mfgId, {
            userId: req.user.id,
            newData: updateData,
            resetVerification: hasCriticalUpdates,
            req
        });

        res.json({ success: true, message: hasCriticalUpdates ? 'Profile updated. critical changes require re-verification.' : 'Profile updated successfully', data: updatedProfile });
    } catch (error) {
        logger.error('Error updating manufacturer profile:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getOrders = async (req, res) => {
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });
    try {
        const { Order } = await import('../models/index.js');
        const orders = await Order.find({
            'items.product': { $exists: true } // Sub-query logic in products/manufacturerId handled in populate/lean
        })
            .populate('items.product')
            .populate('sellerId', 'businessName')
            .populate('customerId', 'name')
            .sort({ createdAt: -1 })
            .lean();

        // Filter orders by manufacturer ID manually or via better query
        const filteredOrders = orders.filter(o => o.items.some(i => i.product?.manufacturerId?.toString() === mfgId.toString()));

        res.json({ success: true, data: filteredOrders });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_ORDERS' });
    }
};

/**
 * Get All Manufacturers (For Dealer Marketplace)
 */
export const getAllManufacturers = async (req, res) => {
    try {
        const { Manufacturer, Product } = await import('../models/index.js');
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

        res.json({
            success: true,
            data: activeManufacturers
        });
    } catch (error) {
        logger.error('Error fetching manufacturers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch manufacturers'
        });
    }
};

export default {
    handleSellerNetwork,
    getSellerRequests,
    allocateInventory,
    getAllocations,
    updateAllocation,
    revokeAllocation,
    getManufacturerStats,
    getMySellers,
    getProfile,
    updateProfile,
    getOrders,
    getAllManufacturers,

    // Product Requests
    getPendingProductRequests: async (req, res) => {
        const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
        if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

        try {
            const requests = await manufacturerService.getPendingProductRequests(mfgId);
            res.json({ success: true, data: requests });
        } catch (error) {
            console.error('Error in getPendingProductRequests:', error);
            res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_REQUESTS', details: error.message });
        }
    },

    approveProductRequest: async (req, res) => {
        const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
        const { inventoryId } = req.body;
        if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

        try {
            const result = await manufacturerService.approveProductRequest(mfgId, inventoryId);
            res.json({ success: true, message: 'Request approved', data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    rejectProductRequest: async (req, res) => {
        const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
        const { inventoryId, reason } = req.body;
        if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

        try {
            const result = await manufacturerService.rejectProductRequest(mfgId, inventoryId, reason);
            res.json({ success: true, message: 'Request rejected', data: result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
};

