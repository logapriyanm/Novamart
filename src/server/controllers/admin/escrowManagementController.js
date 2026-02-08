import escrowService from '../../services/escrow.js';

/**
 * Admin Escrow Management (Release & Refund)
 */
export const settleEscrow = async (req, res) => {
    const { orderId } = req.params;
    try {
        const result = await escrowService.releaseFunds(orderId);
        res.json({ success: true, message: 'Funds released successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message || 'SETTLEMENT_FAILED' });
    }
};

export const refundEscrow = async (req, res) => {
    const { orderId } = req.params;
    const { amount, isPartial } = req.body;
    try {
        const result = await escrowService.processRefund(orderId, amount, isPartial);
        res.json({ success: true, message: 'Refund processed successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message || 'REFUND_FAILED' });
    }
};

export default {
    settleEscrow,
    refundEscrow
};
