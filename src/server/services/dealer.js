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
     * Update Stock Levels.
     */
    async updateStock(inventoryId, dealerId, newStock) {
        const inv = await prisma.inventory.findUnique({
            where: { id: inventoryId }
        });

        if (!inv || inv.dealerId !== dealerId) {
            throw new Error('UNAUTHORIZED_INVENTORY_ACCESS');
        }

        return await prisma.inventory.update({
            where: { id: inventoryId },
            data: { stock: Number(newStock) }
        });
    }

    /**
     * Source a product from a manufacturer.
     * Creates an inventory record for the dealer.
     */
    async sourceProduct(dealerId, productId, region, stock, initialPrice) {
        // 0. Profile Completion Gating
        const dealer = await prisma.dealer.findUnique({ where: { id: dealerId } });
        const isComplete = dealer?.businessName &&
            dealer?.gstNumber &&
            dealer?.businessAddress &&
            dealer?.bankDetails;

        if (!isComplete) {
            throw new Error('PROFILE_INCOMPLETE: Please complete your Business Info, GST, Address, and Bank sections before sourcing products.');
        }

        // 1. Verify product exists and is approved
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product || product.status !== 'APPROVED') {
            throw new Error('PRODUCT_NOT_AVAILABLE_FOR_SOURCING');
        }

        // 2. Check if already sourced
        const existing = await prisma.inventory.findFirst({
            where: { dealerId, productId }
        });

        if (existing) {
            throw new Error('PRODUCT_ALREADY_SOURCED');
        }

        // 3. Create inventory entry
        return await prisma.inventory.create({
            data: {
                dealerId,
                productId,
                region,
                stock: Number(stock),
                price: Number(initialPrice),
                originalPrice: Number(initialPrice)
            }
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

    /**
     * Get full Dealer Profile.
     */
    async getProfile(dealerId) {
        return await prisma.dealer.findUnique({
            where: { id: dealerId },
            include: { user: { select: { email: true, status: true, mfaEnabled: true } } }
        });
    }

    /**
     * Update Dealer Profile Sections.
     */
    async updateProfile(dealerId, section, data) {
        const updateData = {};

        switch (section) {
            case 'account':
                return await prisma.$transaction(async (tx) => {
                    const dealer = await tx.dealer.findUnique({ where: { id: dealerId } });
                    await tx.user.update({
                        where: { id: dealer.userId },
                        data: {
                            email: data.email,
                            phone: data.phone,
                            avatar: data.avatar
                        }
                    });
                    return await tx.dealer.findUnique({
                        where: { id: dealerId },
                        include: { user: true }
                    });
                });
            case 'business':
                updateData.businessName = data.businessName;
                updateData.ownerName = data.ownerName;
                updateData.businessType = data.businessType;
                updateData.contactEmail = data.contactEmail;
                updateData.phone = data.phone;
                break;
            case 'compliance':
                updateData.gstNumber = data.gstNumber;
                updateData.gstCertificate = data.gstCertificate;
                updateData.businessRegDoc = data.businessRegDoc;
                break;
            case 'address':
                updateData.businessAddress = data.businessAddress;
                updateData.city = data.city;
                updateData.state = data.state;
                updateData.pincode = data.pincode;
                updateData.serviceRegions = data.serviceRegions;
                break;
            case 'bank':
                updateData.bankDetails = data.bankDetails;
                updateData.payoutBlocked = true; // Rule: Changing bank pauses payouts
                break;
            default:
                throw new Error('INVALID_PROFILE_SECTION');
        }

        return await prisma.dealer.update({
            where: { id: dealerId },
            data: updateData
        });
    }
}

export default new DealerService();

