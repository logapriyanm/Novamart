import express from 'express';
import authenticate from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';
import { requirePROorHigher, checkSubscriptionExpiry } from '../../middleware/subscriptionMiddleware.js';
import {
    createCustomRequest,
    getMyRequests,
    getRequestDetails,
    updateRequest,
    cancelRequest,
    getIncomingRequests,
    respondToRequest,
    updateMilestone,
    getMilestones
} from '../../controllers/customManufacturingController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(checkSubscriptionExpiry);

// Dealer routes (PRO or ENTERPRISE)
router.post('/requests', requirePROorHigher, createCustomRequest);
router.get('/requests', requirePROorHigher, getMyRequests);
router.get('/requests/:id', requirePROorHigher, getRequestDetails);
router.put('/requests/:id', requirePROorHigher, updateRequest);
router.delete('/requests/:id', requirePROorHigher, cancelRequest);

// Manufacturer routes (no subscription required, but role restricted)
router.get('/incoming', authorize(['MANUFACTURER']), getIncomingRequests);
router.post('/requests/:id/respond', authorize(['MANUFACTURER']), respondToRequest);
router.post('/requests/:id/milestones', authorize(['MANUFACTURER']), updateMilestone);
router.get('/requests/:id/milestones', authorize(['MANUFACTURER']), getMilestones);

export default router;
