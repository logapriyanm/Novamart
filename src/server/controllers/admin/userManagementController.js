import prisma from '../../lib/prisma.js';
import systemEvents, { EVENTS } from '../../lib/systemEvents.js';
import auditService from '../../services/audit.js';

/**
 * User Management
 */
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { id: 'desc' },
            include: {
                documents: true,
                manufacturer: true,
                dealer: true,
                customer: true
            }
        });

        // Map users to include a display 'name'
        const enhancedUsers = users.map(user => ({
            ...user,
            name: user.customer?.name || user.manufacturer?.companyName || user.dealer?.businessName || 'User'
        }));

        res.json({ success: true, data: enhancedUsers });
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_USERS' });
    }
};

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
                },
                approvedBy: true
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
        const updateData = { isVerified };

        const manufacturer = await prisma.manufacturer.update({
            where: { id: manufacturerId },
            data: updateData,
            include: { user: true }
        });

        // Activate user status if verified
        if (isVerified) {
            await prisma.user.update({
                where: { id: manufacturer.userId },
                data: { status: 'ACTIVE' }
            });
        }

        // Optionally assign "VERIFIED" badge if system exists
        try {
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
        } catch (badgeError) {
            console.error('Badge Assignment Failed (Non-critical):', badgeError.message);
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
        console.error('SERVER VERIFICATION ERROR:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            manufacturerId
        });
        res.status(400).json({
            success: false,
            error: 'MANUFACTURER_VERIFICATION_FAILED',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const verifyDealer = async (req, res) => {
    const { dealerId } = req.params;
    const { isVerified } = req.body;
    const adminId = req.user.id;

    try {
        const dealer = await prisma.dealer.update({
            where: { id: dealerId },
            data: { isVerified },
            include: { user: true }
        });

        // Activate user status if verified
        if (isVerified) {
            await prisma.user.update({
                where: { id: dealer.userId },
                data: { status: 'ACTIVE' }
            });
        }

        // Optionally assign "VERIFIED" badge if system exists
        try {
            const badge = await prisma.badge.findUnique({ where: { name: 'VERIFIED' } });
            if (badge && isVerified) {
                await prisma.userBadge.upsert({
                    where: {
                        userId_badgeId: {
                            userId: dealer.userId,
                            badgeId: badge.id
                        }
                    },
                    update: {},
                    create: {
                        userId: dealer.userId,
                        badgeId: badge.id
                    }
                });
            }
        } catch (badgeError) {
            console.error('Badge Assignment Failed (Non-critical):', badgeError.message);
        }

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
        console.error('SERVER VERIFICATION ERROR:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            dealerId
        });
        res.status(400).json({
            success: false,
            error: 'DEALER_VERIFICATION_FAILED',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const updateDealerManufacturers = async (req, res) => {
    const { dealerId } = req.params;
    const { manufacturerId } = req.body;
    const adminId = req.user.id;

    try {
        // Link or unlink based on if manufacturerId is already present
        const currentDealer = await prisma.dealer.findUnique({
            where: { id: dealerId },
            include: { approvedBy: true }
        });

        const isLinked = currentDealer.approvedBy.some(m => m.id === manufacturerId);

        const updatedDealer = await prisma.dealer.update({
            where: { id: dealerId },
            data: {
                approvedBy: isLinked
                    ? { disconnect: { id: manufacturerId } }
                    : { connect: { id: manufacturerId } }
            },
            include: { approvedBy: true, user: true }
        });

        await auditService.logAction('DEALER_MANUFACTURER_LINK', 'DEALER', dealerId, {
            userId: adminId,
            manufacturerId,
            action: isLinked ? 'UNLINK' : 'LINK',
            req
        });

        res.json({
            success: true,
            message: `Manufacturer ${isLinked ? 'unlinked' : 'linked'} successfully`,
            data: updatedDealer
        });
    } catch (error) {
        console.error('Linking failed:', error);
        res.status(400).json({ success: false, error: 'DEALER_MANUFACTURER_LINK_FAILED' });
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
    getUsers,
    manageUser,
    getManufacturers,
    getDealers,
    verifyManufacturer,
    verifyDealer,
    updateDealerManufacturers,
    assignBadge
};
