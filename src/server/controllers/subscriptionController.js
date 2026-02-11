import { SubscriptionPlan, Dealer, DealerSubscription } from '../models/index.js';
import mongoose from 'mongoose';

// --- PLANS ---

export const getPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find().sort({ rank: 1 });
        res.json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch plans' });
    }
};

export const seedPlans = async (req, res) => {
    try {
        const plans = [
            {
                name: 'BASIC', price: 0, duration: 365, margin: 5, rank: 1,
                features: ['Access to basic catalog', 'Standard Support'],
                wholesaleDiscount: 0, marginBoost: 0, priorityAllocation: false,
                allowCustomRequests: false, allowCollaboration: false, maxGroupSize: 0, customOrderPriority: 0
            },
            {
                name: 'PRO', price: 4999, duration: 365, margin: 15, rank: 2,
                features: ['Priority Support', '5% Wholesale Discount', 'Verified Badge', '5% Margin Boost', 'Individual Custom Requests'],
                wholesaleDiscount: 5, marginBoost: 5, priorityAllocation: true,
                allowCustomRequests: true, allowCollaboration: false, maxGroupSize: 0, customOrderPriority: 1
            },
            {
                name: 'ENTERPRISE', price: 14999, duration: 365, margin: 25, rank: 3,
                features: ['Dedicated Manager', '10% Wholesale Discount', 'Priority Stock Access', '10% Margin Boost', 'Collaboration Groups', 'Bulk Custom Manufacturing'],
                wholesaleDiscount: 10, marginBoost: 10, priorityAllocation: true,
                allowCustomRequests: true, allowCollaboration: true, maxGroupSize: 0, customOrderPriority: 2
            }
        ];

        for (const plan of plans) {
            await SubscriptionPlan.findOneAndUpdate(
                { name: plan.name },
                { $set: plan },
                { upsert: true, new: true }
            );
        }
        res.json({ success: true, message: 'Plans seeded and synchronized' });
    } catch (error) {
        res.status(500).json({ message: 'Seeding failed', error: error.message });
    }
};

// --- DEALER SUBSCRIPTIONS ---

export const subscribeToPlan = async (req, res) => {
    try {
        const userId = req.user._id;
        const { planId } = req.body;

        const dealer = await Dealer.findOne({ userId });
        if (!dealer) return res.status(404).json({ message: 'Dealer profile not found' });

        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.duration);

        await DealerSubscription.updateMany(
            { dealerId: dealer._id, status: 'ACTIVE' },
            { $set: { status: 'CANCELLED' } }
        );

        const subscription = await DealerSubscription.create({
            dealerId: dealer._id,
            planId: plan._id,
            endDate,
            status: 'ACTIVE'
        });

        // Update dealer's cached subscription tier
        dealer.currentSubscriptionTier = plan.name;
        dealer.subscriptionExpiresAt = endDate;
        await dealer.save();

        res.status(201).json({ success: true, data: subscription });
    } catch (error) {
        console.error('Subscribe Error:', error);
        res.status(500).json({ message: 'Subscription failed' });
    }
};

export const getMySubscription = async (req, res) => {
    try {
        const userId = req.user._id;
        const dealer = await Dealer.findOne({ userId });

        if (!dealer) return res.status(404).json({ message: 'Dealer not found' });

        const activeSub = await DealerSubscription.findOne({
            dealerId: dealer._id,
            status: 'ACTIVE'
        }).populate('planId').sort({ endDate: -1 });

        res.json({ success: true, data: activeSub });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subscription' });
    }
};

export const cancelSubscription = async (req, res) => {
    try {
        const userId = req.user._id;
        const dealer = await Dealer.findOne({ userId });
        if (!dealer) return res.status(404).json({ message: 'Dealer not found' });

        await DealerSubscription.updateMany(
            { dealerId: dealer._id, status: 'ACTIVE' },
            { $set: { status: 'CANCELLED' } }
        );

        res.json({ success: true, message: 'Subscription cancelled' });
    } catch (error) {
        res.status(500).json({ message: 'Cancellation failed' });
    }
};

/**
 * Get subscription features for current tier
 */
export const getSubscriptionFeatures = async (req, res) => {
    try {
        const userId = req.user._id;
        const dealer = await Dealer.findOne({ userId });

        if (!dealer) {
            return res.status(404).json({ message: 'Dealer not found' });
        }

        const activeSub = await DealerSubscription.findOne({
            dealerId: dealer._id,
            status: 'ACTIVE',
            endDate: { $gt: new Date() }
        }).populate('planId');

        if (!activeSub) {
            // Return BASIC features
            const basicPlan = await SubscriptionPlan.findOne({ name: 'BASIC' });
            return res.json({
                success: true,
                data: {
                    tier: 'BASIC',
                    features: basicPlan?.features || [],
                    allowCustomRequests: false,
                    allowCollaboration: false
                }
            });
        }

        res.json({
            success: true,
            data: {
                tier: activeSub.planId.name,
                features: activeSub.planId.features,
                allowCustomRequests: activeSub.planId.allowCustomRequests,
                allowCollaboration: activeSub.planId.allowCollaboration,
                maxGroupSize: activeSub.planId.maxGroupSize,
                expiresAt: activeSub.endDate
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subscription features' });
    }
};

export default {
    getPlans,
    seedPlans,
    subscribeToPlan,
    getMySubscription,
    cancelSubscription,
    getSubscriptionFeatures
};
