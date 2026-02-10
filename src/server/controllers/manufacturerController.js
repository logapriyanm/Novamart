/**
 * Manufacturer Controller
 * Management for product lifecycle and dealer network.
 */

import manufacturerService from '../services/manufacturer.js';
import stockAllocationService from '../services/stockAllocationService.js';
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

        // Notify dealer of decision
        const dealer = await prisma.dealer.findUnique({
            where: { id: dealerId },
            include: { user: true }
        });

        if (dealer?.user) {
            await prisma.notification.create({
                data: {
                    userId: dealer.user.id,
                    type: status === 'APPROVED' ? 'REQUEST_APPROVED' : 'REQUEST_REJECTED',
                    title: `Partnership Request ${status}`,
                    message: status === 'APPROVED'
                        ? 'Congratulations! Your partnership request has been approved. You can now start sourcing products.'
                        : 'Your partnership request was not approved at this time. You can reach out to the manufacturer for more details.',
                    link: status === 'APPROVED' ? '/dealer/inventory' : '/dealer/marketplace'
                }
            });
        }

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
        console.log(`[Manufacturer] Fetched ${requests.length} requests for ${mfgId} with status ${status || 'PENDING'}`);
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_REQUESTS' });
    }
};

/**
 * Allocate Stock to Region/Dealer
 */
export const allocateInventory = async (req, res) => {
    const { productId, dealerId, region, quantity, dealerBasePrice, dealerMoq, maxMargin } = req.body;
    const mfgId = req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const result = await stockAllocationService.allocateStock(mfgId, {
            productId,
            dealerId,
            region,
            quantity,
            dealerBasePrice,
            dealerMoq,
            maxMargin
        });
        res.status(201).json({ success: true, message: 'Stock allocated successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Get all active allocations for manufacturer
 */
export const getAllocations = async (req, res) => {
    const mfgId = req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const allocations = await stockAllocationService.getManufacturerAllocations(mfgId);
        res.json({ success: true, data: allocations });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_ALLOCATIONS' });
    }
};

/**
 * Update existing allocation
 */
export const updateAllocation = async (req, res) => {
    const { allocationId } = req.params;
    const updateData = req.body;
    const mfgId = req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const result = await stockAllocationService.updateAllocation(mfgId, allocationId, updateData);
        res.json({ success: true, message: 'Allocation updated successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

/**
 * Revoke stock allocation
 */
export const revokeAllocation = async (req, res) => {
    const { allocationId } = req.params;
    const mfgId = req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });

    try {
        const result = await stockAllocationService.revokeAllocation(mfgId, allocationId);
        res.json({ success: true, message: 'Allocation revoked successfully', data: result });
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
        const [sales, credit, productsCount, requests] = await Promise.all([
            manufacturerService.getSalesAnalytics(mfgId),
            manufacturerService.getCreditStatus(mfgId),
            prisma.product.count({ where: { manufacturerId: mfgId } }),
            manufacturerService.getDealerRequests(mfgId, 'PENDING')
        ]);

        res.json({
            success: true,
            data: {
                sales,
                credit,
                productsCount,
                pendingDealerRequests: requests.length
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

export const getOrders = async (req, res) => {
    const mfgId = req.user.manufacturer?.id;
    if (!mfgId) return res.status(403).json({ error: 'MANUFACTURER_ONLY' });
    try {
        const orders = await prisma.order.findMany({
            where: {
                items: {
                    some: {
                        product: { manufacturerId: mfgId }
                    }
                }
            },
            include: {
                items: {
                    include: { product: true }
                },
                dealer: { select: { businessName: true } },
                customer: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_ORDERS' });
    }
};

/**
 * Get All Manufacturers (For Dealer Marketplace)
 */
export const getAllManufacturers = async (req, res) => {
    try {
        const manufacturers = await prisma.manufacturer.findMany({
            where: {
                user: {
                    status: { not: 'SUSPENDED' }
                }
            },
            include: {
                user: {
                    select: {
                        email: true,
                        status: true
                    }
                },
                products: {
                    where: { status: 'APPROVED' },
                    select: {
                        id: true,
                        name: true,
                        basePrice: true,
                        images: true,
                        category: true,
                        moq: true
                    },
                    take: 6, // Preview products
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: {
                        products: {
                            where: { status: 'APPROVED' }
                        }
                    }
                }
            },
            orderBy: { companyName: 'asc' }
        });

        res.json({
            success: true,
            data: manufacturers
        });
    } catch (error) {
        console.error('Error fetching manufacturers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch manufacturers'
        });
    }
};

export default {
    handleDealerNetwork,
    getDealerRequests,
    allocateInventory,
    getAllocations,
    updateAllocation,
    revokeAllocation,
    getManufacturerStats,
    getMyDealers,
    getProfile,
    updateProfile,
    getOrders,
    getAllManufacturers
};

