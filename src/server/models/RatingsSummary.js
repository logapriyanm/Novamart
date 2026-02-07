import mongoose from 'mongoose';

const RatingsSummarySchema = new mongoose.Schema({
    entityType: { type: String, enum: ['DEALER', 'PRODUCT'], required: true },
    entityId: { type: String, required: true, index: true },
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

RatingsSummarySchema.index({ entityType: 1, entityId: 1 }, { unique: true });

export default mongoose.models.RatingsSummary || mongoose.model('RatingsSummary', RatingsSummarySchema);
