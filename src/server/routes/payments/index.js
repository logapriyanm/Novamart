import express from 'express';
import {
    createPaymentOrder,
    verifyPayment,
    handleWebhook,
    getPaymentStatus,
    getRazorpayOrderDetails
} from '../../controllers/paymentController.js';
import authenticate from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';
import { paymentRateLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

// Create Razorpay order
router.post('/create-order', authenticate, authorize(['CUSTOMER']), paymentRateLimiter, createPaymentOrder);

// Verify payment
router.post('/verify', authenticate, authorize(['CUSTOMER']), paymentRateLimiter, verifyPayment);

// Get payment status
router.get('/status/:orderId', authenticate, getPaymentStatus);
router.get('/razorpay/:razorpayOrderId', authenticate, getRazorpayOrderDetails);

// Webhook (no auth - verified via signature)
router.post('/webhook', handleWebhook);

export default router;
