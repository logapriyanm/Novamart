
import express from 'express';
import {
    createOrder,
    getOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus
} from '../../controllers/orders/orderController.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);

// Routes
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.get('/:id/payment', getOrderById); // Reusing getOrderById for now, or create dedicated controller
router.patch('/:id/status', updateOrderStatus);

export default router;
