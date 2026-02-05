/**
 * OTP Controller
 * Handles generation and verification of OTPs for mobile/phone login.
 */

import prisma from '../../lib/prisma.js';
import crypto from 'crypto';

// In-memory or Redis-based OTP store (In-memory for simplicity in this project)
const otpStore = new Map();

/**
 * Generate and Send OTP
 * @param {string} phone - User's phone number
 */
export const sendOTP = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: 'PHONE_REQUIRED' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 5-minute expiry
    otpStore.set(phone, {
        otp,
        expires: Date.now() + 5 * 60 * 1000
    });

    // Mock SMS Sending (In production, integrate with Twilio/MSG91)
    console.log(`[AUTH] OTP for ${phone}: ${otp}`);

    res.json({ message: 'OTP_SENT_SUCCESSFULLY', expiresAt: '5m' });
};

/**
 * Verify OTP
 * @param {string} phone 
 * @param {string} otp 
 */
export const verifyOTP = async (phone, otp) => {
    const record = otpStore.get(phone);

    if (!record) return false;
    if (record.expires < Date.now()) {
        otpStore.delete(phone);
        return false;
    }

    if (record.otp === otp) {
        otpStore.delete(phone);
        return true;
    }

    return false;
};

export default { sendOTP, verifyOTP };
