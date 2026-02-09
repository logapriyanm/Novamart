import express from 'express';
import dashboardController from '../../controllers/admin/dashboardController.js';
import userManagementController from '../../controllers/admin/userManagementController.js';
import productApprovalController from '../../controllers/admin/productApprovalController.js';
import governanceController from '../../controllers/admin/governanceController.js';
import escrowManagementController from '../../controllers/admin/escrowManagementController.js';
import orderLifecycleController from '../../controllers/admin/orderLifecycleController.js';
import auditLogController from '../../controllers/admin/auditLogController.js';
import disputeController from '../../controllers/admin/disputeController.js';
import * as monitoringController from '../../controllers/admin/monitoringController.js';

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
    dashboardController.getDashboardStats
);

router.get('/users',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    userManagementController.getUsers
);

router.put('/users/:id/status',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    auditLog('UPDATE_USER_STATUS', 'USER'),
    userManagementController.manageUser
);

router.get('/manufacturers',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    userManagementController.getManufacturers
);

router.get('/dealers',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    userManagementController.getDealers
);

router.get('/products/pending',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    productApprovalController.getPendingProducts
);

router.get('/products',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    productApprovalController.getAllProducts
);

router.put('/products/:id/approve',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    auditLog('APPROVE_PRODUCT', 'PRODUCT'),
    productApprovalController.approveProduct
);

router.post('/rules/margin',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'FINANCE_ADMIN']),
    auditLog('CREATE_MARGIN_RULE', 'MARGIN_RULE'),
    governanceController.createMarginRule
);

router.get('/audit-logs',
    authorize(['ADMIN'], ['SUPER_ADMIN']),
    auditLogController.getAuditLogs
);

router.put('/escrow/settle/:orderId',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'FINANCE_ADMIN']),
    auditLog('ESCROW_SETTLE', 'ESCROW'),
    escrowManagementController.settleEscrow
);

router.post('/escrow/refund/:orderId',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'FINANCE_ADMIN']),
    auditLog('ESCROW_REFUND', 'ESCROW'),
    escrowManagementController.refundEscrow
);

router.get('/orders',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN', 'FINANCE_ADMIN']),
    orderLifecycleController.getAllOrders
);

router.put('/orders/:orderId/status',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    auditLog('UPDATE_ORDER_LIFECYCLE', 'ORDER'),
    orderLifecycleController.updateOrderStatus
);

router.get('/inventory/audit',
    authorize(['ADMIN'], ['SUPER_ADMIN']),
    orderLifecycleController.auditInventory
);

router.post('/disputes/:disputeId/evaluate',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'TRUST_ADMIN']),
    disputeController.evaluateDispute
);

router.put('/disputes/:disputeId/resolve',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'TRUST_ADMIN']),
    auditLog('DISPUTE_RESOLVE', 'DISPUTE'),
    disputeController.manualResolveDispute
);

router.post('/badges/assign',
    authorize(['ADMIN'], ['SUPER_ADMIN']),
    auditLog('ASSIGN_BADGE', 'USER'),
    userManagementController.assignBadge
);

router.put('/manufacturers/:manufacturerId/verify',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    auditLog('VERIFY_MANUFACTURER', 'MANUFACTURER'),
    userManagementController.verifyManufacturer
);

router.put('/dealers/:dealerId/verify',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    auditLog('VERIFY_DEALER', 'DEALER'),
    userManagementController.verifyDealer
);

router.put('/dealers/:dealerId/manufacturers',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    auditLog('DEALER_MANUFACTURER_LINK', 'DEALER'),
    userManagementController.updateDealerManufacturers
);

router.put('/settings',
    authorize(['ADMIN'], ['SUPER_ADMIN']),
    auditLog('UPDATE_SETTINGS', 'SYSTEM'),
    governanceController.updateSettings
);

// Monitoring Routes
router.get('/monitoring/health',
    authorize(['ADMIN'], ['SUPER_ADMIN', 'OPS_ADMIN']),
    monitoringController.getSystemHealth
);

export default router;

