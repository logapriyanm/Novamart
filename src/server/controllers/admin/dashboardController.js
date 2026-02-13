import { Order, Escrow, Dispute, User, Product, Manufacturer, Seller } from '../../models/index.js';

/**
 * Dashboard Stats (GMV, Escrow, Disputes, Users, Products)
 */
export const getDashboardStats = async (req, res) => {
    try {
        const [gmvResult, escrowStats, disputes, pendingUsers, pendingProducts, totalManufacturers, totalSellers, totalCustomers] = await Promise.all([
            Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
            Escrow.aggregate([
                {
                    $group: {
                        _id: '$status',
                        amount: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                }
            ]),
            Dispute.countDocuments({ status: 'OPEN' }),
            User.countDocuments({ status: 'PENDING' }),
            Product.countDocuments({ status: 'PENDING' }),
            Manufacturer.countDocuments(),
            Seller.countDocuments(),
            User.countDocuments({ role: 'CUSTOMER' })
        ]);

        res.json({
            success: true,
            data: {
                gmv: gmvResult.length > 0 ? gmvResult[0].total : 0,
                escrow: escrowStats.map(s => ({
                    status: s._id,
                    _sum: { amount: s.amount },
                    _count: s.count
                })),
                activeDisputes: disputes,
                pendingApprovals: pendingUsers,
                pendingUserApprovals: pendingUsers,
                pendingProductApprovals: pendingProducts,
                totalManufacturers,
                totalSellers,
                totalCustomers
            }
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ success: false, error: 'FAILED_TO_FETCH_STATS' });
    }
};

export default {
    getDashboardStats
};
