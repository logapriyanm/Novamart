import orderService from '../../services/order.js';
import logger from '../../lib/logger.js';
import shipmentService from '../../services/shipmentService.js';
import disputeService from '../../services/dispute.js';
import emailService from '../../services/emailService.js';
import { Customer } from '../../models/index.js';

export const createOrder = async (req, res) => {
    // Legacy support or direct single order creation
    try {
        const { sellerId, items, shippingAddress } = req.body;
        // ... (reuse service legacy or redirect)
        // For now, if someone calls this directly, we channel through service.createOrder
        // But Phase 3 focuses on initiateCheckout.
        // Let's just keep strict legacy, or fail if we want to force batch.
        // keeping mostly as is but cleaner:
        const order = await orderService.createOrder(req.user._id, sellerId, items, shippingAddress); // NOTE: user._id might need mapping to customerId if createOrder expects it
        res.status(201).json({ success: true, data: order });
    } catch (e) {
        res.status(400).json({ success: false, error: e.message });
    }
};

export const initiateCheckout = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;
        const userId = req.user._id;

        // Get Customer _id
        const customer = await Customer.findOne({ userId });
        if (!customer) throw new Error('Customer profile required');

        const result = await orderService.createBatchOrders(customer._id, items, shippingAddress);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        logger.error('Checkout Initiation Failed:', error);
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
        const orders = await orderService.getOrders('CUSTOMER', userId, req.query);
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
        const userId = req.user._id;
        const role = req.user.role;
        const updated = await orderService.updateStatus(id, status, { reason, metadata, userId, role });

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
            triggerType: 'CUSTOMER_TO_SELLER'
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
    initiateCheckout,
    getOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    raiseDispute,
    simulateDelivery
};
