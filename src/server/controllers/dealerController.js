/**
 * Dealer Controller
 * Management for regional fulfillment and retail ops.
 */

import dealerService from '../services/dealer.js';
import stockAllocationService from '../services/stockAllocationService.js';
import orderService from '../services/order.js';
import auditService from '../services/audit.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';

/**
 * Get Local Inventory (Retail Listings)
 */
export const getMyInventory = async (req, res) => {
    const dealerId = req.user.dealer?._id || req.user.dealer?.id;
    try {
        const inventory = await dealerService.getInventory(dealerId);
        res.json({
            success: true,
            data: inventory
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_INVENTORY' });
    }
};

/**
 * Get Specific Inventory Asset Details
 */
export const getInventoryItem = async (req, res) => {
    const dealerId = req.user.dealer?._id || req.user.dealer?.id;
    const { id } = req.params;
    try {
        const item = await dealerService.getInventoryItem(id, dealerId);
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

/**
 * Get Allocated Products from Manufacturers (Phase 4)
 */
export const getMyAllocations = async (req, res) => {
    const dealerId = req.user.dealer?._id || req.user.dealer?.id;
    try {
        const allocations = await stockAllocationService.getDealerAllocations(dealerId);
        res.json({ success: true, data: allocations });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_ALLOCATIONS' });
    }
};

/**
 * Update Retail Pricing
 */
export const updatePrice = async (req, res) => {
    const dealerId = req.user.dealer?._id || req.user.dealer?.id;
    const { inventoryId, price } = req.body;
    try {
        const result = await dealerService.updateRetailPrice(inventoryId, dealerId, price);

        await auditService.logAction('RETAIL_PRICE_UPDATE', 'INVENTORY', inventoryId, {
            userId: req.user.id,
            newData: { price },
            req
        });

        res.json({
            success: true,
            message: 'Price updated successfully',
            data: result
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Update Stock Levels
 */
export const updateStock = async (req, res) => {
    const dealerId = req.user.dealer?._id || req.user.dealer?.id;
    const { inventoryId, stock } = req.body;
    try {
        const result = await dealerService.updateStock(inventoryId, dealerId, stock);

        await auditService.logAction('STOCK_UPDATE', 'INVENTORY', inventoryId, {
            userId: req.user.id,
            newData: { stock },
            req
        });

        res.json({
            success: true,
            message: 'Stock updated successfully',
            data: result
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Toggle Product Visibility (Go Live)
 */
export const toggleListing = async (req, res) => {
    const dealerId = req.user.dealer?._id || req.user.dealer?.id;
    const { inventoryId, isListed } = req.body;
    try {
        const result = await dealerService.toggleListing(inventoryId, dealerId, isListed);
        res.json({
            success: true,
            message: `Product ${isListed ? 'listed' : 'delisted'} successfully`,
            data: result
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Dashboard & Reports
 */
export const getDealerStats = async (req, res) => {
    const dealerId = req.user.dealer?._id || req.user.dealer?.id;
    try {
        const stats = await dealerService.getSalesReport(dealerId);
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_STATS' });
    }
};

/**
 * Order Fulfillment Actions
 */
export const confirmOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const result = await orderService.confirmOrder(orderId);
        res.json({
            success: true,
            message: 'Order confirmed',
            data: result
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const shipOrder = async (req, res) => {
    const { orderId } = req.params;
    const { trackingNumber } = req.body;
    try {
        const result = await orderService.shipOrder(orderId, trackingNumber);
        res.json({
            success: true,
            message: 'Order shipped',
            data: result
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Sourcing & Inventory Creation
 */
export const sourceProduct = async (req, res) => {
    const dealerId = req.user.dealer?._id || req.user.dealer?.id;
    const { productId, region, stock, price } = req.body;
    try {
        const inventory = await dealerService.sourceProduct(dealerId, productId, region, stock, price);
        res.status(201).json({
            success: true,
            message: 'Product sourced successfully',
            data: inventory
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Handle Order Payout/Settlement Trigger (Mock)
 */
export const requestSettlement = async (req, res) => {
    const { orderId } = req.params;
    res.json({
        success: true,
        message: 'Payout status: PENDING_WINDOW',
        data: { orderId, status: 'PENDING_WINDOW' }
    });
};

/**
 * Profile Management
 */
export const getMyProfile = async (req, res) => {
    const dealerId = req.user.dealer?._id || req.user.dealer?.id;
    try {
        const profile = await dealerService.getProfile(dealerId);
        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_PROFILE' });
    }
};

export const updateProfile = async (req, res) => {
    const dealerId = req.user.dealer?._id || req.user.dealer?.id;
    const { section, data } = req.body;
    try {
        const result = await dealerService.updateProfile(dealerId, section, data);

        await auditService.logAction('PROFILE_UPDATE', 'DEALER', dealerId, {
            userId: req.user.id,
            section,
            newData: data,
            req
        });

        // Emit System Event
        if (section === 'BANK') {
            systemEvents.emit(EVENTS.COMPLIANCE.BANK_CHANGED, {
                userId: req.user.id,
                dealerId
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

export const getPublicDealerProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const { Dealer } = await import('../models/index.js');
        const dealer = await Dealer.findById(id)
            .populate('userId', 'createdAt')
            .populate({
                path: 'sellerReviews',
                populate: { path: 'customerId', select: 'name' }
            })
            .populate({
                path: 'inventory',
                match: { stock: { $gt: 0 } },
                populate: { path: 'productId', select: 'name images basePrice category' }
            })
            .lean();

        if (!dealer) {
            return res.status(404).json({ success: false, error: 'Dealer not found' });
        }

        // Mask sensitive data
        const publicProfile = {
            id: dealer._id,
            businessName: dealer.businessName,
            city: dealer.city,
            state: dealer.state,
            joinedAt: dealer.userId?.createdAt,
            stats: {
                averageRating: dealer.averageRating,
                reviewCount: dealer.reviewCount,
                totalProducts: dealer.inventory.length
            },
            reviews: dealer.sellerReviews || [],
            inventory: (dealer.inventory || []).map(item => ({
                ...item.productId, // Flatten product details
                inventoryId: item._id,
                price: item.price,
                stock: item.stock
            }))
        };

        res.json({
            success: true,
            data: publicProfile
        });
    } catch (error) {
        console.error('Error fetching dealer profile:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch dealer profile' });
    }
};

export const getManufacturers = async (req, res) => {
    try {
        const manufacturers = await dealerService.getManufacturersForDiscovery();
        res.json({ success: true, data: manufacturers });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch manufacturers' });
    }
};

export const requestManufacturerAccess = async (req, res) => {
    const dealerId = req.user.dealer?._id || req.user.dealer?.id;
    const { manufacturerId, ...metadata } = req.body;
    try {
        const request = await dealerService.requestAccess(dealerId, manufacturerId, metadata);
        res.status(201).json({
            success: true,
            message: 'Access request sent successfully',
            data: request
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getMyRequests = async (req, res) => {
    const dealerId = req.user.dealer?._id || req.user.dealer?.id;
    try {
        const requests = await dealerService.getMyAccessRequests(dealerId);
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch requests' });
    }
};

export default {
    getMyInventory,
    getInventoryItem,
    getMyAllocations,
    updatePrice,
    updateStock,
    toggleListing,
    getDealerStats,
    confirmOrder,
    shipOrder,
    sourceProduct,
    requestSettlement,
    getMyProfile,
    updateProfile,
    getPublicDealerProfile,
    getManufacturers,
    requestManufacturerAccess,
    getMyRequests
};

