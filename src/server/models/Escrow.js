import mongoose from 'mongoose';

const EscrowSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
    status: {
        type: String,
        enum: ['HOLD', 'FROZEN', 'RELEASED', 'REFUNDED'],
        default: 'HOLD',
        index: true
    },
    amount: { type: Number, required: true },
    releasedAt: { type: Date },
    dealerAmount: { type: Number },
    platformFee: { type: Number },
    disputeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dispute' },
    releaseCondition: { type: String, default: 'DELIVERY_CONFIRMED' }
}, { timestamps: true });

export default mongoose.models.Escrow || mongoose.model('Escrow', EscrowSchema);
