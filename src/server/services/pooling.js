import { PooledDemand, PoolParticipant } from '../models/index.js';
import mongoose from 'mongoose';

class PoolingService {
    /**
     * Create a new demand pool for a product.
     */
    async createPool(manufacturerId, productId, targetQuantity, expiresAt) {
        return await PooledDemand.create({
            manufacturerId,
            productId,
            targetQuantity,
            expiresAt,
            status: 'OPEN'
        });
    }

    /**
     * Join an existing pool.
     */
    async joinPool(poolId, dealerId, quantity) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const pool = await PooledDemand.findById(poolId).session(session);

            if (!pool) throw new Error('POOL_NOT_FOUND');
            if (pool.status !== 'OPEN') throw new Error('POOL_NOT_OPEN');
            if (new Date() > new Date(pool.expiresAt)) throw new Error('POOL_EXPIRED');

            // Mongoose upsert
            const participant = await PoolParticipant.findOneAndUpdate(
                { poolId, dealerId },
                { quantity },
                { upsert: true, new: true, session }
            );

            // Update pool current quantity
            const totalQuantityResult = await PoolParticipant.aggregate([
                { $match: { poolId: new mongoose.Types.ObjectId(poolId) } },
                { $group: { _id: null, total: { $sum: '$quantity' } } }
            ]).session(session);

            const totalQuantity = totalQuantityResult.length > 0 ? totalQuantityResult[0].total : 0;

            await PooledDemand.findByIdAndUpdate(poolId, { currentQuantity: totalQuantity }, { session });

            await session.commitTransaction();
            return participant;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Get available pools.
     */
    async getPools(filters = {}) {
        const { status, manufacturerId } = filters;
        const query = {};

        if (status) query.status = status;
        if (manufacturerId) query.manufacturerId = manufacturerId;

        return await PooledDemand.find(query)
            .populate('productId')
            .populate({
                path: 'manufacturerId',
                populate: { path: 'userId', select: 'businessName email' }
            })
            .populate('participants')
            .sort({ createdAt: -1 });
    }

    /**
     * Get details of a specific pool.
     */
    async getPoolDetails(poolId) {
        return await PooledDemand.findById(poolId)
            .populate('productId')
            .populate('manufacturerId')
            .populate({
                path: 'participants',
                populate: { path: 'dealerId' }
            });
    }
}

export default new PoolingService();
