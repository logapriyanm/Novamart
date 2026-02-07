import express from 'express';
import productController from './productController.js';
import authenticate from '../../middleware/auth.js';
import authorize from '../../middleware/rbac.js';

const router = express.Router();

// Public Routes (Future)
// router.get('/', productController.getAllProducts);
// router.get('/:id', productController.getProductById);

// Protected Manufacturer Routes
router.post('/',
    authenticate,
    authorize(['MANUFACTURER']),
    productController.createProduct
);

router.get('/my-products',
    authenticate,
    authorize(['MANUFACTURER']),
    productController.getMyProducts
);

export default router;
