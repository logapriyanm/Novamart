import express from 'express';
import authenticate, { authorizeRoles } from '../../middleware/auth.js';
import { createRule, getRules, deleteRule, toggleRuleStatus } from '../../controllers/pricingController.js';

const router = express.Router();

// All routes require authentication and MANUFACTURER role
router.use(authenticate);
router.use(authorizeRoles('MANUFACTURER'));

router.get('/', getRules);
router.post('/', createRule);
router.delete('/:id', deleteRule);
router.patch('/:id/toggle', toggleRuleStatus);

export default router;
