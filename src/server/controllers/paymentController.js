import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../lib/prisma.js';
import paymentService from '../services/paymentService.js';
import logger from '../lib/logger.js';

// Initialize Razorpay (ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are in .env)
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

        // Fetch order
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // Check if already paid
        if (order.status !== 'CREATED') {
            return res.status(400).json({ success: false, error: 'Order already processed' });
        }

        if (!razorpay) {
            // SECURITY: Block mock payments in production
            if (process.env.NODE_ENV === 'production') {
                return res.status(503).json({
                    success: false,
                    error: 'Payment gateway not configured. Please contact support.'
                });
            }

            // Mock mode if Razorpay not configured (DEV ONLY)
            const mockOrderId = `mock_order_${Date.now()}`;

            // Create payment record
            await prisma.payment.upsert({
                where: { orderId: order.id },
                update: {
                    razorpayOrderId: mockOrderId,
                    amount: order.totalAmount,
                    status: 'PENDING'
                },
                create: {
                    orderId: order.id,
                    razorpayOrderId: mockOrderId,
                    amount: order.totalAmount,
                    status: 'PENDING'
                }
            });

            return res.json({
                success: true,
                data: {
                    razorpayOrderId: mockOrderId,
                    amount: Number(order.totalAmount) * 100, // paise
                    currency: 'INR',
                    key: 'mock_key',
                    isMock: true
                }
            });
        }

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Number(order.totalAmount) * 100, // Convert to paise
            currency: 'INR',
            receipt: order.id,
            notes: {
                orderId: order.id,
                customerId: order.customerId
            }
        });

        // Create/Update payment record
        await prisma.payment.upsert({
            where: { orderId: order.id },
            update: {
                razorpayOrderId: razorpayOrder.id,
                amount: order.totalAmount,
                status: 'PENDING'
            },
            create: {
                orderId: order.id,
                razorpayOrderId: razorpayOrder.id,
                amount: order.totalAmount,
                status: 'PENDING'
            }
        });

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

        if (!orderId) {
            return res.status(400).json({ success: false, error: 'Order ID required' });
        }

        // For mock payments, skip real signature verification
        if (razorpay_order_id && razorpay_order_id.startsWith('mock_')) {
            const { order, payment } = await paymentService.processPaymentSuccess({
                orderId,
                razorpayPaymentId: razorpay_payment_id || 'mock_payment',
                method: 'MOCK'
            });
            // Send email for mock too if needed, or just return
            import('../services/emailService.js').then((module) => {
                module.sendPaymentConfirmation(payment, order).catch(err =>
                    logger.error('Failed to send payment confirmation email:', err)
                );
            }).catch(() => { });

            return res.json({ success: true, data: { order, payment } });
        }

        // Real Razorpay verification
        if (!razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, error: 'Missing payment details' });
        }

        // Verify signature
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
            method: 'CARD' // Razorpay handles method details, we can enrich later via API if needed
        });

        // Send payment confirmation email (non-blocking)
        import('../services/emailService.js').then((module) => {
            module.sendPaymentConfirmation(payment, order).catch(err =>
                logger.error('Failed to send payment confirmation email:', err)
            );
        }).catch(() => { });

        res.json({ success: true, data: { order, payment } });

    } catch (error) {
        logger.error('Verify Payment Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Payment verification failed' });
    }
};

// Webhook Handler
export const handleWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (secret) {
            const receivedSignature = req.headers['x-razorpay-signature'];
            const body = JSON.stringify(req.body);

            const expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(body)
                .digest('hex');

            if (receivedSignature !== expectedSignature) {
                return res.status(400).json({ error: 'Invalid signature' });
            }
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

        const payment = await prisma.payment.findUnique({
            where: { orderId },
            include: {
                order: {
                    include: { escrow: true }
                }
            }
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
