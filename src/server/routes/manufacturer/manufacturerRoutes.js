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
router.get('/dealers/requests', manufacturerController.getDealerRequests);
router.post('/network/handle', manufacturerController.handleDealerNetwork);
router.post('/dealers/handle', manufacturerController.handleDealerNetwork); // Alias
router.get('/products', productController.getMyProducts);
router.get('/orders', manufacturerController.getOrders);

/**
 * Inventory & Allocation
 */
router.post('/inventory/allocate', manufacturerController.allocateInventory);
router.get('/allocations', manufacturerController.getAllocations);
router.put('/allocations/:allocationId', manufacturerController.updateAllocation);
router.delete('/allocations/:allocationId', manufacturerController.revokeAllocation);


/**
 * Performance & Financials
 */
router.get('/analytics', manufacturerController.getManufacturerStats);
router.get('/stats', manufacturerController.getManufacturerStats); // Alias

/**
 * Profile & Settings
 */
router.get('/profile', manufacturerController.getProfile);
router.put('/profile', manufacturerController.updateProfile);

/**
 * Public Manufacturer List (For Dealer Marketplace)
 */
router.get('/all', manufacturerController.getAllManufacturers);

export default router;

