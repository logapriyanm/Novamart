import behaviorService from '../services/behaviorService.js';
import auditService from '../services/audit.js';
import { DemandHeatmap } from '../models/index.js';

export const captureEvent = async (req, res) => {
    const { eventType, targetId, metadata } = req.body;
    const userId = req.user?._id;

    try {
        await behaviorService.trackEvent(userId, eventType, targetId, {
            ...metadata,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        res.status(202).json({ success: true });
    } catch (error) {
        console.error('Capture Event Error:', error);
        res.status(500).json({ error: 'TRACKING_FAILED' });
    }
};

/**
 * Log Fraud Signal
 */
export const triggerFraudSignal = async (req, res) => {
    const { signalType, details, severity } = req.body;
    const userId = req.user?._id;

    try {
        await auditService.logSignal(signalType, details, severity, userId);
        res.status(201).json({ success: true, message: 'Signal logged', data: null });
    } catch (error) {
        console.error('Fraud Signal Error:', error);
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
        res.json({ success: true, data: heatmap });
    } catch (error) {
        res.status(500).json({ error: 'FETCH_HEATMAP_FAILED' });
    }
};

export default {
    captureEvent,
    triggerFraudSignal,
    getDemandMap
};

