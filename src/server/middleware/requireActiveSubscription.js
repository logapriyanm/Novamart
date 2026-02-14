/**
 * Middleware: Require Active Subscription
 * Enforces active subscription for collaboration group features (Phase 5).
 */

import Seller from '../models/Seller.js';
import logger from '../lib/logger.js';

export const requireActiveSubscription = async (req, res, next) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'UNAUTHORIZED'
            });
        }

        const seller = await Seller.findOne({ userId });

        if (!seller) {
            return res.status(404).json({
                success: false,
                error: 'SELLER_PROFILE_NOT_FOUND'
            });
        }

        // Check subscription status using virtual field
        const hasActiveSubscription = seller.subscriptionExpiresAt && seller.subscriptionExpiresAt > new Date();

        if (!hasActiveSubscription) {
            logger.warn(`Blocked non-subscribed seller: ${seller.businessName}, expires: ${seller.subscriptionExpiresAt}`);
            return res.status(403).json({
                success: false,
                error: 'SUBSCRIPTION_REQUIRED',
                message: 'Collaboration groups require an active subscription. Please upgrade your plan to access this feature.',
                currentTier: seller.currentSubscriptionTier || 'BASIC',
                expiresAt: seller.subscriptionExpiresAt,
                upgradeUrl: '/seller/subscription'
            });
        }

        // Attach seller to request
        req.seller = seller;

        next();
    } catch (error) {
        logger.error('requireActiveSubscription middleware error:', error);
        res.status(500).json({
            success: false,
            error: 'SUBSCRIPTION_CHECK_FAILED'
        });
    }
};

export default requireActiveSubscription;
