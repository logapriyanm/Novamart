import mongoose from 'mongoose';

const EscrowSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
    status: {
        type: String,
        enum: ['HOLD', 'FROZEN', 'RELEASED', 'REFUNDED'],
        default: 'HOLD',
        index: true
    },
    // Financial fields — IMMUTABLE LEDGER
    amount: { type: Number, required: true },
    grossAmount: { type: Number, required: true }, // Total paid by customer
    commissionAmount: { type: Number, required: true }, // Platform fee (5%)
    sellerAmount: { type: Number, required: true }, // Net seller payout
    platformFee: { type: Number }, // Legacy alias for commissionAmount

    // Settlement tracking
    settlementWindowEndsAt: { type: Date }, // T+7 from delivery
    releasedAt: { type: Date },
    refundedAt: { type: Date },

    // Dispute linkage
    disputeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dispute' },
    releaseCondition: { type: String, default: 'DELIVERY_CONFIRMED' }
}, { timestamps: true });

export default mongoose.models.Escrow || mongoose.model('Escrow', EscrowSchema);
