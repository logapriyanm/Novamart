import mongoose from 'mongoose';

const DisputeSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true, index: true },
    raisedBy: { type: String, enum: ['CUSTOMER', 'DEALER', 'MANUFACTURER'], required: true },
    status: {
        type: String,
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
        default: 'OPEN'
    },
    assignedAdmin: String, // adminId
    logs: [{
        action: { type: String, required: true },
        by: { type: String, required: true }, // adminId or userId
        at: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Legal record rule: NEVER delete (Enforced at service layer)
DisputeSchema.index({ status: 1 });

export default mongoose.models.Dispute || mongoose.model('Dispute', DisputeSchema);
