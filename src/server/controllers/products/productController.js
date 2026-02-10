import productService from '../../services/productService.js';
import prisma from '../../lib/prisma.js'; // Keep for profile check shim if needed or remove if moved
import logger from '../../lib/logger.js';

export const createProduct = async (req, res) => {
    try {
        // 1. Get Manufacturer Profile
        const manufacturer = await prisma.manufacturer.findUnique({
            where: { userId: req.user.id }
        });

        if (!manufacturer) {
            return res.status(403).json({ error: 'Manufacturer profile not found.' });
        }

        // Profile Completion Gating
        const isComplete = manufacturer.companyName && manufacturer.registrationNo && manufacturer.factoryAddress && manufacturer.gstNumber;
        if (!isComplete) {
            return res.status(403).json({
                success: false,
                error: 'PROFILE_INCOMPLETE',
                message: 'Please complete your Company, Factory, and Compliance profile sections before submitting products.'
            });
        }

        const product = await productService.createProduct(manufacturer.id, req.body);
        res.status(201).json({ success: true, message: 'Product created successfully', data: product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getMyProducts = async (req, res) => {
    try {
        const manufacturer = await prisma.manufacturer.findUnique({ where: { userId: req.user.id } });
        if (!manufacturer) return res.status(403).json({ error: 'Manufacturer profile not found' });

        const products = await prisma.product.findMany({
            where: { manufacturerId: manufacturer.id },
            orderBy: { updatedAt: 'desc' }
        });
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const userRole = req.user?.role;
        const dealerId = req.user?.dealer?.id;

        const result = await productService.getAllProducts(req.query, userRole, dealerId);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id, req.user?.id);
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch product' });
    }
};

export const updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;
        const product = await productService.updateStatus(id, status, rejectionReason);
        res.json({ success: true, message: `Product ${status}`, data: product });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update product status' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const manufacturerId = req.user.manufacturer?.id;
        const product = await productService.updateProduct(req.params.id, manufacturerId, req.body);
        res.json({ success: true, message: 'Product updated', data: product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const manufacturerId = req.user.manufacturer?.id;
        await productService.deleteProduct(req.params.id, manufacturerId);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const bulkImportProducts = async (req, res) => {
    try {
        const manufacturerId = req.user.manufacturer?.id;
        const created = await productService.bulkImport(manufacturerId, req.body.products);
        res.json({ success: true, message: `Successfully imported ${created.count} products`, count: created.count });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getDiscoveryFilters = async (req, res) => {
    try {
        const { category, subCategory } = req.query;
        const data = await productService.getDiscoveryFilters(category, subCategory);
        res.json({ success: true, data });
    } catch (error) {
        logger.error('Fetch discovery filters failed:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch filters' });
    }
};

export const getCategories = async (req, res) => {
    try {
        const products = await prisma.product.findMany({ where: { status: 'APPROVED' }, distinct: ['category'], select: { category: true } });
        res.json({ success: true, data: products.map(p => p.category) });
    } catch (error) {
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
    getCategories,
    getDiscoveryFilters,
    bulkImportProducts
};

