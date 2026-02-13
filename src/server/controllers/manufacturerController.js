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
 * Handle Dealer Application (Approve/Reject)
 */
export const handleDealerNetwork = async (req, res) => {
    const { dealerId, status } = req.body;
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const result = await manufacturerService.handleDealerRequest(mfgId, dealerId, status);

        await auditService.logAction('DEALER_NETWORK_UPDATE', 'MANUFACTURER', mfgId, {
            userId: req.user.id,
            newData: { dealerId, status },
            req
        });

        // Notify dealer of decision
        const { Seller, Notification } = await import('../models/index.js');
        const seller = await Seller.findById(dealerId).populate('userId');

        if (seller?.userId) {
            const notifyPayload = {
                userId: seller.userId._id,
                type: 'PARTNERSHIP',
                title: `Partnership Request ${status}`,
                message: status === 'APPROVED'
                    ? 'Congratulations! Your partnership request has been approved. You can now start sourcing products.'
                    : 'Your partnership request was not approved at this time. You can reach out to the manufacturer for more details.',
                link: status === 'APPROVED' ? '/dealer/inventory' : '/dealer/marketplace'
            };
            logger.debug('Notification.create payload: %o', notifyPayload);
            await Notification.create(notifyPayload);
        }

        res.json({ success: true, message: `Dealer request ${status}`, data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Get Dealer Requests
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
 * Allocate Stock to Region/Dealer
 */
export const allocateInventory = async (req, res) => {
    const { productId, dealerId, region, quantity, dealerBasePrice, dealerMoq, maxMargin } = req.body;
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const result = await stockAllocationService.allocateStock(mfgId, {
            productId,
            dealerId,
            region,
            quantity,
            dealerBasePrice,
            dealerMoq,
            maxMargin
        });
        res.status(201).json({ success: true, message: 'Stock allocated successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Get all active allocations for manufacturer
 */
export const getAllocations = async (req, res) => {
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const allocations = await stockAllocationService.getManufacturerAllocations(mfgId);
        res.json({ success: true, data: allocations });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_ALLOCATIONS' });
    }
};

/**
 * Update existing allocation
 */
export const updateAllocation = async (req, res) => {
    const { allocationId } = req.params;
    const updateData = req.body;
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const result = await stockAllocationService.updateAllocation(mfgId, allocationId, updateData);
        res.json({ success: true, message: 'Allocation updated successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Revoke stock allocation
 */
export const revokeAllocation = async (req, res) => {
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const result = await stockAllocationService.revokeAllocation(mfgId, allocationId);
        res.json({ success: true, message: 'Allocation revoked successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Get Sales & Credit Insights
 */
export const getManufacturerStats = async (req, res) => {
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });
    try {
        const { Product } = await import('../models/index.js');
        const [sales, credit, productsCount, requests] = await Promise.all([
            manufacturerService.getSalesAnalytics(mfgId),
            manufacturerService.getCreditStatus(mfgId),
            Product.countDocuments({ manufacturerId: mfgId }),
            manufacturerService.getDealerRequests(mfgId, 'PENDING')
        ]);

        res.json({
            success: true,
            data: {
                sales,
                credit,
                productsCount,
                pendingDealerRequests: requests.length
            }
        });
    } catch (error) {
        logger.error('Stats Error:', error);
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_ANALYTICS' });
    }
};

/**
 * List Managed Dealers
 */
export const getMyDealers = async (req, res) => {
    const mfgId = req.user.manufacturer?._id || req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });
    try {
        const { Manufacturer } = await import('../models/index.js');
        const manufacturer = await Manufacturer.findById(mfgId)
            .populate({
                path: 'approvedBy',
                populate: { path: 'userId', select: 'email status' }
            });
        res.json({ success: true, data: manufacturer.approvedBy });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_DEALERS' });
    }
};

export const getProfile = async (req, res) => {
    const manufacturer = req.user.manufacturer;
    if (!manufacturer) {
        return res.status(404).json({ success: false, error: 'MANUFACTURER_PROFILE_NOT_FOUND' });
    }
    const mfgId = manufacturer._id || manufacturer.id;
    try {
        const profile = await manufacturerService.getProfile(mfgId);
        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_PROFILE' });
    }
};

export const updateProfile = async (req, res) => {
    const mfgId = req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });
    const { section, data } = req.body;
    try {
        const result = await manufacturerService.updateProfile(mfgId, section, data);

        await auditService.logAction('PROFILE_UPDATE', 'MANUFACTURER', mfgId, {
            userId: req.user.id,
            section,
            newData: data,
            req
        });

        // Emit System Event
        if (section === 'BANK') {
            systemEvents.emit(EVENTS.COMPLIANCE.BANK_CHANGED, {
                userId: req.user.id,
                manufacturerId: mfgId
            });
        }

        res.json({
            success: true,
            message: `Profile ${section} updated successfully`,
            data: result
        });
    } catch (error) {
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
            .populate('dealerId', 'businessName')
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

