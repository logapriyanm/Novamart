import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true }
}, { timestamps: true });

// Ensure a customer can only have a product once in their wishlist
WishlistSchema.index({ customerId: 1, productId: 1 }, { unique: true });

export default mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);
