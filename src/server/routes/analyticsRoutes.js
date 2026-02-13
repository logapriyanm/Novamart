import express from 'express';
import {
    getAdminOverview,
    getManufacturerOverview,
    getSellerOverview
} from '../controllers/analyticsController.js';
import authenticate from '../middleware/auth.js';
import authorize from '../middleware/rbac.js';

const router = express.Router();

// Admin
router.get('/admin/overview', authenticate, authorize(['ADMIN']), getAdminOverview);

// Manufacturer
router.get('/manufacturer/overview', authenticate, authorize(['MANUFACTURER']), getManufacturerOverview);

// Seller
router.get('/seller/overview', authenticate, authorize(['SELLER']), getSellerOverview);

export default router;
