import express from 'express';
import {
    createPaymentOrder,
    verifyPayment,
    handleWebhook,
    getPaymentStatus
} from '../../controllers/paymentController.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

// Create Razorpay order
router.post('/create-order', authenticate, createPaymentOrder);

// Verify payment
router.post('/verify', authenticate, verifyPayment);

// Get payment status
router.get('/status/:orderId', authenticate, getPaymentStatus);

// Webhook (no auth - verified via signature)
router.post('/webhook', handleWebhook);

export default router;
