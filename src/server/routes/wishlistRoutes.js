import express from 'express';
import wishlistController from '../controllers/wishlistController.js';
import authenticate from '../middleware/auth.js';
import authorize from '../middleware/rbac.js';
import logger from '../lib/logger.js';

const router = express.Router();

// All wishlist routes require authentication and CUSTOMER role
router.use(authenticate);
router.use(authorize(['CUSTOMER', 'ADMIN', 'MANUFACTURER', 'SELLER'], [], ['ACTIVE', 'PENDING']));

router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.toggleWishlist); // Handle add/toggle via root POST
router.post('/toggle', wishlistController.toggleWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

export default router;
