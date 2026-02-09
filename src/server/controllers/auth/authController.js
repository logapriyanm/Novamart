import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma.js';
import systemEvents, { EVENTS } from '../../lib/systemEvents.js';
import { OAuth2Client } from 'google-auth-library';
import auditService from '../../services/audit.js';
import { verifyOTP } from './otpController.js';
import logger from '../../lib/logger.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'superrefreshsecret';

/**
 * Helper to generate access and refresh tokens
 */
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, role: user.role, status: user.status },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
        { id: user.id },
        REFRESH_SECRET,
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

/**
 * Register a new user
 */
export const register = async (req, res) => {
    const { email, phone, password, role, ...profileData } = req.body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            const roleUpper = role.toUpperCase();
            const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

            const user = await tx.user.create({
                data: {
                    email,
                    phone,
                    password: hashedPassword,
                    role: roleUpper,
                    status: (roleUpper === 'CUSTOMER') ? 'ACTIVE' : 'PENDING'
                }
            });

            if (roleUpper === 'DEALER') {
                const { businessName, gstNumber, businessAddress, bankDetails } = profileData;
                await tx.dealer.create({
                    data: { userId: user.id, businessName, gstNumber, businessAddress, bankDetails }
                });
            } else if (roleUpper === 'MANUFACTURER') {
                const { companyName, registrationNo, factoryAddress, gstNumber, bankDetails, certifications } = profileData;
                await tx.manufacturer.create({
                    data: {
                        userId: user.id,
                        companyName,
                        registrationNo,
                        factoryAddress,
                        gstNumber,
                        bankDetails,
                        certifications: certifications || []
                    }
                });
            } else if (roleUpper === 'CUSTOMER') {
                await tx.customer.create({
                    data: { userId: user.id, name: profileData.name || email?.split('@')[0] || 'Customer' }
                });
            }
            return user;
        });

        const user = result;

        // Audit Log
        await auditService.logAction('USER_REGISTERED', 'USER', user.id, {
            userId: user.id,
            newData: { role: user.role, status: user.status },
            req
        });

        // Emit System Event
        systemEvents.emit(EVENTS.AUTH.REGISTERED, {
            userId: user.id,
            role: user.role,
            status: user.status
        });

        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token to DB
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        await prisma.session.create({
            data: {
                userId: user.id,
                token: accessToken,
                ipAddress: req.ip,
                device: req.headers['user-agent'],
                expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1h
            }
        });

        res.status(201).json({
            success: true,
            message: 'REGISTRATION_SUCCESSFUL',
            data: {
                token: accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    status: user.status
                }
            }
        });
    } catch (error) {
        logger.error('❌ Registration Error:', error);

        let message = 'REGISTRATION_FAILED';
        let details = error.message;

        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0] || 'account';
            message = 'DUPLICATE_ENTRY';
            details = { [field]: `${field.toUpperCase()}_ALREADY_EXISTS` };
        }

        res.status(400).json({ error: message, details });
    }
};

/**
 * Login via Email/Password
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || (user.password && !(await bcrypt.compare(password, user.password)))) {
            return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        // Clear existing sessions
        await prisma.session.deleteMany({ where: { userId: user.id } });

        await prisma.session.create({
            data: {
                userId: user.id,
                token: accessToken,
                ipAddress: req.ip,
                device: req.headers['user-agent'],
                expiresAt: new Date(Date.now() + 60 * 60 * 1000)
            }
        });

        await auditService.logAction('USER_LOGIN_EMAIL', 'USER', user.id, {
            userId: user.id,
            req
        });

        res.json({
            success: true,
            data: {
                token: accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    status: user.status
                }
            }
        });
    } catch (error) {
        logger.error('❌ Login Error:', error);
        res.status(500).json({ success: false, error: 'LOGIN_FAILED', details: error.message });
    }
};

/**
 * Login via Phone + OTP
 */
export const loginWithPhone = async (req, res) => {
    const { phone, otp } = req.body;

    try {
        const isValid = await verifyOTP(phone, otp);
        if (!isValid) {
            return res.status(401).json({ error: 'INVALID_OR_EXPIRED_OTP' });
        }

        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) {
            return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'No account linked to this phone number.' });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        await prisma.session.deleteMany({ where: { userId: user.id } });

        await prisma.session.create({
            data: {
                userId: user.id,
                token: accessToken,
                ipAddress: req.ip,
                device: req.headers['user-agent'],
                expiresAt: new Date(Date.now() + 60 * 60 * 1000)
            }
        });

        await auditService.logAction('USER_LOGIN_PHONE', 'USER', user.id, {
            userId: user.id,
            req
        });

        res.json({
            success: true,
            data: {
                token: accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    status: user.status
                }
            }
        });
    } catch (error) {
        logger.error('❌ Phone Login Error:', error);
        res.status(500).json({ success: false, error: 'PHONE_LOGIN_FAILED' });
    }
};

/**
 * Google OAuth2 Login (Customer Only)
 */
export const googleLogin = async (req, res) => {
    const { idToken } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            if (user.role !== 'CUSTOMER') {
                return res.status(403).json({
                    success: false,
                    error: 'RESTRICTED_ROLE',
                    message: 'Please use standard secure login for your account type.'
                });
            }
        } else {
            user = await prisma.user.create({
                data: {
                    email,
                    role: 'CUSTOMER',
                    status: 'ACTIVE',
                    customer: {
                        create: { name: name || email.split('@')[0] }
                    }
                }
            });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        await prisma.session.deleteMany({ where: { userId: user.id } });

        await prisma.session.create({
            data: {
                userId: user.id,
                token: accessToken,
                ipAddress: req.ip,
                device: req.headers['user-agent'],
                expiresAt: new Date(Date.now() + 60 * 60 * 1000)
            }
        });

        await auditService.logAction('USER_LOGIN_GOOGLE', 'USER', user.id, {
            userId: user.id,
            req
        });

        res.json({
            success: true,
            data: {
                token: accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    status: user.status
                }
            }
        });
    } catch (error) {
        logger.error('❌ Google Auth Error:', error);
        res.status(400).json({ success: false, error: 'GOOGLE_AUTH_FAILED', details: error.message });
    }
};

/**
 * Get Current User (Session Hydration)
 */
export const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        res.json({
            success: true,
            data: {
                id: user.id,
                name: user.customer?.name || user.dealer?.businessName || user.manufacturer?.companyName || user.email.split('@')[0],
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'SESSION_HYDRATION_FAILED' });
    }
};

/**
 * Refresh Access Token
 */
export const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'REFRESH_TOKEN_REQUIRED' });

    try {
        const payload = jwt.verify(refreshToken, REFRESH_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: payload.id }
        });

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ error: 'INVALID_REFRESH_TOKEN' });
        }

        const tokens = generateTokens(user);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: tokens.refreshToken }
        });

        res.json({
            success: true,
            data: {
                token: tokens.accessToken,
                refreshToken: tokens.refreshToken
            }
        });
    } catch (error) {
        res.status(401).json({ error: 'REFRESH_TOKEN_EXPIRED' });
    }
};

/**
 * Logout User
 */
export const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (token) {
            await prisma.session.deleteMany({
                where: { token: token }
            });
        }

        if (req.user) {
            await prisma.user.update({
                where: { id: req.user.id },
                data: { refreshToken: null }
            });
        }

        res.json({ success: true, message: 'LOGOUT_SUCCESSFUL' });
    } catch (error) {
        logger.error('❌ Logout Error:', error);
        res.status(500).json({ success: false, error: 'LOGOUT_FAILED' });
    }
};

/**
 * Forgot Password Stub
 */
export const forgotPassword = async (req, res) => {
    res.json({ success: true, message: 'RESET_LINK_SENT_IF_ACCOUNT_EXISTS' });
};

/**
 * Reset Password Stub
 */
export const resetPassword = async (req, res) => {
    res.json({ success: true, message: 'PASSWORD_RESET_SUCCESSFUL' });
};

export default { register, login, loginWithPhone, googleLogin, getCurrentUser, logout, refresh, forgotPassword, resetPassword };
