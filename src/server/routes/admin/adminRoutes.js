import express from 'express';
import adminController from './adminController.js';
import authorize from '../../middleware/rbac.js';
import auditLog from '../../middleware/audit.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

// Apply authentication to all admin routes
router.use(authenticate);

// All routes require ADMIN role
// Granular sub-roles checked inside individual routes or groups

router.get('/stats',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN', 'FINANCE_ADMIN']),
    adminController.getDashboardStats
);

router.put('/users/:id/status',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    auditLog('UPDATE_USER_STATUS', 'USER'),
    adminController.manageUser
);

router.put('/products/:id/approve',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    auditLog('APPROVE_PRODUCT', 'PRODUCT'),
    adminController.approveProduct
);

router.post('/rules/margin',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'FINANCE_ADMIN']),
    auditLog('CREATE_MARGIN_RULE', 'MARGIN_RULE'),
    adminController.createMarginRule
);

router.get('/audit-logs',
    authorize(['ADMIN'], ['SUPER_ADMIN']),
    adminController.getAuditLogs
);

router.put('/escrow/settle/:orderId',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'FINANCE_ADMIN']),
    auditLog('ESCROW_SETTLE', 'ESCROW'),
    adminController.settleEscrow
);

router.post('/escrow/refund/:orderId',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'FINANCE_ADMIN']),
    auditLog('ESCROW_REFUND', 'ESCROW'),
    adminController.refundEscrow
);

router.put('/orders/:orderId/status',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    auditLog('UPDATE_ORDER_LIFECYCLE', 'ORDER'),
    adminController.updateOrderStatus
);

router.get('/inventory/audit',
    authorize(['ADMIN'], ['SUPER_ADMIN']),
    adminController.auditInventory
);

router.post('/disputes/:disputeId/evaluate',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'TRUST_ADMIN']),
    adminController.evaluateDispute
);

router.put('/disputes/:disputeId/resolve',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'TRUST_ADMIN']),
    auditLog('DISPUTE_RESOLVE', 'DISPUTE'),
    adminController.manualResolveDispute
);

router.post('/badges/assign',
    authorize(['ADMIN'], ['SUPER_ADMIN']),
    auditLog('ASSIGN_BADGE', 'USER'),
    adminController.assignBadge
);

router.put('/settings',
    authorize(['ADMIN'], ['SUPER_ADMIN']),
    auditLog('UPDATE_SETTINGS', 'SYSTEM'),
    adminController.updateSettings
);

export default router;

