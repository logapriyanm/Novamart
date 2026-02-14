/**
 * Middleware: Require Verified Seller
 * Enforces verification status = VERIFIED for sensitive operations like group collaboration.
 */

import Seller from '../models/Seller.js';
import logger from '../lib/logger.js';

export const requireVerifiedSeller = async (req, res, next) => {
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
                error: 'SELLER_PROFILE_NOT_FOUND',
                message: 'Seller profile not found'
            });
        }

        // Check verification status
        if (seller.verificationStatus !== 'VERIFIED') {
            logger.warn(`Blocked unverified seller: ${seller.businessName}, status: ${seller.verificationStatus}`);
            return res.status(403).json({
                success: false,
                error: 'VERIFICATION_REQUIRED',
                message: 'This feature requires a verified seller account. Please upload your business documents for verification.',
                currentStatus: seller.verificationStatus,
                verificationStatus: seller.verificationStatus
            });
        }

        // Attach seller to request for downstream use
        req.seller = seller;

        next();
    } catch (error) {
        logger.error('requireVerifiedSeller middleware error:', error);
        res.status(500).json({
            success: false,
            error: 'VERIFICATION_CHECK_FAILED'
        });
    }
};

export default requireVerifiedSeller;
