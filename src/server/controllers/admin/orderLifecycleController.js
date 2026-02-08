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

export default {
    updateOrderStatus,
    auditInventory
};
