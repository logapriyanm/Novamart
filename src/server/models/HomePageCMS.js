
import mongoose from 'mongoose';

const homePageCMSSchema = new mongoose.Schema({
    sectionKey: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String
    },
    description: {
        type: String
    },
    componentName: {
        type: String, // e.g., 'HeroSection', 'TrendingBar'
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    visibleFor: {
        type: [String],
        enum: ['GUEST', 'CUSTOMER', 'DEALER', 'MANUFACTURER', 'ADMIN'],
        default: ['GUEST', 'CUSTOMER', 'DEALER', 'MANUFACTURER']
    },
    content: {
        type: mongoose.Schema.Types.Mixed, // Flexible JSON for component-specific props
        default: {}
    },
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String],
        altText: String
    },
    schedule: {
        startDate: Date,
        endDate: Date
    },
    metadata: {
        lastUpdatedBy: String,
        lastUpdatedAt: {
            type: Date,
            default: Date.now
        }
    }
}, {
    timestamps: true
});

// Compound index for efficient querying
homePageCMSSchema.index({ isActive: 1, visibleFor: 1, order: 1 });

const HomePageCMS = mongoose.models.HomePageCMS || mongoose.model('HomePageCMS', homePageCMSSchema);

export default HomePageCMS;
