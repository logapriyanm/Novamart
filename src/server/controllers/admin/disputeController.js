import disputeService from '../../services/dispute.js';
import auditService from '../../services/audit.js';

/**
 * Dispute Governance
 */
export const evaluateDispute = async (req, res) => {
    const { disputeId } = req.params;
    try {
        const result = await disputeService.evaluateRules(disputeId);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const manualResolveDispute = async (req, res) => {
    const { disputeId } = req.params;
    const { resolution, reason } = req.body;
    try {
        const result = await disputeService.resolveDispute(disputeId, resolution, reason);

        await auditService.logAction('DISPUTE_RESOLUTION', 'DISPUTE', disputeId, {
            userId: req.user.id,
            newData: { resolution },
            reason,
            req
        });

        res.json({ success: true, message: 'Dispute resolved manually', data: result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export default {
    evaluateDispute,
    manualResolveDispute
};
