import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    type: { type: String, enum: ['PRODUCT', 'SELLER'], required: true, index: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 100 },
    verifiedPurchase: { type: Boolean, default: true },

    // Detailed Seller Ratings
    deliveryRating: { type: Number, min: 1, max: 5 },
    packagingRating: { type: Number, min: 1, max: 5 },
    communicationRating: { type: Number, min: 1, max: 5 },

    comment: { type: String, maxlength: 1000 },
    pros: [String],
    cons: [String],
    images: [String],

    votes: {
        up: { type: Number, default: 0 },
        down: { type: Number, default: 0 }
    },

    reports: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: String,
        createdAt: { type: Date, default: Date.now }
    }],

    sellerReply: {
        text: { type: String, maxlength: 1000 },
        createdAt: { type: Date }
    },

    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED'],
        default: 'PENDING',
        index: true
    },
    moderationReason: String
}, { timestamps: true });

// Compound index to prevent duplicate reviews per order item
ReviewSchema.index({ orderId: 1, productId: 1, type: 1 }, { unique: true });
ReviewSchema.index({ orderId: 1, sellerId: 1, type: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
