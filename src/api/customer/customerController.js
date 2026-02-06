/**
 * Customer Controller
 * Interaction logic for shop visitors and buyers.
 */

import customerService from '../../services/customer.js';
import orderService from '../../services/order.js';
import disputeService from '../../services/dispute.js';

/**
 * Browsing & Discovery
 */
export const getProducts = async (req, res) => {
    const { region, category, q } = req.query;
    try {
        const products = await customerService.browseProducts({ region, category, search: q });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'FAILED_TO_FETCH_PRODUCTS' });
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
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const payOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const result = await orderService.confirmPayment(orderId);
        res.json({ message: 'Payment confirmed. Funds held in escrow.', order: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Post-Purchase
 */
export const getOrderDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await customerService.getOrderHistory(req.user.customer.id);
        const order = orders.find(o => o.id === id);
        if (!order) return res.status(404).json({ error: 'ORDER_NOT_FOUND' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'FAILED_TO_FETCH_ORDER' });
    }
};

export const rateService = async (req, res) => {
    const customerId = req.user.customer.id;
    const { dealerId, rating, comment } = req.body;
    try {
        const result = await customerService.submitRating(customerId, { dealerId, rating, comment });
        res.json({ message: 'Rating submitted', rating: result });
    } catch (error) {
        res.status(400).json({ error: 'RATING_FAILED' });
    }
};

export const raiseOrderDispute = async (req, res) => {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;
    try {
        const dispute = await disputeService.raiseDispute(orderId, userId, { reason, triggerType: 'CUSTOMER_TO_DEALER' });
        res.json({ message: 'Dispute raised. Escrow frozen.', dispute });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export default {
    getProducts,
    placeOrder,
    payOrder,
    getOrderDetails,
    rateService,
    raiseOrderDispute
};

