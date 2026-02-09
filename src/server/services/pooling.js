import prisma from '../lib/prisma.js';

class PoolingService {
    /**
     * Create a new demand pool for a product.
     */
    async createPool(manufacturerId, productId, targetQuantity, expiresAt) {
        return await prisma.pooledDemand.create({
            data: {
                manufacturerId,
                productId,
                targetQuantity,
                expiresAt,
                status: 'OPEN'
            }
        });
    }

    /**
     * Join an existing pool.
     */
    async joinPool(poolId, dealerId, quantity) {
        return await prisma.$transaction(async (tx) => {
            const pool = await tx.pooledDemand.findUnique({
                where: { id: poolId }
            });

            if (!pool) throw new Error('POOL_NOT_FOUND');
            if (pool.status !== 'OPEN') throw new Error('POOL_NOT_OPEN');
            if (new Date() > new Date(pool.expiresAt)) throw new Error('POOL_EXPIRED');

            // Upsert participation
            const participant = await tx.poolParticipant.upsert({
                where: {
                    poolId_dealerId: { poolId, dealerId }
                },
                update: { quantity },
                create: { poolId, dealerId, quantity }
            });

            // Update pool current quantity
            const totalQuantity = await tx.poolParticipant.aggregate({
                where: { poolId },
                _sum: { quantity: true }
            });

            await tx.pooledDemand.update({
                where: { id: poolId },
                data: { currentQuantity: totalQuantity._sum.quantity || 0 }
            });

            return participant;
        });
    }

    /**
     * Get available pools.
     */
    async getPools(filters = {}) {
        const { status, manufacturerId, dealerId } = filters;
        const where = {};

        if (status) where.status = status;
        if (manufacturerId) where.manufacturerId = manufacturerId;

        // If dealerId is provided, find pools they have NOT joined yet, or handle differently?
        // For now, let's just return all open pools or filter by basic fields.

        return await prisma.pooledDemand.findMany({
            where,
            include: {
                product: true,
                manufacturer: {
                    include: { user: { select: { businessName: true } } } // Assuming businessName is on Manufacturer or User? Manufacturer has businessName usually.
                },
                participants: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Get details of a specific pool.
     */
    async getPoolDetails(poolId) {
        return await prisma.pooledDemand.findUnique({
            where: { id: poolId },
            include: {
                product: true,
                manufacturer: true,
                participants: {
                    include: {
                        dealer: true
                    }
                }
            }
        });
    }
}

export default new PoolingService();
