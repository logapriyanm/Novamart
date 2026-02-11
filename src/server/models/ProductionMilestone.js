import mongoose from 'mongoose';

const ProductionMilestoneSchema = new mongoose.Schema({
    customRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomProductRequest', required: true, index: true },
    milestoneType: {
        type: String,
        enum: ['DESIGN_APPROVED', 'PRODUCTION_STARTED', 'QUALITY_CHECK', 'READY_TO_DISPATCH', 'DISPATCHED'],
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
        default: 'PENDING'
    },
    completedAt: { type: Date },
    notes: { type: String },
    attachments: [String], // URLs to images/documents
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

// Index for efficient queries
ProductionMilestoneSchema.index({ customRequestId: 1, milestoneType: 1 });
ProductionMilestoneSchema.index({ customRequestId: 1, createdAt: 1 });

export default mongoose.models.ProductionMilestone || mongoose.model('ProductionMilestone', ProductionMilestoneSchema);
