/**
 * Manufacturer Controller
 * Management for product lifecycle and dealer network.
 */

import manufacturerService from '../../services/manufacturer.js';
import auditService from '../../services/audit.js';
import prisma from '../../lib/prisma.js';

/**
 * Handle Dealer Application (Approve/Reject)
 */
export const handleDealerNetwork = async (req, res) => {
    const { dealerId, status } = req.body;
    const mfgId = req.user.manufacturer.id; // From auth middleware

    try {
        const result = await manufacturerService.handleDealerRequest(mfgId, dealerId, status);

        await auditService.logAction('DEALER_NETWORK_UPDATE', 'MANUFACTURER', mfgId, {
            userId: req.user.id,
            newData: { dealerId, status },
            req
        });

        res.json({ message: `Dealer ${status}`, ...result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Allocate Stock to Region/Dealer
 */
export const allocateInventory = async (req, res) => {
    const { productId, dealerId, region, quantity, price } = req.body;
    try {
        const result = await manufacturerService.allocateStock(productId, dealerId, region, quantity, price);
        res.json({ message: 'Stock allocated successfully', inventory: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Get Sales & Credit Insights
 */
export const getManufacturerStats = async (req, res) => {
    const mfgId = req.user.manufacturer.id;
    try {
        const [sales, credit] = await Promise.all([
            manufacturerService.getSalesAnalytics(mfgId),
            manufacturerService.getCreditStatus(mfgId)
        ]);
        res.json({ sales, credit });
    } catch (error) {
        res.status(500).json({ error: 'FAILED_TO_FETCH_ANALYTICS' });
    }
};

/**
 * List Managed Dealers
 */
export const getMyDealers = async (req, res) => {
    const mfgId = req.user.manufacturer.id;
    try {
        const manufacturer = await prisma.manufacturer.findUnique({
            where: { id: mfgId },
            include: { dealersApproved: { include: { user: { select: { email: true, status: true } } } } }
        });
        res.json(manufacturer.dealersApproved);
    } catch (error) {
        res.status(500).json({ error: 'FAILED_TO_FETCH_DEALERS' });
    }
};

export default {
    handleDealerNetwork,
    allocateInventory,
    getManufacturerStats,
    getMyDealers
};

