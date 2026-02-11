import mongoose from 'mongoose';

const PooledDemandSchema = new mongoose.Schema({
    manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    targetQuantity: { type: Number, required: true },
    currentQuantity: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['OPEN', 'LOCKED', 'FULFILLED', 'EXPIRED', 'CANCELLED'],
        default: 'OPEN',
        index: true
    },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.models.PooledDemand || mongoose.model('PooledDemand', PooledDemandSchema);
