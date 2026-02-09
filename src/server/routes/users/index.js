import express from 'express';
import userController from '../../controllers/userController.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

// Apply authentication to all user routes
router.use(authenticate);

/**
 * @route PUT /api/users/fcm-token
 * @desc Update user's FCM token for push notifications
 */
router.put('/fcm-token', userController.updateFCMToken);

export default router;
