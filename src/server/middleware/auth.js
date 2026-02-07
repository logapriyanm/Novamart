/**
 * Authentication Middleware
 * Validates JWT and attaches user to the request.
 */

import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'UNAUTHORIZED', message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // 1. Verify User exists and is not suspended
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: {
                customer: true,
                dealer: true,
                manufacturer: true
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'USER_NOT_FOUND' });
        }

        if (user.status === 'SUSPENDED') {
            return res.status(403).json({ error: 'ACCOUNT_SUSPENDED' });
        }

        // 2. Strict Session Verification (Database)
        const session = await prisma.session.findUnique({
            where: { token: token }
        });

        if (!session || session.expiresAt < new Date()) {
            return res.status(401).json({ error: 'SESSION_EXPIRED', message: 'Your session has ended. Please login again.' });
        }

        // Attach full user object to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'INVALID_TOKEN' });
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
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { customer: true, dealer: true, manufacturer: true }
        });

        if (user && user.status !== 'SUSPENDED') {
            req.user = user;
        }
    } catch (error) {
        // Silently fail on invalid token for optional auth
    }
    next();
};

export default authenticate;

