/**
 * Manufacturer Service
 * Logic for dealer network management, allocations, and analytics.
 */

import prisma from '../lib/prisma.js';
import userService from './userService.js';

class ManufacturerService {
    /**
     * Approve or Reject a Dealer's request to join the network.
     */
    /**
     * Approve or Reject a Dealer's request to join the network.
     */
    async handleDealerRequest(mfgId, dealerId, status) {
        return await prisma.$transaction(async (tx) => {
            const requestStatus = status === 'APPROVED' ? 'APPROVED' : 'REJECTED';

            // 1. Upsert the DealerRequest record (Create if handling an implicit request)
            const request = await tx.dealerRequest.upsert({
                where: {
                    dealerId_manufacturerId: {
                        dealerId,
                        manufacturerId: mfgId
                    }
                },
                update: { status: requestStatus },
                create: {
                    dealerId,
                    manufacturerId: mfgId,
                    status: requestStatus,
                    message: 'Auto-created upon approval'
                }
            });

            // 2. If approved, connect in the many-to-many relation AND verify the dealer globally if needed
            if (status === 'APPROVED') {
                await tx.manufacturer.update({
                    where: { id: mfgId },
                    data: {
                        dealersApproved: { connect: { id: dealerId } }
                    }
                });

                // Optionally mark dealer as verified globally if this is the main authority
                const dealer = await tx.dealer.update({
                    where: { id: dealerId },
                    data: { isVerified: true },
                    select: { userId: true }
                });

                // Ensure the User is ACTIVE so they can access the platform
                await tx.user.update({
                    where: { id: dealer.userId },
                    data: { status: 'ACTIVE' }
                });
            } else {
                await tx.manufacturer.update({
                    where: { id: mfgId },
                    data: {
                        dealersApproved: { disconnect: { id: dealerId } }
                    }
                });
            }

            return { mfgId, dealerId, status: requestStatus };
        });
    }

    /**
     * Get pending or processed dealer requests for a manufacturer.
     * INCLUDES: Explicit requests AND Orphaned unverified dealers (Implicit Requests)
     */
    async getDealerRequests(mfgId, statusFilter = 'PENDING') {
        const requests = await prisma.dealerRequest.findMany({
            where: {
                manufacturerId: mfgId,
                status: statusFilter
            },
            include: {
                dealer: {
                    include: {
                        user: { select: { email: true, phone: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // If filtering for PENDING, also fetch dealers who have NO requests and are unverified
        if (statusFilter === 'PENDING') {
            const implicitDealers = await prisma.dealer.findMany({
                where: {
                    isVerified: false,
                    partnershipRequests: { none: { manufacturerId: mfgId } } // Not already requested/handled
                },
                include: {
                    user: { select: { email: true, phone: true } }
                }
            });

            const implicitRequests = implicitDealers.map(dealer => ({
                id: `temp-${dealer.id}`,
                dealerId: dealer.id,
                manufacturerId: mfgId,
                status: 'PENDING',
                message: 'New Registration (Pending Verification)',
                createdAt: dealer.user?.createdAt || new Date(), // Fallback to now if user relation issue, but strictly dealer should have created at
                dealer: dealer
            }));

            return [...requests, ...implicitRequests];
        }

        return requests;
    }


    /**
     * Get Sales Analytics for Manufacturer.
     */
    async getSalesAnalytics(mfgId) {
        // Find all orders involving dealers associated with this manufacturer
        const orders = await prisma.order.findMany({
            where: {
                dealer: { approvedBy: { some: { id: mfgId } } },
                status: 'SETTLED'
            },
            include: { items: { include: { linkedProduct: true } } }
        });

        // Calculate Revenue, Volumes, and Regional distribution
        let totalRevenue = 0;
        const regionalSales = {};
        const productStats = {};

        for (const order of orders) {
            for (const item of order.items) {
                // Only count items belonging to this manufacturer
                if (item.linkedProduct.manufacturerId === mfgId) {
                    const lineTotal = Number(item.price) * item.quantity;
                    totalRevenue += lineTotal;

                    const region = item.linkedProduct.category; // Using category as proxy for region
                    regionalSales[region] = (regionalSales[region] || 0) + lineTotal;
                    productStats[item.productId] = (productStats[item.productId] || 0) + item.quantity;
                }
            }
        }

        return {
            totalRevenue,
            totalOrders: orders.length,
            regionalSales,
            topProducts: Object.entries(productStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
        };
    }

    /**
     * Credit & Escrow Tracking.
     */
    async getCreditStatus(mfgId) {
        const escrows = await prisma.escrow.findMany({
            where: {
                order: { items: { some: { linkedProduct: { manufacturerId: mfgId } } } },
                status: { in: ['HOLD', 'FROZEN'] }
            },
            include: {
                order: {
                    include: {
                        items: {
                            where: { linkedProduct: { manufacturerId: mfgId } }
                        }
                    }
                }
            }
        });

        // Sum up only the portions of these escrows belonging to the manufacturer
        let pendingSettle = 0;
        let frozenCount = 0;

        for (const escrow of escrows) {
            for (const item of escrow.order.items) {
                pendingSettle += Number(item.price) * item.quantity;
            }
            if (escrow.status === 'FROZEN') {
                frozenCount++;
            }
        }

        return {
            pendingSettlement: pendingSettle,
            activeHoldRecords: escrows.length,
            frozenCount
        };
    }

    /**
     * Get full Manufacturer Profile.
     */
    async getProfile(mfgId) {
        return await prisma.manufacturer.findUnique({
            where: { id: mfgId },
            include: { user: { select: { email: true, status: true, mfaEnabled: true } }, dealersApproved: true }
        });
    }

    /**
     * Update Manufacturer Profile Sections.
     */
    async updateProfile(mfgId, section, data) {
        const mfg = await prisma.manufacturer.findUnique({ where: { id: mfgId } });
        if (!mfg) throw new Error('MANUFACTURER_NOT_FOUND');

        return await userService.updateFullProfile(mfg.userId, 'MANUFACTURER', section, data);
    }
}

export default new ManufacturerService();

