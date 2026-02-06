import express from 'express';
import { register, login, loginWithPhone, googleLogin } from './authController.js';
import { sendOTP } from './otpController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/otp/send', sendOTP);
router.post('/login/phone', loginWithPhone);
router.post('/google', googleLogin);

export default router;

