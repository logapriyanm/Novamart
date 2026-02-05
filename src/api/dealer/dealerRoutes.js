/**
 * Dealer Routes
 * Localized operations for regional fulfillment agents.
 */

import express from 'express';
import dealerController from './dealerController.js';
import authorize from '../../middleware/rbac.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize(['DEALER']));

/**
 * Inventory & Pricing
 */
router.get('/inventory', dealerController.getMyInventory);
router.put('/inventory/price', dealerController.updatePrice);

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

export default router;
