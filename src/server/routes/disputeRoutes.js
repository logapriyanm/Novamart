import express from 'express';
import { getMyDisputes } from '../controllers/disputeController.js';
import authenticate from '../middleware/auth.js';
import authorize from '../middleware/rbac.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);

// Init dispute creation is currently done via Order endpoints or specific dispute service calls
// Here we expose fetching disputes
router.get('/my', getMyDisputes);

export default router;
