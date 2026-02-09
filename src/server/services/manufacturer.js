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
            const requestStatus = status === 'APPROVED' ? 'APPROVED' : 'REJECTED';

            // 1. Update the DealerRequest record
            await tx.dealerRequest.update({
                where: {
                    dealerId_manufacturerId: {
                        dealerId,
                        manufacturerId: mfgId
                    }
                },
                data: { status: requestStatus }
            });

            // 2. If approved, connect in the many-to-many relation
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

            return { mfgId, dealerId, status: requestStatus };
        });
    }

    /**
     * Get pending or processed dealer requests for a manufacturer.
     */
    async getDealerRequests(mfgId, statusFilter = 'PENDING') {
        return await prisma.dealerRequest.findMany({
            where: {
                manufacturerId: mfgId,
                status: statusFilter
            },
            include: {
                dealer: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                phone: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Allocate product stock to a specific dealer/region.
     */
    async allocateStock(mfgId, productId, dealerId, region, quantity, price) {
        // 1. Verify Product Ownership
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product || product.manufacturerId !== mfgId) {
            throw new Error('UNAUTHORIZED_PRODUCT_ALLOCATION');
        }

        // 2. Verify Dealer is in network
        const manufacturer = await prisma.manufacturer.findUnique({
            where: { id: mfgId },
            include: { dealersApproved: true }
        });

        const isApproved = manufacturer.dealersApproved.some(d => d.id === dealerId);
        if (!isApproved) {
            throw new Error('DEALER_NOT_IN_NETWORK');
        }

        return await prisma.inventory.upsert({
            where: {
                // Using findFirst to avoid composite key complexity if not defined
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
        const updateData = {};

        switch (section) {
            case 'account':
                return await prisma.$transaction(async (tx) => {
                    const mfg = await tx.manufacturer.findUnique({ where: { id: mfgId } });
                    await tx.user.update({
                        where: { id: mfg.userId },
                        data: {
                            email: data.email,
                            phone: data.phone,
                            avatar: data.avatar
                        }
                    });
                    return await tx.manufacturer.findUnique({
                        where: { id: mfgId },
                        include: { user: true }
                    });
                });
            case 'company':
                updateData.companyName = data.companyName;
                updateData.registrationNo = data.registrationNo;
                updateData.businessType = data.businessType;
                updateData.officialEmail = data.officialEmail;
                updateData.phone = data.phone;
                break;
            case 'factory':
                updateData.factoryAddress = data.factoryAddress;
                updateData.capacity = data.capacity;
                updateData.categoriesProduced = data.categoriesProduced;
                break;
            case 'compliance':
                updateData.gstNumber = data.gstNumber;
                updateData.certifications = data.certifications;
                break;
            case 'assets':
                updateData.logo = data.logo;
                updateData.brandDescription = data.brandDescription;
                updateData.marketingMaterials = data.marketingMaterials;
                break;
            case 'bank':
                updateData.bankDetails = data.bankDetails;
                break;
            default:
                throw new Error('INVALID_PROFILE_SECTION');
        }

        return await prisma.manufacturer.update({
            where: { id: mfgId },
            data: updateData
        });
    }
}

export default new ManufacturerService();

