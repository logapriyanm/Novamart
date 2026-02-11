import mongoose from 'mongoose';

const CollaborationGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', required: true, index: true },
    category: { type: String, required: true },
    targetQuantity: { type: Number, required: true },
    currentQuantity: { type: Number, default: 0 },
    requiredDeliveryDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['CREATED', 'ACTIVE', 'LOCKED', 'COMPLETED', 'CANCELLED'],
        default: 'CREATED',
        index: true
    },
    customRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomProductRequest' },
    metadata: { type: mongoose.Schema.Types.Mixed }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for participants
CollaborationGroupSchema.virtual('participants', {
    ref: 'GroupParticipant',
    localField: '_id',
    foreignField: 'groupId'
});

// Index for efficient queries
CollaborationGroupSchema.index({ creatorId: 1, status: 1 });
CollaborationGroupSchema.index({ category: 1, status: 1 });

export default mongoose.models.CollaborationGroup || mongoose.model('CollaborationGroup', CollaborationGroupSchema);
