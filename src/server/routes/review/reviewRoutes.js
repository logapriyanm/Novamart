
import express from 'express';
import {
    submitProductReview,
    submitSellerReview,
    getMyReviews,
    getPendingReviews,
    moderateReview,
    voteReview,
    reportReview,
    getProductReviews,
    getSellerReviews,
    replyToReview,
    getSellerAnalytics,
    getAdminAnalytics
} from '../../controllers/reviewController.js';
import authorize from '../../middleware/rbac.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

// Public Routes
router.get('/product/:productId', getProductReviews);
router.get('/seller/:sellerId', getSellerReviews);

router.use(authenticate);

// Customer Routes
router.post('/product', authorize(['CUSTOMER']), submitProductReview);
router.post('/seller', authorize(['CUSTOMER']), submitSellerReview);
router.post('/:reviewId/vote', authorize(['CUSTOMER']), voteReview);
router.post('/:reviewId/report', authorize(['CUSTOMER']), reportReview);
router.get('/my-reviews', authorize(['CUSTOMER']), getMyReviews);

// Analytics & Management (Seller)
router.get('/analytics/seller', authenticate, authorize(['SELLER']), getSellerAnalytics);
router.post('/:reviewId/reply', authenticate, authorize(['SELLER']), replyToReview);

// Admin Moderation Routes
router.get('/analytics/admin', authenticate, authorize(['ADMIN']), getAdminAnalytics);
router.get('/pending', authorize(['ADMIN']), getPendingReviews);
router.post('/moderate', authorize(['ADMIN']), moderateReview);

export default router;
