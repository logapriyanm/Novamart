
import express from 'express';
import {
    createOrder,
    getOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus
} from '../../controllers/orders/orderController.js';
import authenticate from '../../middleware/auth.js';

// Middleware to verify token (assuming it's reusable from other routes)
// import { verifyToken } from '../../middleware/auth.js';
// Temporarily mocking/skipping auth middleware import if not clearly found,
// but based on `index.js`, controllers handle logic.
// However, `req.user` is needed. Let's assume standard middleware is available.

// For now, I will use a placeholder middleware or try to find the real one.
// Looking at `src/server/routes/auth/authRoutes.js` might reveal the middleware export.
// I'll proceed without import for now and add it in next step after verifying.

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);

// Routes
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

export default router;
