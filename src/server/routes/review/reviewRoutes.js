
import express from 'express';
import {
    submitProductReview,
    submitSellerReview,
    getMyReviews,
    getPendingReviews,
    moderateReview
} from '../../controllers/reviewController.js';
import authorize from '../../middleware/rbac.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Customer Routes
router.post('/product', authorize(['CUSTOMER']), submitProductReview);
router.post('/seller', authorize(['CUSTOMER']), submitSellerReview);
router.get('/my-reviews', authorize(['CUSTOMER']), getMyReviews);

// Admin Moderation Routes
router.get('/pending', authorize(['ADMIN']), getPendingReviews);
router.post('/moderate', authorize(['ADMIN']), moderateReview);

export default router;
