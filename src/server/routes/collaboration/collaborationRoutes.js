import express from 'express';
import authenticate from '../../middleware/auth.js';
import requireVerifiedSeller from '../../middleware/requireVerifiedSeller.js';
import requireActiveSubscription from '../../middleware/requireActiveSubscription.js';
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

// PHASE 5 ENFORCEMENT: Collaboration requires VERIFIED + ACTIVE SUBSCRIPTION
// No longer restricted to ENTERPRISE only - any tier with subscription can collaborate
router.use(authenticate);
router.use(requireVerifiedSeller);      // Must have verificationStatus = VERIFIED
router.use(requireActiveSubscription);  // Must have active subscription

// Collaboration group routes
router.post('/groups', createGroup);
router.get('/groups', getMyGroups);
router.get('/groups/:id', getGroupDetails);
router.post('/groups/:id/invite', inviteDealer);
router.post('/groups/:id/join', joinGroup);
router.delete('/groups/:id/leave', leaveGroup);
router.post('/groups/:id/lock', lockGroup);
router.delete('/groups/:id', cancelGroup);

export default router;
