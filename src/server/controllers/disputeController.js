import disputeService from '../services/dispute.js';
import { Dispute } from '../models/index.js';

export const getMyDisputes = async (req, res) => {
    try {
        const userId = req.user._id;
        const disputes = await Dispute.find({ raisedByUserId: userId })
            .populate('orderId', 'items totalAmount createdAt status customOrderId')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: disputes });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch disputes' });
    }
};

export default {
    getMyDisputes
};
