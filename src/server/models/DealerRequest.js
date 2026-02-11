import mongoose from 'mongoose';

const DealerRequestSchema = new mongoose.Schema({
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', required: true, index: true },
    manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true, index: true },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING',
        index: true
    },
    message: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

DealerRequestSchema.index({ dealerId: 1, manufacturerId: 1 }, { unique: true });

export default mongoose.models.DealerRequest || mongoose.model('DealerRequest', DealerRequestSchema);
