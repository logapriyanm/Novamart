/**
 * Manufacturer Routes
 * Governance for manufacturers over their dealer networks and products.
 */

import express from 'express';
import manufacturerController from '../../controllers/manufacturerController.js';
import authorize from '../../middleware/rbac.js';
import authenticate from '../../middleware/auth.js';
import productController from '../../controllers/products/productController.js';

const router = express.Router();

// All manufacturer routes require authentication and MANUFACTURER role
router.use(authenticate);
router.use(authorize(['MANUFACTURER'], [], ['ACTIVE', 'UNDER_VERIFICATION']));

/**
 * Dealer Network Management
 */
router.get('/network', manufacturerController.getMyDealers);
router.post('/network/handle', manufacturerController.handleDealerNetwork);
router.get('/products', productController.getMyProducts);

/**
 * Inventory & Allocation
 */
router.post('/inventory/allocate', manufacturerController.allocateInventory);

/**
 * Performance & Financials
 */
router.get('/analytics', manufacturerController.getManufacturerStats);

/**
 * Profile & Settings
 */
router.get('/profile', manufacturerController.getProfile);
router.put('/profile', manufacturerController.updateProfile);

export default router;

