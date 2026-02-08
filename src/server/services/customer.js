/**
 * Customer Service
 * Logic for customer-specific actions like ratings and discovery.
 */

import prisma from '../lib/prisma.js';

class CustomerService {
    /**
     * Browse Products with Regional Availability.
     */
    async browseProducts({ region, category, search }) {
        return await prisma.product.findMany({
            where: {
                isApproved: true,
                category: category || undefined,
                name: search ? { contains: search, mode: 'insensitive' } : undefined,
                inventory: {
                    some: {
                        region: region || undefined,
                        stock: { gt: 0 }
                    }
                }
            },
            include: {
                inventory: {
                    where: { region: region || undefined, stock: { gt: 0 } },
                    include: { dealer: { select: { businessName: true, id: true } } }
                }
            }
        });
    }

    /**
     * Rate a Product or Dealer.
     */
    async submitRating(customerId, { productId, dealerId, rating, comment }) {
        return await prisma.rating.create({
            data: {
                customerId,
                dealerId: dealerId || undefined,
                rating,
                comment
            }
        });
    }

    /**
     * Get Customer Profile.
     */
    async getProfile(customerId) {
        return await prisma.customer.findUnique({
            where: { id: customerId },
            include: {
                user: {
                    select: {
                        email: true,
                        phone: true,
                        avatar: true,
                        status: true,
                        createdAt: true
                    }
                }
            }
        });
    }

    /**
     * Update Customer Profile.
     */
    async updateProfile(customerId, data) {
        const { name, email, phone, avatar } = data;

        return await prisma.$transaction(async (tx) => {
            // Update Customer record
            const customer = await tx.customer.update({
                where: { id: customerId },
                data: { name }
            });

            // Update linked User record
            await tx.user.update({
                where: { id: customer.userId },
                data: { email, phone, avatar }
            });

            return await tx.customer.findUnique({
                where: { id: customerId },
                include: { user: true }
            });
        });
    }

    /**
     * Get Customer Order History with Status & Escrow Info.
     */
    async getOrderHistory(customerId) {
        return await prisma.order.findMany({
            where: { customerId },
            include: {
                items: { include: { product: true } },
                escrow: true,
                timeline: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}

export default new CustomerService();

