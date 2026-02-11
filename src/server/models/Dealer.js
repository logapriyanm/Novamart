import mongoose from 'mongoose';

const DealerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    businessName: { type: String, required: true },
    ownerName: { type: String },
    businessType: { type: String },
    contactEmail: { type: String },
    phone: { type: String },
    gstNumber: { type: String, required: true, unique: true },
    gstCertificate: { type: String },
    businessRegDoc: { type: String },
    businessAddress: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    serviceRegions: [String],
    bankDetails: { type: mongoose.Schema.Types.Mixed, required: true },
    payoutBlocked: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    approvedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer' }],

    // Subscription tier caching (for performance)
    currentSubscriptionTier: { type: String, enum: ['BASIC', 'PRO', 'ENTERPRISE'], default: 'BASIC' },
    subscriptionExpiresAt: { type: Date }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for active subscription check
DealerSchema.virtual('hasActiveSubscription').get(function () {
    return this.subscriptionExpiresAt && this.subscriptionExpiresAt > new Date();
});

export default mongoose.models.Dealer || mongoose.model('Dealer', DealerSchema);
