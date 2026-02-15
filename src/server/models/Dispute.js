import mongoose from 'mongoose';

const DisputeSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
    raisedBy: { type: String, enum: ['CUSTOMER', 'SELLER', 'MANUFACTURER'], required: true },
    status: {
        type: String,
        enum: ['OPEN', 'UNDER_REVIEW', 'EVIDENCE_COLLECTION', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        default: 'OPEN'
    },
    assignedAdmin: String, // adminId
    logs: [{
        action: { type: String, required: true },
        by: { type: String, required: true }, // adminId or userId
        at: { type: Date, default: Date.now }
    }],
    resolutionMetadata: {
        resolution: { type: String, enum: ['RELEASE', 'REFUND', 'PARTIAL_REFUND'] },
        reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        adminNotes: { type: String },
        compensationAmount: { type: Number }
    }
}, { timestamps: true });

// Legal record rule: NEVER delete (Enforced at service layer)
DisputeSchema.index({ status: 1 });

export default mongoose.models.Dispute || mongoose.model('Dispute', DisputeSchema);
