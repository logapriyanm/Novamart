/**
 * Admin Controller
 * High-authority governance and management.
 */

import prisma from '../../lib/prisma.js';
import auditService from '../../services/audit.js';

/**
 * 1. Dashboard Stats (GMV, Escrow, Disputes)
 */
export const getDashboardStats = async (req, res) => {
    try {
        const [gmv, escrowStats, disputes, pendingUsers] = await Promise.all([
            prisma.order.aggregate({ _sum: { totalAmount: true } }),
            prisma.escrow.groupBy({
                by: ['status'],
                _sum: { amount: true },
                _count: true
            }),
            prisma.dispute.count({ where: { status: 'OPEN' } }),
            prisma.user.count({ where: { status: 'PENDING' } })
        ]);

        res.json({
            gmv: gmv._sum.totalAmount || 0,
            escrow: escrowStats,
            activeDisputes: disputes,
            pendingApprovals: pendingUsers
        });
    } catch (error) {
        res.status(500).json({ error: 'FAILED_TO_FETCH_STATS' });
    }
};

/**
 * 2. User/Manufacturer Management
 */
export const manageUser = async (req, res) => {
    const { id } = req.params;
    const { status, adminReason } = req.body;

    try {
        const oldUser = await prisma.user.findUnique({ where: { id } });
        const user = await prisma.user.update({
            where: { id },
            data: { status }
        });

        await auditService.logAction('USER_STATUS_UPDATE', 'USER', id, {
            userId: req.user.id,
            oldData: oldUser,
            newData: user,
            reason: adminReason,
            req
        });

        res.json({ message: `User status updated to ${status}`, user });
    } catch (error) {
        res.status(400).json({ error: 'USER_UPDATE_FAILED' });
    }
};

/**
 * 3. Product Approval Queue
 */
export const approveProduct = async (req, res) => {
    const { id } = req.params;
    const { isApproved, rejectionReason } = req.body;

    try {
        const oldProduct = await prisma.product.findUnique({ where: { id } });
        const product = await prisma.product.update({
            where: { id },
            data: {
                isApproved,
                rejectionReason: isApproved ? null : rejectionReason
            }
        });

        await auditService.logAction('PRODUCT_APPROVAL', 'PRODUCT', id, {
            userId: req.user.id,
            oldData: oldProduct,
            newData: product,
            reason: rejectionReason,
            req
        });

        res.json({ message: isApproved ? 'Product Approved' : 'Product Rejected', product });
    } catch (error) {
        res.status(400).json({ error: 'PRODUCT_APPROVAL_FAILED' });
    }
};

/**
 * 4. Rule Management (Margin/Tax)
 */
export const createMarginRule = async (req, res) => {
    const { category, maxCap, minMOQ } = req.body;
    try {
        const rule = await prisma.marginRule.create({
            data: { category, maxCap, minMOQ }
        });
        res.status(201).json(rule);
    } catch (error) {
        res.status(400).json({ error: 'RULE_CREATION_FAILED' });
    }
};

/**
 * 6. Admin Escrow Management (Release & Refund)
 */
export const settleEscrow = async (req, res) => {
    const { orderId } = req.params;
    try {
        const result = await escrowService.releaseFunds(orderId);
        res.json({ message: 'Funds released successfully', ...result });
    } catch (error) {
        res.status(400).json({ error: error.message || 'SETTLEMENT_FAILED' });
    }
};

export const refundEscrow = async (req, res) => {
    const { orderId } = req.params;
    const { amount, isPartial } = req.body;
    try {
        const result = await escrowService.processRefund(orderId, amount, isPartial);
        res.json({ message: 'Refund processed successfully', result });
    } catch (error) {
        res.status(400).json({ error: error.message || 'REFUND_FAILED' });
    }
};

/**
 * 7. Order Lifecycle Management
 */
export const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { action, trackingNumber, carrier, reason } = req.body;

    try {
        let result;
        switch (action) {
            case 'CONFIRM': result = await orderService.confirmOrder(orderId); break;
            case 'SHIP': result = await orderService.shipOrder(orderId, `${carrier}: ${trackingNumber}`); break;
            case 'DELIVER': result = await orderService.deliverOrder(orderId); break;
            case 'CANCEL': result = await orderService.cancelOrder(orderId, reason); break;
            default: throw new Error('Invalid action');
        }
        res.json({ message: `Order updated to ${result.status}`, order: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * 5. Audit Log Viewer
 */
export const getAuditLogs = async (req, res) => {
    const { entity, userId } = req.query;
    try {
        const logs = await prisma.auditLog.findMany({
            where: {
                entity: entity || undefined,
                userId: userId || undefined
            },
            orderBy: { timestamp: 'desc' },
            take: 100,
            include: { user: { select: { email: true, role: true } } }
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'FAILED_TO_FETCH_LOGS' });
    }
};

/**
 * 9. Inventory Audit
 */
export const auditInventory = async (req, res) => {
    try {
        const result = await orderService.auditStock();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'INVENTORY_AUDIT_FAILED' });
    }
};

/**
 * 10. Trust Badge Management
 */
export const assignBadge = async (req, res) => {
    const { userId, badgeId } = req.body;
    const adminId = req.user.id;
    try {
        const userBadge = await prisma.userBadge.create({
            data: { userId, badgeId, assignedBy: adminId }
        });
        res.json({ message: 'Badge assigned successfully', userBadge });
    } catch (error) {
        res.status(400).json({ error: 'BADGE_ASSIGNMENT_FAILED' });
    }
};

/**
 * 8. Dispute Governance
 */
export const evaluateDispute = async (req, res) => {
    const { disputeId } = req.params;
    try {
        const result = await disputeService.evaluateRules(disputeId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
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

        res.json({ message: 'Dispute resolved manually', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * 11. Platform Settings
 */
export const updateSettings = async (req, res) => {
    const { key, value, description } = req.body;
    try {
        const setting = await prisma.platformSettings.upsert({
            where: { key },
            update: { value, description },
            create: { key, value, description }
        });
        res.json({ message: 'Setting updated', setting });
    } catch (error) {
        res.status(400).json({ error: 'SETTINGS_UPDATE_FAILED' });
    }
};

import orderService from '../../services/order.js';
import escrowService from '../../services/escrow.js';
import disputeService from '../../services/dispute.js';

export default {
    getDashboardStats,
    manageUser,
    approveProduct,
    createMarginRule,
    getAuditLogs,
    settleEscrow,
    refundEscrow,
    updateOrderStatus,
    evaluateDispute,
    manualResolveDispute,
    assignBadge,
    updateSettings,
    auditInventory
};
