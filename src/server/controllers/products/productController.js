import prisma from '../../lib/prisma.js';
import systemEvents, { EVENTS } from '../../lib/systemEvents.js';
import logger from '../../lib/logger.js';

export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            basePrice,
            moq,
            category,
            colors,
            sizes,
            images,
            video,
            specifications,
            status,
            ...otherFields
        } = req.body;

        // 1. Get Manufacturer Profile
        const manufacturer = await prisma.manufacturer.findUnique({
            where: { userId: req.user.id }
        });

        if (!manufacturer) {
            return res.status(403).json({
                error: 'Manufacturer profile not found for this user.'
            });
        }

        // Profile Completion Gating
        const isComplete = manufacturer.companyName &&
            manufacturer.registrationNo &&
            manufacturer.factoryAddress &&
            manufacturer.gstNumber;

        if (!isComplete) {
            return res.status(403).json({
                success: false,
                error: 'PROFILE_INCOMPLETE',
                message: 'Please complete your Company, Factory, and Compliance profile sections before submitting products.'
            });
        }

        // Merge detailed fields into specifications
        const finalSpecs = {
            ...(specifications || {}),
            ...otherFields
        };

        // 2. Create Product
        // Flow Update: Verified manufacturers publish instantly if not Draft
        const isRequestingDraft = status === 'DRAFT';
        const finalStatus = isRequestingDraft ? 'DRAFT' : (manufacturer.isVerified ? 'APPROVED' : 'PENDING');
        const isApprovedStatus = finalStatus === 'APPROVED';

        const newProduct = await prisma.product.create({
            data: {
                manufacturerId: manufacturer.id,
                name,
                description,
                basePrice: parseFloat(basePrice) || 0,
                moq: parseInt(moq) || 1,
                category,
                colors: colors || [],
                sizes: sizes || [],
                images: images || [],
                video,
                specifications: finalSpecs,
                status: finalStatus,
                isApproved: isApprovedStatus
            }
        });

        // Emit System Event
        systemEvents.emit(EVENTS.PRODUCT.CREATED, {
            productId: newProduct.id,
            productName: newProduct.name,
            manufacturerId: manufacturer.id
        });

        logger.info(`Product created: ${newProduct.name} by ${manufacturer.companyName}`);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct
        });

    } catch (error) {
        logger.error('Error creating product:', error);
        res.status(500).json({
            error: 'Failed to create product',
            details: error.message
        });
    }
};

export const getMyProducts = async (req, res) => {
    try {
        const manufacturer = await prisma.manufacturer.findUnique({
            where: { userId: req.user.id }
        });

        if (!manufacturer) {
            return res.status(403).json({ error: 'Manufacturer profile not found' });
        }

        const products = await prisma.product.findMany({
            where: { manufacturerId: manufacturer.id },
            orderBy: { updatedAt: 'desc' }
        });

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        logger.error('Error fetching my products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products'
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const {
            status, category, q, minPrice, maxPrice, sortBy,
            brands, rating, availability, verifiedOnly,
            powerConsumption, capacity, energyRating,
            installationType, usageType, warranty, isSmart,
            subCategory, page = 1, limit = 20
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const where = {};

        const conditions = [];

        // Status filter
        if (status) conditions.push({ status });

        // Hierarchical Category Filtering
        if (category) {
            conditions.push({
                OR: [
                    { category: category },
                    { specifications: { path: ['mainCategory'], equals: category } }
                ]
            });
        }

        if (subCategory) {
            conditions.push({
                specifications: { path: ['subCategory'], equals: subCategory }
            });
        }

        // Search Query
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

        // Price Filter
        if (minPrice || maxPrice) {
            const priceCond = {};
            if (minPrice) priceCond.gte = parseFloat(minPrice);
            if (maxPrice) priceCond.lte = parseFloat(maxPrice);
            conditions.push({ basePrice: priceCond });
        }

        // --- NEW FILTERS ---
        const manufacturerFilter = {
            user: {
                status: { not: 'SUSPENDED' }
            }
        };

        // 1. Brands (Manufacturer Name)
        if (brands) {
            const brandList = Array.isArray(brands) ? brands : brands.split(',');
            manufacturerFilter.companyName = { in: brandList, mode: 'insensitive' };
        }

        // 2. Verified Sellers Only
        if (verifiedOnly === 'true') {
            manufacturerFilter.isVerified = true;
        }

        if (Object.keys(manufacturerFilter).length > 0) {
            where.manufacturer = manufacturerFilter;
        }

        // 3. Minimum Rating
        if (rating) {
            conditions.push({ averageRating: { gte: parseFloat(rating) } });
        }

        // 4. Availability
        if (availability) {
            const availList = Array.isArray(availability) ? availability : availability.split(',');
            if (availList.includes('In Stock')) {
                conditions.push({ inventory: { some: { stock: { gt: 0 } } } });
            }
        }

        // 5. Specification Filters (JSONB Querying)
        // Note: For multiple JSON path filters, we use AND to avoid overwriting the specifications key
        const specFilters = [];

        if (isSmart === 'true') {
            specFilters.push({ specifications: { path: ['isSmart'], equals: true } });
        }

        const addSpecFilter = (field, val) => {
            const values = Array.isArray(val) ? val : val.split(',');
            if (values.length > 0) {
                specFilters.push({ specifications: { path: [field], equals: values[0] } });
            }
        };

        if (powerConsumption) addSpecFilter('powerConsumption', powerConsumption);
        if (capacity) addSpecFilter('capacity', capacity);
        if (energyRating) addSpecFilter('energyRating', energyRating);
        if (installationType) addSpecFilter('installationType', installationType);
        if (usageType) addSpecFilter('usageType', usageType);
        if (warranty) addSpecFilter('warranty', warranty);

        if (specFilters.length > 0) {
            conditions.push(...specFilters);
        }

        // Final check for manufacturerFilter
        if (Object.keys(manufacturerFilter).length > 0) {
            conditions.push({ manufacturer: manufacturerFilter });
        }

        if (conditions.length > 0) {
            where.AND = conditions;
        }
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
                    manufacturer: {
                        select: {
                            companyName: true,
                            factoryAddress: true,
                            isVerified: true
                        }
                    },
                    inventory: {
                        take: 1,
                        where: { stock: { gt: 0 } },
                        include: {
                            dealer: {
                                select: {
                                    businessName: true
                                }
                            }
                        }
                    }
                },
                orderBy,
                skip,
                take
            })
        ]);

        res.json({
            success: true,
            data: products,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        logger.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products',
            details: error.message
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                manufacturer: {
                    select: {
                        id: true,
                        companyName: true,
                        logo: true,
                        isVerified: true
                    }
                },
                inventory: {
                    where: { stock: { gt: 0 } },
                    include: {
                        dealer: {
                            select: {
                                id: true,
                                businessName: true,
                                averageRating: true,
                                reviewCount: true
                            }
                        }
                    }
                },
                reviews: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: {
                        customer: {
                            select: { name: true }
                        }
                    }
                }
            }
        });

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Log View Behavior (Background)
        if (req.user) {
            prisma.userBehavior.create({
                data: {
                    userId: req.user.id,
                    type: 'VIEW',
                    targetId: id,
                    metadata: { type: 'PRODUCT_VIEW', category: product.category }
                }
            }).catch(err => console.error('Failed to log view:', err.message));
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        logger.error('Error fetching product details:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch product' });
    }
};

export const updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                status,
                rejectionReason: status === 'REJECTED' ? rejectionReason : null,
                isApproved: status === 'APPROVED' // detailed sync
            }
        });

        logger.info(`Product status updated: ${id} -> ${status}`);

        res.json({
            success: true,
            message: `Product ${status}`,
            data: product
        });
    } catch (error) {
        logger.error('Error updating product status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update product status'
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const manufacturerId = req.user.manufacturer?.id;

        // Check ownership
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });

        if (!existingProduct || existingProduct.manufacturerId !== manufacturerId) {
            return res.status(403).json({ error: 'Not authorized to update this product' });
        }

        const {
            name, description, basePrice, moq, category,
            colors, sizes, images, video, specifications,
            status, ...otherFields
        } = req.body;

        const finalSpecs = {
            ...(existingProduct.specifications || {}),
            ...(specifications || {}),
            ...otherFields
        };

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name, description,
                basePrice: parseFloat(basePrice),
                moq: parseInt(moq),
                category,
                colors, sizes, images, video,
                specifications: finalSpecs,
                // If specific critical fields change, reset status to PENDING
                status: (existingProduct.status === 'APPROVED' && (basePrice !== existingProduct.basePrice || name !== existingProduct.name)) ? 'PENDING' : existingProduct.status
            }
        });

        res.json({ success: true, message: 'Product updated', data: updatedProduct });
    } catch (error) {
        logger.error('Error updating product:', error);
        res.status(500).json({ success: false, error: 'Failed to update product' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const manufacturerId = req.user.manufacturer?.id;

        const product = await prisma.product.findUnique({ where: { id } });

        if (!product || product.manufacturerId !== manufacturerId) {
            return res.status(403).json({ error: 'Not authorized to delete this product' });
        }

        await prisma.product.delete({ where: { id } });

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        logger.error('Error deleting product:', error);
        res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
};

export const getCategories = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { status: 'APPROVED' },
            distinct: ['category'],
            select: { category: true }
        });

        const categories = products
            .map(p => p.category)
            .filter(c => c && c.trim() !== '');

        res.json({
            success: true,
            data: [...new Set(categories)]
        });
    } catch (error) {
        logger.error('Error fetching categories:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
};

export default {
    createProduct,
    getMyProducts,
    getAllProducts,
    getProductById,
    updateProductStatus,
    updateProduct,
    deleteProduct,
    getCategories
};

