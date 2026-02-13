import mongoose from 'mongoose';

const CustomOrderEscrowSchema = new mongoose.Schema({
    customRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomProductRequest', required: true, unique: true, index: true },
    manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true, index: true },

    // Total amount and breakdown
    totalAmount: { type: Number, required: true, min: 0 },
    advancePercentage: { type: Number, required: true, default: 30, min: 0, max: 100 },
    advanceAmount: { type: Number, required: true },
    balanceAmount: { type: Number, required: true },

    // Payment tracking
    advancePaid: { type: Number, default: 0 },
    balancePaid: { type: Number, default: 0 },

    // Status
    status: {
        type: String,
        enum: ['CREATED', 'ADVANCE_PENDING', 'ADVANCE_PAID', 'BALANCE_PENDING', 'BALANCE_PAID', 'RELEASED', 'REFUNDED'],
        default: 'CREATED',
        index: true
    },

    // Payment splits for group orders
    participantPayments: [{
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        shareAmount: { type: Number, required: true },
        advanceShare: { type: Number, required: true },
        balanceShare: { type: Number, required: true },
        advancePaid: { type: Boolean, default: false },
        balancePaid: { type: Boolean, default: false },
        advancePaidAt: Date,
        balancePaidAt: Date,
        paymentTransactionIds: [String]
    }],

    // Release tracking
    releasedToManufacturer: { type: Boolean, default: false },
    releasedAt: { type: Date },
    releasedAmount: { type: Number, default: 0 },

    // Refund tracking
    refundReason: String,
    refundedAt: Date,

    metadata: { type: mongoose.Schema.Types.Mixed }
}, {
    timestamps: true
});

// Indexes for efficient queries
CustomOrderEscrowSchema.index({ manufacturerId: 1, status: 1 });
CustomOrderEscrowSchema.index({ 'participantPayments.sellerId': 1 });

export default mongoose.models.CustomOrderEscrow || mongoose.model('CustomOrderEscrow', CustomOrderEscrowSchema);
