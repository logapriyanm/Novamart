/**
 * Product Service
 * Logic for catalog management, search, and manufacturer offerings.
 */

import prisma from '../lib/prisma.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';
import logger from '../lib/logger.js';

class ProductService {
    /**
     * Create a new product.
     */
    async createProduct(manufacturerId, data) {
        const {
            name,
            description,
            basePrice,
            moq,
            category,
            specifications,
            colors = [],
            sizes = [],
            images = [],
            video
        } = data;

        // 1. Validate Category (Slugify)
        const normalizedCategory = category ? category.toLowerCase().replace(/\s+/g, '-') : 'general';

        // 2. Create Product (Defaults to PENDING for admin review)
        const product = await prisma.product.create({
            data: {
                manufacturerId,
                name,
                description,
                basePrice: parseFloat(basePrice) || 0,
                moq: parseInt(moq) || 1,
                category: normalizedCategory,
                colors,
                sizes,
                images,
                video,
                specifications: specifications || {},
                status: 'PENDING',
                isApproved: false
            }
        });

        // 3. Emit Event
        systemEvents.emit(EVENTS.PRODUCT.CREATED, {
            productId: product.id,
            productName: product.name,
            manufacturerId
        });

        return product;
    }

    /**
     * Fetch products with advanced filtering and pagination.
     */
    async getAllProducts(filters, userRole, dealerId = null) {
        const {
            status, category, q, minPrice, maxPrice, sortBy,
            brands, rating, availability, verifiedOnly,
            specFilters = [], subCategory, page = 1, limit = 20,
            networkOnly
        } = filters;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const conditions = [];

        // 1. Role-based Status Filtering
        if (userRole === 'ADMIN') {
            if (status) conditions.push({ status });
        } else {
            conditions.push({ status: 'APPROVED' });
        }

        // 2. Category & Subcategory
        if (category) {
            conditions.push({
                OR: [
                    { category: category },
                    { specifications: { path: ['mainCategory'], equals: category } }
                ]
            });
        }
        if (subCategory) {
            conditions.push({ specifications: { path: ['subCategory'], equals: subCategory } });
        }

        // 3. Search Query
        if (q) {
            conditions.push({
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                    { category: { contains: q, mode: 'insensitive' } },
                    { manufacturer: { companyName: { contains: q, mode: 'insensitive' } } }
                ]
            });
        }

        // 4. Price & Rating
        if (minPrice) conditions.push({ basePrice: { gte: parseFloat(minPrice) } });
        if (maxPrice) conditions.push({ basePrice: { lte: parseFloat(maxPrice) } });
        if (rating) conditions.push({ averageRating: { gte: parseFloat(rating) } });

        // 5. Manufacturer Filters
        const mfgFilter = { user: { status: { not: 'SUSPENDED' } } };
        if (networkOnly === 'true' && dealerId) {
            mfgFilter.dealersApproved = { some: { id: dealerId } };
        }
        if (brands) {
            const brandList = Array.isArray(brands) ? brands : brands.split(',');
            mfgFilter.companyName = { in: brandList, mode: 'insensitive' };
        }
        if (verifiedOnly === 'true') mfgFilter.isVerified = true;

        conditions.push({ manufacturer: mfgFilter });

        // 6. Availability & Spec Filters
        if (availability?.includes('In Stock')) {
            conditions.push({ inventory: { some: { stock: { gt: 0 } } } });
        }
        if (specFilters.length > 0) {
            conditions.push(...specFilters);
        }

        const where = { AND: conditions };

        // Sorting
        let orderBy = { updatedAt: 'desc' };
        if (sortBy) {
            switch (sortBy) {
                case 'price-low': orderBy = { basePrice: 'asc' }; break;
                case 'price-high': orderBy = { basePrice: 'desc' }; break;
                case 'rating': orderBy = { averageRating: 'desc' }; break;
                case 'newest': orderBy = { createdAt: 'desc' }; break;
                case 'popularity': orderBy = { reviewCount: 'desc' }; break;
            }
        }

        const [total, products] = await Promise.all([
            prisma.product.count({ where }),
            prisma.product.findMany({
                where,
                include: {
                    manufacturer: { select: { companyName: true, isVerified: true } },
                    inventory: {
                        take: 1,
                        where: { stock: { gt: 0 } },
                        include: { dealer: { select: { businessName: true } } }
                    }
                },
                orderBy,
                skip,
                take
            })
        ]);

        return {
            products,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        };
    }

    /**
     * Get detailed product view.
     */
    async getProductById(id, userId = null) {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                manufacturer: { select: { id: true, companyName: true, logo: true, isVerified: true } },
                inventory: {
                    where: { stock: { gt: 0 } },
                    include: {
                        dealer: { select: { id: true, businessName: true, averageRating: true, reviewCount: true } }
                    }
                },
                reviews: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: { customer: { select: { name: true } } }
                }
            }
        });

        if (product && userId) {
            // Async track view
            prisma.userBehavior.create({
                data: {
                    userId,
                    type: 'VIEW',
                    targetId: id,
                    metadata: { type: 'PRODUCT_VIEW', category: product.category }
                }
            }).catch(e => logger.error('View tracking failed', e));
        }

        return product;
    }

    /**
     * Admin: Update product status.
     */
    async updateStatus(id, status, rejectionReason = null) {
        return await prisma.product.update({
            where: { id },
            data: {
                status,
                rejectionReason: status === 'REJECTED' ? rejectionReason : null,
                isApproved: status === 'APPROVED'
            }
        });
    }

    /**
     * Manufacturer: Update product.
     */
    async updateProduct(id, manufacturerId, data) {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product || product.manufacturerId !== manufacturerId) {
            throw new Error('UNAUTHORIZED_PRODUCT_ACCESS');
        }

        const { basePrice, moq, specifications, ...other } = data;
        const finalSpecs = { ...(product.specifications || {}), ...(specifications || {}) };

        const newData = {
            ...other,
            specifications: finalSpecs
        };

        if (basePrice) newData.basePrice = parseFloat(basePrice);
        if (moq) newData.moq = parseInt(moq);

        // Reset to PENDING if critical fields change
        if (product.status === 'APPROVED' && (newData.basePrice !== product.basePrice || newData.name !== product.name)) {
            newData.status = 'PENDING';
            newData.isApproved = false;
        }

        return await prisma.product.update({
            where: { id },
            data: newData
        });
    }

    /**
     * Manufacturer: Delete product.
     */
    async deleteProduct(id, manufacturerId) {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product || product.manufacturerId !== manufacturerId) {
            throw new Error('UNAUTHORIZED_PRODUCT_ACCESS');
        }

        return await prisma.product.delete({ where: { id } });
    }

    /**
     * Bulk Import.
     */
    async bulkImport(manufacturerId, products) {
        const validProducts = products.map(p => ({
            manufacturerId,
            name: p.name,
            description: p.description || '',
            basePrice: parseFloat(p.basePrice) || 0,
            moq: parseInt(p.moq) || 1,
            category: p.category,
            status: 'PENDING',
            isApproved: false,
            specifications: p.specifications || {},
            images: p.images || []
        }));

        return await prisma.product.createMany({ data: validProducts });
    }

    /**
     * Get discovery filters based on current approved catalog.
     */
    async getDiscoveryFilters(category = null) {
        const where = { status: 'APPROVED' };
        if (category && category !== 'all') {
            where.category = { equals: category, mode: 'insensitive' };
        }

        const [priceAgg, brandsAgg, categoriesAgg] = await Promise.all([
            prisma.product.aggregate({ where, _min: { basePrice: true }, _max: { basePrice: true } }),
            prisma.product.findMany({ where, select: { manufacturer: { select: { companyName: true } } }, distinct: ['manufacturerId'] }),
            prisma.product.groupBy({ by: ['category'], where: { status: 'APPROVED' }, _count: true })
        ]);

        return {
            minPrice: priceAgg._min.basePrice || 0,
            maxPrice: priceAgg._max.basePrice || 100000,
            brands: brandsAgg.map(p => p.manufacturer.companyName).filter(Boolean),
            categories: categoriesAgg.map(c => ({ name: c.category, count: c._count }))
        };
    }
}

export default new ProductService();
