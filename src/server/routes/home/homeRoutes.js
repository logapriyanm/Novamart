import express from 'express';
import { getPersonalizedHome, trackUserEvent } from '../../controllers/homeController.js';
import { authenticateUser } from '../../middleware/auth.js';

const router = express.Router();

// Get personalized home data (requires auth for personalization, can be optional in future)
router.get('/personalized', authenticateUser, getPersonalizedHome);

// Track user interaction (view, click)
router.post('/track', authenticateUser, trackUserEvent);

export default router;
