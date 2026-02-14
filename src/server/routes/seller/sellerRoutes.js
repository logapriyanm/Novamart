/**
 * Seller Routes
 * Localized operations for regional fulfillment agents.
 */

import express from 'express';
import sellerController from '../../controllers/sellerController.js';
import authorize from '../../middleware/rbac.js';
import authenticate from '../../middleware/auth.js';
import requireSellerApproved from '../../middleware/requireSellerApproved.js';

const router = express.Router();

// Public Routes
router.get('/public/:id', sellerController.getPublicSellerProfile);

// Protected Routes - Require authentication and SELLER role
router.use(authenticate);
router.use(authorize(['SELLER'], [], ['ACTIVE', 'UNDER_VERIFICATION', 'PENDING']));

// CRITICAL: Block PENDING sellers from accessing dashboard (Phase 1 enforcement)
// This middleware returns 403 if seller status is not ACTIVE
router.use(requireSellerApproved);

/**
 * Inventory & Pricing
 */
router.get('/inventory', sellerController.getMyInventory);
router.get('/inventory/:id', sellerController.getInventoryItem);
router.get('/allocations', sellerController.getMyAllocations);
router.post('/source', sellerController.sourceProduct);
router.put('/inventory/price', sellerController.updatePrice);
router.put('/inventory/stock', sellerController.updateStock);
router.put('/inventory/toggle-listing', sellerController.toggleListing);


/**
 * Performance & Reputation
 */
router.get('/analytics', sellerController.getSellerStats);
router.post('/reviews/:reviewId/reply', sellerController.replyToReview);

/**
 * Fulfillment
 */
router.post('/orders/:orderId/confirm', sellerController.confirmOrder);
router.post('/orders/:orderId/ship', sellerController.shipOrder);
router.get('/orders/:orderId/payout', sellerController.requestSettlement);

/**
 * Profile & Identity
 */
router.get('/profile', sellerController.getMyProfile);
router.put('/profile', sellerController.updateProfile);

/**
 * Manufacturer Discovery & Access Requests
 */
router.get('/manufacturers', sellerController.getManufacturers);
router.get('/manufacturers/:id', sellerController.getManufacturerDetails);
router.post('/request-access', sellerController.requestManufacturerAccess);
router.get('/my-requests', sellerController.getMyRequests);

export default router;
