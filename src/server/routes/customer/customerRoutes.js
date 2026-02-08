/**
 * Customer Routes
 * Public and private endpoints for shoppers.
 */

import express from 'express';
import customerController from '../../controllers/customerController.js';
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
router.get('/orders', customerController.getOrders);
router.get('/stats', customerController.getStats);
router.post('/orders/:orderId/pay', customerController.payOrder);
router.get('/orders/:id', customerController.getOrderDetails);
router.post('/ratings', customerController.rateService);
router.post('/orders/:orderId/dispute', customerController.raiseOrderDispute);

/**
 * Profile Management
 */
router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);

export default router;

