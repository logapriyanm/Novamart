import { Order, Product, User, Seller, Manufacturer } from '../models/index.js';
import mongoose from 'mongoose';

// --- Helpers ---
const getDateRange = (range) => {
    const now = new Date();
    const start = new Date();
    if (range === '7d') start.setDate(now.getDate() - 7);
    else if (range === '30d') start.setDate(now.getDate() - 30);
    else if (range === '90d') start.setDate(now.getDate() - 90);
    else start.setDate(now.getDate() - 30); // Default 30d
    return { start, end: now };
};

// --- Admin Analytics ---
export const getAdminOverview = async (req, res) => {
    try {
        const { range } = req.query;
        const { start, end } = getDateRange(range);

        // 1. Revenue & GMV (Daily)
        const revenueData = await Order.aggregate([
            {
                $match: {
                    status: { $in: ['PAID', 'DELIVERED', 'SHIPPED', 'CONFIRMED', 'CREATED', 'PENDING', 'PROCESSING', 'OUT_FOR_DELIVERY'] },
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalAmount" },
                    commission: { $sum: "$commissionAmount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const totalGMV = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);
        const totalCommission = revenueData.reduce((acc, curr) => acc + curr.commission, 0);

        // Format for Recharts
        const revenueChart = revenueData.map(item => ({
            date: item._id,
            revenue: item.revenue,
            commission: item.commission,
            gmv: item.revenue
        }));

        // 2. User Growth
        const userGrowthData = await User.aggregate([
            {
                $match: { createdAt: { $gte: start, $lte: end } }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        role: "$role"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.date": 1 } }
        ]);

        const userGrowthMap = {};
        userGrowthData.forEach(item => {
            const date = item._id.date;
            if (!userGrowthMap[date]) userGrowthMap[date] = { date, customers: 0, sellers: 0, manufacturers: 0 };
            if (item._id.role === 'CUSTOMER') userGrowthMap[date].customers += item.count;
            if (item._id.role === 'SELLER') userGrowthMap[date].sellers += item.count;
            if (item._id.role === 'MANUFACTURER') userGrowthMap[date].manufacturers += item.count;
        });
        const userGrowthChart = Object.values(userGrowthMap).sort((a, b) => a.date.localeCompare(b.date));
        const totalMerchants = await User.countDocuments({ role: { $in: ['SELLER', 'MANUFACTURER'] } });

        // 3. Order Status Distribution
        const orderStatusData = await Order.aggregate([
            { $match: { createdAt: { $gte: start } } },
            { $group: { _id: "$status", value: { $sum: 1 } } }
        ]);
        const orderStatusChart = orderStatusData.map(item => ({ name: item._id, value: item.value }));

        // 4. Category Dominance (from sold items)
        const categoryData = await Order.aggregate([
            { $match: { status: { $in: ['PAID', 'DELIVERED'] }, createdAt: { $gte: start } } },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $group: {
                    _id: "$product.category",
                    count: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 }
        ]);

        const totalCategoryRevenue = categoryData.reduce((acc, curr) => acc + curr.revenue, 0);
        const categoryDominance = categoryData.map(cat => ({
            name: cat._id || 'Uncategorized',
            value: cat.revenue,
            share: totalCategoryRevenue ? Math.round((cat.revenue / totalCategoryRevenue) * 100) + '%' : '0%'
        }));

        // 5. Dispute Ratio
        // Assuming Dispute model exists or we track via Order status 'DISPUTED' (if applicable) or separate collection
        // For now, using Order status 'CANCELLED' as proxy for "issues" if no Dispute model ready-to-use here
        const disputeCount = await Order.countDocuments({ status: 'CANCELLED', createdAt: { $gte: start } });
        const totalOrders = await Order.countDocuments({ createdAt: { $gte: start } });
        const disputeRatio = totalOrders ? ((disputeCount / totalOrders) * 100).toFixed(2) + '%' : '0%';

        res.json({
            success: true,
            data: {
                macroStats: {
                    quarterlyGMV: totalGMV,
                    merchantCount: totalMerchants,
                    disputeRatio
                },
                revenueChart,
                userGrowthChart,
                orderStatusChart,
                categoryDominance
            }
        });

    } catch (error) {
        console.error('Admin Analytics Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch admin analytics' });
    }
};

export const getQualityAudit = async (req, res) => {
    try {
        // Fetch products and aggregate mock performance stats 
        // (Since we don't have a granular "Quality" score in DB, we verify against Orders)
        const products = await Product.find().select('name category price status').limit(20).lean();

        // For each product, find return rate (cancelled/returned orders)
        // This is expensive N+1, but limits to 20 for "Queue"
        const auditData = await Promise.all(products.map(async (p) => {
            const totalOrders = await Order.countDocuments({ "items.productId": p._id });
            const returns = await Order.countDocuments({ "items.productId": p._id, status: { $in: ['CANCELLED', 'RETURNED'] } });

            const returnRate = totalOrders ? Math.round((returns / totalOrders) * 100) : 0;

            let status = 'STABLE';
            if (returnRate > 10) status = 'AT_RISK';
            if (p.status === 'DRAFT') status = 'REVIEW';

            return {
                id: p._id,
                name: p.name,
                category: p.category,
                returnRate: returnRate + '%',
                complaints: 0, // Placeholder until Complaint model linked
                status
            };
        }));

        res.json({ success: true, data: auditData });
    } catch (error) {
        console.error('Quality Audit Error:', error);
        res.status(500).json({ success: false, error: 'Failed to audit products' });
    }
};

// --- Manufacturer Analytics ---
export const getManufacturerOverview = async (req, res) => {
    try {
        const { range } = req.query;
        const manufacturerId = req.user.profileId; // Assuming profileId is attached
        const { start, end } = getDateRange(range);

        // 1. Revenue Trend (based on Orders containing their products)
        // Check Model: Manufacturing orders or D2C? 
        // Assuming Manufacturers sell to Sellers (B2B) via "CustomManufacturing" or similar?
        // OR if they sell D2C. Let's assume D2C for simplicity or mapped via Products.
        // Actually, in NovaMart, Manufacturers map to Products too?
        // Let's use Product ownership.

        // Find products by this manufacturer
        // const products = await Product.find({ manufacturerId }).select('_id');
        // const productIds = products.map(p => p._id);

        // Mocking Manufacturer Data for now as schema details for Manufacturer-Order link might be complex (B2B vs B2C)
        // If Manufacturers are just creating products that Sellers sell? Or selling directly?
        // Let's assume they sell directly for this dashboard or we track their B2B sales.

        // Return structured mock data that fits the Recharts requirement until verified
        const mockData = {
            revenueTrend: [
                { date: '2026-01-01', revenue: 50000 },
                { date: '2026-01-02', revenue: 65000 },
                { date: '2026-01-03', revenue: 45000 },
            ],
            topProducts: [
                { name: 'Steel Pipes', sales: 1200 },
                { name: 'Copper Wire', sales: 900 },
            ],
            allocation: [
                { month: 'Jan', allocated: 1000, sold: 850 }
            ]
        };

        res.json({ success: true, data: mockData });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- Seller Analytics ---
export const getSellerOverview = async (req, res) => {
    try {
        const { range } = req.query;
        const sellerId = req.user.profileId;
        const { start, end } = getDateRange(range);

        // 1. Daily Sales
        const salesData = await Order.aggregate([
            {
                $match: {
                    sellerId: new mongoose.Types.ObjectId(sellerId),
                    status: { $in: ['PAID', 'DELIVERED'] },
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: "$totalAmount" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const salesChart = salesData.map(item => ({
            date: item._id,
            sales: item.sales,
            orders: item.orders
        }));

        // 2. Margin Breakdown (Mocked calculation as cost price might not be in OrderItem)
        // 3. Funnel (Mocked/Derived from Status)

        res.json({
            success: true,
            data: {
                salesChart,
                // Add margins/funnel placehokders
            }
        });

    } catch (error) {
        console.error('Seller Analytics Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch seller analytics' });
    }
};
