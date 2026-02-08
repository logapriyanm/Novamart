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

router.use(authenticate);
router.use(authorize(['DEALER']));

/**
 * Inventory & Pricing
 */
router.get('/inventory', dealerController.getMyInventory);
router.post('/source', dealerController.sourceProduct);
router.put('/inventory/price', dealerController.updatePrice);
router.put('/inventory/stock', dealerController.updateStock);

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

export default router;

