/**
 * Evidence Model
 * Supporting data for disputes.
 */
import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
    disputeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dispute', required: true },
    fileUrl: { type: String, required: true },
    type: { type: String, enum: ['UNBOXING_VIDEO', 'POD', 'INVOICE', 'PHOTO', 'OTHERS'], required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    metadata: {
        gps: { type: String },
        deviceTimestamp: { type: Date },
        uploadAt: { type: Date, default: Date.now }
    }
});

export default mongoose.model('Evidence', evidenceSchema);
