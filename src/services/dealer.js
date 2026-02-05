/**
 * Dealer Service
 * Logic for regional inventory, retail pricing, and fulfillment.
 */

import prisma from '../lib/prisma.js';

class DealerService {
    /**
     * Get Dealer's localized inventory.
     */
    async getInventory(dealerId) {
        return await prisma.inventory.findMany({
            where: { dealerId },
            include: { product: true }
        });
    }

    /**
     * Update Retail Price (Margin Control).
     * Ensures price fits within platform's margin rules.
     */
    async updateRetailPrice(inventoryId, dealerId, newPrice) {
        const inv = await prisma.inventory.findUnique({
            where: { id: inventoryId },
            include: { product: true }
        });

        if (!inv || inv.dealerId !== dealerId) {
            throw new Error('UNAUTHORIZED_INVENTORY_ACCESS');
        }

        // Fetch Margin Rule for the category
        const rule = await prisma.marginRule.findFirst({
            where: { category: inv.product.category, isActive: true }
        });

        if (rule) {
            const basePrice = Number(inv.product.basePrice);
            const maxRetail = basePrice * (1 + Number(rule.maxCap) / 100);

            if (Number(newPrice) > maxRetail) {
                throw new Error(`PRICE_EXCEEDS_MARGIN_CAP: Max allowed is ₹${maxRetail.toFixed(2)}`);
            }
        }

        return await prisma.inventory.update({
            where: { id: inventoryId },
            data: { price: newPrice }
        });
    }

    /**
     * Get Dealer Sales Report.
     */
    async getSalesReport(dealerId) {
        const orders = await prisma.order.findMany({
            where: { dealerId, status: 'SETTLED' },
            include: { items: true }
        });

        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
        const totalTax = orders.reduce((sum, o) => sum + Number(o.taxAmount), 0);
        const marginEarned = orders.reduce((sum, o) => {
            const retail = Number(o.totalAmount);
            const base = retail - Number(o.commissionAmount) - Number(o.taxAmount); // Simplified
            return sum + (retail - base);
        }, 0);

        return {
            totalRevenue,
            totalTax,
            marginEarned,
            settledOrders: orders.length
        };
    }
}

export default new DealerService();
