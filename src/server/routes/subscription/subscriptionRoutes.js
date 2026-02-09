import express from 'express';
import { getPlans, seedPlans, subscribeToPlan, getMySubscription, cancelSubscription } from '../../controllers/subscriptionController.js';
import { authenticateUser, authorizeRoles } from '../../middleware/auth.js';

const router = express.Router();

router.get('/plans', getPlans);
router.post('/seed', seedPlans); // Should be admin only in prod, keeping open for dev convenience

router.post('/subscribe', authenticateUser, authorizeRoles(['DEALER']), subscribeToPlan);
router.post('/cancel', authenticateUser, authorizeRoles(['DEALER']), cancelSubscription);
router.get('/my-subscription', authenticateUser, authorizeRoles(['DEALER']), getMySubscription);


export default router;
