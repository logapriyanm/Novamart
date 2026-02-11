import mongoose from 'mongoose';

const ManufacturerDealerBlockSchema = new mongoose.Schema({
    manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true, index: true },
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', required: true, index: true },
    reason: { type: String },
    isActive: { type: Boolean, default: true },
    blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

ManufacturerDealerBlockSchema.index({ manufacturerId: 1, dealerId: 1 }, { unique: true });

export default mongoose.models.ManufacturerDealerBlock || mongoose.model('ManufacturerDealerBlock', ManufacturerDealerBlockSchema);
