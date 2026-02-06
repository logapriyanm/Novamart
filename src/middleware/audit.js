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
            if (res.statusCode >= 200 && res.statusCode < 300) {
                prisma.auditLog.create({
                    data: {
                        userId: user?.id,
                        action,
                        entity,
                        entityId: body?.id || req.params?.id || 'N/A',
                        newData: body,
                        ipAddress: req.ip || req.headers['x-forwarded-for'],
                        device: req.headers['user-agent'],
                        method: req.method,
                        reason: req.headers['x-audit-reason'] || 'Routine operation'
                    }
                }).catch(err => console.error('Audit Logging Failed:', err));
            }

            originalSend.apply(res, arguments);
        };

        next();
    };
};

export default auditLog;

