import express from 'express';
import authenticate from '../middleware/auth.js';

import notificationController from '../controllers/notificationController.js';

const router = express.Router();

/**
 * Get user notifications
 */
router.get('/', authenticate, notificationController.getNotifications);

/**
 * Mark notification as read
 */
router.put('/:id/read', authenticate, notificationController.markAsRead);

/**
 * Mark all as read
 */
router.put('/read-all', authenticate, notificationController.markAllAsRead);

export default router;
