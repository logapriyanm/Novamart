import { User, Manufacturer, Seller, Customer, KYCDocument, Badge } from '../../models/index.js';
import systemEvents, { EVENTS } from '../../lib/systemEvents.js';
import auditService from '../../services/audit.js';

/**
 * User Management
 */
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        // Mongoose doesn't support easy multi-model inclusion like Prisma in one go without complex lookups
        // But we can manually populate or use aggregation. For admin, simple map is okay if volume is low, 
        // but better to use Mongoose population if possible.
        // However, Manufacturer/Dealer/Customer are separate collections.

        const enhancedUsers = await Promise.all(users.map(async (user) => {
            const userId = user._id;
            const manufacturer = await Manufacturer.findOne({ userId });
            const seller = await Seller.findOne({ userId });
            const customer = await Customer.findOne({ userId });
            const kyc = await KYCDocument.findOne({ userId });

            return {
                ...user.toObject(),
                name: customer?.name || manufacturer?.companyName || seller?.businessName || 'User',
                manufacturer,
                dealer: seller,
                customer,
                documents: kyc ? kyc.documents : []
            };
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
        const oldUser = await User.findById(id);
        const user = await User.findByIdAndUpdate(id, { status }, { new: true });

        await auditService.logAction('USER_STATUS_UPDATE', 'USER', id, {
            userId: req.user._id,
            oldData: oldUser,
            newData: user,
            reason: adminReason,
            req
        });

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
        const manufacturers = await Manufacturer.find().populate('userId', 'email status').sort({ createdAt: -1 });
        res.json({
            success: true,
            data: manufacturers
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_MANUFACTURERS' });
    }
};

export const getSellers = async (req, res) => {
    try {
        const sellers = await Seller.find()
            .populate('userId', 'email status')
            .populate('approvedBy')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            data: sellers
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_SELLERS' });
    }
};

export const verifyManufacturer = async (req, res) => {
    const { manufacturerId } = req.params;
    const { isVerified } = req.body;
    const adminId = req.user._id;

    try {
        const manufacturer = await Manufacturer.findByIdAndUpdate(manufacturerId, { isVerified }, { new: true }).populate('userId');

        if (isVerified) {
            await User.findByIdAndUpdate(manufacturer.userId._id, { status: 'ACTIVE' });
        }

        try {
            const badge = await Badge.findOne({ name: 'VERIFIED' });
            if (badge && isVerified) {
                await User.findByIdAndUpdate(manufacturer.userId._id, {
                    $addToSet: { badges: { badgeId: badge._id } }
                });
            }
        } catch (badgeError) {
            console.error('Badge Assignment Failed:', badgeError.message);
        }

        await auditService.logAction('MANUFACTURER_VERIFICATION', 'MANUFACTURER', manufacturerId, {
            userId: adminId,
            isVerified,
            req
        });

        systemEvents.emit(isVerified ? EVENTS.AUTH.VERIFIED : EVENTS.AUTH.REJECTED, {
            userId: manufacturer.userId._id,
            userName: manufacturer.companyName
        });

        res.json({
            success: true,
            message: `Manufacturer ${isVerified ? 'Verified' : 'Unverified'}`,
            data: manufacturer
        });
    } catch (error) {
        console.error('MANUFACTURER VERIFICATION ERROR:', error);
        res.status(400).json({ success: false, error: 'MANUFACTURER_VERIFICATION_FAILED' });
    }
};

export const verifySeller = async (req, res) => {
    const { sellerId, dealerId } = req.params;
    const id = sellerId || dealerId; // Handle both sellerId and dealerId
    const { isVerified } = req.body;
    const adminId = req.user._id;

    try {
        const seller = await Seller.findByIdAndUpdate(id, { isVerified }, { new: true }).populate('userId');

        if (isVerified) {
            await User.findByIdAndUpdate(seller.userId._id, { status: 'ACTIVE' });
        }

        try {
            const badge = await Badge.findOne({ name: 'VERIFIED' });
            if (badge && isVerified) {
                await User.findByIdAndUpdate(seller.userId._id, {
                    $addToSet: { badges: { badgeId: badge._id } }
                });
            }
        } catch (badgeError) {
            console.error('Badge Assignment Failed:', badgeError.message);
        }

        await auditService.logAction('SELLER_VERIFICATION', 'SELLER', id, {
            userId: adminId,
            isVerified,
            req
        });

        systemEvents.emit(isVerified ? EVENTS.AUTH.VERIFIED : EVENTS.AUTH.REJECTED, {
            userId: seller.userId._id,
            userName: seller.businessName
        });

        res.json({
            success: true,
            message: `Seller ${isVerified ? 'Verified' : 'Unverified'}`,
            data: seller
        });
    } catch (error) {
        console.error('SELLER VERIFICATION ERROR:', error);
        res.status(400).json({ success: false, error: 'SELLER_VERIFICATION_FAILED' });
    }
};

export const updateSellerManufacturers = async (req, res) => {
    const { sellerId, dealerId } = req.params;
    const id = sellerId || dealerId; // Handle both sellerId and dealerId
    const { manufacturerId } = req.body;
    const adminId = req.user._id;

    try {
        const currentSeller = await Seller.findById(id);
        const isLinked = currentSeller.approvedBy.includes(manufacturerId);

        const updateAction = isLinked
            ? { $pull: { approvedBy: manufacturerId } }
            : { $addToSet: { approvedBy: manufacturerId } };

        const updatedSeller = await Seller.findByIdAndUpdate(id, updateAction, { new: true })
            .populate('approvedBy')
            .populate('userId');

        await auditService.logAction('SELLER_MANUFACTURER_LINK', 'SELLER', id, {
            userId: adminId,
            manufacturerId,
            action: isLinked ? 'UNLINK' : 'LINK',
            req
        });

        res.json({
            success: true,
            message: `Manufacturer ${isLinked ? 'unlinked' : 'linked'} successfully`,
            data: updatedSeller
        });
    } catch (error) {
        console.error('Linking failed:', error);
        res.status(400).json({ success: false, error: 'SELLER_MANUFACTURER_LINK_FAILED' });
    }
};

export const assignBadge = async (req, res) => {
    const { userId, badgeId } = req.body;
    const adminId = req.user._id;
    try {
        const user = await User.findByIdAndUpdate(userId, {
            $addToSet: { badges: { badgeId } }
        }, { new: true });
        res.json({ success: true, message: 'Badge assigned successfully', data: user.badges });
    } catch (error) {
        res.status(400).json({ success: false, error: 'BADGE_ASSIGNMENT_FAILED' });
    }
};

export default {
    getUsers,
    manageUser,
    getManufacturers,
    getSellers,
    verifyManufacturer,
    verifySeller,
    updateSellerManufacturers,
    assignBadge
};
