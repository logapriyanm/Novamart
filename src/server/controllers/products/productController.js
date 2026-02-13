import productService from '../../services/productService.js';
import { Manufacturer, Product } from '../../models/index.js';
import logger from '../../lib/logger.js';

export const createProduct = async (req, res) => {
    try {
        // 1. Get Manufacturer Profile
        const manufacturer = await Manufacturer.findOne({ userId: req.user.id });

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

        // Auto-approve if manufacturer is verified
        const shouldAutoApprove = manufacturer.isVerified === true;

        const product = await productService.createProduct(manufacturer._id, req.body, shouldAutoApprove);
        const successMessage = shouldAutoApprove ? 'Product published successfully' : 'Product submitted for review';

        res.status(201).json({ success: true, message: successMessage, data: product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getMyProducts = async (req, res) => {
    try {
        const manufacturer = await Manufacturer.findOne({ userId: req.user.id });
        if (!manufacturer) return res.status(403).json({ error: 'Manufacturer profile not found' });

        const products = await Product.find({ manufacturerId: manufacturer._id }).sort({ updatedAt: -1 });
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const userRole = req.user?.role;
        const sellerId = req.user?.seller?._id || req.user?.seller?.id;

        const result = await productService.getAllProducts(req.query, userRole, sellerId);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id, req.user?._id || req.user?.id);
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Get Product By ID Error:', error);
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
        const manufacturer = await Manufacturer.findOne({ userId: req.user.id });
        if (!manufacturer) return res.status(403).json({ error: 'Manufacturer profile not found' });

        const shouldAutoApprove = manufacturer.isVerified === true;

        const product = await productService.updateProduct(req.params.id, manufacturer._id, req.body, shouldAutoApprove);
        res.json({ success: true, message: 'Product updated', data: product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const manufacturer = await Manufacturer.findOne({ userId: req.user.id });
        if (!manufacturer) return res.status(403).json({ error: 'Manufacturer profile not found' });

        await productService.deleteProduct(req.params.id, manufacturer._id);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const bulkImportProducts = async (req, res) => {
    try {
        const manufacturer = await Manufacturer.findOne({ userId: req.user.id });
        if (!manufacturer) return res.status(403).json({ error: 'Manufacturer profile not found' });

        const shouldAutoApprove = manufacturer.isVerified === true;
        const created = await productService.bulkImport(manufacturer._id, req.body.products, shouldAutoApprove);
        const message = shouldAutoApprove ? `Successfully imported and published ${created.count} products` : `Successfully imported ${created.count} products (pending review)`;

        res.json({ success: true, message, count: created.count });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getDiscoveryFilters = async (req, res) => {
    try {
        const { category } = req.query;
        const data = await productService.getDiscoveryFilters(category);
        res.json({ success: true, data });
    } catch (error) {
        logger.error('Fetch discovery filters failed:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch filters' });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category', { status: 'APPROVED' });
        res.json({ success: true, data: categories });
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

