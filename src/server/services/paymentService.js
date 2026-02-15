import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order, Payment, Escrow, Customer } from '../models/index.js';
import { isValidTransition } from '../lib/stateMachine.js';
import mongoose from 'mongoose';
import logger from '../lib/logger.js';

const COMMISSION_RATE = 0.05; // 5% platform commission — IMMUTABLE

// Initialize Razorpay
const razorpay = process.env.RAZORPAY_KEY_ID ? new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
}) : null;

class PaymentService {

    /**
     * Create a Razorpay Order for a batch of internal orders.
     * @param {number} amount - Grand total in INR
     * @param {string[]} orderIds - Array of internal Order IDs
     * @param {string} customerId - Customer ID
     */
    async createBatchRazorpayOrder(amount, orderIds, customerId) {
        if (!razorpay) {
            // Mock Mode for Dev/Test
            if (process.env.NODE_ENV !== 'production' || process.env.MOCK_PAYMENTS === 'true') {
                return {
                    id: `mock_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    amount: Math.round(amount * 100),
                    currency: 'INR',
                    isMock: true
                };
            }
            throw new Error('Payment gateway not configured');
        }

        const options = {
            amount: Math.round(amount * 100), // amount in paisa
            currency: 'INR',
            receipt: `batch_${Date.now()}`,
            notes: {
                type: 'BATCH_ORDER',
                orderIds: JSON.stringify(orderIds),
                customerId: customerId.toString()
            }
        };

        try {
            const order = await razorpay.orders.create(options);
            return order;
        } catch (error) {
            logger.error('Razorpay Create Order Failed:', error);
            throw new Error('Failed to initialize payment gateway');
        }
    }

    /**
     * Verify and Process Batch Payment Success.
     * Updates ALL linked orders and creates Escrow records.
     */
    async processBatchPaymentSuccess({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // 1. Validate Signature (if not mock)
            if (!razorpayOrderId.startsWith('mock_')) {
                const body = razorpayOrderId + '|' + razorpayPaymentId;
                const expectedSignature = crypto
                    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                    .update(body)
                    .digest('hex');

                if (expectedSignature !== razorpaySignature) {
                    throw new Error('Invalid payment signature');
                }
            }

            // 2. Find all payments linked to this Razorpay Order ID
            const payments = await Payment.find({ razorpayOrderId }).session(session);
            if (!payments.length) throw new Error('No pending payments found for this order');

            const updatedOrders = [];

            for (const paymentRec of payments) {
                if (paymentRec.status === 'SUCCESS') continue; // Idempotency check handled per record

                const order = await Order.findById(paymentRec.orderId).session(session);
                if (!order) continue;

                if (!isValidTransition(order.status, 'PAID')) {
                    logger.warn(`Skipping invalid transition for Order ${order._id}: ${order.status} -> PAID`);
                    continue;
                }

                // Update Payment Record
                paymentRec.status = 'SUCCESS';
                paymentRec.razorpayPaymentId = razorpayPaymentId;
                paymentRec.method = 'CARD'; // Default, ideally fetch from Razorpay API
                await paymentRec.save({ session });

                // Update Order Status
                const updatedOrder = await Order.findByIdAndUpdate(order._id, {
                    status: 'PAID',
                    $push: {
                        timeline: {
                            fromState: order.status,
                            toState: 'PAID',
                            reason: `Batch Payment verified: ${razorpayPaymentId}`
                        }
                    }
                }, { session, new: true });
                updatedOrders.push(updatedOrder);

                // Create Escrow Record (if not exists)
                const existingEscrow = await Escrow.findOne({ orderId: order._id }).session(session);
                if (!existingEscrow) {
                    const grossAmount = Number(order.totalAmount);
                    const commissionAmount = grossAmount * COMMISSION_RATE;
                    const sellerAmount = grossAmount - commissionAmount;

                    const settlementWindowEndsAt = new Date();
                    settlementWindowEndsAt.setDate(settlementWindowEndsAt.getDate() + 14);

                    await Escrow.create([{
                        orderId: order._id,
                        amount: grossAmount,
                        grossAmount,
                        commissionAmount,
                        sellerAmount,
                        platformFee: commissionAmount,
                        settlementWindowEndsAt,
                        status: 'HOLD'
                    }], { session });
                }
            }

            await session.commitTransaction();
            return { success: true, orders: updatedOrders };

        } catch (error) {
            await session.abortTransaction();
            logger.error('Batch Payment Processing Failed:', error);
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Unified logic for handling successful payments from Razorpay (Single Order Legacy Support).
     * Ensures idempotency to prevent duplicate escrow creation or order updates.
     */
    async processPaymentSuccess({ orderId, razorpayPaymentId, method }) {
        // ... (Existing logic for single order webhook handling if needed, or redirect to batch logic)
        // For now, keeping legacy single-order processing logic but wrapping it for backward compatibility if needed.
        // But since we are moving to Batch, we strictly use processBatchPaymentSuccess for the new flow.
        // Keeping this for Webhook 'payment.captured' events which come individually?
        // Actually, Razorpay Webhook gives 'payment.captured'. The 'notes' will contain 'orderIds' stringified if batch.
        // Or we can rely on razorpay_order_id to find the batch.

        // IMPLEMENTATION: Re-use the batch logic even for single?
        // Let's keep the legacy one for safety if we have mixed flows, but Phase 3 goal is to replace it.
        // Copying existing logic back for safety.

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // 1. Fetch current order with relations
            const order = await Order.findById(orderId).session(session);
            if (!order) throw new Error(`Order ${orderId} not found`);

            const payment = await Payment.findOne({ orderId }).session(session);
            const escrow = await Escrow.findOne({ orderId }).session(session);

            // 2. Idempotency Check
            if (payment?.razorpayPaymentId === razorpayPaymentId && order.status === 'PAID' && escrow) {
                await session.abortTransaction();
                return { order, payment };
            }

            // 3. State machine validation
            if (!isValidTransition(order.status, 'PAID')) {
                throw new Error(`Invalid state transition: ${order.status} → PAID`);
            }

            // 4. Update/Create Payment record
            const paymentRecord = await Payment.findOneAndUpdate(
                { orderId },
                {
                    razorpayPaymentId,
                    status: 'SUCCESS',
                    method: method || 'CARD',
                    amount: order.totalAmount
                },
                { session, upsert: true, new: true }
            );

            // 5. Update Order status and timeline
            const updatedOrder = await Order.findByIdAndUpdate(orderId, {
                status: 'PAID',
                $push: {
                    timeline: {
                        fromState: order.status,
                        toState: 'PAID',
                        reason: `Payment verified: ${razorpayPaymentId}`
                    }
                }
            }, { session, new: true });

            // 6. Create Escrow record with FULL financial breakdown (if not exists)
            if (!escrow) {
                const grossAmount = Number(order.totalAmount);
                const commissionAmount = grossAmount * COMMISSION_RATE;
                const sellerAmount = grossAmount - commissionAmount;

                const settlementWindowEndsAt = new Date();
                settlementWindowEndsAt.setDate(settlementWindowEndsAt.getDate() + 14);

                await Escrow.create([{
                    orderId,
                    amount: grossAmount,
                    grossAmount,
                    commissionAmount,
                    sellerAmount,
                    platformFee: commissionAmount,
                    settlementWindowEndsAt,
                    status: 'HOLD'
                }], { session });
            }

            await session.commitTransaction();
            return { order: updatedOrder, payment: paymentRecord };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Handle payment failure from webhook or API.
     */
    async processPaymentFailure({ orderId, razorpayOrderId, errorDescription }) {
        return await Payment.findOneAndUpdate(
            { orderId },
            {
                status: 'FAILED',
                errorDescription,
                razorpayOrderId
            },
            { new: true }
        );
    }
}

export default new PaymentService();
