import express from 'express';
import { register, login, loginWithPhone, googleLogin, getCurrentUser, logout } from '../../controllers/auth/authController.js';
import authenticate from '../../middleware/auth.js';
import { sendOTP } from '../../controllers/auth/otpController.js';
import { validateRegistration, validateLogin, validatePhoneLogin } from '../../middleware/validate.js';

const router = express.Router();

router.get('/me', authenticate, getCurrentUser);
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/otp/send', sendOTP);
router.post('/login/phone', validatePhoneLogin, loginWithPhone);
router.post('/google', googleLogin);
router.post('/logout', authenticate, logout);

export default router;

