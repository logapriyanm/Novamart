/**
 * Review Service
 * Handles product and seller reviews.
 */

import prisma from '../lib/prisma.js';

class ReviewService {
    /**
     * Submit a product review.
     */
    async submitProductReview({ orderItemId, productId, customerId, rating, comment, images }) {
        try {
            // 1. Create Review
            const review = await prisma.productReview.create({
                data: {
                    item: { connect: { id: orderItemId } },
                    product: { connect: { id: productId } },
                    customer: { connect: { id: customerId } },
                    rating,
                    comment,
                    images
                }
            });

            // 2. Update Product Stats (Async)
            this.updateProductRating(productId);

            return review;
        } catch (error) {
            console.error('Submit Product Review Error:', error);
            throw new Error('Failed to submit product review');
        }
    }

    /**
     * Submit a seller review.
     */
    async submitSellerReview({ orderId, dealerId, customerId, rating, delivery, packaging, communication, comment }) {
        try {
            // 1. Create Review
            const review = await prisma.sellerReview.create({
                data: {
                    order: { connect: { id: orderId } },
                    dealer: { connect: { id: dealerId } },
                    customer: { connect: { id: customerId } },
                    rating, // Overall
                    deliveryRating: delivery,
                    packagingRating: packaging,
                    communicationRating: communication,
                    comment
                }
            });

            // 2. Update Dealer Stats (Async)
            this.updateDealerRating(dealerId);

            return review;
        } catch (error) {
            console.error('Submit Seller Review Error:', error);
            throw new Error('Failed to submit seller review');
        }
    }

    /**
     * Recalculate and update product rating.
     * Only includes APPROVED reviews.
     */
    async updateProductRating(productId) {
        const aggregations = await prisma.productReview.aggregate({
            where: {
                productId,
                status: 'APPROVED'
            },
            _avg: { rating: true },
            _count: { rating: true }
        });

        await prisma.product.update({
            where: { id: productId },
            data: {
                averageRating: aggregations._avg.rating || 0,
                reviewCount: aggregations._count.rating || 0
            }
        });
    }

    /**
     * Recalculate and update dealer rating.
     * Only includes APPROVED reviews.
     */
    async updateDealerRating(dealerId) {
        const aggregations = await prisma.sellerReview.aggregate({
            where: {
                dealerId,
                status: 'APPROVED'
            },
            _avg: { rating: true },
            _count: { rating: true }
        });

        await prisma.dealer.update({
            where: { id: dealerId },
            data: {
                averageRating: aggregations._avg.rating || 0,
                reviewCount: aggregations._count.rating || 0
            }
        });
    }

    /**
     * Moderate a review (Admin).
     */
    async moderateReview(type, reviewId, status) {
        try {
            let review;
            if (type === 'PRODUCT') {
                review = await prisma.productReview.update({
                    where: { id: reviewId },
                    data: { status }
                });
                await this.updateProductRating(review.productId);
            } else if (type === 'SELLER') {
                review = await prisma.sellerReview.update({
                    where: { id: reviewId },
                    data: { status }
                });
                await this.updateDealerRating(review.dealerId);
            }
            return review;
        } catch (error) {
            console.error('Moderate Review Error:', error);
            throw new Error('Failed to moderate review');
        }
    }

    /**
     * Get pending reviews for moderation.
     */
    async getPendingReviews() {
        try {
            const productReviews = await prisma.productReview.findMany({
                where: { status: 'PENDING' },
                include: { product: true, customer: true }
            });
            const sellerReviews = await prisma.sellerReview.findMany({
                where: { status: 'PENDING' },
                include: { dealer: true, customer: true }
            });
            return { productReviews, sellerReviews };
        } catch (error) {
            console.error('Get Pending Reviews Error:', error);
            throw new Error('Failed to fetch pending reviews');
        }
    }

    /**
     * Get all reviews by a specific customer.
     */
    async getCustomerReviews(customerId) {
        try {
            const reviews = await prisma.productReview.findMany({
                where: { customerId },
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            images: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return reviews;
        } catch (error) {
            console.error('Get Customer Reviews Error:', error);
            throw new Error('Failed to fetch customer reviews');
        }
    }
}

export default new ReviewService();
