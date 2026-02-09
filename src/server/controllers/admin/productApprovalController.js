import prisma from '../../lib/prisma.js';
import systemEvents, { EVENTS } from '../../lib/systemEvents.js';
import auditService from '../../services/audit.js';

/**
 * Product Approval Queue
 */
export const approveProduct = async (req, res) => {
    const { id } = req.params;
    const { isApproved, rejectionReason } = req.body;

    try {
        const oldProduct = await prisma.product.findUnique({ where: { id } });
        const product = await prisma.product.update({
            where: { id },
            data: {
                isApproved,
                status: isApproved ? 'APPROVED' : 'REJECTED',
                rejectionReason: isApproved ? null : rejectionReason
            }
        });

        await auditService.logAction('PRODUCT_APPROVAL', 'PRODUCT', id, {
            userId: req.user.id,
            oldData: oldProduct,
            newData: product,
            reason: rejectionReason,
            req
        });

        // Emit System Event
        systemEvents.emit(isApproved ? EVENTS.PRODUCT.APPROVED : EVENTS.PRODUCT.REJECTED, {
            productId: id,
            productName: product.name,
            manufacturerId: product.manufacturerId
        });

        res.json({
            success: true,
            message: isApproved ? 'Product Approved' : 'Product Rejected',
            data: product
        });
    } catch (error) {
        res.status(400).json({ success: false, error: 'PRODUCT_APPROVAL_FAILED' });
    }
};

export const getPendingProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { status: 'PENDING' },
            include: { manufacturer: true },
            orderBy: { updatedAt: 'desc' }
        });
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_PENDING_PRODUCTS' });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: { manufacturer: true },
            orderBy: { id: 'desc' }
        });
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_PRODUCTS' });
    }
};

export default {
    approveProduct,
    getPendingProducts,
    getAllProducts
};
