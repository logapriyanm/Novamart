/**
 * Tracking Service
 * Records user interactions for personalization.
 */

import prisma from '../lib/prisma.js';

class TrackingService {
    /**
     * Record a user event.
     * @param {string} userId - ID of the user
     * @param {string} type - VIEW_PRODUCT, SEARCH, VIEW_CATEGORY, ADD_TO_CART
     * @param {string} targetId - Product ID or Category Name
     * @param {object} metadata - Additional info (e.g. search query)
     */
    async trackEvent(userId, type, targetId, metadata = {}) {
        try {
            return await prisma.userBehavior.create({
                data: {
                    userId,
                    type,
                    targetId,
                    metadata
                }
            });
        } catch (error) {
            console.error('Failed to track event:', error);
            // Non-blocking error
            return null;
        }
    }

    /**
     * Get recent product views.
     */
    async getRecentViews(userId, limit = 5) {
        const views = await prisma.userBehavior.findMany({
            where: {
                userId,
                type: 'VIEW_PRODUCT'
            },
            orderBy: { createdAt: 'desc' },
            take: limit * 2 // Fetch more to deduplicate
        });

        // Deduplicate locally
        const uniqueIds = new Set();
        const uniqueViews = [];

        for (const view of views) {
            if (!uniqueIds.has(view.targetId)) {
                uniqueIds.add(view.targetId);
                uniqueViews.push(view);
                if (uniqueViews.length >= limit) break;
            }
        }

        return uniqueViews;
    }

    /**
     * Calculate top categories based on recent behavior.
     */
    async getTopCategories(userId) {
        // Fetch last 50 relevant actions
        const actions = await prisma.userBehavior.findMany({
            where: {
                userId,
                type: { in: ['VIEW_CATEGORY', 'VIEW_PRODUCT'] }
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        const scores = {};

        for (const action of actions) {
            let category = null;
            let weight = 0;

            if (action.type === 'VIEW_CATEGORY') {
                category = action.targetId;
                weight = 2;
            } else if (action.type === 'VIEW_PRODUCT') {
                // Ideally we'd fetch product category, but for speed we might rely on metadata
                // or fetch product details (expensive loop).
                // Optimization: Assume metadata contains category if possible, or skip.
                if (action.metadata?.category) {
                    category = action.metadata.category;
                    weight = 1;
                }
            }

            if (category) {
                scores[category] = (scores[category] || 0) + weight;
            }
        }

        return Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(([category]) => category)
            .slice(0, 3);
    }
}

export default new TrackingService();
