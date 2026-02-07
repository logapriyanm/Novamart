import mongoose from 'mongoose';

const FeatureFlagSchema = new mongoose.Schema({
    feature: { type: String, required: true, unique: true },
    enabled: { type: Boolean, default: false },
    description: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.models.FeatureFlag || mongoose.model('FeatureFlag', FeatureFlagSchema);
