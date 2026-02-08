
import reviewService from '../services/review.js';
import prisma from '../lib/prisma.js';

export const submitProductReview = async (req, res) => {
    try {
        const { orderItemId, productId, rating, comment, images } = req.body;
        const customerId = req.user.customer.id;

        // 1. Gating: Ensure order item exists and order is DELIVERED
        const orderItem = await prisma.orderItem.findUnique({
            where: { id: orderItemId },
            include: { order: true }
        });

        if (!orderItem) {
            return res.status(404).json({ success: false, error: 'Order item not found' });
        }

        if (orderItem.order.customerId !== customerId) {
            return res.status(403).json({ success: false, error: 'Unauthorized: You do not own this order' });
        }

        if (orderItem.order.status !== 'DELIVERED') {
            return res.status(400).json({ success: false, error: 'Cannot review products before delivery' });
        }

        const review = await reviewService.submitProductReview({
            orderItemId,
            productId,
            customerId,
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
        const customerId = req.user.customer.id;

        // 1. Gating: Ensure order exists and is DELIVERED
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        if (order.customerId !== customerId) {
            return res.status(403).json({ success: false, error: 'Unauthorized: You do not own this order' });
        }

        if (order.status !== 'DELIVERED') {
            return res.status(400).json({ success: false, error: 'Cannot review sellers before delivery' });
        }

        const review = await reviewService.submitSellerReview({
            orderId,
            dealerId,
            customerId,
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
        const customerId = req.user.customer.id;
        const reviews = await reviewService.getCustomerReviews(customerId);
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
