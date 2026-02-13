import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {
    User,
    Session,
    Seller,
    Manufacturer,
    Customer,
    Badge
} from '../../models/index.js';
import systemEvents, { EVENTS } from '../../lib/systemEvents.js';
import { OAuth2Client } from 'google-auth-library';
import auditService from '../../services/audit.js';
import { verifyOTP } from './otpController.js';
import logger from '../../lib/logger.js';
import crypto from 'crypto';
import emailService from '../../services/emailService.js';


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('FATAL: JWT_SECRET environment variable is not set.');
    }
    return process.env.JWT_SECRET;
};
const getRefreshSecret = () => {
    if (!process.env.REFRESH_SECRET && !process.env.JWT_SECRET) {
        throw new Error('FATAL: REFRESH_SECRET or JWT_SECRET environment variable is not set.');
    }
    return process.env.REFRESH_SECRET || (process.env.JWT_SECRET + '_refresh');
};

/**
 * Helper to generate access and refresh tokens
 */
const generateTokens = (user) => {
    const userId = user._id || user.id;
    const accessToken = jwt.sign(
        { id: userId, role: user.role, status: user.status },
        getJwtSecret(),
        { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
        { id: userId },
        getRefreshSecret(),
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};



export const register = async (req, res) => {
    const { email, phone, password, role, ...profileData } = req.body;
    logger.info('DEBUG: Registering user - Email: %s, Role: %s', email, role);
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const roleUpper = role.toUpperCase();
        logger.info('DEBUG: roleUpper: %s', roleUpper);
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const [user] = await User.create([{
            email,
            phone,
            password: hashedPassword,
            role: roleUpper,
            status: (roleUpper === 'CUSTOMER') ? 'ACTIVE' : 'PENDING'
        }], { session });

        if (roleUpper === 'SELLER' || roleUpper === 'DEALER') {
            const { businessName, gstNumber, businessAddress, bankDetails } = profileData;
            await Seller.create([{
                userId: user._id,
                businessName,
                gstNumber,
                businessAddress,
                bankDetails
            }], { session });
        } else if (roleUpper === 'MANUFACTURER') {
            const { companyName, registrationNo, factoryAddress, gstNumber, bankDetails, certifications } = profileData;
            await Manufacturer.create([{
                userId: user._id,
                companyName,
                registrationNo,
                factoryAddress,
                gstNumber,
                bankDetails,
                certifications: certifications || []
            }], { session });
        } else if (roleUpper === 'CUSTOMER') {
            await Customer.create([{
                userId: user._id,
                name: profileData.name || email?.split('@')[0] || 'Customer'
            }], { session });
        }

        await session.commitTransaction();

        // Audit Log
        await auditService.logAction('USER_REGISTERED', 'USER', user._id, {
            userId: user._id,
            newData: { role: user.role, status: user.status },
            req
        });

        // Emit System Event
        systemEvents.emit(EVENTS.AUTH.REGISTERED, {
            userId: user._id,
            role: user.role,
            status: user.status
        });

        // 3. Send Welcome Email
        // Note: Send email *after* transaction commit to ensure user exists
        emailService.sendWelcomeEmail(user).catch(err => {
            logger.error('Failed to send welcome email to %s:', user.email, err);
        });

        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token to DB
        await User.findByIdAndUpdate(user._id, { refreshToken });

        await Session.create({
            userId: user._id,
            token: accessToken,
            ipAddress: req.ip,
            device: req.headers['user-agent'],
            expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1h
        });

        res.status(201).json({
            success: true,
            message: 'REGISTRATION_SUCCESSFUL',
            data: {
                token: accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    avatar: user.avatar
                }
            }
        });
    } catch (error) {
        await session.abortTransaction();
        const message = error.code === 11000 ? 'DUPLICATE_ENTRY' : 'REGISTRATION_FAILED';
        const details = error.message;



        logger.error('❌ Registration Error Details:', {
            message: error.message,
            code: error.code,
            keyPattern: error.keyPattern,
            keyValue: error.keyValue
        });

        res.status(400).json({ success: false, error: message, details });
    } finally {
        session.endSession();
    }
};

/**
 * Login via Email/Password
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        logger.debug('User found in login - Email: %s, Role: %s, ID: %s', email, user?.role, user?._id);
        if (!user || (user.password && !(await bcrypt.compare(password, user.password)))) {
            return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        await User.findByIdAndUpdate(user._id, { refreshToken });

        // Clear existing sessions
        await Session.deleteMany({ userId: user._id });

        await Session.create({
            userId: user._id,
            token: accessToken,
            ipAddress: req.ip,
            device: req.headers['user-agent'],
            expiresAt: new Date(Date.now() + 60 * 60 * 1000)
        });

        await auditService.logAction('USER_LOGIN_EMAIL', 'USER', user._id, {
            userId: user._id,
            req
        });

        res.json({
            success: true,
            data: {
                token: accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    avatar: user.avatar
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

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'No account linked to this phone number.' });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        await User.findByIdAndUpdate(user._id, { refreshToken });

        await Session.deleteMany({ userId: user._id });

        await Session.create({
            userId: user._id,
            token: accessToken,
            ipAddress: req.ip,
            device: req.headers['user-agent'],
            expiresAt: new Date(Date.now() + 60 * 60 * 1000)
        });

        await auditService.logAction('USER_LOGIN_PHONE', 'USER', user._id, {
            userId: user._id,
            req
        });

        res.json({
            success: true,
            data: {
                token: accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    avatar: user.avatar
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

        let user = await User.findOne({ email });

        if (user) {
            if (user.role !== 'CUSTOMER') {
                return res.status(403).json({
                    success: false,
                    error: 'RESTRICTED_ROLE',
                    message: 'Please use standard secure login for your account type.'
                });
            }
        } else {
            user = await User.create({
                email,
                role: 'CUSTOMER',
                status: 'ACTIVE'
            });

            await Customer.create({
                userId: user._id,
                name: name || email.split('@')[0]
            });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        await User.findByIdAndUpdate(user._id, { refreshToken });

        await Session.deleteMany({ userId: user._id });

        await Session.create({
            userId: user._id,
            token: accessToken,
            ipAddress: req.ip,
            device: req.headers['user-agent'],
            expiresAt: new Date(Date.now() + 60 * 60 * 1000)
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
                    status: user.status,
                    avatar: user.avatar
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
                status: user.status,
                avatar: user.avatar
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
    logger.info('DEBUG: Refreshing token for RT starting with: %s', refreshToken?.substring(0, 10));
    if (!refreshToken) {
        logger.info('DEBUG: No refresh token provided');
        return res.status(401).json({ error: 'REFRESH_TOKEN_REQUIRED' });
    }

    try {
        const payload = jwt.verify(refreshToken, getRefreshSecret());
        const user = await User.findById(payload.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ error: 'INVALID_REFRESH_TOKEN' });
        }

        const tokens = generateTokens(user);

        // Update User's refresh token
        await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

        // Create new session for the new access token
        const newSession = await Session.create({
            userId: user._id,
            token: tokens.accessToken,
            ipAddress: req.ip,
            device: req.headers['user-agent'],
            expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1h
        });
        logger.info('DEBUG: New session created in DB for user: %s', user._id);

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
            await Session.deleteMany({ token });
            // Ideally we should decode the token to get userId and invalidate refreshToken too,
            // but without verification we can't trust the token.
            // If we want to be thorough, we can try-catch jwt.decode
            try {
                const decoded = jwt.decode(token);
                if (decoded?.id) {
                    await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
                }
            } catch (e) {
                // Ignore decoding errors during logout
            }
        }

        res.json({ success: true, message: 'LOGOUT_SUCCESSFUL' });
    } catch (error) {
        logger.error('❌ Logout Error:', error);
        // Even if server error, client should consider it logged out
        res.status(200).json({ success: true, message: 'LOGOUT_COMPLETED_WITH_ERRORS' });
    }
};

/**
 * Forgot Password - Send Reset Link
 */
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Industry standard: Don't reveal if user exists
            return res.json({ success: true, message: 'RESET_LINK_SENT_IF_ACCOUNT_EXISTS' });
        }

        // Generate Secure Token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const tokenExpiry = new Date(Date.now() + 3600000); // 1 Hour

        await User.findByIdAndUpdate(user._id, {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: tokenExpiry
        });

        // Send Email
        await emailService.sendPasswordResetEmail(user, resetToken);

        await auditService.logAction('FORGOT_PASSWORD_REQUEST', 'USER', user.id, { email, req });

        res.json({ success: true, message: 'RESET_LINK_SENT' });
    } catch (error) {
        logger.error('❌ Forgot Password Error:', error);
        res.status(500).json({ success: false, error: 'FORGOT_PASSWORD_FAILED' });
    }
};

/**
 * Reset Password - Update Password with Token
 */
export const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({ resetPasswordToken: hashedToken });

        if (!user || user.resetPasswordExpires < new Date()) {
            return res.status(400).json({ error: 'INVALID_OR_EXPIRED_TOKEN' });
        }

        // Hash New Password
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        });

        await auditService.logAction('PASSWORD_RESET_SUCCESSFUL', 'USER', user.id, { req });

        res.json({ success: true, message: 'PASSWORD_RESET_SUCCESSFUL' });
    } catch (error) {
        logger.error('❌ Reset Password Error:', error);
        res.status(500).json({ success: false, error: 'RESET_PASSWORD_FAILED' });
    }
};

export default { register, login, loginWithPhone, googleLogin, getCurrentUser, logout, refresh, forgotPassword, resetPassword };
