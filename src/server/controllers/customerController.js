import customerService from '../services/customer.js';
import orderService from '../services/order.js';
import disputeService from '../services/dispute.js';
import { Customer } from '../models/index.js';
import logger from '../lib/logger.js';

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
        logger.error('Get Products Error:', error);
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_PRODUCTS' });
    }
};

/**
 * Ordering & Payment
 */
export const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const { sellerId, items } = req.body;
        const targetSellerId = sellerId;

        const order = await orderService.createOrder(customer._id, targetSellerId, items);
        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Pay for Order
 */
export const payOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentMethod, paymentDetails } = req.body;
        const userId = req.user._id;

        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const result = await orderService.processPayment(orderId, customer._id, {
            paymentMethod,
            paymentDetails
        });

        res.json({
            success: true,
            message: 'Payment processed successfully',
            data: result
        });
    } catch (error) {
        logger.error('Payment Error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Get Customer Orders
 */
export const getOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const { status, page = 1, limit = 10 } = req.query;
        const orders = await orderService.getCustomerOrders(customer._id, { status, page, limit });

        res.json({ success: true, data: orders });
    } catch (error) {
        logger.error('Get Orders Error:', error);
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_ORDERS' });
    }
};

/**
 * Get Customer Statistics
 */
export const getStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const stats = await customerService.getCustomerStats(customer._id);
        res.json({ success: true, data: stats });
    } catch (error) {
        logger.error('Get Stats Error:', error);
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_STATS' });
    }
};

/**
 * Get Order Details
 */
export const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const order = await orderService.getOrderById(id, customer._id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        logger.error('Get Order Details Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const rateService = async (req, res) => {
    try {
        const userId = req.user._id;
        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const { sellerId, rating, comment } = req.body;
        const targetSellerId = sellerId;

        const result = await customerService.submitRating(customer._id, { sellerId: targetSellerId, rating, comment });
        res.json({ success: true, message: 'Rating submitted', data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: 'RATING_FAILED' });
    }
};

export const raiseOrderDispute = async (req, res) => {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;
    try {
        const dispute = await disputeService.raiseDispute(orderId, userId, { reason, triggerType: 'CUSTOMER_TO_SELLER' });
        res.json({ success: true, message: 'Dispute raised. Escrow frozen.', data: dispute });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Profile Management
 */
export const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const profile = await customerService.getProfile(customer._id);
        res.json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_PROFILE' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const { name, email, phone, avatar } = req.body;
        const result = await customerService.updateProfile(customer._id, { name, email, phone, avatar });
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
    updateProfile,

    addAddress: async (req, res) => {
        try {
            const userId = req.user._id;
            const customer = await Customer.findOne({ userId });
            if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

            const addresses = await customerService.addAddress(customer._id, req.body);
            res.json({ success: true, data: addresses });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    removeAddress: async (req, res) => {
        try {
            const userId = req.user._id;
            const customer = await Customer.findOne({ userId });
            if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

            const addresses = await customerService.removeAddress(customer._id, req.params.id);
            res.json({ success: true, data: addresses });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    updateAddress: async (req, res) => {
        try {
            const userId = req.user._id;
            const customer = await Customer.findOne({ userId });
            if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

            const addresses = await customerService.updateAddress(customer._id, req.params.id, req.body);
            res.json({ success: true, data: addresses });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
};

