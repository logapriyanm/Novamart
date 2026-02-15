/**
 * Seller Controller
 * Management for regional fulfillment and retail ops.
 */

import sellerService from '../services/seller.js';
import logger from '../lib/logger.js';
import stockAllocationService from '../services/stockAllocationService.js';
import orderService from '../services/order.js';
import auditService from '../services/audit.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';

/**
 * Get Local Inventory (Retail Listings)
 */
export const getMyInventory = async (req, res) => {
    const sellerId = req.user.seller?._id || req.user.seller?.id;
    try {
        const inventory = await sellerService.getInventory(sellerId);
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
    const sellerId = req.user.seller?._id || req.user.seller?.id;
    const { id } = req.params;
    try {
        const item = await sellerService.getInventoryItem(id, sellerId);
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

/**
 * Get Allocated Products from Manufacturers (Phase 4)
 */
export const getMyAllocations = async (req, res) => {
    const sellerId = req.user.seller?._id || req.user.seller?.id;
    try {
        const allocations = await stockAllocationService.getSellerAllocations(sellerId);
        res.json({ success: true, data: allocations });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_ALLOCATIONS' });
    }
};

/**
 * Update Retail Pricing
 */
export const updatePrice = async (req, res) => {
    const sellerId = req.user.seller?._id || req.user.seller?.id;
    const { inventoryId, price } = req.body;
    try {
        const result = await sellerService.updateRetailPrice(inventoryId, sellerId, price);

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
 * Update Stock Levels - DISABLED FOR SECURITY
 * CRITICAL: Direct stock manipulation is blocked to prevent overselling
 * Stock can ONLY be modified via allocation deductions during order placement
 */
export const updateStock = async (req, res) => {
    // SECURITY LOCKDOWN: Manual stock editing is disabled
    return res.status(403).json({
        success: false,
        error: 'FEATURE_DISABLED',
        message: 'Direct stock editing is disabled for security. Stock is managed automatically via allocations and orders.',
        hint: 'To update stock, create a new allocation from manufacturer negotiation'
    });

    /* ORIGINAL IMPLEMENTATION - DISABLED FOR SECURITY
    const sellerId = req.user.seller?._id || req.user.seller?.id;
    const { inventoryId, stock } = req.body;
    try {
        const result = await sellerService.updateStock(inventoryId, sellerId, stock);

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
    */
};

/**
 * Update Inventory Details (Custom Images, Name, Description)
 */
export const updateDetails = async (req, res) => {
    const sellerId = req.user.seller?._id || req.user.seller?.id;
    const { inventoryId, ...updates } = req.body;
    try {
        const result = await sellerService.updateInventoryDetails(inventoryId, sellerId, updates);

        await auditService.logAction('INVENTORY_UPDATE', 'INVENTORY', inventoryId, {
            userId: req.user.id,
            newData: updates,
            req
        });

        res.json({
            success: true,
            message: 'Product details updated successfully',
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
    const sellerId = req.user.seller?._id || req.user.seller?.id;
    const { inventoryId, isListed } = req.body;
    try {
        const result = await sellerService.toggleListing(inventoryId, sellerId, isListed);
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
export const getSellerStats = async (req, res) => {
    const sellerId = req.user.seller?._id || req.user.seller?.id;
    try {
        const stats = await sellerService.getDashboardStats(sellerId);
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
    const sellerId = req.user.seller?._id || req.user.seller?.id;
    const { productId, region, stock, price } = req.body;
    try {
        const inventory = await sellerService.sourceProduct(sellerId, productId, region, stock, price);
        res.status(201).json({
            success: true,
            message: inventory.allocationStatus === 'PENDING' ? 'REQUEST_PENDING' : 'Product sourced successfully',
            data: inventory
        });
    } catch (error) {
        console.error('SOURCE_PRODUCT_ERROR:', error);
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
    const sellerId = req.user.seller?._id || req.user.seller?.id;
    try {
        const profile = await sellerService.getProfile(sellerId);
        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_PROFILE' });
    }
};

export const updateProfile = async (req, res) => {
    const sellerId = req.user.seller?._id || req.user.seller?.id;
    const { section, data } = req.body;
    try {
        const { Seller, User } = await import('../models/index.js');

        // Check for critical section updates
        const criticalSections = ['BUSINESS', 'BANK', 'GST']; // Add GST if it's a separate section in frontend
        const requiresVerificationReset = criticalSections.includes(section);

        const result = await sellerService.updateProfile(sellerId, section, data);

        if (requiresVerificationReset) {
            await Seller.findByIdAndUpdate(sellerId, {
                isVerified: false,
                verificationStatus: 'PENDING'
            });
            await User.findByIdAndUpdate(req.user.id, { isVerified: false });
        }

        await auditService.logAction('PROFILE_UPDATE', 'SELLER', sellerId, {
            userId: req.user.id,
            section,
            newData: data,
            resetVerification: requiresVerificationReset,
            req
        });

        // Emit System Event
        if (section === 'BANK') {
            systemEvents.emit(EVENTS.COMPLIANCE.BANK_CHANGED, {
                userId: req.user.id,
                sellerId
            });
        }

        res.json({
            success: true,
            message: requiresVerificationReset ? `Profile ${section} updated. Critical changes require re-verification.` : `Profile ${section} updated successfully`,
            data: result
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getPublicSellerProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const { Seller, Inventory, Review } = await import('../models/index.js');

        const seller = await Seller.findById(id)
            .populate('userId', 'createdAt')
            .lean();

        if (!seller) {
            return res.status(404).json({ success: false, error: 'Seller not found' });
        }

        // Fetch inventory and reviews separately (no virtuals needed)
        const [inventory, reviews] = await Promise.all([
            Inventory.find({ sellerId: id, stock: { $gt: 0 } })
                .populate('productId', 'name images basePrice category description')
                .lean(),
            Review.find({ sellerId: id, type: 'SELLER' })
                .populate('customerId', 'name')
                .sort({ createdAt: -1 })
                .lean()
        ]);

        const publicProfile = {
            id: seller._id,
            businessName: seller.businessName,
            description: seller.description,
            city: seller.city,
            state: seller.state,
            isVerified: seller.isVerified,
            profileImage: seller.profileImage,
            joinedAt: seller.userId?.createdAt,
            stats: {
                averageRating: seller.averageRating || 0,
                reviewCount: seller.reviewCount || 0,
                totalProducts: inventory.length
            },
            reviews: reviews || [],
            products: (inventory || [])
                .filter(item => item.productId)
                .map(item => ({
                    ...item.productId,
                    id: item.productId._id,

                    // Merge Seller Overrides
                    name: item.customName || item.productId.name,
                    description: item.customDescription || item.productId.description,
                    images: (item.customImages && item.customImages.length > 0) ? item.customImages : item.productId.images,
                    category: item.customCategory || item.productId.category,

                    // Inventory Metadata
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
        logger.error('Error fetching seller profile:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch seller profile' });
    }
};

export const getManufacturers = async (req, res) => {
    try {
        console.log('Fetching manufacturers for discovery...');
        const manufacturers = await sellerService.getManufacturersForDiscovery();
        console.log(`Found ${manufacturers.length} manufacturers.`);
        res.json({ success: true, data: manufacturers });
    } catch (error) {
        console.error('CRITICAL ERROR in getManufacturers:', error);
        logger.error('getManufacturers Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch manufacturers', details: error.message });
    }
};

export const getManufacturerDetails = async (req, res) => {
    const sellerId = req.user.seller?._id || req.user.seller?.id;
    const { id } = req.params;
    try {
        const manufacturer = await sellerService.getManufacturerDetails(id, sellerId);
        res.json({ success: true, data: manufacturer });
    } catch (error) {
        console.error('CRITICAL ERROR in getManufacturerDetails:', error);
        logger.error('getManufacturerDetails Error:', error);
        res.status(404).json({ success: false, error: error.message });
    }
};

export const requestManufacturerAccess = async (req, res) => {
    const userId = req.user._id; // Use Requesting User ID
    const { manufacturerId, productId, ...metadata } = req.body;
    try {
        const request = await sellerService.requestAccess(userId, manufacturerId, { ...metadata, productId });
        res.status(201).json({
            success: true,
            message: 'Access request sent successfully',
            data: request
        });
    } catch (error) {
        console.error('CRITICAL ERROR in requestManufacturerAccess:', error);
        logger.error('requestManufacturerAccess Error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getMyRequests = async (req, res) => {
    const sellerId = req.user.seller?._id || req.user.seller?.id;
    try {
        if (!sellerId) {
            console.warn('getMyRequests: Seller ID is missing. Returning empty list.');
            return res.json({ success: true, data: [] });
        }
        const requests = await sellerService.getMyAccessRequests(sellerId);
        res.json({ success: true, data: requests });
    } catch (error) {
        console.error('CRITICAL ERROR in getMyRequests:', error);
        logger.error('getMyRequests Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch requests', details: error.message });
    }
};

export const replyToReview = async (req, res) => {
    const sellerId = req.user.seller?._id || req.user.seller?.id;
    const { reviewId } = req.params;
    const { response } = req.body;
    try {
        const result = await sellerService.replyToReview(sellerId, reviewId, response);
        res.json({
            success: true,
            message: 'Response posted successfully',
            data: result
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export default {
    getMyInventory,
    getInventoryItem,
    getMyAllocations,
    updatePrice,
    updateStock,
    updateDetails,
    toggleListing,
    getSellerStats,
    confirmOrder,
    shipOrder,
    sourceProduct,
    requestSettlement,
    getMyProfile,
    updateProfile,
    getPublicSellerProfile,
    getManufacturers,
    getManufacturerDetails,
    requestManufacturerAccess,
    getMyRequests,
    replyToReview
};
