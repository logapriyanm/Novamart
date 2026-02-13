import mongoose from 'mongoose';

const ManufacturerSellerBlockSchema = new mongoose.Schema({
    manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true, index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    reason: String,
    metadata: { type: mongoose.Schema.Types.Mixed },
    blockedAt: { type: Date, default: Date.now }
}, { timestamps: true });

ManufacturerSellerBlockSchema.index({ manufacturerId: 1, sellerId: 1 }, { unique: true });

export default mongoose.models.ManufacturerSellerBlock || mongoose.model('ManufacturerSellerBlock', ManufacturerSellerBlockSchema);
