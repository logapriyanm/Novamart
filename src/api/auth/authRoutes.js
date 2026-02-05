import express from 'express';
import { register, login, loginWithPhone } from './authController.js';
import { sendOTP } from './otpController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/otp/send', sendOTP);
router.post('/login/phone', loginWithPhone);

export default router;
