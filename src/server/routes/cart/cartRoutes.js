import express from 'express';
import authenticate from '../../middleware/auth.js';
import * as cartController from '../../controllers/cartController.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

// Get cart
router.get('/', cartController.getCart);

// Add item to cart
router.post('/add', cartController.addToCart);

// Update cart item quantity
router.put('/update', cartController.updateCartItem);

// Remove item from cart
router.delete('/remove/:cartItemId', cartController.removeFromCart);

// Clear cart
router.delete('/clear', cartController.clearCart);

// Sync cart from local storage (on login)
router.post('/sync', cartController.syncCart);

export default router;
