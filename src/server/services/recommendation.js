import { Product, User, Customer, Order, Cart, Tracking, Negotiation, Inventory, SellerRequest, Manufacturer, Seller } from '../models/index.js';

class RecommendationService {
    /**
     * Log User Behavior
     */
    async logBehavior(userId, type, targetId, metadata = {}) {
        try {
            await Tracking.create({
                userId,
                eventType: type,
                metadata: {
                    ...metadata,
                    productId: targetId
                }
            });
        } catch (error) {
            console.error('Failed to log behavior:', error);
        }
    }

    async getPersonalizedHomepage(userId) {
        try {
            const WEIGHTS = {
                ORDER: 5,
                CART: 3,
                VIEW: 1,
                SEARCH: 1
            };

            const categoryScores = {};

            // 1. Fetch Data Signals
            const customer = await Customer.findOne({ userId });

            const [recentOrders, cart, behaviors] = await Promise.all([
                // ORDERS: Last 10 orders
                Order.find({ customerId: customer?._id })
                    .sort({ createdAt: -1 })
                    .limit(10)
                    .populate('items.productId')
                    .populate({
                        path: 'items.productId.inventory',
                        select: 'stock price'
                    }),
                // CART: Current cart items
                customer ? Cart.findOne({ customerId: customer._id }).populate('items.productId') : Promise.resolve(null),
                // BEHAVIORS: Last 50 actions
                Tracking.find({ userId, eventType: { $in: ['PAGE_VIEW', 'SEARCH'] } })
                    .sort({ createdAt: -1 })
                    .limit(50)
            ]);

            // 2. Compute Scores
            recentOrders.forEach(order => {
                order.items.forEach(item => {
                    const cat = item.productId?.category;
                    if (cat) categoryScores[cat] = (categoryScores[cat] || 0) + WEIGHTS.ORDER;
                });
            });

            cart?.items?.forEach(item => {
                const cat = item.productId?.category;
                if (cat) categoryScores[cat] = (categoryScores[cat] || 0) + WEIGHTS.CART;
            });

            for (const b of behaviors) {
                if (b.eventType === 'PAGE_VIEW' && b.metadata?.category) {
                    const cat = b.metadata.category;
                    categoryScores[cat] = (categoryScores[cat] || 0) + WEIGHTS.VIEW;
                }
            }

            // 3. Determine Top Categories
            const topCategories = Object.entries(categoryScores)
                .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
                .map(([cat]) => cat)
                .slice(0, 3);

            // 4. Fetch Recommendations
            let recommendations = [];
            if (topCategories.length > 0) {
                recommendations = await Product.find({
                    category: { $in: topCategories },
                    isApproved: true
                })
                    .populate('manufacturerId', 'companyName')
                    .populate({
                        path: 'inventory',
                        match: { stock: { $gt: 0 } },
                        select: 'stock price'
                    })
                    .limit(8)
                    .sort({ reviewCount: -1 });
            }

            // 5. Backfill
            if (recommendations.length < 8) {
                const popular = await Product.find({
                    isApproved: true,
                    _id: { $nin: recommendations.map(r => r._id) }
                })
                    .populate('manufacturerId', 'companyName')
                    .populate({
                        path: 'inventory',
                        match: { stock: { $gt: 0 } },
                        select: 'stock price'
                    })
                    .limit(8 - recommendations.length)
                    .sort({ reviewCount: -1 });
                recommendations = [...recommendations, ...popular];
            }

            // 6. Section Data
            const newArrivals = await Product.find({ isApproved: true })
                .populate('manufacturerId', 'companyName')
                .populate({
                    path: 'inventory',
                    match: { stock: { $gt: 0 } },
                    select: 'stock price'
                })
                .limit(8)
                .sort({ createdAt: -1 });

            const trending = await Product.find({ isApproved: true })
                .populate('manufacturerId', 'companyName')
                .populate({
                    path: 'inventory',
                    match: { stock: { $gt: 0 } },
                    select: 'stock price'
                })
                .limit(8)
                .sort({ averageRating: -1, reviewCount: -1 });

            // 7. Hero Item
            let hero = null;
            if (recommendations.length > 0) {
                hero = {
                    category: recommendations[0].category,
                    product: recommendations[0]
                };
            }

            // 8. Special Day & B2B Metrics
            const user = await User.findById(userId);
            let specialDay = null;
            let b2bMetrics = null;

            if (user) {
                const joinDate = new Date(user.createdAt);
                const now = new Date();
                const isAnniversaryMonth = joinDate.getMonth() === now.getMonth();
                const daysSinceJoin = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

                if (isAnniversaryMonth) {
                    specialDay = { type: 'ANNIVERSARY', discount: 15 };
                } else if (daysSinceJoin < 30) {
                    specialDay = { type: 'WELCOME', discount: 10 };
                }

                if (user.role === 'SELLER') {
                    const seller = await Seller.findOne({ userId });
                    if (seller) {
                        const [openNegs, newAllocations] = await Promise.all([
                            Negotiation.countDocuments({ sellerId: seller._id, status: 'OPEN' }),
                            Inventory.countDocuments({ sellerId: seller._id, isAllocated: true, stock: 0 })
                        ]);
                        b2bMetrics = {
                            role: 'SELLER',
                            actions: [
                                { label: 'Active Negotiations', count: openNegs, link: '/seller/negotiations', icon: 'Negotiate' },
                                { label: 'New Allocations', count: newAllocations, link: '/seller/inventory', icon: 'Package' }
                            ]
                        };
                    }
                } else if (user.role === 'MANUFACTURER') {
                    const manufacturer = await Manufacturer.findOne({ userId });
                    if (manufacturer) {
                        const [pendingRequests, activeNegs] = await Promise.all([
                            SellerRequest.countDocuments({ manufacturerId: manufacturer._id, status: 'PENDING' }),
                            Negotiation.countDocuments({ manufacturerId: manufacturer._id, status: 'OPEN' })
                        ]);
                        b2bMetrics = {
                            role: 'MANUFACTURER',
                            actions: [
                                { label: 'Partner Requests', count: pendingRequests, link: '/manufacturer/sellers', icon: 'UserPlus' },
                                { label: 'Active Negotiations', count: activeNegs, link: '/manufacturer/negotiations', icon: 'Negotiate' }
                            ]
                        };
                    }
                }
            }

            // 9. Continue Viewing
            const continueViewingIds = behaviors
                .filter(b => b.eventType === 'PAGE_VIEW' && b.metadata?.productId)
                .slice(0, 5)
                .map(b => b.metadata.productId);

            const resolvedHistory = await Product.find({ _id: { $in: continueViewingIds } })
                .populate('manufacturerId', 'companyName')
                .populate({
                    path: 'inventory',
                    match: { stock: { $gt: 0 } },
                    select: 'stock price'
                });

            // 10. Combos (Placeholder for now)
            const combos = await Product.find({ isApproved: true })
                .populate('manufacturerId', 'companyName')
                .populate({
                    path: 'inventory',
                    match: { stock: { $gt: 0 } },
                    select: 'stock price'
                })
                .limit(4)
                .sort({ reviewCount: 1 }); // Just pick different ones

            return {
                hero,
                specialDay,
                b2bMetrics,
                recommended: recommendations,
                newArrivals,
                trending,
                continueViewing: resolvedHistory,
                combos
            };

        } catch (error) {
            console.error('Recommendation service error:', error);
            return {
                hero: null,
                specialDay: null,
                recommended: [],
                newArrivals: [],
                trending: [],
                continueViewing: []
            };
        }
    }
}

export default new RecommendationService();
