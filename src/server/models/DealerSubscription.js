/**
 * Dealer Subscription Model
 */
import mongoose from 'mongoose';

const dealerSubscriptionSchema = new mongoose.Schema({
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'], default: 'ACTIVE' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true }
});

export default mongoose.model('DealerSubscription', dealerSubscriptionSchema);
