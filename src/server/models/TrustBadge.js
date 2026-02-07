import mongoose from 'mongoose';

const TrustBadgeSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    badge: { type: String, required: true }, // e.g., VERIFIED_SELLER, PREMIUM_MFR
    issuedBy: { type: String, required: true }, // adminId
    issuedAt: { type: Date, default: Date.now },
    revoked: { type: Boolean, default: false }
}, { timestamps: true });

TrustBadgeSchema.index({ userId: 1, badge: 1 }, { unique: true });

export default mongoose.models.TrustBadge || mongoose.model('TrustBadge', TrustBadgeSchema);
