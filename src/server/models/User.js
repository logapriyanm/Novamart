import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String },
    role: {
        type: String,
        enum: ['ADMIN', 'MANUFACTURER', 'DEALER', 'CUSTOMER'],
        required: true,
        index: true
    },
    adminRole: {
        type: String,
        enum: ['SUPER_ADMIN', 'OPS_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN']
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'PENDING', 'UNDER_VERIFICATION', 'SUSPENDED'],
        default: 'PENDING',
        index: true
    },
    mfaEnabled: { type: Boolean, default: false },
    avatar: { type: String },
    dob: { type: Date },
    fcmToken: { type: String },
    refreshToken: { type: String },
    resetPasswordToken: { type: String, unique: true, sparse: true },
    resetPasswordExpires: { type: Date },

    // Onboarding tracking
    onboardingCompleted: { type: Boolean, default: false },
    onboardingSteps: {
        profileCompleted: { type: Boolean, default: false },
        firstActionTaken: { type: Boolean, default: false },
        featuresExplored: { type: Boolean, default: false },
        verificationCompleted: { type: Boolean, default: false }
    },
    onboardingDismissed: { type: Boolean, default: false },
    loginCount: { type: Number, default: 0 },
    interests: [{
        category: String,
        weight: { type: Number, default: 0 },
        isExplicit: { type: Boolean, default: false }
    }],
    badges: [{
        badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
        earnedAt: { type: Date, default: Date.now }
    }],
    lastLogin: { type: Date }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for Customer Profile
UserSchema.virtual('customer', {
    ref: 'Customer',
    localField: '_id',
    foreignField: 'userId',
    justOne: true
});

// Virtual for Dealer Profile
UserSchema.virtual('dealer', {
    ref: 'Dealer',
    localField: '_id',
    foreignField: 'userId',
    justOne: true
});

// Virtual for Manufacturer Profile
UserSchema.virtual('manufacturer', {
    ref: 'Manufacturer',
    localField: '_id',
    foreignField: 'userId',
    justOne: true
});

UserSchema.index({ role: 1, status: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);
