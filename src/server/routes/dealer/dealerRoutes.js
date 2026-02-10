/**
 * Dealer Routes
 * Localized operations for regional fulfillment agents.
 */

import express from 'express';
import dealerController from '../../controllers/dealerController.js';
import authorize from '../../middleware/rbac.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

// Public Routes
router.get('/public/:id', dealerController.getPublicDealerProfile);

// Allow PENDING status so new dealers can see their "Application Pending" dashboard state
router.use(authenticate);
router.use(authorize(['DEALER'], [], ['ACTIVE', 'UNDER_VERIFICATION', 'PENDING']));

/**
 * Inventory & Pricing
 */
router.get('/inventory', dealerController.getMyInventory);
router.get('/inventory/:id', dealerController.getInventoryItem);
router.get('/allocations', dealerController.getMyAllocations);
router.post('/source', dealerController.sourceProduct);
router.put('/inventory/price', dealerController.updatePrice);
router.put('/inventory/stock', dealerController.updateStock);
router.put('/inventory/toggle-listing', dealerController.toggleListing);


/**
 * Performance
 */
router.get('/analytics', dealerController.getDealerStats);

/**
 * Fulfillment
 */
router.post('/orders/:orderId/confirm', dealerController.confirmOrder);
router.post('/orders/:orderId/ship', dealerController.shipOrder);
router.get('/orders/:orderId/payout', dealerController.requestSettlement);

/**
 * Profile & Identity
 */
router.get('/profile', dealerController.getMyProfile);
router.put('/profile', dealerController.updateProfile);

/**
 * Manufacturer Discovery & Access Requests
 */
router.get('/manufacturers', dealerController.getManufacturers);
router.post('/request-access', dealerController.requestManufacturerAccess);
router.get('/my-requests', dealerController.getMyRequests);

export default router;

