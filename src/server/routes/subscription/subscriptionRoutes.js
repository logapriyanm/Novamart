import express from 'express';
import { getPlans, seedPlans, subscribeToPlan, getMySubscription, cancelSubscription, getSubscriptionFeatures } from '../../controllers/subscriptionController.js';
import { authenticateUser } from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';

const router = express.Router();

router.get('/plans', getPlans);
router.post('/seed', authenticateUser, authorize(['ADMIN']), seedPlans);

router.post('/subscribe', authenticateUser, authorize(['SELLER']), subscribeToPlan);
router.post('/cancel', authenticateUser, authorize(['SELLER']), cancelSubscription);
router.get('/my-subscription', authenticateUser, authorize(['SELLER']), getMySubscription);
router.get('/features', authenticateUser, authorize(['SELLER']), getSubscriptionFeatures);


export default router;
