/**
 * Customer Controller
 * Interaction logic for shop visitors and buyers.
 */

import customerService from '../services/customer.js';
import orderService from '../services/order.js';
import disputeService from '../services/dispute.js';

/**
 * Browsing & Discovery
 */
export const getProducts = async (req, res) => {
    const { region, category, q } = req.query;
    try {
        const products = await customerService.browseProducts({ region, category, search: q });
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_PRODUCTS' });
    }
};

/**
 * Ordering & Payment
 */
export const placeOrder = async (req, res) => {
    const customerId = req.user.customer.id;
    const { dealerId, items } = req.body;
    try {
        const order = await orderService.createOrder(customerId, dealerId, items);
        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const payOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const result = await orderService.confirmPayment(orderId);
        res.json({
            success: true,
            message: 'Payment confirmed. Funds held in escrow.',
            data: result
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Post-Purchase
 */
export const getOrders = async (req, res) => {
    try {
        const orders = await customerService.getOrderHistory(req.user.customer.id);
        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_ORDERS' });
    }
};

export const getStats = async (req, res) => {
    const customerId = req.user.customer.id;
    try {
        const orders = await customerService.getOrderHistory(customerId);
        // Simple stats aggregation
        const stats = {
            totalOrders: orders.length,
            activeOrders: orders.filter(o => ['CREATED', 'PAID', 'CONFIRMED', 'SHIPPED'].includes(o.status)).length,
            totalSpent: orders.filter(o => o.status !== 'CANCELLED').reduce((acc, o) => acc + o.totalAmount, 0)
        };
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_STATS' });
    }
};

export const getOrderDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await customerService.getOrderHistory(req.user.customer.id);
        const order = orders.find(o => o.id === id);
        if (!order) return res.status(404).json({ success: false, error: 'ORDER_NOT_FOUND' });
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_ORDER' });
    }
};

export const rateService = async (req, res) => {
    const customerId = req.user.customer.id;
    const { dealerId, rating, comment } = req.body;
    try {
        const result = await customerService.submitRating(customerId, { dealerId, rating, comment });
        res.json({ success: true, message: 'Rating submitted', data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: 'RATING_FAILED' });
    }
};

export const raiseOrderDispute = async (req, res) => {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;
    try {
        const dispute = await disputeService.raiseDispute(orderId, userId, { reason, triggerType: 'CUSTOMER_TO_DEALER' });
        res.json({ success: true, message: 'Dispute raised. Escrow frozen.', data: dispute });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Profile Management
 */
export const getProfile = async (req, res) => {
    const customerId = req.user.customer.id;
    try {
        const profile = await customerService.getProfile(customerId);
        res.json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_PROFILE' });
    }
};

export const updateProfile = async (req, res) => {
    const customerId = req.user.customer.id;
    const { name, email, phone, avatar } = req.body;
    try {
        const result = await customerService.updateProfile(customerId, { name, email, phone, avatar });
        res.json({ success: true, message: 'Profile updated successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export default {
    getProducts,
    placeOrder,
    payOrder,
    getOrders,
    getStats,
    getOrderDetails,
    rateService,
    raiseOrderDispute,
    getProfile,
    updateProfile
};

