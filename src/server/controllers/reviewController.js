import reviewService from '../services/review.js';
import { Order, Inventory, Customer } from '../models/index.js';

export const submitProductReview = async (req, res) => {
    try {
        const { orderItemId, productId, rating, comment, images } = req.body;
        const userId = req.user._id;

        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const order = await Order.findOne({
            customerId: customer._id,
            'items._id': orderItemId
        });

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order item not found or unauthorized' });
        }

        if (order.status !== 'DELIVERED') {
            return res.status(400).json({ success: false, error: 'Cannot review products before delivery' });
        }

        const review = await reviewService.submitProductReview({
            orderId: order._id,
            productId,
            customerId: customer._id,
            rating,
            comment,
            images
        });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const submitSellerReview = async (req, res) => {
    try {
        const { orderId, dealerId, rating, delivery, packaging, communication, comment } = req.body;
        const userId = req.user._id;

        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        if (order.customerId.toString() !== customer._id.toString()) {
            return res.status(403).json({ success: false, error: 'Unauthorized: You do not own this order' });
        }

        if (order.status !== 'DELIVERED') {
            return res.status(400).json({ success: false, error: 'Cannot review sellers before delivery' });
        }

        const review = await reviewService.submitSellerReview({
            orderId,
            dealerId,
            customerId: customer._id,
            rating,
            delivery,
            packaging,
            communication,
            comment
        });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getMyReviews = async (req, res) => {
    try {
        const userId = req.user._id;
        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const reviews = await reviewService.getCustomerReviews(customer._id);
        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const moderateReview = async (req, res) => {
    try {
        const { type, reviewId, status } = req.body;
        const review = await reviewService.moderateReview(type, reviewId, status);
        res.status(200).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getPendingReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getPendingReviews();
        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export default {
    submitProductReview,
    submitSellerReview,
    getMyReviews,
    moderateReview,
    getPendingReviews
};
