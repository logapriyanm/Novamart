import express from 'express';
import { register, login, loginWithPhone, googleLogin, getCurrentUser, logout, refresh, forgotPassword, resetPassword } from '../../controllers/auth/authController.js';
import authenticate from '../../middleware/auth.js';
import { sendOTP } from '../../controllers/auth/otpController.js';
import { validateRegistration, validateLogin, validatePhoneLogin } from '../../middleware/validate.js';
import { otpRateLimiter, loginRateLimiter, authRateLimiter } from '../../middleware/rateLimiter.js';
import logger from '../../lib/logger.js';

const router = express.Router();

// Apply general auth rate limiting to all routes
router.use(authRateLimiter);

router.get('/me', authenticate, getCurrentUser);
router.post('/register', validateRegistration, register);
router.post('/login', loginRateLimiter, validateLogin, login);
router.post('/otp/send', otpRateLimiter, sendOTP);
router.post('/login/phone', loginRateLimiter, validatePhoneLogin, loginWithPhone);
router.post('/google', loginRateLimiter, googleLogin);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);

export default router;

