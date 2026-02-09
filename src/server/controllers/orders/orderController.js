import orderService from '../../services/order.js';
import logger from '../../lib/logger.js';

export const createOrder = async (req, res) => {
    try {
        const { dealerId, items, shippingAddress } = req.body;
        const userId = req.user?.id;

        // Items in req.body might be [{inventoryId, quantity}]
        // OrderService.createOrder expects [{productId, quantity, price}]
        // We might need a small shim or update OrderService to handle inventoryId

        const order = await orderService.createOrder(userId, dealerId, items);
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

export default {
    createOrder,
    getOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus
};
