/**
 * OTP Controller
 * Handles generation and verification of OTPs for mobile/phone login.
 */

import crypto from 'crypto';
import prisma from '../../lib/prisma.js';
import notificationService from '../../services/notificationService.js';

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

    // Check for existing OTP (prevent spam)
    const existing = otpStore.get(phone);
    if (existing && existing.expires > Date.now()) {
        const remainingTime = Math.ceil((existing.expires - Date.now()) / 1000);
        return res.status(429).json({
            error: 'OTP_ALREADY_SENT',
            message: `Please wait ${remainingTime} seconds before requesting a new OTP`,
            retryAfter: remainingTime
        });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP with security metadata
    otpStore.set(phone, {
        otp,
        expires: expiresAt,
        attempts: 0,
        used: false,
        createdAt: Date.now()
    });

    // Priority Delivery via NotificationService
    const user = await prisma.user.findUnique({ where: { phone } });
    if (user) {
        await notificationService.sendNotification({
            userId: user.id,
            type: 'OTP',
            title: 'Your Verification Code',
            message: `Your NovaMart login code is: ${otp}. Valid for 5 minutes.`,
            channels: ['WHATSAPP', 'PUSH']
        });
    } else {
        // For guest/new user OTP, log directly until registration
        console.log(`[AUTH-GUEST] OTP for ${phone}: ${otp}`);
    }

    res.json({ success: true, message: 'OTP_SENT_SUCCESSFULLY', expiresAt: '5m' });
};

/**
 * Verify OTP
 * @param {string} phone 
 * @param {string} otp 
 */
export const verifyOTP = async (phone, otp) => {
    const record = otpStore.get(phone);

    // No OTP found
    if (!record) return false;

    // Check expiry
    if (record.expires < Date.now()) {
        otpStore.delete(phone);
        return false;
    }

    // Check if already used (prevent reuse)
    if (record.used === true) {
        return false;
    }

    // Increment attempt counter (prevent brute force)
    record.attempts += 1;

    // Max 3 attempts
    if (record.attempts > 3) {
        otpStore.delete(phone);
        return false;
    }

    // Verify OTP
    if (record.otp === otp) {
        // Mark as used to prevent reuse
        record.used = true;
        // Delete after successful verification
        otpStore.delete(phone);
        return true;
    }

    // Update the record with incremented attempts
    otpStore.set(phone, record);
    return false;
};

export default { sendOTP, verifyOTP };

