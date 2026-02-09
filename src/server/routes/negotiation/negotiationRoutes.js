import express from 'express';
import { createNegotiation, getNegotiations, updateNegotiation, getSingleNegotiation } from '../../controllers/negotiationController.js';
import { authenticateUser, authorizeRoles } from '../../middleware/auth.js';

const router = express.Router();

router.post('/create', authenticateUser, authorizeRoles(['DEALER']), createNegotiation);
router.get('/', authenticateUser, getNegotiations);
router.get('/:negotiationId', authenticateUser, getSingleNegotiation);
router.put('/:negotiationId', authenticateUser, updateNegotiation);

export default router;
