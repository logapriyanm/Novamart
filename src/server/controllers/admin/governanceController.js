import { MarginRule, SystemConfig } from '../../models/index.js';

/**
 * Rule Management (Margin/Tax)
 */
export const createMarginRule = async (req, res) => {
    const { category, maxCap, minMOQ } = req.body;
    try {
        const rule = await MarginRule.create({ category, maxCap, minMOQ });
        res.status(201).json({ success: true, data: rule });
    } catch (error) {
        res.status(400).json({ success: false, error: 'RULE_CREATION_FAILED' });
    }
};

/**
 * Platform Settings
 */
export const updateSettings = async (req, res) => {
    const { key, value, description } = req.body;
    try {
        // Using SystemConfig as it corresponds to platform settings in MongoDB
        const setting = await SystemConfig.findOneAndUpdate(
            { key },
            { value, description, updatedBy: req.user._id, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        res.json({ success: true, message: 'Setting updated', data: setting });
    } catch (error) {
        console.error('Settings Update Error:', error);
        res.status(400).json({ success: false, error: 'SETTINGS_UPDATE_FAILED' });
    }
};

export default {
    createMarginRule,
    updateSettings
};
