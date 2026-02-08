import mongoose from 'mongoose';
const { Schema } = mongoose;

/**
 * Fraud Signal Schema: Generated from tracking data or system events.
 */
const FraudSignalSchema = new Schema({
    userId: { type: String, index: true },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' },
    signalType: {
        type: String,
        enum: ['MULTIPLE_FAILED_LOGIN', 'UNUSUAL_IP_SWAP', 'RAPID_ORDER_PLACEMENT', 'FAKE_EVIDENCE_PATTERN'],
        required: true
    },
    details: Schema.Types.Mixed,
    isResolved: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now, index: true }
});

export default mongoose.models.FraudSignal || mongoose.model('FraudSignal', FraudSignalSchema);
