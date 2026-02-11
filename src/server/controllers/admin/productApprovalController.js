import { Product } from '../../models/index.js';
import systemEvents, { EVENTS } from '../../lib/systemEvents.js';
import auditService from '../../services/audit.js';

/**
 * Toggle Product Visibility/Status
 */
export const approveProduct = async (req, res) => {
    const { id } = req.params;
    const { isApproved, status, rejectionReason } = req.body;

    try {
        const oldProduct = await Product.findById(id);

        // Determine new status: 
        // If status explicitly provided (like 'DISABLED' for blocking), use it.
        // Otherwise use isApproved boolean logic.
        let newStatus = status;
        if (!newStatus) {
            newStatus = isApproved ? 'APPROVED' : 'REJECTED';
        }

        const product = await Product.findByIdAndUpdate(id, {
            isApproved: newStatus === 'APPROVED',
            status: newStatus,
            rejectionReason: newStatus === 'REJECTED' ? rejectionReason : null
        }, { new: true });

        await auditService.logAction('PRODUCT_STATUS_CHANGE', 'PRODUCT', id, {
            userId: req.user._id,
            oldData: oldProduct,
            newData: product,
            reason: rejectionReason,
            req
        });

        // Emit System Event
        const eventType = newStatus === 'APPROVED' ? EVENTS.PRODUCT.APPROVED : EVENTS.PRODUCT.REJECTED;
        systemEvents.emit(eventType, {
            productId: id,
            productName: product.name,
            manufacturerId: product.manufacturerId
        });

        res.json({
            success: true,
            message: `Product status updated to ${newStatus}`,
            data: product
        });
    } catch (error) {
        res.status(400).json({ success: false, error: 'PRODUCT_STATUS_UPDATE_FAILED' });
    }
};

export const getPendingProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: 'PENDING' })
            .populate('manufacturerId')
            .sort({ updatedAt: -1 });
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_PENDING_PRODUCTS' });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('manufacturerId')
            .sort({ createdAt: -1 });
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
