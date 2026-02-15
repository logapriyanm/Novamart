import jwt from 'jsonwebtoken';
import { User, Session } from '../models/index.js';
import logger from '../lib/logger.js';

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start securely.');
    }
    return process.env.JWT_SECRET;
};

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'UNAUTHORIZED', message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, getJwtSecret());
        logger.debug('Token decoded for user ID: %s', decoded.id);

        // 1. Verify User exists and is not suspended
        const user = await User.findById(decoded.id);

        if (!user) {
            logger.warn('User not found for ID: %s', decoded.id);
            return res.status(401).json({ error: 'USER_NOT_FOUND' });
        }

        // Only populate the user's actual role profile (performance optimization)
        if (user.role === 'CUSTOMER') await user.populate('customer');
        else if (user.role === 'SELLER') await user.populate('seller');
        else if (user.role === 'MANUFACTURER') await user.populate('manufacturer');
        logger.debug('User authenticated: role=%s status=%s', user.role, user.status);

        if (user.status === 'SUSPENDED') {
            return res.status(403).json({ error: 'ACCOUNT_SUSPENDED' });
        }

        // 2. Strict Session Verification (Database)
        const session = await Session.findOne({ token });

        if (!session) {
            logger.debug('Session not found in DB for user: %s', decoded.id);
        }

        if (session && session.expiresAt < new Date()) {
            logger.debug('Session expired for user: %s', decoded.id);
        }

        if (!session || session.expiresAt < new Date()) {
            return res.status(401).json({ error: 'SESSION_EXPIRED', message: 'Your session has ended. Please login again.' });
        }

        // Attach full user object to request
        req.user = user;
        next();
    } catch (error) {
        logger.error('Auth Middleware Error: %s', error.message);
        return res.status(401).json({ error: 'INVALID_TOKEN', message: error.message });
    }
};

/**
 * Optional Authentication Middleware
 * Attaches user to req if token is valid, but doesn't block if missing.
 */
export const authenticateOptional = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, getJwtSecret());
        const user = await User.findById(decoded.id)
            .populate('customer')
            .populate('seller')
            .populate('manufacturer');

        if (user && user.status !== 'SUSPENDED') {
            req.user = user;
        }
    } catch (error) {
        // Silently fail on invalid token for optional auth
    }
    next();
};

export const authenticateUser = authenticate;

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        logger.debug('Role Check - User Role: %s, Allowed Roles: %s', req.user?.role, roles);
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied' });
        }
        next();
    };
};

export default authenticate;
