import mongoose from 'mongoose';

/**
 * GroupContribution Model
 * Tracks individual seller financial contributions in collaboration group negotiations
 */
const GroupContributionSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CollaborationGroup',
        required: true,
        index: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
        index: true
    },
    negotiationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Negotiation',
        index: true
    },

    // Contribution details
    requestedQuantity: {
        type: Number,
        required: true,
        min: 1
    },
    contributionAmount: {
        type: Number,
        required: true,
        min: 0
    },

    // Payment tracking
    paid: {
        type: Boolean,
        default: false
    },
    paidAt: { type: Date },
    paymentMethod: { type: String },

    // Escrow
    escrowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Escrow'
    },

    // Status
    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'REFUNDED', 'ALLOCATED'],
        default: 'PENDING',
        index: true
    },

    refundedAt: { type: Date },
    refundReason: { type: String }
}, {
    timestamps: true
});

// Unique constraint: One contribution per seller per group
GroupContributionSchema.index({ groupId: 1, sellerId: 1 }, { unique: true });

// Compound indexes
GroupContributionSchema.index({ groupId: 1, status: 1 });
GroupContributionSchema.index({ sellerId: 1, paid: 1 });

export default mongoose.models.GroupContribution || mongoose.model('GroupContribution', GroupContributionSchema);
