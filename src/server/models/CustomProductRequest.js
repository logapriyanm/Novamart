import mongoose from 'mongoose';

const CustomProductRequestSchema = new mongoose.Schema({
    // Request source (either individual dealer or collaboration group)
    requestType: {
        type: String,
        enum: ['INDIVIDUAL', 'GROUP'],
        required: true
    },
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', index: true },
    collaborationGroupId: { type: mongoose.Schema.Types.ObjectId, ref: 'CollaborationGroup', index: true },

    // Manufacturer
    manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true, index: true },

    // Product specifications
    productCategory: { type: String, required: true },
    productName: { type: String, required: true },
    customSpecifications: { type: mongoose.Schema.Types.Mixed, required: true },
    brandingRequirements: {
        logoUrl: String,
        colors: [String],
        customText: String
    },
    packagingPreferences: { type: String },

    // Quantity and pricing
    totalQuantity: { type: Number, required: true, min: 1 },
    expectedPriceRange: {
        min: Number,
        max: Number
    },

    // Timeline
    requiredDeliveryDate: { type: Date, required: true },

    // Status tracking
    status: {
        type: String,
        enum: ['REQUESTED', 'NEGOTIATING', 'APPROVED', 'IN_PRODUCTION', 'COMPLETED', 'REJECTED', 'CANCELLED'],
        default: 'REQUESTED',
        index: true
    },

    // Manufacturer response
    manufacturerResponse: {
        respondedAt: Date,
        accepted: Boolean,
        proposedPrice: Number,
        proposedDeliveryDate: Date,
        counterOffer: String,
        rejectionReason: String
    },

    // Subscription tier indicator
    subscriptionTier: {
        type: String,
        enum: ['PRO', 'ENTERPRISE'],
        required: true
    },

    // Additional metadata
    notes: String,
    metadata: { type: mongoose.Schema.Types.Mixed }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for milestones
CustomProductRequestSchema.virtual('milestones', {
    ref: 'ProductionMilestone',
    localField: '_id',
    foreignField: 'customRequestId'
});

// Virtual for escrow
CustomProductRequestSchema.virtual('escrow', {
    ref: 'CustomOrderEscrow',
    localField: '_id',
    foreignField: 'customRequestId',
    justOne: true
});

// Indexes for efficient queries
CustomProductRequestSchema.index({ manufacturerId: 1, status: 1 });
CustomProductRequestSchema.index({ dealerId: 1, status: 1 });

CustomProductRequestSchema.index({ createdAt: -1 });

export default mongoose.models.CustomProductRequest || mongoose.model('CustomProductRequest', CustomProductRequestSchema);
