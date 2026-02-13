import express from 'express';
import {
    getAdminOverview,
    getQualityAudit,
    getManufacturerOverview,
    getSellerOverview
} from '../controllers/analyticsController.js';
import authenticate from '../middleware/auth.js';
import authorize from '../middleware/rbac.js';

const router = express.Router();

// Admin
router.get('/admin/overview', authenticate, authorize(['ADMIN']), getAdminOverview);
router.get('/admin/quality-audit', authenticate, authorize(['ADMIN']), getQualityAudit);

// Manufacturer
router.get('/manufacturer/overview', authenticate, authorize(['MANUFACTURER']), getManufacturerOverview);

// Seller
router.get('/seller/overview', authenticate, authorize(['SELLER']), getSellerOverview);

export default router;
