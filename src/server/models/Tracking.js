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
        sellerId: String,
        device: String,
        browser: String,
        ip: String,
        referrer: String
    },
    timestamp: { type: Date, default: Date.now, index: true }
}, { shardKey: { timestamp: 1 } });

const Tracking = mongoose.model('Tracking', TrackingSchema);
export default Tracking;
