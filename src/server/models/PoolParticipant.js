import mongoose from 'mongoose';

const PoolParticipantSchema = new mongoose.Schema({
    poolId: { type: mongoose.Schema.Types.ObjectId, ref: 'PooledDemand', required: true, index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    quantity: { type: Number, required: true },
    status: { type: String, default: 'COMMITTED' }
}, { timestamps: true });

PoolParticipantSchema.index({ poolId: 1, sellerId: 1 }, { unique: true });

export default mongoose.models.PoolParticipant || mongoose.model('PoolParticipant', PoolParticipantSchema);
