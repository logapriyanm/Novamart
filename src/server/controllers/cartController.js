import { Cart, Customer, Inventory, Product } from '../models/index.js';
import mongoose from 'mongoose';

// Get Cart for authenticated customer
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        let customer = await Customer.findOne({ userId });

        if (!customer) {
            if (req.user.role === 'CUSTOMER') {
                customer = await Customer.create({
                    userId,
                    name: req.user.email?.split('@')[0] || 'Customer'
                });
            } else {
                return res.json({ success: true, data: { items: [], itemCount: 0 } });
            }
        }

        let cart = await Cart.findOne({ customerId: customer._id })
            .populate({
                path: 'items.inventoryId',
                populate: {
                    path: 'productId',
                    populate: { path: 'manufacturerId' }
                }
            });

        if (!cart) {
            cart = await Cart.create({ customerId: customer._id });
        }

        const enrichedItems = cart.items.map(item => {
            const inventory = item.inventoryId;
            return {
                id: item._id,
                quantity: item.quantity,
                price: item.price,
                product: inventory?.productId,
                dealerId: inventory?.dealerId,
                inventoryId: inventory?._id,
                stock: inventory?.stock || 0
            };
        });

        res.json({
            success: true,
            data: {
                id: cart._id,
                items: enrichedItems,
                itemCount: enrichedItems.length
            }
        });
    } catch (error) {
        console.error('Get Cart Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch cart' });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { inventoryId, quantity = 1 } = req.body;

        if (!inventoryId) {
            return res.status(400).json({ success: false, error: 'Inventory ID required' });
        }

        let customer = await Customer.findOne({ userId });
        if (!customer) {
            if (req.user.role === 'CUSTOMER') {
                customer = await Customer.create({
                    userId,
                    name: req.user.email?.split('@')[0] || 'Customer'
                });
            } else {
                return res.status(403).json({ success: false, error: 'Action restricted to customers' });
            }
        }

        const inventory = await Inventory.findById(inventoryId).populate('productId');
        if (!inventory) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        if (inventory.stock < quantity) {
            return res.status(400).json({ success: false, error: 'Insufficient stock' });
        }

        let cart = await Cart.findOne({ customerId: customer._id });
        if (!cart) {
            cart = await Cart.create({ customerId: customer._id });
        }

        const itemIndex = cart.items.findIndex(item => item.inventoryId.toString() === inventoryId);

        if (itemIndex > -1) {
            const newQuantity = cart.items[itemIndex].quantity + quantity;
            if (inventory.stock < newQuantity) {
                return res.status(400).json({
                    success: false,
                    error: `Only ${inventory.stock} items available`
                });
            }
            cart.items[itemIndex].quantity = newQuantity;
            cart.items[itemIndex].price = inventory.price;
        } else {
            cart.items.push({
                inventoryId,
                productId: inventory.productId._id,
                quantity,
                price: inventory.price
            });
        }

        await cart.save();
        res.json({ success: true, data: cart });
    } catch (error) {
        console.error('Add to Cart Error:', error);
        res.status(500).json({ success: false, error: 'Failed to add item to cart' });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { cartItemId, quantity } = req.body;

        let customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const cart = await Cart.findOne({ customerId: customer._id });
        if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

        const item = cart.items.id(cartItemId);
        if (!item) return res.status(404).json({ success: false, error: 'Cart item not found' });

        const inventory = await Inventory.findById(item.inventoryId);
        if (!inventory) return res.status(404).json({ success: false, error: 'Product no longer available' });

        if (inventory.stock < quantity) {
            return res.status(400).json({
                success: false,
                error: `Only ${inventory.stock} items available`
            });
        }

        item.quantity = quantity;
        item.price = inventory.price;
        await cart.save();

        res.json({ success: true, data: cart });
    } catch (error) {
        console.error('Update Cart Item Error:', error);
        res.status(500).json({ success: false, error: 'Failed to update cart item' });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { cartItemId } = req.params;

        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const cart = await Cart.findOne({ customerId: customer._id });
        if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

        cart.items.pull(cartItemId);
        await cart.save();

        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from Cart Error:', error);
        res.status(500).json({ success: false, error: 'Failed to remove item' });
    }
};

// Clear entire cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        await Cart.findOneAndUpdate({ customerId: customer._id }, { $set: { items: [] } });

        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear Cart Error:', error);
        res.status(500).json({ success: false, error: 'Failed to clear cart' });
    }
};

// Sync cart from local storage
export const syncCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, error: 'Items array required' });
        }

        let customer = await Customer.findOne({ userId });
        if (!customer) {
            customer = await Customer.create({
                userId,
                name: req.user.email?.split('@')[0] || 'Customer'
            });
        }

        let cart = await Cart.findOne({ customerId: customer._id });
        if (!cart) cart = await Cart.create({ customerId: customer._id });

        for (const item of items) {
            const { inventoryId, quantity } = item;
            const inventory = await Inventory.findById(inventoryId);
            if (!inventory || inventory.stock <= 0) continue;

            const existingIndex = cart.items.findIndex(ci => ci.inventoryId.toString() === inventoryId);
            if (existingIndex > -1) {
                cart.items[existingIndex].quantity = Math.min(Math.max(cart.items[existingIndex].quantity, quantity), inventory.stock);
                cart.items[existingIndex].price = inventory.price;
            } else {
                cart.items.push({
                    inventoryId,
                    productId: inventory.productId,
                    quantity: Math.min(quantity, inventory.stock),
                    price: inventory.price
                });
            }
        }

        await cart.save();
        res.json({ success: true, data: { mergedCount: items.length } });
    } catch (error) {
        console.error('Sync Cart Error:', error);
        res.status(500).json({ success: false, error: 'Failed to sync cart' });
    }
};
