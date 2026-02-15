
import express from 'express';
import {
    createOrder,
    initiateCheckout,
    getOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    raiseDispute,
    simulateDelivery
} from '../../controllers/orders/orderController.js';
import authenticate from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';
import { checkoutRateLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);

// Routes
// Routes
router.post('/checkout/initiate', authorize(['CUSTOMER']), checkoutRateLimiter, initiateCheckout);
router.post('/', authorize(['CUSTOMER']), checkoutRateLimiter, createOrder);
router.get('/', authorize(['ADMIN', 'SELLER']), getOrders);
router.get('/my', authorize(['CUSTOMER']), getMyOrders);
router.get('/:id', getOrderById); // Ownership checked in service
router.get('/:id/payment', getOrderById);
router.patch('/:id/status', authorize(['ADMIN', 'SELLER', 'MANUFACTURER']), updateOrderStatus);
router.post('/:id/dispute', authorize(['CUSTOMER']), raiseDispute);
router.post('/:id/simulate-delivery', authorize(['ADMIN', 'SELLER']), simulateDelivery);

export default router;
