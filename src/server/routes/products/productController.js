import prisma from '../../lib/prisma.js';

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

        // Merge detailed fields into specifications
        const finalSpecs = {
            ...(specifications || {}),
            ...otherFields
        };

        // 2. Create Product
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
                status: status || 'DRAFT',
                isApproved: false // Default to false
            }
        });

        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
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

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export default {
    createProduct,
    getMyProducts
};
