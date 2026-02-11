/**
 * Subscription Plan Model
 * B2B benefits for dealers.
 */
import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // in days
    wholesaleDiscount: { type: Number, default: 0 }, // Percentage
    marginBoost: { type: Number, default: 0 }, // Extra margin allowed
    features: [String],
    isActive: { type: Boolean, default: true },

    // Collaboration-specific features
    allowCustomRequests: { type: Boolean, default: false }, // PRO and ENTERPRISE
    allowCollaboration: { type: Boolean, default: false }, // ENTERPRISE only
    maxGroupSize: { type: Number, default: 0 }, // Maximum dealers per group (0 = unlimited for ENTERPRISE)
    customOrderPriority: { type: Number, default: 0 } // Higher priority for ENTERPRISE
});

export default mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

