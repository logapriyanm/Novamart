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
import authorize from '../../middleware/rbac.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Customer routes (ownership checked inside controller)
router.get('/:orderId', getEscrow);
router.post('/confirm-delivery', confirmDelivery);
router.post('/request-refund', requestRefund);

// Admin-only routes — RBAC enforced
router.post('/admin/release', authorize(['ADMIN']), adminReleaseEscrow);
router.post('/admin/refund', authorize(['ADMIN']), adminProcessRefund);
router.get('/admin/all', authorize(['ADMIN']), adminGetAllEscrows);

// System route — admin-only (should be protected by API key in production)
router.post('/auto-release', authorize(['ADMIN']), autoReleaseEscrow);

export default router;
