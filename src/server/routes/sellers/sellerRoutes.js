import express from 'express';
import sellerController from '../../controllers/sellerController.js';

const router = express.Router();

/**
 * Public Routes
 */
router.get('/:id', sellerController.getPublicProfile);
router.get('/:id/products', sellerController.getSellerProducts);

export default router;
