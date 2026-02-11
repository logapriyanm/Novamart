/**
 * Payment Service
 * Unified logic for handling successful payments from Razorpay.
 */

import { Order, Payment, Escrow } from '../models/index.js';
import mongoose from 'mongoose';

class PaymentService {
    /**
     * Unified logic for handling successful payments from Razorpay.
     * Ensures idempotency to prevent duplicate escrow creation or order updates.
     */
    async processPaymentSuccess({ orderId, razorpayPaymentId, method }) {
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

            // 3. Update/Create Payment record
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

            // 4. Update Order status and timeline
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

            // 5. Create Escrow record (if not exists)
            let escrowRecord = escrow;
            if (!escrow) {
                escrowRecord = await Escrow.create([{
                    orderId,
                    amount: order.totalAmount,
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
