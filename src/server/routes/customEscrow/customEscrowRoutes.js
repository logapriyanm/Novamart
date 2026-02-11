import express from 'express';
import authenticate from '../../middleware/auth.js';
import {
    createEscrow,
    payAdvance,
    payBalance,
    releaseToManufacturer,
    getEscrowStatus
} from '../../controllers/customEscrowController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Escrow management routes
router.post('/:requestId/create', createEscrow);
router.post('/:requestId/pay-advance', payAdvance);
router.post('/:requestId/pay-balance', payBalance);
router.post('/:requestId/release', releaseToManufacturer);
router.get('/:requestId/status', getEscrowStatus);

export default router;
