import systemEvents, { EVENTS } from '../lib/systemEvents.js';
import emailService from '../services/emailService.js';
import logger from '../lib/logger.js';

class EmailSubscriber {
    constructor() {
        this.init();
    }

    init() {
        // Order Events
        systemEvents.on(EVENTS.ORDER.PLACED, this.handleOrderPlaced.bind(this));
        systemEvents.on(EVENTS.ORDER.SHIPPED, this.handleOrderShipped.bind(this));
        systemEvents.on(EVENTS.ORDER.DELIVERED, this.handleOrderDelivered.bind(this));

        // Review Events
        systemEvents.on(EVENTS.REVIEW.CREATED, this.handleReviewCreated.bind(this));
        systemEvents.on(EVENTS.REVIEW.REPLIED, this.handleReviewReplied.bind(this));

        logger.info('📧 Email Subscriber Initialized');
    }

    /**
     * Handle Order Placed -> Send Confirmation
     */
    async handleOrderPlaced(data) {
        try {
            // Data structure from OrderService: { order, customerId, sellerId }
            // We need order._id
            const orderId = data.order?._id || data.orderId;
            if (!orderId) {
                logger.error('EmailSubscriber: No orderId in ORDER.PLACED event', data);
                return;
            }

            logger.info(`📧 Sending Order Confirmation for ${orderId}`);
            await emailService.sendOrderConfirmation(orderId);
        } catch (error) {
            logger.error('EmailSubscriber: Order Placed Handler Error', error);
        }
    }

    /**
     * Handle Order Shipped -> Send Notification
     */
    async handleOrderShipped(data) {
        try {
            // Data from OrderService: { orderId, userId, trackingNumber }
            const { orderId, trackingNumber } = data;
            if (!orderId) return;

            logger.info(`📧 Sending Order Shipped for ${orderId}`);
            await emailService.sendOrderShipped(orderId, trackingNumber);
        } catch (error) {
            logger.error('EmailSubscriber: Order Shipped Handler Error', error);
        }
    }

    /**
     * Handle Order Delivered -> Send Notification
     */
    async handleOrderDelivered(data) {
        try {
            // Data from OrderService: { orderId, userId }
            const { orderId } = data;
            if (!orderId) return;

            logger.info(`📧 Sending Order Delivered for ${orderId}`);
            await emailService.sendOrderDelivered(orderId);
        } catch (error) {
            logger.error('EmailSubscriber: Order Delivered Handler Error', error);
        }
    }

    /**
     * Handle Review Created -> Notify Seller
     */
    async handleReviewCreated(data) {
        try {
            const { review } = data;
            if (!review) return;

            logger.info(`📧 Sending Review Notification for Review ${review._id}`);
            await emailService.sendReviewNotification(review);
        } catch (error) {
            logger.error('EmailSubscriber: Review Created Handler Error', error);
        }
    }

    /**
     * Handle Review Replied -> Notify Customer
     */
    async handleReviewReplied(data) {
        try {
            const { review } = data;
            if (!review) return;

            logger.info(`📧 Sending Reply Notification for Review ${review._id}`);
            await emailService.sendReplyNotification(review);
        } catch (error) {
            logger.error('EmailSubscriber: Review Replied Handler Error', error);
        }
    }
}

export default new EmailSubscriber();
