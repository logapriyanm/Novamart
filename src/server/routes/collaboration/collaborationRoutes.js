import express from 'express';
import authenticate from '../../middleware/auth.js';
import { requireENTERPRISE, checkSubscriptionExpiry } from '../../middleware/subscriptionMiddleware.js';
import {
    createGroup,
    getMyGroups,
    getGroupDetails,
    inviteDealer,
    joinGroup,
    leaveGroup,
    lockGroup,
    cancelGroup
} from '../../controllers/collaborationController.js';

const router = express.Router();

// All routes require authentication and ENTERPRISE subscription
router.use(authenticate);
router.use(checkSubscriptionExpiry);

// Collaboration group routes
router.post('/groups', requireENTERPRISE, createGroup);
router.get('/groups', requireENTERPRISE, getMyGroups);
router.get('/groups/:id', requireENTERPRISE, getGroupDetails);
router.post('/groups/:id/invite', requireENTERPRISE, inviteDealer);
router.post('/groups/:id/join', requireENTERPRISE, joinGroup);
router.delete('/groups/:id/leave', requireENTERPRISE, leaveGroup);
router.post('/groups/:id/lock', requireENTERPRISE, lockGroup);
router.delete('/groups/:id', requireENTERPRISE, cancelGroup);

export default router;
