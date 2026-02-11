import { Wishlist, Customer, Product } from '../models/index.js';

/**
 * Get Customer Wishlist
 */
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const customer = await Customer.findOne({ userId });
        if (!customer) {
            return res.json({ success: true, data: [] });
        }

        const items = await Wishlist.find({ customerId: customer._id })
            .populate('productId')
            .sort({ createdAt: -1 });

        // Extract products from wishlist items
        const products = items.map(item => item.productId).filter(p => p !== null);

        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Toggle Product in Wishlist (Add/Remove)
 */
export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        const existing = await Wishlist.findOne({ customerId: customer._id, productId });

        if (existing) {
            await Wishlist.findByIdAndDelete(existing._id);
            return res.json({ success: true, message: 'Removed from wishlist', action: 'REMOVED' });
        } else {
            const newItem = new Wishlist({ customerId: customer._id, productId });
            await newItem.save();
            return res.status(201).json({ success: true, message: 'Added to wishlist', action: 'ADDED' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Remove from Wishlist
 */
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const customer = await Customer.findOne({ userId });
        if (!customer) return res.status(403).json({ success: false, error: 'Customer profile required' });

        await Wishlist.findOneAndDelete({ customerId: customer._id, productId });
        res.json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export default {
    getWishlist,
    toggleWishlist,
    removeFromWishlist
};
