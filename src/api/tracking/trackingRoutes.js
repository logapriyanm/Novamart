/**
 * Tracking Routes
 * Endpoints for silent behavioral data and fraud monitoring.
 */

import express from 'express';
import trackingController from './trackingController.js';
import authenticate, { authenticateOptional } from '../../middleware/auth.js';

const router = express.Router();

// Tracking routes are usually low-auth or optional auth to capture high-volume data
router.post('/events', authenticateOptional, trackingController.captureEvent);
router.post('/signals', authenticateOptional, trackingController.triggerFraudSignal);

// Analytics routes (Admin/Mfg only - to be wrapped in RBAC in server.js or here)
router.get('/heatmap', trackingController.getDemandMap);

export default router;
