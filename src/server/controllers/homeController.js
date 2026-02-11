/**
 * Home Controller
 * Manages personalized home page data.
 */

import recommendationService from '../services/recommendation.js';
import logger from '../lib/logger.js';
import behaviorService from '../services/behaviorService.js';
import { Product } from '../models/index.js';

/**
 * Get Personalized Home Data
 */
export const getPersonalizedHome = async (req, res) => {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
        return res.status(401).json({
            success: false,
            error: 'UNAUTHORIZED'
        });
    }

    try {
        const personalizedData = await recommendationService.getPersonalizedHomepage(userId);

        res.json({
            success: true,
            data: {
                ...personalizedData
            }
        });
    } catch (error) {
        logger.error('Failed to get personalized home:', error);
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_HOME' });
    }
};

/**
 * Get Guest Home Data (no auth required)
 */
export const getGuestHome = async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isApproved: true })
            .populate('manufacturerId', 'companyName')
            .limit(8)
            .sort({ createdAt: -1 });

        // Map to match expected frontend structure if necessary, or update service
        res.json({
            success: true,
            data: {
                featured: featuredProducts,
                trending: featuredProducts.slice(0, 4)
            }
        });
    } catch (error) {
        logger.error('Failed to get guest home:', error);
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_HOME' });
    }
};

/**
 * Track user event (frontend beacon)
 */
export const trackUserEvent = async (req, res) => {
    const userId = req.user?._id;
    const { type, targetId, metadata } = req.body;

    if (!userId || !type) {
        return res.status(400).json({ success: false, error: 'INVALID_REQUEST' });
    }

    try {
        await behaviorService.trackEvent(userId, type, targetId, metadata);
        res.json({ success: true, message: 'Event recorded' });
    } catch (error) {
        console.error('Track Event Error:', error);
        res.status(500).json({ success: false, error: 'TRACKING_FAILED' });
    }
};

export default {
    getPersonalizedHome,
    getGuestHome,
    trackUserEvent
};
