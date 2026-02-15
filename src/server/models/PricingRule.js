import mongoose from 'mongoose';

const PricingRuleSchema = new mongoose.Schema({
    manufacturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    // Optional targeting
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },

    // Rule Logic
    type: {
        type: String,
        enum: ['BULK', 'PROMOTIONAL', 'EXCLUSIVE'],
        default: 'BULK'
    },
    minQuantity: {
        type: Number,
        default: 1
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },

    // Validity
    validFrom: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

// Index for efficient lookup during price calculation
PricingRuleSchema.index({ manufacturerId: 1, type: 1, isActive: 1 });
PricingRuleSchema.index({ productId: 1, isActive: 1 });

export default mongoose.models.PricingRule || mongoose.model('PricingRule', PricingRuleSchema);
