/**
 * Home Controller
 * Manages personalized home page data.
 */

import recommendationService from '../services/recommendation.js';
import trackingService from '../services/tracking.js';
import prisma from '../lib/prisma.js';
import logger from '../lib/logger.js';

/**
 * Get Personalized Home Data
 */
export const getPersonalizedHome = async (req, res) => {
    // req.user is populated by authMiddleware
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
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
        // Return featured/trending products for guest users
        const featuredProducts = await prisma.product.findMany({
            where: {
                status: 'APPROVED'
            },
            include: {
                manufacturer: {
                    select: {
                        companyName: true,
                        id: true
                    }
                },
                inventory: {
                    select: {
                        price: true,
                        stock: true,
                        dealerId: true
                    },
                    take: 1
                }
            },
            take: 8,
            orderBy: {
                createdAt: 'desc'
            }
        });

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
    const userId = req.user?.id;
    const { type, targetId, metadata } = req.body;

    if (!userId || !type) {
        return res.status(400).json({ success: false, error: 'INVALID_REQUEST' });
    }

    try {
        // Fire and forget (don't wait for await if high volume, but here we await for safety)
        await trackingService.trackEvent(userId, type, targetId, metadata);
        res.json({ success: true, message: 'Event recorded' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'TRACKING_FAILED' });
    }
};

export default {
    getPersonalizedHome,
    getGuestHome,
    trackUserEvent
};
