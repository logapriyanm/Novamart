import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma.js';
import systemEvents, { EVENTS } from '../../lib/systemEvents.js';
import { OAuth2Client } from 'google-auth-library';
import auditService from '../../services/audit.js';
import { verifyOTP } from './otpController.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

/**
 * Register a new user
 */
export const register = async (req, res) => {
    const { email, phone, password, role, ...profileData } = req.body;

    try {
        const roleUpper = role.toUpperCase();
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const user = await prisma.user.create({
            data: {
                email,
                phone,
                password: hashedPassword,
                role: roleUpper,
                status: (roleUpper === 'CUSTOMER' || roleUpper === 'DEALER' || roleUpper === 'MANUFACTURER') ? 'ACTIVE' : 'PENDING'
            }
        });

        if (roleUpper === 'DEALER') {
            const { businessName, gstNumber, businessAddress, bankDetails } = profileData;
            await prisma.dealer.create({
                data: { userId: user.id, businessName, gstNumber, businessAddress, bankDetails }
            });
        } else if (roleUpper === 'MANUFACTURER') {
            const { companyName, registrationNo, factoryAddress, gstNumber, bankDetails, certifications } = profileData;
            await prisma.manufacturer.create({
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
            await prisma.customer.create({
                data: { userId: user.id, name: profileData.name || email?.split('@')[0] || 'Customer' }
            });
        }

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

        // Generate Token & Create Session
        const token = jwt.sign({ id: user.id, role: user.role, status: user.status }, JWT_SECRET, { expiresIn: '24h' });

        await prisma.session.create({
            data: {
                userId: user.id,
                token: token,
                ipAddress: req.ip,
                device: req.headers['user-agent'],
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        });

        res.status(201).json({
            success: true,
            message: 'REGISTRATION_SUCCESSFUL',
            token,
            data: { id: user.id, role: user.role, status: user.status }
        });
    } catch (error) {
        console.error('❌ Registration Error:', error);

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
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
        }

        const token = jwt.sign({ id: user.id, role: user.role, status: user.status }, JWT_SECRET, { expiresIn: '24h' });

        // Clear existing sessions to avoid uniqueness issues or multiple active sessions
        await prisma.session.deleteMany({ where: { userId: user.id } });

        await prisma.session.create({
            data: {
                userId: user.id,
                token: token,
                ipAddress: req.ip,
                device: req.headers['user-agent'],
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        });

        await auditService.logAction('USER_LOGIN_EMAIL', 'USER', user.id, {
            userId: user.id,
            req
        });

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    status: user.status
                }
            }
        });
    } catch (error) {
        console.error('❌ Login Error:', error);
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

        const token = jwt.sign({ id: user.id, role: user.role, status: user.status }, JWT_SECRET, { expiresIn: '24h' });

        await prisma.session.create({
            data: {
                userId: user.id,
                token: token,
                ipAddress: req.ip,
                device: req.headers['user-agent'],
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        });

        await auditService.logAction('USER_LOGIN_PHONE', 'USER', user.id, {
            userId: user.id,
            req
        });

        res.json({
            success: true,
            data: { token, role: user.role, status: user.status }
        });
    } catch (error) {
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
        const { email, name, sub: googleId, picture } = payload;

        // Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            // Restriction: Only allow CUSTOMER role via Google
            if (user.role !== 'CUSTOMER') {
                return res.status(403).json({
                    success: false,
                    error: 'RESTRICTED_ROLE',
                    message: 'Please use standard secure login for your account type.'
                });
            }
        } else {
            // Auto-register new Google user as CUSTOMER
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

        const token = jwt.sign({ id: user.id, role: user.role, status: user.status }, JWT_SECRET, { expiresIn: '24h' });

        await prisma.session.create({
            data: {
                userId: user.id,
                token: token,
                ipAddress: req.ip,
                device: req.headers['user-agent'],
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        });

        await auditService.logAction('USER_LOGIN_GOOGLE', 'USER', user.id, {
            userId: user.id,
            req
        });

        res.json({
            success: true,
            data: { token, role: user.role, status: user.status }
        });
    } catch (error) {
        console.error('❌ Google Auth Error:', error);
        res.status(400).json({ success: false, error: 'GOOGLE_AUTH_FAILED', details: error.message });
    }
};

/**
 * Get Current User (Session Hydration)
 */
export const getCurrentUser = async (req, res) => {
    try {
        const user = req.user; // Attached by middleware
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
 * Logout User (Clear Session)
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

        res.json({
            success: true,
            message: 'LOGOUT_SUCCESSFUL'
        });
    } catch (error) {
        console.error('❌ Logout Error:', error);
        res.status(500).json({ success: false, error: 'LOGOUT_FAILED' });
    }
};

export default { register, login, loginWithPhone, googleLogin, getCurrentUser, logout };

