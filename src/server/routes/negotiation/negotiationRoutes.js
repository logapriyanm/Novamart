import express from 'express';
import { createNegotiation, getNegotiations, updateNegotiation, getSingleNegotiation } from '../../controllers/negotiationController.js';
import { authenticateUser } from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';

const router = express.Router();

router.post('/create', authenticateUser, authorize(['DEALER']), createNegotiation);
router.get('/', authenticateUser, authorize(['DEALER', 'MANUFACTURER']), getNegotiations);
router.get('/:negotiationId', authenticateUser, authorize(['DEALER', 'MANUFACTURER']), getSingleNegotiation);
router.put('/:negotiationId', authenticateUser, authorize(['DEALER', 'MANUFACTURER']), updateNegotiation);

export default router;
