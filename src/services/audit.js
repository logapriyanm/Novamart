/**
 * Audit Service
 * Centralized logging for transactional (Postgres) and behavior (MongoDB) logs.
 */

import prisma from '../lib/prisma.js';
import { Tracking, FraudSignal, DemandHeatmap } from '../../models/Tracking.js';

class AuditService {
    /**
     * Log a transactional event (Immutable Audit Log)
     */
    async logAction(action, entity, entityId, { userId, oldData, newData, reason, req }) {
        try {
            return await prisma.auditLog.create({
                data: {
                    action,
                    entity,
                    entityId,
                    userId,
                    oldData: oldData || {},
                    newData: newData || {},
                    reason,
                    ipAddress: req?.ip,
                    device: req?.headers['user-agent'],
                    method: req?.method,
                    timestamp: new Date()
                }
            });
        } catch (error) {
            console.error('Failed to log audit action:', error);
        }
    }

    /**
     * Log a behavioral event or fraud signal to MongoDB
     */
    async logSignal(signalType, details, severity = 'LOW', userId = null) {
        try {
            const signal = new FraudSignal({
                userId,
                signalType,
                details,
                severity,
                timestamp: new Date()
            });
            await signal.save();
        } catch (error) {
            console.error('Failed to log fraud signal:', error);
        }
    }

    /**
     * Silent tracking of page views/actions
     */
    async trackEvent(eventType, metadata, userId = null, sessionId = null) {
        try {
            const tracking = new Tracking({
                userId,
                sessionId,
                eventType,
                metadata,
                timestamp: new Date()
            });
            await tracking.save();
        } catch (error) {
            console.error('Tracking failed:', error);
        }
    }

    /**
     * Specialized Search Tracking
     */
    async trackSearch(query, { userId, region, resultsCount }) {
        return this.trackEvent('SEARCH', {
            query,
            region,
            resultsCount,
            timestamp: new Date()
        }, userId);
    }

    /**
     * Regional Demand Heatmap Aggregation
     */
    async aggregateDemand() {
        // This would typically run in a cron job
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const results = await Tracking.aggregate([
            { $match: { eventType: { $in: ['SEARCH', 'PAGE_VIEW'] }, timestamp: { $gte: yesterday } } },
            {
                $group: {
                    _id: { region: "$metadata.region", category: "$metadata.category" },
                    views: { $sum: { $cond: [{ $eq: ["$eventType", "PAGE_VIEW"] }, 1, 0] } },
                    searches: { $sum: { $cond: [{ $eq: ["$eventType", "SEARCH"] }, 1, 0] } }
                }
            }
        ]);

        for (const res of results) {
            await DemandHeatmap.create({
                region: res._id.region,
                categoryId: res._id.category,
                viewCount: res.views,
                searchCount: res.searches,
                date: yesterday
            });
        }
    }
}

export default new AuditService();

