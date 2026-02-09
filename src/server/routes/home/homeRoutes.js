import express from 'express';
import { getPersonalizedHome, getGuestHome, trackUserEvent } from '../../controllers/homeController.js';
import { authenticateUser } from '../../middleware/auth.js';

const router = express.Router();

// Get guest home data (no auth required)
router.get('/guest', getGuestHome);

// Get personalized home data (requires auth for personalization)
router.get('/personalized', authenticateUser, getPersonalizedHome);

// Track user interaction (view, click)
router.post('/track', authenticateUser, trackUserEvent);

export default router;
