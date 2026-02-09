import express from 'express';
import productController from '../../controllers/products/productController.js';
import authenticate, { authenticateOptional } from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';

import { validateProduct } from '../../middleware/validate.js';

const router = express.Router();

// Public Routes
router.get('/', productController.getAllProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', authenticateOptional, productController.getProductById);

// Protected Manufacturer Routes
router.post('/',
    authenticate,
    authorize(['MANUFACTURER'], [], ['ACTIVE', 'UNDER_VERIFICATION']),
    validateProduct,
    productController.createProduct
);

router.get('/my-products',
    authenticate,
    authorize(['MANUFACTURER'], [], ['ACTIVE', 'UNDER_VERIFICATION']),
    productController.getMyProducts
);

router.put('/:id',
    authenticate,
    authorize(['MANUFACTURER'], [], ['ACTIVE', 'UNDER_VERIFICATION']),
    validateProduct,
    productController.updateProduct
);

router.delete('/:id',
    authenticate,
    authorize(['MANUFACTURER'], [], ['ACTIVE', 'UNDER_VERIFICATION']),
    productController.deleteProduct
);

/*
router.post('/bulk',
    authenticate,
    authorize(['MANUFACTURER'], [], ['ACTIVE', 'UNDER_VERIFICATION']),
    productController.bulkImportProducts
);
*/

// Admin: Manage Products (Approve/Reject)

router.patch('/:id/status',
    authenticate,
    authorize(['ADMIN']),
    productController.updateProductStatus
);

export default router;
