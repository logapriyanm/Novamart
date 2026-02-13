import express from 'express';
import * as poolingController from '../../controllers/pooling/poolingController.js';
import authenticate from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';

const router = express.Router();

router.post('/create', authenticate, authorize(['SELLER']), poolingController.createPool);
router.post('/:poolId/join', authenticate, authorize(['SELLER']), poolingController.joinPool);
router.get('/', authenticate, authorize(['SELLER']), poolingController.getPools);
router.get('/:id', authenticate, authorize(['SELLER']), poolingController.getPoolDetails);

export default router;
