import poolingService from '../../services/pooling.js';
import { Seller } from '../../models/index.js';

export const createPool = async (req, res) => {
    try {
        const { manufacturerId, productId, targetQuantity, expiresAt } = req.body;
        const pool = await poolingService.createPool(manufacturerId, productId, targetQuantity, expiresAt);
        res.status(201).json({ success: true, data: pool });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const joinPool = async (req, res) => {
    try {
        const { poolId } = req.params;
        const { quantity } = req.body;
        const userId = req.user._id;

        const seller = await Seller.findOne({ userId });
        if (!seller) {
            return res.status(403).json({ success: false, message: 'Dealer profile required' });
        }

        const participant = await poolingService.joinPool(poolId, seller._id, quantity);
        res.status(200).json({ success: true, data: participant });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getPools = async (req, res) => {
    try {
        const pools = await poolingService.getPools(req.query);
        res.status(200).json({ success: true, data: pools });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPoolDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolingService.getPoolDetails(id);
        if (!pool) return res.status(404).json({ success: false, message: 'Pool not found' });
        res.status(200).json({ success: true, data: pool });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default {
    createPool,
    joinPool,
    getPools,
    getPoolDetails
};
