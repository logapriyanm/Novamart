/**
 * Audit Logging Middleware
 * Records critical actions to the immutable audit log.
 */

import prisma from '../lib/prisma.js';

const auditLog = (action, entity) => {
    return async (req, res, next) => {
        const originalSend = res.send;

        res.send = function (data) {
            const body = req.body;
            const user = req.user;

            // Only log if successful or if it's a critical action
            // Use auditService instead of direct prisma access to avoid errors with non-existent models
            import('../services/audit.js').then(({ default: auditService }) => {
                auditService.logAction(action, entity, body?.id || req.params?.id || 'N/A', {
                    userId: user?.id,
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

