/**
 * Dealer Service
 * Logic for regional inventory, retail pricing, and fulfillment.
 */

import prisma from '../lib/prisma.js';
import userService from './userService.js';

class DealerService {
    /**
     * Get Dealer's localized inventory.
     */
    /**
     * Get specific inventory item with details.
     */
    async getInventoryItem(inventoryId, dealerId) {
        const inv = await prisma.inventory.findUnique({
            where: { id: inventoryId },
            include: {
                product: {
                    include: { manufacturer: { select: { companyName: true } } }
                }
            }
        });

        if (!inv || inv.dealerId !== dealerId) {
            throw new Error('UNAUTHORIZED_INVENTORY_ACCESS');
        }

        return inv;
    }

    async getInventory(dealerId) {
        return await prisma.inventory.findMany({
            where: { dealerId },
            include: { product: true }
        });
    }

    /**
     * Update Retail Price (Margin Control).
     * Ensures price fits within manufacturer constraints or platform rules.
     */
    async updateRetailPrice(inventoryId, dealerId, newPrice) {
        const inv = await prisma.inventory.findUnique({
            where: { id: inventoryId },
            include: { product: true }
        });

        if (!inv || inv.dealerId !== dealerId) {
            throw new Error('UNAUTHORIZED_INVENTORY_ACCESS');
        }

        const requestedPrice = Number(newPrice);
        const wholesalePrice = Number(inv.dealerBasePrice || inv.product.basePrice);

        // Fetch Dealer's active subscription for benefits
        const dealer = await prisma.dealer.findUnique({
            where: { id: dealerId },
            include: {
                subscriptions: {
                    where: { status: 'ACTIVE' },
                    include: { plan: true },
                    take: 1
                }
            }
        });

        const activeSub = dealer?.subscriptions[0];
        const boost = Number(activeSub?.plan?.marginBoost || 0);

        // 1. Check Manufacturer's Max Margin (Phase 4 & 5)
        if (inv.isAllocated && inv.maxMargin) {
            const maxAllowed = wholesalePrice * (1 + (Number(inv.maxMargin) + boost) / 100);
            if (requestedPrice > maxAllowed) {
                throw new Error(`MANUFACTURER_MARGIN_LIMIT: Max allowed price is ₹${maxAllowed.toFixed(2)} (${Number(inv.maxMargin) + boost}% margin with ${boost}% boost)`);
            }
        }

        // 2. Check Platform Margin Rule (Fallback)
        const rule = await prisma.marginRule.findFirst({
            where: { category: inv.product.category, isActive: true }
        });

        if (rule) {
            const maxRetail = wholesalePrice * (1 + (Number(rule.maxCap) + boost) / 100);
            if (requestedPrice > maxRetail) {
                throw new Error(`PLATFORM_MARGIN_CAP: Max allowed is ₹${maxRetail.toFixed(2)} (${Number(rule.maxCap) + boost}% limit with boost)`);
            }
        }


        return await prisma.inventory.update({
            where: { id: inventoryId },
            data: { price: requestedPrice }
        });
    }


    /**
     * Toggle public listing status.
     */
    async toggleListing(inventoryId, dealerId, isListed) {
        const inv = await prisma.inventory.findUnique({
            where: { id: inventoryId }
        });

        if (!inv || inv.dealerId !== dealerId) {
            throw new Error('UNAUTHORIZED_INVENTORY_ACCESS');
        }

        return await prisma.inventory.update({
            where: { id: inventoryId },
            data: {
                isListed,
                listedAt: isListed ? new Date() : inv.listedAt
            }
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
     * Enforces Phase 4 allocation limits and applies Phase 6 subscription benefits.
     */
    async sourceProduct(dealerId, productId, region, quantity, initialPrice) {
        // 0. Profile Completion Gating
        const dealer = await prisma.dealer.findUnique({
            where: { id: dealerId },
            include: { subscriptions: { where: { status: 'ACTIVE' }, include: { plan: true } } }
        });
        const isComplete = dealer?.businessName &&
            dealer?.gstNumber &&
            dealer?.businessAddress &&
            dealer?.bankDetails;

        if (!isComplete) {
            throw new Error('PROFILE_INCOMPLETE: Please complete your Business Info, GST, Address, and Bank sections before sourcing products.');
        }

        // 1. Verify allocation exists (Phase 4 & 5 Requirement)
        const allocation = await prisma.inventory.findFirst({
            where: {
                dealerId,
                productId,
                region,
                isAllocated: true
            },
            include: { product: true }
        });

        if (!allocation) {
            throw new Error('PRODUCT_NOT_ALLOCATED: This product has not been allocated to you by the manufacturer.');
        }

        // 2. Validate allocation limits
        const requestedQty = Number(quantity);
        if (requestedQty > allocation.allocatedStock) {
            throw new Error(`EXCEEDS_ALLOCATION: You are only allocated ${allocation.allocatedStock} units of this product.`);
        }

        if (requestedQty < (allocation.dealerMoq || 1)) {
            throw new Error(`BELOW_MOQ: Minimum order quantity is ${allocation.dealerMoq} units.`);
        }

        // 3. Apply Phase 6 Subscription Benefits (Wholesale Discount)
        let finalPrice = Number(allocation.dealerBasePrice || allocation.product.basePrice);
        const activeSub = dealer.subscriptions[0];
        if (activeSub && activeSub.plan?.wholesaleDiscount > 0) {
            const discount = Number(activeSub.plan.wholesaleDiscount);
            finalPrice = finalPrice * (1 - discount / 100);
        }

        // 4. Update the existing allocation record with physical stock and retail price
        return await prisma.inventory.update({
            where: { id: allocation.id },
            data: {
                stock: { increment: requestedQty },
                price: Number(initialPrice) || finalPrice, // Initial retail price
                originalPrice: finalPrice, // Wholesale price paid by dealer (after discount)
                isListed: true,
                listedAt: new Date()
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
        const dealer = await prisma.dealer.findUnique({ where: { id: dealerId } });
        if (!dealer) throw new Error('DEALER_NOT_FOUND');

        return await userService.updateFullProfile(dealer.userId, 'DEALER', section, data);
    }

    /**
     * Discovery: Fetch manufacturers and their top products.
     */
    async getManufacturersForDiscovery() {
        return await prisma.manufacturer.findMany({
            where: {
                user: { status: { not: 'SUSPENDED' } }
            },
            include: {
                user: { select: { email: true, status: true } },
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
                    take: 6,
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: {
                        products: { where: { status: 'APPROVED' } }
                    }
                }
            },
            orderBy: { companyName: 'asc' }
        });
    }

    /**
     * Request access to a manufacturer's product line.
     */
    async requestAccess(dealerId, manufacturerId, metadata = {}) {
        const { message, expectedQuantity, region, priceExpectation } = metadata;

        // Check for existing request
        // Check for existing request (Status Agnostic)
        const existing = await prisma.dealerRequest.findFirst({
            where: {
                dealerId,
                manufacturerId
            }
        });

        if (existing) {
            if (existing.status === 'PENDING') throw new Error('Request already sent. Please wait for approval.');
            if (existing.status === 'APPROVED') throw new Error('You are already an approved dealer for this manufacturer.');

            // If REJECTED or other, allow re-application by updating
            return await prisma.dealerRequest.update({
                where: { id: existing.id },
                data: {
                    status: 'PENDING',
                    message: message || existing.message,
                    metadata: {
                        expectedQuantity,
                        region,
                        priceExpectation
                    },
                    createdAt: new Date() // Treat as new request
                }
            });
        }

        return await prisma.$transaction(async (tx) => {
            const request = await tx.dealerRequest.create({
                data: {
                    dealerId,
                    manufacturerId,
                    message: message || '',
                    status: 'PENDING',
                    metadata: {
                        expectedQuantity,
                        region,
                        priceExpectation
                    }
                },
                include: {
                    manufacturer: { select: { companyName: true, user: true } }
                }
            });

            // Create notification for manufacturer
            if (request.manufacturer.user) {
                const dealer = await tx.dealer.findUnique({ where: { id: dealerId } });
                await tx.notification.create({
                    data: {
                        userId: request.manufacturer.user.id,
                        type: 'DEALER_REQUEST',
                        title: 'New Dealer Partnership Request',
                        message: `${dealer.businessName} has requested access to your products.`,
                        link: '/manufacturer/dealers/requests'
                    }
                });
            }

            return request;
        });
    }

    /**
     * Get Dealer's own requests.
     */
    async getMyAccessRequests(dealerId) {
        return await prisma.dealerRequest.findMany({
            where: { dealerId },
            include: {
                manufacturer: {
                    select: {
                        companyName: true,
                        factoryAddress: true,
                        logo: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}

export default new DealerService();
