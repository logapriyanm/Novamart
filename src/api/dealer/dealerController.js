/**
 * Dealer Controller
 * Management for regional fulfillment and retail ops.
 */

import dealerService from '../../services/dealer.js';
import orderService from '../../services/order.js';
import auditService from '../../services/audit.js';

/**
 * Get Local Inventory
 */
export const getMyInventory = async (req, res) => {
    const dealerId = req.user.dealer.id;
    try {
        const inventory = await dealerService.getInventory(dealerId);
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: 'FAILED_TO_FETCH_INVENTORY' });
    }
};

/**
 * Update Retail Pricing
 */
export const updatePrice = async (req, res) => {
    const dealerId = req.user.dealer.id;
    const { inventoryId, price } = req.body;
    try {
        const result = await dealerService.updateRetailPrice(inventoryId, dealerId, price);

        await auditService.logAction('RETAIL_PRICE_UPDATE', 'INVENTORY', inventoryId, {
            userId: req.user.id,
            newData: { price },
            req
        });

        res.json({ message: 'Price updated successfully', inventory: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Dashboard & Reports
 */
export const getDealerStats = async (req, res) => {
    const dealerId = req.user.dealer.id;
    try {
        const stats = await dealerService.getSalesReport(dealerId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'FAILED_TO_FETCH_STATS' });
    }
};

/**
 * Order Fulfillment Actions
 */
export const confirmOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const result = await orderService.confirmOrder(orderId);
        res.json({ message: 'Order confirmed', order: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const shipOrder = async (req, res) => {
    const { orderId } = req.params;
    const { trackingNumber } = req.body;
    try {
        const result = await orderService.shipOrder(orderId, trackingNumber);
        res.json({ message: 'Order shipped', order: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Handle Order Payout/Settlement Trigger (Mock)
 */
export const requestSettlement = async (req, res) => {
    const { orderId } = req.params;
    res.json({ message: 'Payout status: PENDING_WINDOW', orderId });
};

export default {
    getMyInventory,
    updatePrice,
    getDealerStats,
    requestSettlement,
    confirmOrder,
    shipOrder
};
