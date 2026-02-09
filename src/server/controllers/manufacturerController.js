/**
 * Manufacturer Controller
 * Management for product lifecycle and dealer network.
 */

import manufacturerService from '../services/manufacturer.js';
import auditService from '../services/audit.js';
import prisma from '../lib/prisma.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';

/**
 * Handle Dealer Application (Approve/Reject)
 */
export const handleDealerNetwork = async (req, res) => {
    const { dealerId, status } = req.body;
    const mfgId = req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const result = await manufacturerService.handleDealerRequest(mfgId, dealerId, status);

        await auditService.logAction('DEALER_NETWORK_UPDATE', 'MANUFACTURER', mfgId, {
            userId: req.user.id,
            newData: { dealerId, status },
            req
        });

        res.json({ success: true, message: `Dealer request ${status}`, data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Get Dealer Requests
 */
export const getDealerRequests = async (req, res) => {
    const mfgId = req.user.manufacturer?.id;
    const { status } = req.query;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const requests = await manufacturerService.getDealerRequests(mfgId, status || 'PENDING');
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_REQUESTS' });
    }
};

/**
 * Allocate Stock to Region/Dealer
 */
export const allocateInventory = async (req, res) => {
    const { productId, dealerId, region, quantity, price } = req.body;
    const mfgId = req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const result = await manufacturerService.allocateStock(mfgId, productId, dealerId, region, quantity, price);
        res.status(201).json({ success: true, message: 'Stock allocated successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Get Sales & Credit Insights
 */
export const getManufacturerStats = async (req, res) => {
    const mfgId = req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });
    try {
        const [sales, credit, productsCount] = await Promise.all([
            manufacturerService.getSalesAnalytics(mfgId),
            manufacturerService.getCreditStatus(mfgId),
            prisma.product.count({ where: { manufacturerId: mfgId } })
        ]);

        res.json({
            success: true,
            data: {
                sales,
                credit,
                productsCount,
                pendingDealerRequests: 0 // TODO: Implement dealer request logic when model is ready
            }
        });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_ANALYTICS' });
    }
};

/**
 * List Managed Dealers
 */
export const getMyDealers = async (req, res) => {
    const mfgId = req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });
    try {
        const manufacturer = await prisma.manufacturer.findUnique({
            where: { id: mfgId },
            include: { dealersApproved: { include: { user: { select: { email: true, status: true } } } } }
        });
        res.json({ success: true, data: manufacturer.dealersApproved });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_DEALERS' });
    }
};

export const getProfile = async (req, res) => {
    const manufacturer = req.user.manufacturer;
    if (!manufacturer) {
        return res.status(404).json({ success: false, error: 'MANUFACTURER_PROFILE_NOT_FOUND' });
    }
    const mfgId = manufacturer.id;
    try {
        const profile = await manufacturerService.getProfile(mfgId);
        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_PROFILE' });
    }
};

export const updateProfile = async (req, res) => {
    const mfgId = req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });
    const { section, data } = req.body;
    try {
        const result = await manufacturerService.updateProfile(mfgId, section, data);

        await auditService.logAction('PROFILE_UPDATE', 'MANUFACTURER', mfgId, {
            userId: req.user.id,
            section,
            newData: data,
            req
        });

        // Emit System Event
        if (section === 'BANK') {
            systemEvents.emit(EVENTS.COMPLIANCE.BANK_CHANGED, {
                userId: req.user.id,
                manufacturerId: mfgId
            });
        }

        res.json({
            success: true,
            message: `Profile ${section} updated successfully`,
            data: result
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export default {
    handleDealerNetwork,
    getDealerRequests,
    allocateInventory,
    getManufacturerStats,
    getMyDealers,
    getProfile,
    updateProfile
};

