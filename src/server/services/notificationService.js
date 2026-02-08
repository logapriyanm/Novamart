import { Notification } from '../models/index.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';

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
        console.log(`[NotificationService] Sending ${type} to ${userId}: ${title}`);
        const results = {};

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

                // Real-time Socket Emitting
                if (this.io) {
                    // Emit to specific user room (assuming room name is userId as standard practice)
                    // Or iterate sockets. For scalability we should have user rooms.
                    // In index.js we didn't explicitly join user room yet, checking...
                    // "socket.join(roomId)" is for chat.
                    // We need to ensure users join a room named with their userID on connection.
                    // I will update index.js later to user logic: socket.join(socket.user.id);
                    this.io.to(userId).emit('notification:new', notify);
                }

            } catch (error) {
                console.error('In-App Notification DB Error:', error);
            }
        }

        // 2. Email (Mock AWS SES)
        if (channels.includes('EMAIL')) {
            console.log(`[SIMULATED EMAIL] To: ${userId} | Sub: ${title} | Body: ${message}`);
            results.email = { success: true };
        }

        // 3. Push (Mock Firebase)
        if (channels.includes('PUSH')) {
            console.log(`[SIMULATED PUSH] To: ${userId} | Title: ${title} | Msg: ${message}`);
            results.push = { success: true };
        }

        return results;
    }

    // --- Specific Event Handlers ---

    async handleOrderPlaced({ order, customerId, dealerId }) {
        console.log('[NotificationService] handleOrderPlaced triggered', { orderId: order?.id, customerId, dealerId });
        // Notify Customer
        await this.sendNotification({
            userId: customerId,
            type: 'ORDER',
            title: 'Order Placed',
            message: `Your order #${order.id.slice(-8)} has been placed successfully and is in escrow.`,
            metadata: { orderId: order.id }
        });

        // Notify Dealer
        await this.sendNotification({
            userId: dealerId,
            type: 'ORDER',
            title: 'New Incoming Order',
            message: `A new order #${order.id.slice(-8)} is awaiting fulfillment.`,
            metadata: { orderId: order.id }
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
            metadata: { orderId }
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
