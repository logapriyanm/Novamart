import rateLimit from 'express-rate-limit';

// Strict rate limiter for OTP endpoints (prevent brute force)
export const otpRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 500, // 5 requests per window
    message: {
        success: false,
        error: 'Too many OTP requests. Please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => {
        return req.body.phone || req['ip'];
    },
    validate: { xForwardedForHeader: false, trustProxy: false }
});

// Standard rate limiter for auth endpoints
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10000, // 100 requests per window
    message: {
        success: false,
        error: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false, trustProxy: false }
});

// Strict login rate limiter (prevent credential stuffing)
export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, // 10 login attempts per window
    message: {
        success: false,
        error: 'Too many login attempts. Please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => {
        return req.body.email || req.body.phone || req['ip'];
    },
    validate: { xForwardedForHeader: false, trustProxy: false }
});
