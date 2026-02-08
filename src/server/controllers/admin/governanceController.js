import prisma from '../../lib/prisma.js';

/**
 * Rule Management (Margin/Tax)
 */
export const createMarginRule = async (req, res) => {
    const { category, maxCap, minMOQ } = req.body;
    try {
        const rule = await prisma.marginRule.create({
            data: { category, maxCap, minMOQ }
        });
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
        const setting = await prisma.platformSettings.upsert({
            where: { key },
            update: { value, description },
            create: { key, value, description }
        });
        res.json({ success: true, message: 'Setting updated', data: setting });
    } catch (error) {
        res.status(400).json({ success: false, error: 'SETTINGS_UPDATE_FAILED' });
    }
};

export default {
    createMarginRule,
    updateSettings
};
