/**
 * Manufacturer Routes
 * Governance for manufacturers over their dealer networks and products.
 */

import express from 'express';
import manufacturerController from './manufacturerController.js';
import authorize from '../../middleware/rbac.js';
import authenticate from '../../middleware/auth.js';

const router = express.Router();

// All manufacturer routes require authentication and MANUFACTURER role
router.use(authenticate);
router.use(authorize(['MANUFACTURER']));

/**
 * Dealer Network Management
 */
router.get('/network', manufacturerController.getMyDealers);
router.post('/network/handle', manufacturerController.handleDealerNetwork);

/**
 * Inventory & Allocation
 */
router.post('/inventory/allocate', manufacturerController.allocateInventory);

/**
 * Performance & Financials
 */
router.get('/analytics', manufacturerController.getManufacturerStats);

export default router;
