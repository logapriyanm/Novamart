import orderService from '../../services/order.js';
import logger from '../../lib/logger.js';
import shipmentService from '../../services/shipmentService.js';
import disputeService from '../../services/dispute.js';
import emailService from '../../services/emailService.js';
import { Customer } from '../../models/index.js';

export const createOrder = async (req, res) => {
    try {
        const { dealerId, sellerId, items, shippingAddress, idempotencyKey } = req.body;
        const targetSellerId = sellerId || dealerId; // Backward compatibility
        const userId = req.user._id;

        // Idempotency check: if idempotencyKey provided and order exists, return existing order
        if (idempotencyKey) {
            const existingOrder = await orderService.findOrderByIdempotencyKey(idempotencyKey, userId);
            if (existingOrder) {
                logger.info('Idempotent order creation: returning existing order', { idempotencyKey, orderId: existingOrder._id });
                return res.status(200).json({ success: true, data: existingOrder, idempotent: true });
            }
        }

        // Get customerId for idempotency check
        let customerId;
        if (req.user.role === 'CUSTOMER') {
            const customer = await Customer.findOne({ userId });
            if (!customer) throw new Error('Customer profile required');
            customerId = customer._id;

            // Re-check idempotency with customerId
            if (idempotencyKey) {
                const existingOrder = await orderService.findOrderByIdempotencyKey(idempotencyKey, customerId);
                if (existingOrder) {
                    logger.info('Idempotent order creation: returning existing order', { idempotencyKey, orderId: existingOrder._id });
                    return res.status(200).json({ success: true, data: existingOrder, idempotent: true });
                }
            }
        }

        // Ensure we have the customer profile _id (if not already set above)
        if (!customerId) {
            if (req.user.role === 'CUSTOMER') {
                const customer = await Customer.findOne({ userId });
                if (!customer) throw new Error('Customer profile required');
                customerId = customer._id;
            } else {
                return res.status(403).json({ success: false, error: 'Customer profile required for orders.' });
            }
        }

        const order = await orderService.createOrder(customerId, targetSellerId, items, shippingAddress, idempotencyKey);
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        logger.error('Order creation failed:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user._id;
        const orders = await orderService.getOrders(userRole, userId, req.query);
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await orderService.getOrders('CUSTOMER', userId);
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch your orders' });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;
        const order = await orderService.getOrderById(id, userId, userRole);
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(403).json({ success: false, error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason, metadata } = req.body;
        const updated = await orderService.updateStatus(id, status, { reason, metadata });

        // Email Notifications are now handled by EmailSubscriber via system events


        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const raiseDispute = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const userId = req.user._id;

        const dispute = await disputeService.raiseDispute(id, userId, {
            reason,
            triggerType: 'CUSTOMER_TO_DEALER'
        });

        res.json({ success: true, data: dispute });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const simulateDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        shipmentService.simulateJourney(id);
        res.json({ success: true, message: 'Delivery simulation started' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export default {
    createOrder,
    getOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    raiseDispute,
    simulateDelivery
};
