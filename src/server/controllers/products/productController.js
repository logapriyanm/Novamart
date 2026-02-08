import prisma from '../../lib/prisma.js';
import systemEvents, { EVENTS } from '../../lib/systemEvents.js';

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
        const isVerified = manufacturer.isVerified;
        const autoApprove = isVerified;

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
                status: autoApprove ? 'APPROVED' : (status || 'APPROVED'),
                isApproved: autoApprove || true // Sync with status for simulation
            }
        });

        // Emit System Event
        systemEvents.emit(EVENTS.PRODUCT.CREATED, {
            productId: newProduct.id,
            productName: newProduct.name,
            manufacturerId: manufacturer.id
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct
        });

    } catch (error) {
        console.error('Error creating product:', error);
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
            // New Filters
            brands, rating, availability, verifiedOnly,
            powerConsumption, capacity, energyRating,
            installationType, usageType, warranty, isSmart
        } = req.query;

        const where = {};

        // Basic Filters
        if (status) where.status = status;
        if (category) where.category = category;

        // Search Query
        if (q) {
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { category: { contains: q, mode: 'insensitive' } },
                { 'manufacturer.companyName': { contains: q, mode: 'insensitive' } } // Search by brand
            ];
        }

        // Price Filter
        if (minPrice || maxPrice) {
            where.basePrice = {};
            if (minPrice) where.basePrice.gte = parseFloat(minPrice);
            if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
        }

        // --- NEW FILTERS ---

        // 1. Brands (Manufacturer Name)
        if (brands) {
            const brandList = Array.isArray(brands) ? brands : brands.split(',');
            where.manufacturer = {
                ...where.manufacturer, // Preserve existing manufacturer filters if any
                companyName: { in: brandList, mode: 'insensitive' }
            };
        }

        // 2. Verified Sellers Only
        if (verifiedOnly === 'true') {
            where.manufacturer = {
                ...where.manufacturer,
                isVerified: true
            };
        }

        // 3. Minimum Rating
        if (rating) {
            where.averageRating = { gte: parseFloat(rating) };
        }

        // 4. Availability
        if (availability) {
            const availList = Array.isArray(availability) ? availability : availability.split(',');
            if (availList.includes('In Stock')) {
                where.inventory = { some: { stock: { gt: 0 } } };
            }
            // 'Out of Stock' logic would be more complex (every inventory <= 0), 
            // typically users filter for 'In Stock'. 
        }

        // 5. Specification Filters (JSONB Querying)
        // Note: Prisma JSON filtering requires specific syntax. 
        // We'll map these requests to the 'specifications' JSON field.

        const jsonFilters = {};
        if (powerConsumption) jsonFilters.powerConsumption = { in: Array.isArray(powerConsumption) ? powerConsumption : powerConsumption.split(',') };
        if (capacity) jsonFilters.capacity = { in: Array.isArray(capacity) ? capacity : capacity.split(',') };
        if (energyRating) jsonFilters.energyRating = { in: Array.isArray(energyRating) ? energyRating : energyRating.split(',') };
        if (installationType) jsonFilters.installationType = { in: Array.isArray(installationType) ? installationType : installationType.split(',') };
        if (usageType) jsonFilters.usageType = { in: Array.isArray(usageType) ? usageType : usageType.split(',') };
        if (warranty) jsonFilters.warranty = { in: Array.isArray(warranty) ? warranty : warranty.split(',') };
        if (isSmart === 'true') jsonFilters.isSmart = true;

        // Apply JSON filters if any exist
        if (Object.keys(jsonFilters).length > 0) {
            // Simplest partial match approach for Postgres JSONB
            // Ideally use exact matches if structure is guaranteed
            Object.entries(jsonFilters).forEach(([key, value]) => {
                if (key === 'isSmart') {
                    where.specifications = {
                        path: ['isSmart'],
                        equals: true
                    };
                } else if (value.in) {
                    // Start OR logic for array of values
                    // Prisma JSON array filtering is tricky. 
                    // Fallback to simpler 'array-contains' if possible, or simple equals if single.
                    // For Production: Ideally flatten these to columns or use raw query.
                    // For now, let's try path filtering (works for single value selection effectively)

                    // Note: Filtering a JSON field for "Value IN [Array]" is limited in Prisma without raw query.
                    // We will implement simpler single-value filtering if array length is 1, 
                    // or skip complex multi-select filtering on JSON for this iteration to avoid crashing.

                    // Implementation for now: Filter if ANY match (simplified)
                    // If complex multi-select is needed for JSON keys, Raw SQL is preferred.
                }
            });

            // REVISED JSON STRATEGY: 
            // Since Prisma's JSON filtering is strict, let's use the `path` syntax for exact keys.
            // We will handle single-select scenarios cleanly.

            if (isSmart === 'true') {
                where.specifications = { ...(where.specifications || {}), path: ['isSmart'], equals: true };
            }
            // Helper to add spec filter
            const addSpecFilter = (field, val) => {
                const values = Array.isArray(val) ? val : val.split(',');
                if (values.length > 0) {
                    // OR logic for multiple selected values for the SAME field
                    // OR is not easily supported in single JSON filter object depth in Prisma.
                    // We will filter by the FIRST value for now to demonstrate functionality 
                    // or use `array_contains` if structure is an array (it's not, it's a value).

                    // Correct way with Prisma Client extensions or Raw would be distinct.
                    // Standard Prisma: path: ['field'], equals: value

                    // We will iterate and find matches.
                    where.specifications = {
                        ...(where.specifications || {}),
                        path: [field],
                        equals: values[0] // Taking first for stability in this step
                    };
                }
            };

            if (powerConsumption) addSpecFilter('powerConsumption', powerConsumption);
            if (capacity) addSpecFilter('capacity', capacity);
            if (energyRating) addSpecFilter('energyRating', energyRating);
            if (installationType) addSpecFilter('installationType', installationType);
            if (usageType) addSpecFilter('usageType', usageType);
            if (warranty) addSpecFilter('warranty', warranty);
        }


        // Sorting Logic
        let orderBy = { updatedAt: 'desc' };
        if (sortBy) {
            switch (sortBy) {
                case 'price-low': orderBy = { basePrice: 'asc' }; break;
                case 'price-high': orderBy = { basePrice: 'desc' }; break;
                case 'rating': orderBy = { averageRating: 'desc' }; break;
                case 'newest': orderBy = { createdAt: 'desc' }; break;
                case 'popularity': orderBy = { reviewCount: 'desc' }; break; // Proxy for high selling
            }
        }

        const products = await prisma.product.findMany({
            where: {
                ...where,
                manufacturer: {
                    user: {
                        status: { not: 'SUSPENDED' }
                    }
                }
            },
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
            orderBy
        });

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products'
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

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product details:', error);
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

        // Audit Log for Admin Action
        // await auditService.logAction('PRODUCT_STATUS_UPDATE', 'ADMIN', req.user.id, { productId: id, status });

        // res.json({ message: `Product ${status}`, product });
        res.json({
            success: true,
            message: `Product ${status}`,
            data: product
        });
    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update product status'
        });
    }
};

export default {
    createProduct,
    getMyProducts,
    getAllProducts,
    getProductById,
    updateProductStatus
};
