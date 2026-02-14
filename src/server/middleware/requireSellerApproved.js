/**
 * Middleware: Require Seller Approved
 * Blocks PENDING sellers from accessing dashboard routes.
 */

import User from '../models/User.js';
import logger from '../lib/logger.js';

export const requireSellerApproved = async (req, res, next) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'UNAUTHORIZED',
                message: 'Authentication required'
            });
        }

        const user = await User.findById(userId).populate('seller');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'USER_NOT_FOUND'
            });
        }

        // Check user account status
        if (user.status !== 'ACTIVE') {
            logger.warn(`Blocked dashboard access for non-active seller: ${user.email}, status: ${user.status}`);
            return res.status(403).json({
                success: false,
                error: 'ACCOUNT_PENDING_APPROVAL',
                message: 'Your account is pending admin approval. You will be notified once approved.',
                status: user.status
            });
        }

        // Additional seller-specific check
        if (user.role === 'SELLER' && user.seller) {
            // Future: Can add more seller-specific validations here
        }

        // IMPORTANT: Refresh req.user with the populated version
        req.user = user;

        next();
    } catch (error) {
        logger.error('requireSellerApproved middleware error:', error);
        res.status(500).json({
            success: false,
            error: 'AUTHORIZATION_CHECK_FAILED',
            message: 'Failed to verify account status'
        });
    }
};

export default requireSellerApproved;
