import express from 'express';
import productController from '../../controllers/products/productController.js';
import authenticate from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';

const router = express.Router();

// Public Routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected Manufacturer Routes
router.post('/',
    authenticate,
    authorize(['MANUFACTURER'], [], ['ACTIVE', 'UNDER_VERIFICATION']),
    productController.createProduct
);

router.get('/my-products',
    authenticate,
    authorize(['MANUFACTURER'], [], ['ACTIVE', 'UNDER_VERIFICATION']),
    productController.getMyProducts
);

// Admin: Manage Products (Approve/Reject)

router.patch('/:id/status',
    authenticate,
    authorize(['ADMIN']),
    productController.updateProductStatus
);

export default router;
