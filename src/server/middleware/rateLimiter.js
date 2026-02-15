import rateLimit from 'express-rate-limit';

// Strict rate limiter for OTP endpoints (prevent brute force)
export const otpRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // 5 requests per 15-minute window
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
    limit: 100, // 100 requests per 15-minute window
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
    limit: 10, // 10 login attempts per 15-minute window
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

// Checkout rate limiter (prevent rapid order spam)
export const checkoutRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10, // 10 checkout attempts per 15 minutes
    message: {
        success: false,
        error: 'Too many checkout attempts. Please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false, trustProxy: false }
});

// Payment endpoint rate limiter
export const paymentRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20, // 20 payment-related requests per 15 minutes
    message: {
        success: false,
        error: 'Too many payment requests. Please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false, trustProxy: false }
});

// Negotiation rate limiter (prevent spam offers)
export const negotiationRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30, // 30 negotiation actions per 15 minutes
    message: {
        success: false,
        error: 'Too many negotiation requests. Please slow down.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false, trustProxy: false }
});
