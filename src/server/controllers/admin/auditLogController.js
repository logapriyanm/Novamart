/**
 * Audit Log Viewer
 */
export const getAuditLogs = async (req, res) => {
    const { entity, userId } = req.query;
    try {
        const { AuditLog } = await import('../../models/index.js');

        const query = {};
        if (entity) query['details.entityType'] = entity;
        if (userId) query.actorId = userId;

        const logs = await AuditLog.find(query)
            .sort({ createdAt: -1 })
            .limit(100);

        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_LOGS' });
    }
};

export default {
    getAuditLogs
};
