import mongoose from 'mongoose';

const SellerRequestSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false, index: true }, // Optional for general partnership requests
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING',
        index: true
    },
    message: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

// Compound index to prevent duplicate requests for the same product (or general partnership if productId is null)
SellerRequestSchema.index({ sellerId: 1, manufacturerId: 1, productId: 1 }, { unique: true });

export default mongoose.models.SellerRequest || mongoose.model('SellerRequest', SellerRequestSchema);
