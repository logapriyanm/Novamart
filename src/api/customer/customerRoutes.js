/**
 * Customer Routes
 * Public and private endpoints for shoppers.
 */

import express from 'express';
import customerController from './customerController.js';
import authorize from '../../middleware/rbac.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

/**
 * Public Routes
 */
router.get('/products', customerController.getProducts);

/**
 * Protected Routes (Authenticated Customer Only)
 */
router.use(authenticate);
router.use(authorize(['CUSTOMER']));

router.post('/orders', customerController.placeOrder);
router.post('/orders/:orderId/pay', customerController.payOrder);
router.get('/orders/:id', customerController.getOrderDetails);
router.post('/ratings', customerController.rateService);
router.post('/orders/:orderId/dispute', customerController.raiseOrderDispute);

export default router;
