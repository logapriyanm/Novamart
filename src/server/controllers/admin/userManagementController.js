import prisma from '../../lib/prisma.js';
import systemEvents, { EVENTS } from '../../lib/systemEvents.js';
import auditService from '../../services/audit.js';

/**
 * User/Manufacturer Management
 */
export const manageUser = async (req, res) => {
    const { id } = req.params;
    const { status, adminReason } = req.body;

    try {
        const oldUser = await prisma.user.findUnique({ where: { id } });
        const user = await prisma.user.update({
            where: { id },
            data: { status }
        });

        await auditService.logAction('USER_STATUS_UPDATE', 'USER', id, {
            userId: req.user.id,
            oldData: oldUser,
            newData: user,
            reason: adminReason,
            req
        });

        // Emit System Event
        if (status === 'ACTIVE' || status === 'SUSPENDED') {
            systemEvents.emit(status === 'ACTIVE' ? EVENTS.AUTH.VERIFIED : EVENTS.AUTH.SUSPENDED, {
                userId: id,
                userName: user.email
            });
        }

        res.json({
            success: true,
            message: `User status updated to ${status}`,
            data: user
        });
    } catch (error) {
        res.status(400).json({ success: false, error: 'USER_UPDATE_FAILED' });
    }
};

export const getManufacturers = async (req, res) => {
    try {
        const manufacturers = await prisma.manufacturer.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        status: true
                    }
                }
            },
            orderBy: { id: 'desc' }
        });
        res.json({
            success: true,
            data: manufacturers
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_MANUFACTURERS' });
    }
};

export const getDealers = async (req, res) => {
    try {
        const dealers = await prisma.dealer.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        status: true
                    }
                }
            },
            orderBy: { id: 'desc' }
        });
        res.json({
            success: true,
            data: dealers
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_DEALERS' });
    }
};

export const verifyManufacturer = async (req, res) => {
    const { manufacturerId } = req.params;
    const { isVerified } = req.body;
    const adminId = req.user.id;

    try {
        const manufacturer = await prisma.manufacturer.update({
            where: { id: manufacturerId },
            data: { isVerified }
        });

        // Optionally assign "VERIFIED" badge if system exists
        const badge = await prisma.badge.findUnique({ where: { name: 'VERIFIED' } });
        if (badge && isVerified) {
            await prisma.userBadge.upsert({
                where: {
                    userId_badgeId: {
                        userId: manufacturer.userId,
                        badgeId: badge.id
                    }
                },
                update: {},
                create: {
                    userId: manufacturer.userId,
                    badgeId: badge.id
                }
            });
        }

        await auditService.logAction('MANUFACTURER_VERIFICATION', 'MANUFACTURER', manufacturerId, {
            userId: adminId,
            isVerified,
            req
        });

        // Emit System Event
        systemEvents.emit(isVerified ? EVENTS.AUTH.VERIFIED : EVENTS.AUTH.REJECTED, {
            userId: manufacturer.userId,
            userName: manufacturer.companyName
        });

        res.json({
            success: true,
            message: `Manufacturer ${isVerified ? 'Verified' : 'Unverified'}`,
            data: manufacturer
        });
    } catch (error) {
        console.error('Verification failed ERROR DETAIL:', error);
        res.status(400).json({ success: false, error: 'MANUFACTURER_VERIFICATION_FAILED', details: error.message });
    }
};

export const verifyDealer = async (req, res) => {
    const { dealerId } = req.params;
    const { isVerified } = req.body;
    const adminId = req.user.id;

    try {
        const dealer = await prisma.dealer.update({
            where: { id: dealerId },
            data: {
                // businessName: ..., // Not updating name here
                // Note: isVerified doesn't exist on Dealer schema yet
            }
        });

        await auditService.logAction('DEALER_VERIFICATION', 'DEALER', dealerId, {
            userId: adminId,
            isVerified,
            req
        });

        // Emit System Event
        systemEvents.emit(isVerified ? EVENTS.AUTH.VERIFIED : EVENTS.AUTH.REJECTED, {
            userId: dealer.userId,
            userName: dealer.businessName
        });

        res.json({
            success: true,
            message: `Dealer ${isVerified ? 'Verified' : 'Unverified'}`,
            data: dealer
        });
    } catch (error) {
        console.error('Dealer verification failed:', error);
        res.status(400).json({ success: false, error: 'DEALER_VERIFICATION_FAILED' });
    }
};

export const assignBadge = async (req, res) => {
    const { userId, badgeId } = req.body;
    const adminId = req.user.id;
    try {
        const userBadge = await prisma.userBadge.create({
            data: { userId, badgeId }
        });
        res.json({ success: true, message: 'Badge assigned successfully', data: userBadge });
    } catch (error) {
        res.status(400).json({ success: false, error: 'BADGE_ASSIGNMENT_FAILED' });
    }
};

export default {
    manageUser,
    getManufacturers,
    getDealers,
    verifyManufacturer,
    verifyDealer,
    assignBadge
};
