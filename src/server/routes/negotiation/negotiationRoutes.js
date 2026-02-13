import express from 'express';
import { createNegotiation, getNegotiations, updateNegotiation, getSingleNegotiation } from '../../controllers/negotiationController.js';
import { authenticateUser } from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';

const router = express.Router();

router.post('/create', authenticateUser, authorize(['SELLER']), createNegotiation);
router.get('/', authenticateUser, authorize(['SELLER', 'MANUFACTURER']), getNegotiations);
router.get('/:negotiationId', authenticateUser, authorize(['SELLER', 'MANUFACTURER']), getSingleNegotiation);
router.put('/:negotiationId', authenticateUser, authorize(['SELLER', 'MANUFACTURER']), updateNegotiation);

export default router;
