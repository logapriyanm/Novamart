import { Notification, User } from '../models/index.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';
import emailService from './emailService.js';
import firebaseAdmin from '../lib/firebaseAdmin.js';
import logger from '../lib/logger.js';

class NotificationService {
    constructor() {
        this.io = null;
        this.initListeners();
        logger.info('Notification Service Initialized');
    }

    setIO(io) {
        this.io = io;
        logger.info('Socket.IO instance injected into NotificationService');
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
        logger.info(`[NotificationService] Processing ${type} for ${userId}`);
        const results = {};

        // Fetch User to get FCM token and Contact Info
        const user = await User.findById(userId).select('fcmToken email phone');

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
                results.inApp = { success: true, id: notify._id };

                if (this.io) {
                    this.io.to(userId.toString()).emit('notification:new', notify);
                }
            } catch (error) {
                logger.error('In-App Notification DB Error:', error);
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
                logger.error('Push Notification Error:', error);
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
                logger.error('Email Notification Error:', error);
                results.email = { success: false, error: error.message };
            }
        }

        // 4. WhatsApp (Restricted Priority) - PRIORITY 3
        if (channels.includes('WHATSAPP') && user?.phone) {
            // Restriction check: Only for high-trust transaction alerts
            const allowedTypes = ['OTP', 'ORDER', 'PAYMENT', 'SECURITY'];
            if (allowedTypes.includes(type)) {
                logger.info('--- [WHATSAPP OUTGOING] ---');
                logger.info(`To: ${user.phone}`);
                logger.info(`Msg: ${message}`);
                logger.info('---------------------------');
                results.whatsapp = { success: true };
            } else {
                // console.warn(`[NotificationService] WhatsApp blocked for type: ${type}`);
            }
        }

        return results;
    }

    // --- Specific Event Handlers ---

    async handleOrderPlaced({ order, customerId, dealerId }) {
        const orderId = order?._id || order?.id;
        logger.info('[NotificationService] handleOrderPlaced triggered', { orderId, customerId, dealerId });

        await this.sendNotification({
            userId: customerId,
            type: 'ORDER',
            title: 'Order Confirmed - NovaMart',
            message: `Order #${orderId.toString().slice(-8)} placed! Secured by NovaEscrow.`,
            metadata: { orderId: orderId.toString() },
            channels: ['WHATSAPP', 'PUSH', 'IN_APP'] // EMAIL handled by emailSubscriber
        });

        await this.sendNotification({
            userId: dealerId,
            type: 'ORDER',
            title: 'New Incoming Order',
            message: `A new order #${orderId.toString().slice(-8)} is awaiting fulfillment.`,
            metadata: { orderId: orderId.toString() },
            channels: ['PUSH', 'IN_APP']
        });
    }

    async handleOrderPaid({ orderId, userId }) {
        await this.sendNotification({
            userId,
            type: 'PAYMENT',
            title: 'Payment Confirmed',
            message: `Payment for order #${orderId.toString().slice(-8)} has been secured in NovaEscrow.`,
            metadata: { orderId: orderId.toString() }
        });
    }

    async handleOrderShipped({ orderId, userId, trackingDetails }) {
        await this.sendNotification({
            userId,
            type: 'DELIVERY',
            title: 'Order Dispatched',
            message: `Your order #${orderId.toString().slice(-8)} is on the way! Tracking: ${trackingDetails}`,
            metadata: { orderId: orderId.toString() },
            channels: ['PUSH', 'IN_APP'] // EMAIL handled by emailSubscriber
        });
    }

    async handleOrderDelivered({ orderId, userId }) {
        await this.sendNotification({
            userId,
            type: 'DELIVERY',
            title: 'Order Delivered',
            message: `Your order #${orderId.toString().slice(-8)} has been delivered. Please verify to release funds.`,
            metadata: { orderId: orderId.toString() },
            channels: ['IN_APP', 'PUSH'] // EMAIL handled by emailSubscriber
        });
    }

    async handleEscrowRelease({ orderId, dealerId, amount }) {
        await this.sendNotification({
            userId: dealerId,
            type: 'PAYMENT',
            title: 'Funds Released',
            message: `₹${amount} for order #${orderId.toString().slice(-8)} has been released to your account.`,
            metadata: { orderId: orderId.toString() },
            channels: ['IN_APP', 'EMAIL', 'PUSH', 'WHATSAPP']
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
            metadata: { productId: productId.toString() }
        });
    }

    async handleDisputeRaised({ disputeId, orderId, raisedByUserId, reason }) {
        await this.sendNotification({
            userId: raisedByUserId,
            type: 'SECURITY',
            title: 'Dispute Raised',
            message: `You have raised a dispute for order #${orderId.toString().slice(-8)}. Reason: ${reason}`,
            metadata: { disputeId: disputeId.toString(), orderId: orderId.toString() }
        });
    }

    async handleDisputeResolved({ disputeId, orderId, resolution }) {
        logger.info(`[NotificationService] Dispute ${disputeId} resolved: ${resolution}`);
    }
}

const notificationService = new NotificationService();
export default notificationService;
