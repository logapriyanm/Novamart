import orderService from '../../services/order.js';
import logger from '../../lib/logger.js';

export const createOrder = async (req, res) => {
    try {
        const { dealerId, items, shippingAddress } = req.body;
        const customerId = req.user?.customer?.id;
        if (!customerId) {
            return res.status(403).json({ success: false, error: 'Customer profile required for orders.' });
        }

        // Items in req.body might be [{inventoryId, quantity}]
        // OrderService.createOrder expects [{productId, quantity, price}]
        // We might need a small shim or update OrderService to handle inventoryId

        const order = await orderService.createOrder(customerId, dealerId, items, shippingAddress);
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const userRole = req.user?.role;
        const userId = req.user?.id;
        const orders = await orderService.getOrders(userRole, userId, req.query);
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        const orders = await orderService.getOrders('CUSTOMER', userId);
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch your orders' });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;
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
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

import shipmentService from '../../services/shipmentService.js';
import disputeService from '../../services/dispute.js';

export const raiseDispute = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const userId = req.user.id;

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
        // This is an async action that runs in background
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
