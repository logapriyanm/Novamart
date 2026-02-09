import express from 'express';
import * as poolingController from '../../controllers/pooling/poolingController.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

router.post('/create', authenticate, poolingController.createPool);
router.post('/:poolId/join', authenticate, poolingController.joinPool);
router.get('/', authenticate, poolingController.getPools);
router.get('/:id', authenticate, poolingController.getPoolDetails);

export default router;
