import express from 'express';
import sellerController from '../../controllers/sellerController.js';
import authenticate from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';

const router = express.Router();

/**
 * Public Routes
 */
router.get('/:id', sellerController.getPublicProfile);
router.get('/:id/products', sellerController.getSellerProducts);

/**
 * Protected Routes
 */
// Inventory & Stock
router.get('/inventory/my', authenticate, authorize(['SELLER']), sellerController.getMyInventory);
router.get('/inventory/:id', authenticate, authorize(['SELLER']), sellerController.getInventoryItem);
router.put('/inventory/price', authenticate, authorize(['SELLER']), sellerController.updatePrice);
router.put('/inventory/stock', authenticate, authorize(['SELLER']), sellerController.updateStock);
router.put('/inventory/toggle', authenticate, authorize(['SELLER']), sellerController.toggleListing);

// Sourcing
router.get('/manufacturers', authenticate, authorize(['SELLER']), sellerController.getManufacturers);
router.post('/source', authenticate, authorize(['SELLER']), sellerController.sourceProduct);
router.post('/request-access', authenticate, authorize(['SELLER']), sellerController.requestManufacturerAccess);
router.get('/requests', authenticate, authorize(['SELLER']), sellerController.getMyRequests);
router.get('/allocations', authenticate, authorize(['SELLER']), sellerController.getMyAllocations);

// Orders
router.put('/orders/:orderId/confirm', authenticate, authorize(['SELLER']), sellerController.confirmOrder);
router.put('/orders/:orderId/ship', authenticate, authorize(['SELLER']), sellerController.shipOrder);
router.post('/orders/:orderId/settle', authenticate, authorize(['SELLER']), sellerController.requestSettlement);

// Profile & Stats
router.get('/profile', authenticate, authorize(['SELLER']), sellerController.getMyProfile);
router.put('/profile', authenticate, authorize(['SELLER']), sellerController.updateProfile);
router.get('/stats', authenticate, authorize(['SELLER']), sellerController.getSellerStats);

export default router;
