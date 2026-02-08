import express from 'express';
import { createNegotiation, getNegotiations, updateNegotiation } from '../../controllers/negotiationController.js';
import { authenticateUser, authorizeRoles } from '../../middleware/auth.js';

const router = express.Router();

router.post('/create', authenticateUser, authorizeRoles(['DEALER']), createNegotiation);
router.get('/', authenticateUser, getNegotiations);
router.put('/:negotiationId', authenticateUser, updateNegotiation);

export default router;
