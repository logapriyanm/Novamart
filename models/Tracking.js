import mongoose from 'mongoose';
const { Schema } = mongoose;

/**
 * Tracking Schema: Captures silent user behavior.
 * Optimized for high-write throughput.
 */
const TrackingSchema = new Schema({
    userId: { type: String, index: true }, // Ties to PostgreSQL User.id
    role: { type: String, index: true },
    sessionId: { type: String, index: true },
    eventType: {
        type: String,
        enum: ['PAGE_VIEW', 'SEARCH', 'CLICK', 'CART_ADD', 'CART_REMOVE', 'WISHLIST'],
        required: true,
        index: true
    },
    url: String,
    metadata: {
        productId: { type: String, index: true },
        query: String, // Search terms
        category: String,
        dealerId: String,
        device: String,
        browser: String,
        ip: String,
        referrer: String
    },
    timestamp: { type: Date, default: Date.now, index: true }
}, { shardKey: { timestamp: 1 } });

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

/**
 * Demand Heatmap Table (Aggregated from Tracking)
 */
const DemandHeatmapSchema = new Schema({
    region: { type: String, index: true },
    categoryId: String,
    productName: String,
    viewCount: { type: Number, default: 0 },
    searchCount: { type: Number, default: 0 },
    date: { type: Date, index: true }
});

export const Tracking = mongoose.model('Tracking', TrackingSchema);
export const FraudSignal = mongoose.model('FraudSignal', FraudSignalSchema);
export const DemandHeatmap = mongoose.model('DemandHeatmap', DemandHeatmapSchema);
