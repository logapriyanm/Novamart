/**
 * Review Service
 * Handles product and seller reviews using Mongoose levels
 */

import { Review, Product, Seller, Order } from '../models/index.js';
import logger from '../lib/logger.js';

class ReviewService {
    /**
     * Submit a product review.
     */
    async submitProductReview({ orderId, productId, customerId, rating, comment, images }) {
        try {
            const review = await Review.create({
                type: 'PRODUCT',
                orderId,
                productId,
                customerId,
                rating,
                comment,
                images,
                status: 'PENDING'
            });

            // Update product stats (async)
            this.updateProductRating(productId);

            return review;
        } catch (error) {
            logger.error('Submit Product Review Error:', error);
            throw new Error('Failed to submit product review');
        }
    }

    /**
     * Submit a seller review.
     */
    async submitSellerReview({ orderId, dealerId, customerId, rating, delivery, packaging, communication, comment }) {
        try {
            const review = await Review.create({
                type: 'SELLER',
                orderId,
                dealerId,
                customerId,
                rating,
                deliveryRating: delivery,
                packagingRating: packaging,
                communicationRating: communication,
                comment,
                status: 'PENDING'
            });

            // Update dealer stats (async)
            this.updateDealerRating(dealerId);

            return review;
        } catch (error) {
            logger.error('Submit Seller Review Error:', error);
            throw new Error('Failed to submit seller review');
        }
    }

    /**
     * Recalculate and update product rating.
     */
    async updateProductRating(productId) {
        const stats = await Review.aggregate([
            { $match: { productId: productId, type: 'PRODUCT', status: 'APPROVED' } },
            {
                $group: {
                    _id: '$productId',
                    avgRating: { $avg: '$rating' },
                    count: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                averageRating: stats[0].avgRating,
                reviewCount: stats[0].count
            });
        }
    }

    /**
     * Recalculate and update dealer rating.
     */
    async updateDealerRating(dealerId) {
        const stats = await Review.aggregate([
            { $match: { dealerId: dealerId, type: 'SELLER', status: 'APPROVED' } },
            {
                $group: {
                    _id: '$dealerId',
                    avgRating: { $avg: '$rating' },
                    count: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            await Seller.findByIdAndUpdate(dealerId, {
                averageRating: stats[0].avgRating,
                reviewCount: stats[0].count
            });
        }
    }

    /**
     * Moderate a review (Admin).
     */
    async moderateReview(type, reviewId, status) {
        try {
            const review = await Review.findByIdAndUpdate(reviewId, { status }, { new: true });
            if (!review) throw new Error('Review not found');

            if (review.type === 'PRODUCT') {
                await this.updateProductRating(review.productId);
            } else {
                await this.updateDealerRating(review.dealerId);
            }
            return review;
        } catch (error) {
            logger.error('Moderate Review Error:', error);
            throw new Error('Failed to moderate review');
        }
    }

    /**
     * Get pending reviews for moderation.
     */
    async getPendingReviews() {
        try {
            const productReviews = await Review.find({ type: 'PRODUCT', status: 'PENDING' })
                .populate('productId')
                .populate('customerId');
            const sellerReviews = await Review.find({ type: 'SELLER', status: 'PENDING' })
                .populate('dealerId')
                .populate('customerId');
            return { productReviews, sellerReviews };
        } catch (error) {
            logger.error('Get Pending Reviews Error:', error);
            throw new Error('Failed to fetch pending reviews');
        }
    }

    /**
     * Get all reviews by a specific customer.
     */
    async getCustomerReviews(customerId) {
        try {
            return await Review.find({ customerId })
                .populate('productId', 'name images')
                .sort({ createdAt: -1 });
        } catch (error) {
            logger.error('Get Customer Reviews Error:', error);
            throw new Error('Failed to fetch customer reviews');
        }
    }
}

export default new ReviewService();
