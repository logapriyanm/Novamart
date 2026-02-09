import { Notification } from '../models/index.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';
import emailService from './emailService.js';
import firebaseAdmin from '../lib/firebaseAdmin.js';
import prisma from '../lib/prisma.js';

class NotificationService {
    constructor() {
        this.io = null;
        this.initListeners();
        console.log('Notification Service Initialized');
    }

    setIO(io) {
        this.io = io;
        console.log('Socket.IO instance injected into NotificationService');
    }

    initListeners() {
        // --- Auth & Account Flows ---
        systemEvents.on(EVENTS.AUTH.VERIFIED, (data) => this.handleAuthStatus(data, 'VERIFIED'));
        systemEvents.on(EVENTS.AUTH.REJECTED, (data) => this.handleAuthStatus(data, 'REJECTED'));
        systemEvents.on(EVENTS.AUTH.PASSWORD_CHANGED, (data) => this.handleSecurityEvent(data, 'Password Changed'));

        // --- Product Lifecycle ---
        systemEvents.on(EVENTS.PRODUCT.APPROVED, (data) => this.handleProductStatus(data, 'APPROVED'));
        systemEvents.on(EVENTS.PRODUCT.REJECTED, (data) => this.handleProductStatus(data, 'REJECTED'));

        // --- Order & Fulfillment ---
        systemEvents.on(EVENTS.ORDER.PLACED, (data) => this.handleOrderPlaced(data));
        systemEvents.on(EVENTS.ORDER.PAID, (data) => this.handleOrderPaid(data));
        systemEvents.on(EVENTS.ORDER.SHIPPED, (data) => this.handleOrderShipped(data));
        systemEvents.on(EVENTS.ORDER.DELIVERED, (data) => this.handleOrderDelivered(data));

        // --- Escrow & Payments ---
        systemEvents.on(EVENTS.ESCROW.RELEASE, (data) => this.handleEscrowRelease(data));
        systemEvents.on(EVENTS.ESCROW.REFUND, (data) => this.handleEscrowRefund(data));

        // --- Disputes ---
        systemEvents.on(EVENTS.DISPUTE.RAISED, (data) => this.handleDisputeRaised(data));
        systemEvents.on(EVENTS.DISPUTE.RESOLVED, (data) => this.handleDisputeResolved(data));
    }

    /**
     * Centralized Sending Logic
     */
    async sendNotification({ userId, type, title, message, metadata = {}, channels = ['IN_APP', 'EMAIL', 'PUSH'] }) {
        console.log(`[NotificationService] Processing ${type} for ${userId}`);
        const results = {};

        // Fetch User to get FCM token and Contact Info
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { fcmToken: true, email: true, phone: true }
        });

        // 1. Mandatory In-App Log (MongoDB)
        if (channels.includes('IN_APP')) {
            try {
                const notify = await Notification.create({
                    userId,
                    type,
                    title,
                    message,
                    metadata
                });
                results.inApp = { success: true, id: notify.id };

                if (this.io) {
                    this.io.to(userId).emit('notification:new', notify);
                }
            } catch (error) {
                console.error('In-App Notification DB Error:', error);
            }
        }

        // 2. Push Notification (Firebase) - PRIORITY 1
        if (channels.includes('PUSH') && user?.fcmToken) {
            try {
                const pushResult = await firebaseAdmin.messaging().send({
                    token: user.fcmToken,
                    notification: { title, body: message },
                    data: { ...metadata, type }
                });
                results.push = { success: true, messageId: pushResult.messageId };
            } catch (error) {
                console.error('Push Notification Error:', error);
                results.push = { success: false, error: error.message };
            }
        }

        // 3. Email (AWS SES / SMTP) - PRIORITY 2
        if (channels.includes('EMAIL') && user?.email) {
            try {
                const emailResult = await emailService.sendEmail(user.email, {
                    subject: title,
                    html: `<h3>${title}</h3><p>${message}</p>`
                });
                results.email = emailResult;
            } catch (error) {
                console.error('Email Notification Error:', error);
                results.email = { success: false, error: error.message };
            }
        }

        // 4. WhatsApp (Restricted Priority) - PRIORITY 3
        if (channels.includes('WHATSAPP') && user?.phone) {
            // Restriction check: Only for high-trust transaction alerts
            const allowedTypes = ['OTP', 'ORDER', 'PAYMENT', 'SECURITY'];
            if (allowedTypes.includes(type)) {
                console.log(`--- [WHATSAPP OUTGOING] ---`);
                console.log(`To: ${user.phone}`);
                console.log(`Msg: ${message}`);
                console.log('---------------------------');
                results.whatsapp = { success: true };
            } else {
                console.warn(`[NotificationService] WhatsApp blocked for type: ${type}`);
            }
        }

        return results;
    }

    // --- Specific Event Handlers ---

    async handleOrderPlaced({ order, customerId, dealerId }) {
        console.log('[NotificationService] handleOrderPlaced triggered', { orderId: order?.id, customerId, dealerId });

        // Notify Customer (Priority: WhatsApp + Email + Push)
        await this.sendNotification({
            userId: customerId,
            type: 'ORDER',
            title: 'Order Confirmed - NovaMart',
            message: `Order #${order.id.slice(-8)} placed! Secured by NovaEscrow.`,
            metadata: { orderId: order.id },
            channels: ['WHATSAPP', 'EMAIL', 'PUSH', 'IN_APP']
        });

        // Notify Dealer (Priority: Push + In-App)
        await this.sendNotification({
            userId: dealerId,
            type: 'ORDER',
            title: 'New Incoming Order',
            message: `A new order #${order.id.slice(-8)} is awaiting fulfillment.`,
            metadata: { orderId: order.id },
            channels: ['PUSH', 'IN_APP']
        });
    }

    async handleOrderPaid({ orderId, userId }) {
        await this.sendNotification({
            userId,
            type: 'PAYMENT',
            title: 'Payment Confirmed',
            message: `Payment for order #${orderId.slice(-8)} has been secured in NovaEscrow.`,
            metadata: { orderId }
        });
    }

    async handleOrderShipped({ orderId, userId, trackingDetails }) {
        await this.sendNotification({
            userId,
            type: 'DELIVERY',
            title: 'Order Dispatched',
            message: `Your order #${orderId.slice(-8)} is on the way! Tracking: ${trackingDetails}`,
            metadata: { orderId }
        });
    }

    async handleOrderDelivered({ orderId, userId }) {
        await this.sendNotification({
            userId,
            type: 'DELIVERY',
            title: 'Order Delivered',
            message: `Your order #${orderId.slice(-8)} has been delivered. Please verify to release funds.`,
            metadata: { orderId },
            channels: ['IN_APP', 'PUSH'] // Delivered is already high visible via push
        });
    }

    async handleEscrowRelease({ orderId, dealerId, amount }) {
        await this.sendNotification({
            userId: dealerId,
            type: 'PAYMENT',
            title: 'Funds Released',
            message: `₹${amount} for order #${orderId.slice(-8)} has been released to your account.`,
            metadata: { orderId },
            channels: ['IN_APP', 'EMAIL', 'PUSH', 'WHATSAPP'] // WhatsApp for critical payout
        });
    }

    async handleAuthStatus({ userId, userName }, status) {
        await this.sendNotification({
            userId,
            type: 'KYC',
            title: `Account ${status}`,
            message: `Hello ${userName}, your account status has been updated to ${status}.`,
            channels: ['IN_APP', 'EMAIL']
        });
    }

    async handleProductStatus({ productId, productName, manufacturerId }, status) {
        await this.sendNotification({
            userId: manufacturerId,
            type: 'PRODUCT',
            title: `Product ${status}`,
            message: `Your product "${productName}" has been ${status.toLowerCase()} by the audit team.`,
            metadata: { productId }
        });
    }

    async handleDisputeRaised({ disputeId, orderId, raisedByUserId, reason }) {
        await this.sendNotification({
            userId: raisedByUserId,
            type: 'SECURITY',
            title: 'Dispute Raised',
            message: `You have raised a dispute for order #${orderId.slice(-8)}. Reason: ${reason}`,
            metadata: { disputeId, orderId }
        });
    }

    async handleDisputeResolved({ disputeId, orderId, resolution }) {
        // This would ideally notify all parties, for now just generic
        console.log(`[NotificationService] Dispute ${disputeId} resolved: ${resolution}`);
    }
}

// Singleton instance
const notificationService = new NotificationService();
export default notificationService;
