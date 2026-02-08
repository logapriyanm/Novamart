import express from 'express';
import {
    getEscrow,
    confirmDelivery,
    requestRefund,
    adminReleaseEscrow,
    adminProcessRefund,
    adminGetAllEscrows,
    autoReleaseEscrow
} from '../../controllers/escrowController.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Customer routes
router.get('/:orderId', getEscrow);
router.post('/confirm-delivery', confirmDelivery);
router.post('/request-refund', requestRefund);

// Admin routes
router.post('/admin/release', adminReleaseEscrow);
router.post('/admin/refund', adminProcessRefund);
router.get('/admin/all', adminGetAllEscrows);

// System route (should be protected by API key in production)
router.post('/auto-release', autoReleaseEscrow);

export default router;
