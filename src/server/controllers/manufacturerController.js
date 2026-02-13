/**
 * Manufacturer Controller
 * Management for product lifecycle and dealer network.
 */

import manufacturerService from '../services/manufacturer.js';
import stockAllocationService from '../services/stockAllocationService.js';
import auditService from '../services/audit.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';
import logger from '../lib/logger.js';

/**
 * Handle Seller Application (Approve/Reject)
 */
export const handleDealerNetwork = async (req, res) => {
    const { dealerId, sellerId, status } = req.body;
    const targetSellerId = sellerId || dealerId;
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const result = await manufacturerService.handleDealerRequest(mfgId, targetSellerId, status);

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
export const getDealerRequests = async (req, res) => {
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    const { status } = req.query;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const requests = await manufacturerService.getDealerRequests(mfgId, status || 'PENDING');
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_REQUESTS' });
    }
};

/**
 * Allocate Stock to Region/Seller
 */
export const allocateInventory = async (req, res) => {
    const { productId, dealerId, sellerId, region, quantity, dealerBasePrice, dealerMoq, maxMargin } = req.body;
    const targetSellerId = sellerId || dealerId;
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const result = await stockAllocationService.allocateStock(mfgId, {
            productId,
            sellerId: targetSellerId,
            region,
            quantity,
            sellerBasePrice: dealerBasePrice, // Mapping legacy input to service expected input if service changed? 
            // Service expects sellerBasePrice. If frontend sends dealerBasePrice, we map it.
            // Wait, service `allocateStock` destructures `sellerBasePrice`.
            sellerBasePrice: dealerBasePrice,
            sellerMoq: dealerMoq,
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
        const allocations = await stockAllocationService.getAllocations(mfgId);
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

        // Total dealers/sellers in network
        const totalDealers = await Seller.countDocuments({
            'manufacturerNetwork.manufacturerId': mfgId,
            'manufacturerNetwork.status': 'APPROVED'
        });

        // Orders statistics
        const orders = await Order.find({})
            .populate('items.product')
            .lean();

        const manufacturerOrders = orders.filter(o =>
            o.items.some(i => i.product?.manufacturerId?.toString() === mfgId.toString())
        );

        const totalOrders = manufacturerOrders.length;
        const totalRevenue = manufacturerOrders.reduce((sum, order) => {
            const orderRevenue = order.items
                .filter(i => i.product?.manufacturerId?.toString() === mfgId.toString())
                .reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
            return sum + orderRevenue;
        }, 0);

        // Recent orders (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentOrders = manufacturerOrders.filter(o => new Date(o.createdAt) >= thirtyDaysAgo);

        res.json({
            success: true,
            data: {
                products: {
                    total: totalProducts,
                    approved: approvedProducts,
                    pending: totalProducts - approvedProducts
                },
                network: {
                    totalDealers,
                },
                orders: {
                    total: totalOrders,
                    recent: recentOrders.length,
                    totalRevenue
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
export const getMyDealers = async (req, res) => {
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const { Seller } = await import('../models/index.js');

        const dealers = await Seller.find({
            'manufacturerNetwork.manufacturerId': mfgId,
            'manufacturerNetwork.status': 'APPROVED'
        })
            .populate('userId', 'email')
            .select('businessName contactInfo userId manufacturerNetwork')
            .lean();

        res.json({ success: true, data: dealers });
    } catch (error) {
        logger.error('Error fetching dealer network:', error);
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_DEALERS' });
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
        const { _id, userId, createdAt, __v, ...updateData } = req.body;

        const updatedProfile = await Manufacturer.findByIdAndUpdate(
            mfgId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('userId', 'email status');

        if (!updatedProfile) {
            return res.status(404).json({ success: false, error: 'PROFILE_NOT_FOUND' });
        }

        await auditService.logAction('PROFILE_UPDATE', 'MANUFACTURER', mfgId, {
            userId: req.user.id,
            newData: updateData,
            req
        });

        res.json({ success: true, message: 'Profile updated successfully', data: updatedProfile });
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
    handleDealerNetwork,
    getDealerRequests,
    allocateInventory,
    getAllocations,
    updateAllocation,
    revokeAllocation,
    getManufacturerStats,
    getMyDealers,
    getProfile,
    updateProfile,
    getOrders,
    getAllManufacturers
};

