/**
 * Audit Logging Middleware
 * Records critical actions to the immutable audit log.
 */


const auditLog = (action, entity) => {
    return async (req, res, next) => {
        const originalSend = res.send;

        res.send = function (data) {
            const body = req.body;
            const user = req.user;

            // Use auditService instead of direct database access
            import('../services/audit.js').then(({ default: auditService }) => {
                auditService.logAction(action, entity, body?.id || req.params?.id || 'N/A', {
                    userId: user?._id,
                    oldData: {},
                    newData: body,
                    reason: req.headers['x-audit-reason'] || 'Routine operation',
                    req
                }).catch(err => console.error('Audit Logging Failed:', err));
            }).catch(err => console.error('Failed to load Audit Service:', err));

            originalSend.apply(res, arguments);
        };

        next();
    };
};

export default auditLog;

