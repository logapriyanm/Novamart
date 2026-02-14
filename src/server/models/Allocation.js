import mongoose from 'mongoose';

/**
 * Allocation Model
 * Tracks manufacturer-to-seller stock allocations from individual or group negotiations.
 * Maintains inventory formula: allocated - sold = remaining
 */
const AllocationSchema = new mongoose.Schema({
    // Source tracking
    negotiationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Negotiation',
        index: true
    },
    type: {
        type: String,
        enum: ['INDIVIDUAL', 'GROUP', 'DIRECT'],
        required: true,
        default: 'INDIVIDUAL'
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CollaborationGroup',
        index: true
    },

    // Participants
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,
        index: true
    },
    manufacturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manufacturer',
        required: true,
        index: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    },

    // Quantity tracking (CRITICAL for inventory management)
    allocatedQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    soldQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    remainingQuantity: {
        type: Number,
        required: true,
        min: 0
    },

    // Pricing
    negotiatedPrice: {
        type: Number,
        required: true,
        min: 0
    },
    minRetailPrice: {
        type: Number,
        required: true // Computed as negotiatedPrice * 1.05
    },

    // Status
    status: {
        type: String,
        enum: ['ACTIVE', 'DEPLETED', 'REVOKED'],
        default: 'ACTIVE',
        index: true
    },

    // Metadata
    region: { type: String },
    notes: { type: String },
    revokedAt: { type: Date },
    revokedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    revokeReason: { type: String }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Pre-save hook: Calculate minRetailPrice
AllocationSchema.pre('save', async function () {
    if (this.isModified('negotiatedPrice')) {
        this.minRetailPrice = this.negotiatedPrice * 1.05; // 5% commission
    }
});

// Prevent negative remaining quantity
AllocationSchema.pre('save', async function () {
    if (this.soldQuantity > this.allocatedQuantity) {
        throw new Error('OVERSELLING_DETECTED: soldQuantity cannot exceed allocatedQuantity');
    }
    this.remainingQuantity = this.allocatedQuantity - this.soldQuantity;
});

// Auto-mark as DEPLETED when remaining = 0
AllocationSchema.pre('save', async function () {
    if (this.remainingQuantity === 0 && this.status === 'ACTIVE') {
        this.status = 'DEPLETED';
    }
});

// Indexes for performance
AllocationSchema.index({ sellerId: 1, status: 1, remainingQuantity: 1 });
AllocationSchema.index({ productId: 1, sellerId: 1 });
AllocationSchema.index({ manufacturerId: 1, status: 1 });
AllocationSchema.index({ groupId: 1, sellerId: 1 });

// V-004: Prevent duplicate allocations for the same negotiation + seller
AllocationSchema.index(
    { negotiationId: 1, sellerId: 1 },
    { unique: true, partialFilterExpression: { negotiationId: { $exists: true, $ne: null } } }
);

export default mongoose.models.Allocation || mongoose.model('Allocation', AllocationSchema);
