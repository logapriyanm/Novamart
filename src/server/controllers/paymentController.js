import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order, Payment, Customer } from '../models/index.js';
import paymentService from '../services/paymentService.js';
import logger from '../lib/logger.js';

// Initialize Razorpay
const razorpay = process.env.RAZORPAY_KEY_ID ? new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
}) : null;

// Create Razorpay Order
export const createPaymentOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, error: 'Order ID is required' });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // SECURITY: Verify ownership — the requesting user must own this order
        const customer = await Customer.findOne({ userId: req.user._id });
        if (!customer || order.customerId.toString() !== customer._id.toString()) {
            return res.status(403).json({ success: false, error: 'Not authorized for this order' });
        }

        if (order.status !== 'CREATED') {
            return res.status(400).json({ success: false, error: 'Order already processed' });
        }

        if (!razorpay) {
            if (process.env.NODE_ENV === 'production') {
                return res.status(503).json({
                    success: false,
                    error: 'Payment gateway not configured. Please contact support.'
                });
            }

            const mockOrderId = `mock_order_${Date.now()}`;

            await Payment.findOneAndUpdate(
                { orderId: order._id },
                {
                    razorpayOrderId: mockOrderId,
                    amount: order.totalAmount,
                    status: 'PENDING'
                },
                { upsert: true }
            );

            return res.json({
                success: true,
                data: {
                    razorpayOrderId: mockOrderId,
                    amount: Number(order.totalAmount) * 100,
                    currency: 'INR',
                    key: 'mock_key',
                    isMock: true
                }
            });
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(Number(order.totalAmount) * 100),
            currency: 'INR',
            receipt: order._id.toString(),
            notes: {
                orderId: order._id.toString(),
                customerId: order.customerId.toString()
            }
        });

        await Payment.findOneAndUpdate(
            { orderId: order._id },
            {
                razorpayOrderId: razorpayOrder.id,
                amount: order.totalAmount,
                status: 'PENDING'
            },
            { upsert: true }
        );

        res.json({
            success: true,
            data: {
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID
            }
        });

    } catch (error) {
        logger.error('Create Payment Order Error:', error);
        res.status(500).json({ success: false, error: 'Payment initialization failed' });
    }
};

// Verify Payment and Create Escrow
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        // BATCH FLOW: If no orderId, but we have razorpay_order_id
        if (!orderId && razorpay_order_id) {

            // Validate Signature
            const body = razorpay_order_id + '|' + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body)
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                return res.status(400).json({ success: false, error: 'Invalid payment signature' });
            }

            // Process Batch
            const result = await paymentService.processBatchPaymentSuccess({
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature
            });

            // Send Emails (Async)
            result.orders.forEach(order => {
                import('../services/emailService.js').then((module) => {
                    module.default.sendOrderConfirmation(order._id).catch(err =>
                        logger.error('Failed to send order confirmation email:', err)
                    );
                }).catch(() => { });
            });

            return res.json({ success: true, data: result });
        }

        // LEGACY / SINGLE FLOW
        if (!orderId) {
            return res.status(400).json({ success: false, error: 'Order ID required' });
        }

        if (razorpay_order_id && razorpay_order_id.startsWith('mock_')) {
            const { order, payment } = await paymentService.processPaymentSuccess({
                orderId,
                razorpayPaymentId: razorpay_payment_id || 'mock_payment',
                method: 'MOCK'
            });

            import('../services/emailService.js').then((module) => {
                module.default.sendOrderConfirmation(order._id).catch(err =>
                    logger.error('Failed to send order confirmation email:', err)
                );
            }).catch(() => { });

            return res.json({ success: true, data: { order, payment } });
        }

        if (!razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, error: 'Missing payment details' });
        }

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, error: 'Invalid payment signature' });
        }

        const { order, payment } = await paymentService.processPaymentSuccess({
            orderId,
            razorpayPaymentId: razorpay_payment_id,
            method: 'CARD'
        });

        import('../services/emailService.js').then((module) => {
            module.default.sendOrderConfirmation(order._id).catch(err =>
                logger.error('Failed to send order confirmation email:', err)
            );
        }).catch(() => { });

        res.json({ success: true, data: { order, payment } });

    } catch (error) {
        logger.error('Verify Payment Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Payment verification failed' });
    }
};

// Get details for a Razorpay Order (for Batch Payment Page)
export const getRazorpayOrderDetails = async (req, res) => {
    try {
        const { razorpayOrderId } = req.params;

        // Find payments linked to this Razorpay Order
        const payments = await Payment.find({ razorpayOrderId });
        if (!payments.length) {
            return res.status(404).json({ success: false, error: 'Payment record not found' });
        }

        // Aggregate info
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

        res.json({
            success: true,
            data: {
                razorpayOrderId,
                amount: totalAmount,
                currency: 'INR', // Assuming INR
                key: process.env.RAZORPAY_KEY_ID
            }
        });

    } catch (error) {
        logger.error('Get Razorpay Order Details Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch payment details' });
    }
};

// Webhook Handler
export const handleWebhook = async (req, res) => {
    try {
        // SECURITY: Webhook signature verification is MANDATORY
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
            logger.error('RAZORPAY_WEBHOOK_SECRET is not configured — rejecting webhook');
            return res.status(500).json({ error: 'Webhook secret not configured' });
        }

        const receivedSignature = req.headers['x-razorpay-signature'];
        const body = JSON.stringify(req.body);

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        if (receivedSignature !== expectedSignature) {
            return res.status(400).json({ error: 'Invalid signature' });
        }

        const event = req.body.event;
        const payload = req.body.payload;

        if (event === 'payment.captured' || event === 'payment.authorized') {
            const paymentEntity = payload.payment.entity;
            const orderId = paymentEntity.notes?.orderId;

            if (orderId) {
                await paymentService.processPaymentSuccess({
                    orderId,
                    razorpayPaymentId: paymentEntity.id,
                    method: paymentEntity.method
                });
            }
        } else if (event === 'payment.failed') {
            const paymentEntity = payload.payment.entity;
            const orderId = paymentEntity.notes?.orderId;
            if (orderId) {
                await paymentService.processPaymentFailure({
                    orderId,
                    razorpayOrderId: paymentEntity.order_id,
                    errorDescription: paymentEntity.error_description
                });
            }
        }

        res.json({ status: 'ok' });

    } catch (error) {
        logger.error('Webhook Error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};

// Get Payment Status
export const getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        // SECURITY: Verify the user owns this order or is an admin
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        if (req.user.role !== 'ADMIN') {
            const customer = await Customer.findOne({ userId: req.user._id });
            if (!customer || order.customerId.toString() !== customer._id.toString()) {
                return res.status(403).json({ success: false, error: 'Not authorized for this order' });
            }
        }

        const payment = await Payment.findOne({ orderId })
            .populate({
                path: 'orderId',
                populate: { path: 'escrow' }
            });

        if (!payment) {
            return res.status(404).json({ success: false, error: 'Payment not found' });
        }

        res.json({ success: true, data: payment });

    } catch (error) {
        logger.error('Get Payment Status Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch payment status' });
    }
};
