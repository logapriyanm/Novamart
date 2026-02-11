import express from 'express';
import * as poolingController from '../../controllers/pooling/poolingController.js';
import authenticate from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';

const router = express.Router();

router.post('/create', authenticate, authorize(['DEALER']), poolingController.createPool);
router.post('/:poolId/join', authenticate, authorize(['DEALER']), poolingController.joinPool);
router.get('/', authenticate, authorize(['DEALER']), poolingController.getPools);
router.get('/:id', authenticate, authorize(['DEALER']), poolingController.getPoolDetails);

export default router;
