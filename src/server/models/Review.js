import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductMaster', required: true, index: true },
    dealerId: { type: String, required: true, index: true },
    customerId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    approved: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
