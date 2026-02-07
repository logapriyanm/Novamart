import mongoose from 'mongoose';

const AnalyticsSnapshotSchema = new mongoose.Schema({
    type: { type: String, enum: ['DAILY', 'WEEKLY', 'MONTHLY'], required: true },
    metric: { type: String, required: true }, // e.g., 'TOP_PRODUCTS', 'USER_GROWTH'
    data: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

// Read-only logic usually enforced at application layer, but timestamps are auto-managed.

export default mongoose.models.AnalyticsSnapshot || mongoose.model('AnalyticsSnapshot', AnalyticsSnapshotSchema);
