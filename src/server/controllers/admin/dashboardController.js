import prisma from '../../lib/prisma.js';

/**
 * Dashboard Stats (GMV, Escrow, Disputes)
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
            success: true,
            data: {
                gmv: gmv._sum.totalAmount || 0,
                escrow: escrowStats,
                activeDisputes: disputes,
                pendingApprovals: pendingUsers
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_STATS' });
    }
};

export default {
    getDashboardStats
};
