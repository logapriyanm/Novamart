/**
 * Tracking Controller
 * Low-latency endpoints for behavioral data collection.
 */

import auditService from '../../services/audit.js';
import { DemandHeatmap } from '../../models/index.js';

/**
 * Capture Silent Tracking Event
 */
export const captureEvent = async (req, res) => {
    const { eventType, metadata } = req.body;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'];

    try {
        await auditService.trackEvent(eventType, {
            ...metadata,
            ip: req.ip,
            device: req.headers['user-agent']
        }, userId, sessionId);

        res.status(202).send(); // Accepted (Fire and forget)
    } catch (error) {
        res.status(500).json({ error: 'TRACKING_FAILED' });
    }
};

/**
 * Log Fraud Signal
 */
export const triggerFraudSignal = async (req, res) => {
    const { signalType, details, severity } = req.body;
    const userId = req.user?.id;

    try {
        await auditService.logSignal(signalType, details, severity, userId);
        res.status(201).json({ message: 'Signal logged' });
    } catch (error) {
        res.status(500).json({ error: 'SIGNAL_LOG_FAILED' });
    }
};

/**
 * Get Regional Demand Map (for Manufacturers/Admins)
 */
export const getDemandMap = async (req, res) => {
    const { region } = req.query;
    try {
        const heatmap = await DemandHeatmap.find({ region }).sort({ date: -1 }).limit(10);
        res.json(heatmap);
    } catch (error) {
        res.status(500).json({ error: 'FETCH_HEATMAP_FAILED' });
    }
};

export default {
    captureEvent,
    triggerFraudSignal,
    getDemandMap
};

