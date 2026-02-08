import prisma from '../lib/prisma.js';

class RecommendationService {
    async getPersonalizedHomepage(userId) {
        // 1. Fetch User's recent view history & orders
        const recentViews = await prisma.productView.findMany({
            where: { userId },
            orderBy: { viewedAt: 'desc' },
            take: 5,
            include: { product: true }
        });

        const recentOrders = await prisma.order.findMany({
            where: {
                customer: { userId }
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
            include: { items: { include: { product: true } } }
        });

        // 2. Extract Categories/Tags of interest
        const interestedCategories = new Set();
        recentViews.forEach(v => interestedCategories.add(v.product.category));
        recentOrders.forEach(o => o.items.forEach(i => interestedCategories.add(i.product.category)));

        const categoryList = Array.from(interestedCategories);

        // 3. Fetch Recommendations
        let recommendations = [];
        if (categoryList.length > 0) {
            recommendations = await prisma.product.findMany({
                where: {
                    category: { in: categoryList },
                    status: 'APPROVED',
                    showOnHome: true, // CMS override
                    id: { notIn: recentViews.map(v => v.productId) }
                },
                take: 8,
                orderBy: { isFeatured: 'desc', averageRating: 'desc' } // Prioritize featured
            });
        }

        // 4. Fill popular items
        if (recommendations.length < 8) {
            const popular = await prisma.product.findMany({
                where: {
                    status: 'APPROVED',
                    showOnHome: true,
                    id: { notIn: recommendations.map(r => r.id) }
                },
                take: 8 - recommendations.length,
                orderBy: { isFeatured: 'desc', averageRating: 'desc' }
            });
            recommendations = [...recommendations, ...popular];
        }

        // 5. Get "New Arrivals"
        const newArrivals = await prisma.product.findMany({
            where: { status: 'APPROVED', showOnHome: true },
            orderBy: { createdAt: 'desc' },
            take: 8
        });

        // 6. Get "Trending" / Featured
        const trending = await prisma.product.findMany({
            where: {
                status: 'APPROVED',
                showOnHome: true,
                OR: [
                    { isFeatured: true },
                    { averageRating: { gte: 4.5 } }
                ]
            },
            orderBy: [
                { isFeatured: 'desc' },
                { averageRating: 'desc' }
            ],
            take: 8
        });

        return {
            recommendations,
            newArrivals,
            trending,
            recentViews: recentViews.map(v => v.product)
        };
    }
}

export default new RecommendationService();
