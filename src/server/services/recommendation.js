import prisma from '../lib/prisma.js';

class RecommendationService {
    /**
     * Log User Behavior (exposed for other services)
     */
    async logBehavior(userId, type, targetId, metadata = {}) {
        try {
            await prisma.userBehavior.create({
                data: {
                    userId,
                    type,
                    targetId,
                    metadata
                }
            });
        } catch (error) {
            console.error('Failed to log behavior:', error);
        }
    }

    async getPersonalizedHomepage(userId) {
        try {
            // Weights configuration
            const WEIGHTS = {
                ORDER: 5,
                CART: 3,
                VIEW: 1,
                SEARCH: 1
            };

            const categoryScores = {};

            // 1. Fetch Data Signals
            // First get customer to ensure we have ID for cart
            const customer = await prisma.customer.findUnique({ where: { userId } });

            const [recentOrders, cart, behaviors] = await Promise.all([
                // ORDERS: Last 10 orders
                prisma.order.findMany({
                    where: { customer: { userId } },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: { items: { include: { linkedProduct: true } } }
                }),
                // CART: Current cart items (only if customer exists)
                customer ? prisma.cart.findUnique({
                    where: { customerId: customer.id },
                    include: { items: { include: { linkedProduct: true } } }
                }) : Promise.resolve(null),
                // BEHAVIORS: Last 50 actions (View/Search)
                prisma.userBehavior.findMany({
                    where: { userId, type: { in: ['VIEW', 'SEARCH'] } },
                    orderBy: { createdAt: 'desc' },
                    take: 50
                })
            ]);

            // 2. Compute Scores
            // Process Orders (+5)
            recentOrders.forEach(order => {
                order.items.forEach(item => {
                    const cat = item.linkedProduct?.category;
                    if (cat) categoryScores[cat] = (categoryScores[cat] || 0) + WEIGHTS.ORDER;
                });
            });

            // Process Cart (+3)
            cart?.items?.forEach(item => {
                const cat = item.linkedProduct?.category;
                if (cat) categoryScores[cat] = (categoryScores[cat] || 0) + WEIGHTS.CART;
            });

            // Process Behaviors (+1)
            for (const b of behaviors) {
                if (b.type === 'VIEW' && b.metadata?.category) {
                    const cat = b.metadata.category;
                    categoryScores[cat] = (categoryScores[cat] || 0) + WEIGHTS.VIEW;
                } else if (b.type === 'SEARCH' && b.metadata?.query) {
                    // Simple heuristic: if query matches a known category (simplified)
                    // In real app, would need search index matching. For now, skipping direct string match.
                }
            }

            // 3. Determine Top Categories
            const topCategories = Object.entries(categoryScores)
                .sort(([, scoreA], [, scoreB]) => scoreB - scoreA) // Descending score
                .map(([cat]) => cat)
                .slice(0, 3); // Top 3 interest areas

            // 4. Fetch Recommendations
            let recommendations = [];
            if (topCategories.length > 0) {
                recommendations = await prisma.product.findMany({
                    where: {
                        category: { in: topCategories },
                        status: 'APPROVED'
                    },
                    include: {
                        manufacturer: { select: { companyName: true, id: true } },
                        inventory: { select: { price: true, stock: true }, take: 1 }
                    },
                    take: 8,
                    orderBy: { reviewCount: 'desc' } // Within interest, show popular
                });
            }

            // 5. Backfill with Popular/Trending if personalized list is short
            if (recommendations.length < 8) {
                const popular = await prisma.product.findMany({
                    where: {
                        status: 'APPROVED',
                        id: { notIn: recommendations.map(r => r.id) }
                    },
                    include: {
                        manufacturer: { select: { companyName: true, id: true } },
                        inventory: { select: { price: true, stock: true }, take: 1 }
                    },
                    take: 8 - recommendations.length,
                    orderBy: { reviewCount: 'desc' }
                });
                recommendations = [...recommendations, ...popular];
            }

            // 6. Fetch Section Data (New Arrivals, Trending) - Keep slightly random/fresh
            const newArrivals = await prisma.product.findMany({
                where: { status: 'APPROVED' },
                include: {
                    manufacturer: { select: { companyName: true, id: true } },
                    inventory: { select: { price: true, stock: true }, take: 1 }
                },
                orderBy: { createdAt: 'desc' },
                take: 8
            });

            const trending = await prisma.product.findMany({
                where: { status: 'APPROVED' },
                include: {
                    manufacturer: { select: { companyName: true, id: true } },
                    inventory: { select: { price: true, stock: true }, take: 1 }
                },
                orderBy: [{ averageRating: 'desc' }, { reviewCount: 'desc' }],
                take: 8
            });

            // 7. Hero Item (Top Recommendation)
            let hero = null;
            if (recommendations.length > 0) {
                hero = {
                    category: recommendations[0].category,
                    product: recommendations[0]
                };
            }

            // 8. Determine Special Day / Occasion (Anniversary or Member Special)
            const user = await prisma.user.findUnique({ where: { id: userId } });
            let specialDay = null;

            if (user) {
                const joinDate = new Date(user.createdAt);
                const now = new Date();
                const isAnniversaryMonth = joinDate.getMonth() === now.getMonth();
                const daysSinceJoin = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

                if (isAnniversaryMonth) {
                    specialDay = {
                        type: 'ANNIVERSARY',
                        discount: 15
                    };
                } else if (daysSinceJoin < 30) {
                    specialDay = {
                        type: 'WELCOME',
                        discount: 10
                    };
                }
            }

            // 9. Continue Viewing (History)
            const continueViewing = behaviors
                .filter(b => b.type === 'VIEW' && b.targetId)
                .slice(0, 5)
                .map(async b =>
                    await prisma.product.findUnique({
                        where: { id: b.targetId },
                        include: {
                            manufacturer: { select: { companyName: true } },
                            inventory: { take: 1 }
                        }
                    })
                );

            const resolvedHistory = (await Promise.all(continueViewing)).filter(p => p !== null);

            return {
                hero,
                specialDay,
                recommended: recommendations,
                newArrivals,
                trending,
                continueViewing: resolvedHistory
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
