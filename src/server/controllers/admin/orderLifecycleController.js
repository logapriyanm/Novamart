import { Order } from '../../models/index.js';
import orderService from '../../services/order.js';

/**
 * Order Lifecycle Management
 */
export const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { action, trackingNumber, carrier, reason } = req.body;

    try {
        let result;
        switch (action) {
            case 'CONFIRM': result = await orderService.confirmOrder(orderId); break;
            case 'SHIP': result = await orderService.shipOrder(orderId, `${carrier}: ${trackingNumber}`); break;
            case 'DELIVER': result = await orderService.deliverOrder(orderId); break;
            case 'CANCEL': result = await orderService.cancelOrder(orderId, reason); break;
            default: throw new Error('Invalid action');
        }
        res.json({
            success: true,
            message: `Order updated to ${result.status}`,
            data: result
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Inventory Audit
 */
export const auditInventory = async (req, res) => {
    try {
        const result = await orderService.auditStock();
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: 'INVENTORY_AUDIT_FAILED' });
    }
};

/**
 * Global Order View
 */
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customerId', 'name email')
            .populate('dealerId', 'businessName')
            .populate('items.inventoryId')
            .sort({ createdAt: -1 });

        // Items in MongoDB Order model have inventoryId which might need further population
        // The Prisma include was items { include { linkedProduct: true } }
        // In Mongoose, we might need deep population

        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Fetch Orders Error:', error);
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_ORDERS' });
    }
};

export default {
    updateOrderStatus,
    auditInventory,
    getAllOrders
};
