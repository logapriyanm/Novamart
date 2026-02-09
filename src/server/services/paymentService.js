import prisma from '../lib/prisma.js';

class PaymentService {
    /**
     * Unified logic for handling successful payments from Razorpay.
     * Can be called by verifyPayment API or handleWebhook.
     * Ensures idempotency to prevent duplicate escrow creation or order updates.
     */
    async processPaymentSuccess({ orderId, razorpayPaymentId, method }) {
        return await prisma.$transaction(async (tx) => {
            // 1. Fetch current order and payment record
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: { payment: true, escrow: true }
            });

            if (!order) throw new Error(`Order ${orderId} not found`);

            // 2. Idempotency Check: If already processed this specific payment
            if (order.payment?.razorpayPaymentId === razorpayPaymentId && order.status === 'PAID' && order.escrow) {
                return order;
            }

            // 3. Upsert Payment record
            await tx.payment.upsert({
                where: { orderId },
                update: {
                    razorpayPaymentId,
                    status: 'SUCCESS',
                    method: method || 'CARD'
                },
                create: {
                    orderId,
                    amount: order.totalAmount,
                    status: 'SUCCESS',
                    razorpayPaymentId,
                    method: method || 'CARD'
                }
            });

            // 4. Update Order status
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: { status: 'PAID' }
            });

            // 5. Create Escrow record (if not exists)
            if (!order.escrow) {
                await tx.escrow.create({
                    data: {
                        orderId,
                        amount: order.totalAmount,
                        status: 'HOLD'
                    }
                });
            }

            // 6. Log activity
            await tx.orderTimeline.create({
                data: {
                    orderId,
                    fromState: order.status,
                    toState: 'PAID',
                    reason: `Payment verified: ${razorpayPaymentId}`
                }
            });

            return updatedOrder;
        });
    }

    /**
     * Handle payment failure from webhook or API.
     */
    async processPaymentFailure({ orderId, razorpayOrderId, errorDescription }) {
        return await prisma.payment.update({
            where: { orderId },
            data: {
                status: 'FAILED',
                errorDescription
            }
        });
    }
}

export default new PaymentService();
