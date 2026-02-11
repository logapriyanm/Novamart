import { Dealer, DealerSubscription, SubscriptionPlan } from '../models/index.js';

/**
 * Middleware to require a specific subscription tier
 * Usage: requireSubscription('PRO') or requireSubscription(['PRO', 'ENTERPRISE'])
 */
export const requireSubscription = (allowedTiers) => {
    return async (req, res, next) => {
        try {
            const userId = req.user._id;

            // Get dealer profile
            const dealer = await Dealer.findOne({ userId });
            if (!dealer) {
                return res.status(403).json({
                    success: false,
                    error: 'DEALER_PROFILE_REQUIRED',
                    message: 'This feature requires a dealer profile'
                });
            }

            // Check cached subscription tier
            const now = new Date();
            if (dealer.subscriptionExpiresAt && dealer.subscriptionExpiresAt > now) {
                // Valid cached subscription
                const tiersArray = Array.isArray(allowedTiers) ? allowedTiers : [allowedTiers];

                if (tiersArray.includes(dealer.currentSubscriptionTier)) {
                    req.dealer = dealer;
                    req.subscriptionTier = dealer.currentSubscriptionTier;
                    return next();
                }

                return res.status(403).json({
                    success: false,
                    error: 'SUBSCRIPTION_UPGRADE_REQUIRED',
                    message: `This feature requires ${tiersArray.join(' or ')} subscription`,
                    currentTier: dealer.currentSubscriptionTier,
                    requiredTiers: tiersArray,
                    upgradeUrl: '/dealer/subscription'
                });
            }

            // Cache expired or not set - check database
            const activeSub = await DealerSubscription.findOne({
                dealerId: dealer._id,
                status: 'ACTIVE',
                endDate: { $gt: now }
            }).populate('planId');

            if (!activeSub) {
                return res.status(403).json({
                    success: false,
                    error: 'NO_ACTIVE_SUBSCRIPTION',
                    message: 'This feature requires an active subscription',
                    upgradeUrl: '/dealer/subscription'
                });
            }

            // Update cache
            dealer.currentSubscriptionTier = activeSub.planId.name;
            dealer.subscriptionExpiresAt = activeSub.endDate;
            await dealer.save();

            // Check if tier is allowed
            const tiersArray = Array.isArray(allowedTiers) ? allowedTiers : [allowedTiers];
            if (!tiersArray.includes(activeSub.planId.name)) {
                return res.status(403).json({
                    success: false,
                    error: 'SUBSCRIPTION_UPGRADE_REQUIRED',
                    message: `This feature requires ${tiersArray.join(' or ')} subscription`,
                    currentTier: activeSub.planId.name,
                    requiredTiers: tiersArray,
                    upgradeUrl: '/dealer/subscription'
                });
            }

            req.dealer = dealer;
            req.subscriptionTier = activeSub.planId.name;
            req.subscriptionPlan = activeSub.planId;
            next();
        } catch (error) {
            console.error('Subscription Middleware Error:', error);
            res.status(500).json({
                success: false,
                error: 'SUBSCRIPTION_CHECK_FAILED',
                message: 'Failed to verify subscription'
            });
        }
    };
};

/**
 * Shorthand middleware for PRO or ENTERPRISE
 */
export const requirePROorHigher = requireSubscription(['PRO', 'ENTERPRISE']);

/**
 * Shorthand middleware for ENTERPRISE only
 */
export const requireENTERPRISE = requireSubscription('ENTERPRISE');

/**
 * Middleware to check subscription expiry and auto-expire
 */
export const checkSubscriptionExpiry = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const dealer = await Dealer.findOne({ userId });

        if (!dealer) return next();

        const now = new Date();

        // Check if cached expiry is in the past
        if (dealer.subscriptionExpiresAt && dealer.subscriptionExpiresAt < now) {
            // Reset to BASIC
            dealer.currentSubscriptionTier = 'BASIC';
            dealer.subscriptionExpiresAt = null;
            await dealer.save();

            // Mark subscription as EXPIRED
            await DealerSubscription.updateMany(
                { dealerId: dealer._id, status: 'ACTIVE', endDate: { $lt: now } },
                { $set: { status: 'EXPIRED' } }
            );
        }

        next();
    } catch (error) {
        console.error('Subscription Expiry Check Error:', error);
        next(); // Don't block request on error
    }
};

export default {
    requireSubscription,
    requirePROorHigher,
    requireENTERPRISE,
    checkSubscriptionExpiry
};
