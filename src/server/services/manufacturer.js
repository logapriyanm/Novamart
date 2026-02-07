/**
 * Manufacturer Service
 * Logic for dealer network management, allocations, and analytics.
 */

import prisma from '../lib/prisma.js';

class ManufacturerService {
    /**
     * Approve or Reject a Dealer's request to join the network.
     */
    async handleDealerRequest(mfgId, dealerId, status) {
        return await prisma.$transaction(async (tx) => {
            if (status === 'APPROVED') {
                await tx.manufacturer.update({
                    where: { id: mfgId },
                    data: {
                        dealersApproved: { connect: { id: dealerId } }
                    }
                });
            } else {
                await tx.manufacturer.update({
                    where: { id: mfgId },
                    data: {
                        dealersApproved: { disconnect: { id: dealerId } }
                    }
                });
            }

            return { mfgId, dealerId, status };
        });
    }

    /**
     * Allocate product stock to a specific dealer/region.
     */
    async allocateStock(productId, dealerId, region, quantity, price) {
        return await prisma.inventory.upsert({
            where: {
                // Since productId + dealerId + region is a logical unique constraint for supply chain
                // We'll use a findFirst or handle via composite key if schema allows.
                // For now, looking for existing record.
                id: (await prisma.inventory.findFirst({
                    where: { productId, dealerId, region }
                }))?.id || 'temp-id'
            },
            update: { stock: { increment: quantity }, price },
            create: { productId, dealerId, region, stock: quantity, price }
        });
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
            include: { items: { include: { product: true } } }
        });

        // Calculate Revenue, Volumes, and Regional distribution
        let totalRevenue = 0;
        const regionalSales = {};
        const productStats = {};

        for (const order of orders) {
            totalRevenue += Number(order.totalAmount);
            for (const item of order.items) {
                const region = order.items[0]?.product?.category; // Simplified regional proxy for now
                regionalSales[region] = (regionalSales[region] || 0) + Number(item.price) * item.quantity;
                productStats[item.productId] = (productStats[item.productId] || 0) + item.quantity;
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
                order: { items: { some: { product: { manufacturerId: mfgId } } } },
                status: { in: ['HOLD', 'FROZEN'] }
            }
        });

        const pendingSettle = escrows.reduce((sum, e) => sum + Number(e.amount), 0);

        return {
            pendingSettlement: pendingSettle,
            activeHoldRecords: escrows.length,
            frozenCount: escrows.filter(e => e.status === 'FROZEN').length
        };
    }
}

export default new ManufacturerService();

