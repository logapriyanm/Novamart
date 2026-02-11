import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    type: { type: String, enum: ['PRODUCT', 'SELLER'], required: true, index: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    // Type specific ratings (Seller)
    deliveryRating: { type: Number, min: 1, max: 5 },
    packagingRating: { type: Number, min: 1, max: 5 },
    communicationRating: { type: Number, min: 1, max: 5 },
    comment: String,
    images: [String],
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING',
        index: true
    },
    moderationReason: String
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
