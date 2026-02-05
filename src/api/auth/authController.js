import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma.js';
import auditService from '../../services/audit.js';
import { verifyOTP } from './otpController.js';

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
                status: roleUpper === 'CUSTOMER' ? 'ACTIVE' :
                    roleUpper === 'MANUFACTURER' ? 'UNDER_VERIFICATION' : 'PENDING'
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

        res.status(201).json({ message: 'REGISTRATION_SUCCESSFUL', user: { id: user.id, role: user.role, status: user.status } });
    } catch (error) {
        res.status(400).json({ error: 'REGISTRATION_FAILED', details: error.message });
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

        res.json({ token, role: user.role, status: user.status });
    } catch (error) {
        res.status(500).json({ error: 'LOGIN_FAILED' });
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

        res.json({ token, role: user.role, status: user.status });
    } catch (error) {
        res.status(500).json({ error: 'PHONE_LOGIN_FAILED' });
    }
};

export default { register, login, loginWithPhone };
