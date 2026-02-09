/**
 * Stock Allocation Service
 * Logic for manufacturers to allocate stock, set dealer-specific pricing and MOQ.
 */

import prisma from '../lib/prisma.js';

class StockAllocationService {
    /**
     * Allocate stock to a dealer for a specific product.
     * Updates or creates an inventory record with allocation constraints.
     */
    async allocateStock(mfgId, { productId, dealerId, region, quantity, dealerBasePrice, dealerMoq, maxMargin }) {
        // 1. Verify Product Ownership
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product || product.manufacturerId !== mfgId) {
            throw new Error('UNAUTHORIZED_PRODUCT_ALLOCATION');
        }

        // 2. Verify Dealer is in network (Approved)
        const isApproved = await prisma.manufacturer.findFirst({
            where: {
                id: mfgId,
                dealersApproved: { some: { id: dealerId } }
            }
        });

        if (!isApproved) {
            throw new Error('DEALER_NOT_IN_NETWORK');
        }

        // 3. Check if dealer is blocked (Phase 8 integration)
        const isBlocked = await prisma.manufacturerDealerBlock.findUnique({
            where: {
                manufacturerId_dealerId: {
                    manufacturerId: mfgId,
                    dealerId: dealerId
                }
            }
        });

        if (isBlocked && isBlocked.isActive) {
            throw new Error('DEALER_IS_BLOCKED');
        }

        // 4. Update or Create Inventory Record
        return await prisma.inventory.upsert({
            where: {
                // Find by product, dealer, and region
                id: (await prisma.inventory.findFirst({
                    where: { productId, dealerId, region }
                }))?.id || 'new-allocation'
            },
            update: {
                allocatedStock: { increment: quantity },
                dealerBasePrice: dealerBasePrice || product.basePrice,
                dealerMoq: dealerMoq || 1,
                maxMargin: maxMargin || 20, // Default 20% max margin if not specified
                isAllocated: true,
                // If dealer hasn't set a retail price yet, initialize it
                price: (await prisma.inventory.findFirst({ where: { productId, dealerId, region } }))?.price || dealerBasePrice || product.basePrice
            },
            create: {
                productId,
                dealerId,
                region,
                stock: 0, // Current physical stock
                allocatedStock: quantity,
                dealerBasePrice: dealerBasePrice || product.basePrice,
                dealerMoq: dealerMoq || 1,
                maxMargin: maxMargin || 20,
                isAllocated: true,
                price: dealerBasePrice || product.basePrice
            }
        });
    }

    /**
     * Get all allocations for a manufacturer across their dealer network.
     */
    async getManufacturerAllocations(mfgId) {
        return await prisma.inventory.findMany({
            where: {
                product: { manufacturerId: mfgId },
                isAllocated: true
            },
            include: {
                dealer: {
                    select: {
                        id: true,
                        businessName: true,
                        city: true,
                        subscriptions: {
                            where: { status: 'ACTIVE' },
                            include: { plan: true },
                            take: 1
                        }
                    }
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                        basePrice: true,
                        images: true
                    }
                }
            },
            orderBy: { listedAt: 'desc' }
        });
    }


    /**
     * Update an existing allocation's parameters.
     */
    async updateAllocation(mfgId, allocationId, updateData) {
        const inventory = await prisma.inventory.findUnique({
            where: { id: allocationId },
            include: { product: true }
        });

        if (!inventory || inventory.product.manufacturerId !== mfgId) {
            throw new Error('UNAUTHORIZED_ALLOCATION_UPDATE');
        }

        return await prisma.inventory.update({
            where: { id: allocationId },
            data: {
                allocatedStock: updateData.allocatedStock,
                dealerBasePrice: updateData.dealerBasePrice,
                dealerMoq: updateData.dealerMoq,
                maxMargin: updateData.maxMargin
            }
        });
    }

    /**
     * Revoke an allocation.
     * Does not delete the record but removes allocation status and limits.
     */
    async revokeAllocation(mfgId, allocationId) {
        const inventory = await prisma.inventory.findUnique({
            where: { id: allocationId },
            include: { product: true }
        });

        if (!inventory || inventory.product.manufacturerId !== mfgId) {
            throw new Error('UNAUTHORIZED_ALLOCATION_REVOKE');
        }

        return await prisma.inventory.update({
            where: { id: allocationId },
            data: {
                isAllocated: false,
                isListed: false, // Auto-delist if allocation is revoked
                allocatedStock: 0
            }
        });
    }

    /**
     * Get allocations for a specific dealer (for dealer dashboard).
     */
    async getDealerAllocations(dealerId) {
        return await prisma.inventory.findMany({
            where: {
                dealerId,
                isAllocated: true
            },
            include: {
                product: {
                    include: {
                        manufacturer: {
                            select: { businessType: true, companyName: true }
                        }
                    }
                }
            }
        });
    }
}

export default new StockAllocationService();
