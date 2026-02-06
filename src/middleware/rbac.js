/**
 * Specialized RBAC Middleware
 * @param {string[]} allowedRoles - Roles allowed (e.g., ADMIN, DEALER)
 * @param {string[]} allowedAdminRoles - Specific Admin sub-roles (e.g., SUPER_ADMIN, FINANCE_ADMIN)
 * @param {string} requiredStatus - Minimum account status
 */
const authorize = (allowedRoles = [], allowedAdminRoles = [], requiredStatus = 'ACTIVE') => {
    return (req, res, next) => {
        // user is attached to req by auth middleware (to be implemented)
        const { role, adminRole, status } = req.user || {};

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ error: 'FORBIDDEN', message: 'Insufficient role permissions' });
        }

        // If it's an admin, check granular admin role if specified
        if (role === 'ADMIN' && allowedAdminRoles.length > 0) {
            if (!allowedAdminRoles.includes(adminRole)) {
                return res.status(403).json({ error: 'FORBIDDEN_ADMIN', message: 'Insufficient admin sub-role permissions' });
            }
        }

        if (status !== requiredStatus) {
            return res.status(403).json({
                error: 'FORBIDDEN',
                message: 'You do not have permission to perform this action.',
                code: 'INSUFFICIENT_PERMISSIONS'
            });
        }

        next();
    };
};

export default authorize;

