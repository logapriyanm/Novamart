import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db'; // Adjusted import alias if needed, or relative path
import paymentService from '../../../../server/services/paymentService.js';
import logger from '../../../../server/lib/logger.js';

export async function POST(req) {
    try {
        // 1. Connect to Database
        await connectDB();

        // 2. Get Raw Body (Text)
        const body = await req.text();
        const signature = req.headers.get('x-razorpay-signature');
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        // 3. Verify Signature
        if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
            console.error('RAZORPAY_WEBHOOK_SECRET is not set');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('Invalid Razorpay Signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // 4. Parse Event
        const event = JSON.parse(body);
        const { payload } = event;

        // 5. Process Event
        if (event.event === 'payment.captured' || event.event === 'payment.authorized') {
            const paymentEntity = payload.payment.entity;
            const orderId = paymentEntity.notes?.orderId;

            if (orderId) {
                await paymentService.processPaymentSuccess({
                    orderId,
                    razorpayPaymentId: paymentEntity.id,
                    method: paymentEntity.method
                });
                console.log(`✅ Webhook: Payment processed for Order ${orderId}`);
            }
        } else if (event.event === 'payment.failed') {
            const paymentEntity = payload.payment.entity;
            const orderId = paymentEntity.notes?.orderId;
            if (orderId) {
                await paymentService.processPaymentFailure({
                    orderId,
                    razorpayOrderId: paymentEntity.order_id,
                    errorDescription: paymentEntity.error_description
                });
                console.log(`❌ Webhook: Payment failed for Order ${orderId}`);
            }
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
