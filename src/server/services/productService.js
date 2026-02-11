/**
 * Product Service
 * Logic for catalog management, search, and manufacturer offerings.
 */

import { Product, Manufacturer, Inventory, User, Review, AuditLog } from '../models/index.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';
import logger from '../lib/logger.js';

class ProductService {
    /**
     * Create a new product.
     */
    /**
     * Create a new product.
     */
    async createProduct(manufacturerId, data, shouldAutoApprove = false) {
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

        // 2. Create Product
        // If manufacturer is verified (shouldAutoApprove), defaults to APPROVED. Otherwise PENDING.
        const initialStatus = shouldAutoApprove ? 'APPROVED' : 'PENDING';

        const product = await Product.create({
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
            status: initialStatus,
            isApproved: shouldAutoApprove
        });

        // 3. Emit Event
        systemEvents.emit(EVENTS.PRODUCT.CREATED, {
            productId: product._id,
            productName: product.name,
            manufacturerId,
            status: initialStatus
        });

        return product;
    }

    // ... getAllProducts (unchanged) ...

    /**
     * Manufacturer: Update product.
     */
    async updateProduct(id, manufacturerId, data, shouldAutoApprove = false) {
        const product = await Product.findById(id);
        if (!product || product.manufacturerId.toString() !== manufacturerId.toString()) {
            throw new Error('UNAUTHORIZED_PRODUCT_ACCESS');
        }

        const { basePrice, moq, specifications, ...other } = data;

        const updateData = { ...other };
        if (specifications) {
            updateData.specifications = { ...(product.specifications || {}), ...specifications };
        }
        if (basePrice) updateData.basePrice = parseFloat(basePrice);
        if (moq) updateData.moq = parseInt(moq);

        // Reset to PENDING if critical fields change AND manufacturer is NOT trusted
        // If shouldAutoApprove is true, we skip the revert to PENDING
        if (!shouldAutoApprove && product.status === 'APPROVED' && (updateData.basePrice !== product.basePrice || updateData.name !== product.name)) {
            updateData.status = 'PENDING';
            updateData.isApproved = false;
        }

        return await Product.findByIdAndUpdate(id, updateData, { new: true });
    }

    /**
     * Fetch products with advanced filtering and pagination.
     */
    async getAllProducts(filters, userRole, dealerId = null) {
        const {
            status, category, q, minPrice, maxPrice, sortBy,
            brands, rating, availability, verifiedOnly,
            subCategory, page = 1, limit = 20,
            networkOnly
        } = filters;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const query = {};

        // 1. Role-based Status Filtering
        if (userRole === 'ADMIN') {
            if (status) query.status = status;
        } else {
            query.status = 'APPROVED';
        }

        // 2. Category & Subcategory
        if (category && category !== 'all') {
            query.category = new RegExp(`^${category}$`, 'i');
        }

        if (subCategory && subCategory !== 'all') {
            const normalizedSubCategory = subCategory.toLowerCase().replace(/\s+/g, '-');
            query.$or = [
                { 'specifications.subCategory': subCategory },
                { 'specifications.subCategory': normalizedSubCategory }
            ];
        }

        // 3. Search Query (Text search)
        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } }
            ];
        }

        // 4. Price & Rating
        if (minPrice || maxPrice) {
            query.basePrice = {};
            if (minPrice) query.basePrice.$gte = parseFloat(minPrice);
            if (maxPrice) query.basePrice.$lte = parseFloat(maxPrice);
        }

        if (rating) {
            query.averageRating = { $gte: parseFloat(rating) };
        }

        // 5. Manufacturer Filters (Sub-query or Aggregation needed for networkOnly/verified)
        // For simplicity in a single query, we'll use $in with matching manufacturer IDs
        let manufacturerIds = [];
        const mfgQuery = {};
        if (verifiedOnly === 'true') mfgQuery.isVerified = true;
        if (brands) {
            const brandList = Array.isArray(brands) ? brands : brands.split(',');
            mfgQuery.companyName = { $in: brandList.map(b => new RegExp(`^${b}$`, 'i')) };
        }

        if (Object.keys(mfgQuery).length > 0 || (networkOnly === 'true' && dealerId)) {
            const manufacturers = await Manufacturer.find(mfgQuery).select('_id approvedBy');
            manufacturerIds = manufacturers
                .filter(m => networkOnly !== 'true' || (dealerId && m.approvedBy?.includes(dealerId)))
                .map(m => m._id);

            if (manufacturerIds.length > 0) {
                query.manufacturerId = { $in: manufacturerIds };
            } else if (Object.keys(mfgQuery).length > 0 || networkOnly === 'true') {
                // Return empty if filters provided but no manufacturers match
                return { products: [], pagination: { total: 0, page: parseInt(page), limit: parseInt(limit), pages: 0 } };
            }
        }

        // 6. Availability & Spec Filters
        if (availability?.includes('In Stock')) {
            // This is complex in MongoDB without aggregation. We'll handle it via sub-query.
            const productsWithInventory = await Inventory.distinct('productId', { stock: { $gt: 0 } });
            query._id = { $in: productsWithInventory };
        }

        // 7. Dynamic Spec Filters
        if (filters.specs) {
            const specsArray = filters.specs.split(',');
            specsArray.forEach(pair => {
                const [key, value] = pair.split(':');
                if (key && value) {
                    const field = `specifications.${key}`;
                    if (value.includes('|')) {
                        query[field] = { $in: value.split('|') };
                    } else {
                        query[field] = value;
                    }
                }
            });
        }

        // Sorting
        let sort = { updatedAt: -1 };
        if (sortBy) {
            switch (sortBy) {
                case 'price-low': sort = { basePrice: 1 }; break;
                case 'price-high': sort = { basePrice: -1 }; break;
                case 'rating': sort = { averageRating: -1 }; break;
                case 'newest': sort = { createdAt: -1 }; break;
                case 'popularity': sort = { reviewCount: -1 }; break;
            }
        }

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .populate('manufacturerId', 'companyName isVerified logo')
                .sort(sort)
                .skip(skip)
                .limit(take)
                .lean()
        ]);

        // Format to match old output (manufacturer vs manufacturerId)
        const formattedProducts = await Promise.all(products.map(async (p) => {
            const inventory = await Inventory.findOne({ productId: p._id, stock: { $gt: 0 } })
                .populate('dealerId', 'businessName')
                .lean();

            return {
                ...p,
                id: p._id,
                manufacturer: p.manufacturerId,
                inventory: inventory ? [inventory] : []
            };
        }));

        return {
            products: formattedProducts,
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
        if (!mongoose.Types.ObjectId.isValid(id)) return null;

        const product = await Product.findById(id)
            .populate('manufacturerId', 'companyName logo isVerified')
            .lean();

        if (!product) return null;

        const [inventory, reviews] = await Promise.all([
            Inventory.find({ productId: id, stock: { $gt: 0 } })
                .populate('dealerId', 'businessName averageRating reviewCount')
                .lean(),
            Review.find({ productId: id })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('customerId', 'name')
                .lean()
        ]);

        const formattedProduct = {
            ...product,
            id: product._id,
            manufacturer: product.manufacturerId,
            inventory,
            reviews
        };

        if (userId) {
            // Async track view
            AuditLog.create({
                userId,
                action: 'VIEW',
                targetType: 'PRODUCT',
                targetId: id,
                metadata: { type: 'PRODUCT_VIEW', category: product.category }
            }).catch(e => logger.error('View tracking failed', e));
        }

        return formattedProduct;
    }

    /**
     * Admin: Update product status.
     */
    async updateStatus(id, status, rejectionReason = null) {
        return await Product.findByIdAndUpdate(id, {
            status,
            rejectionReason: status === 'REJECTED' ? rejectionReason : null,
            isApproved: status === 'APPROVED'
        }, { new: true });
    }

    /**
     * Manufacturer: Update product.
     */
    async updateProduct(id, manufacturerId, data) {
        const product = await Product.findById(id);
        if (!product || product.manufacturerId.toString() !== manufacturerId.toString()) {
            throw new Error('UNAUTHORIZED_PRODUCT_ACCESS');
        }

        const { basePrice, moq, specifications, ...other } = data;

        const updateData = { ...other };
        if (specifications) {
            updateData.specifications = { ...(product.specifications || {}), ...specifications };
        }
        if (basePrice) updateData.basePrice = parseFloat(basePrice);
        if (moq) updateData.moq = parseInt(moq);

        // Reset to PENDING if critical fields change
        if (product.status === 'APPROVED' && (updateData.basePrice !== product.basePrice || updateData.name !== product.name)) {
            updateData.status = 'PENDING';
            updateData.isApproved = false;
        }

        return await Product.findByIdAndUpdate(id, updateData, { new: true });
    }

    /**
     * Manufacturer: Delete product.
     */
    async deleteProduct(id, manufacturerId) {
        const product = await Product.findById(id);
        if (!product || product.manufacturerId.toString() !== manufacturerId.toString()) {
            throw new Error('UNAUTHORIZED_PRODUCT_ACCESS');
        }

        return await Product.findByIdAndDelete(id);
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

        const result = await Product.insertMany(validProducts);
        return { count: result.length };
    }

    /**
     * Get discovery filters based on current approved catalog.
     */
    async getDiscoveryFilters(category = null) {
        const query = { status: 'APPROVED' };
        if (category && category !== 'all') {
            query.category = new RegExp(`^${category}$`, 'i');
        }

        const [priceRange, manufacturers, categories] = await Promise.all([
            Product.aggregate([
                { $match: query },
                { $group: { _id: null, min: { $min: '$basePrice' }, max: { $max: '$basePrice' } } }
            ]),
            Product.distinct('manufacturerId', query),
            Product.aggregate([
                { $match: { status: 'APPROVED' } },
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ])
        ]);

        const brandNames = await Manufacturer.find({ _id: { $in: manufacturers } }).distinct('companyName');

        return {
            minPrice: priceRange[0]?.min || 0,
            maxPrice: priceRange[0]?.max || 100000,
            brands: brandNames,
            categories: categories.map(c => ({ name: c._id, count: c.count }))
        };
    }
}

export default new ProductService();
