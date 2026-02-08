import mongoose from 'mongoose';
const { Schema } = mongoose;

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

export default mongoose.models.DemandHeatmap || mongoose.model('DemandHeatmap', DemandHeatmapSchema);
