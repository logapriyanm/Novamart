/**
 * Tracking Service
 * Records user interactions for personalization.
 */

import { Tracking } from '../models/index.js';

class BehaviorService {
    /**
     * Record a user event (View, Click, Search, AddToCart)
     */
    async trackEvent(userId, type, targetId, metadata = {}) {
        try {
            return await Tracking.create({
                userId,
                eventType: type, // Schema uses eventType
                targetId,
                metadata,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Tracking Error:', error);
        }
    }

    /**
     * Get recent product views for a user
     */
    async getRecentViews(userId, limit = 10) {
        const views = await Tracking.find({
            userId,
            eventType: 'PAGE_VIEW' // Mapping VIEW to PAGE_VIEW if that's the intention
        })
            .sort({ timestamp: -1 })
            .limit(limit);

        return views;
    }

    /**
     * Analytics: Identify trending categories based on recent searches/views
     */
    async getTrendingCategories() {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const actions = await Tracking.find({
            timestamp: { $gte: sevenDaysAgo },
            'metadata.category': { $exists: true }
        });

        const categoryCounts = {};
        actions.forEach(a => {
            const cat = a.metadata.category;
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        return Object.entries(categoryCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([category]) => category)
            .slice(0, 5);
    }
}

export default new BehaviorService();
