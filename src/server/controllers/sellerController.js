import { Manufacturer, Dealer, Review, Product, Inventory } from '../models/index.js';
import logger from '../lib/logger.js';

/**
 * Get public profile for a seller (Dealer or Manufacturer)
 */
export const getPublicProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Try finding as Dealer first, then Manufacturer
        let seller = await Dealer.findById(id).populate('userId', 'createdAt').lean();
        let sellerType = 'DEALER';

        if (!seller) {
            seller = await Manufacturer.findById(id).populate('userId', 'createdAt').lean();
            sellerType = 'MANUFACTURER';
        }

        if (!seller) {
            return res.status(404).json({ success: false, error: 'Seller not found' });
        }

        // Fetch approved reviews
        const reviews = await Review.find({
            dealerId: id, // Works for both if we use id as dealerId/sellerId
            type: 'SELLER',
            status: 'APPROVED'
        })
            .populate('customerId', 'name')
            .sort({ createdAt: -1 })
            .lean();

        // Fetch products associated with this seller
        let products = [];
        if (sellerType === 'DEALER') {
            const inventory = await Inventory.find({ dealerId: id, stock: { $gt: 0 } })
                .populate('productId')
                .lean();
            products = inventory.map(item => ({
                ...item.productId,
                inventoryId: item._id,
                price: item.price,
                stock: item.stock
            }));
        } else {
            products = await Product.find({ manufacturerId: id, status: 'APPROVED' }).lean();
        }

        const publicProfile = {
            id: seller._id,
            type: sellerType,
            businessName: seller.businessName || seller.companyName,
            description: seller.brandDescription || seller.businessDescription || '',
            city: seller.city || seller.factoryAddress?.split(',').pop()?.trim() || '',
            state: seller.state || '',
            joinedAt: seller.userId?.createdAt,
            isVerified: seller.isVerified,
            stats: {
                averageRating: seller.averageRating || 0,
                reviewCount: seller.reviewCount || 0,
                totalProducts: products.length
            },
            reviews,
            products
        };

        res.json({ success: true, data: publicProfile });
    } catch (error) {
        logger.error('Public Profile Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch seller profile' });
    }
};

/**
 * Get products from a specific seller
 */
export const getSellerProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Try Dealer inventory first
        const inventory = await Inventory.find({ dealerId: id, stock: { $gt: 0 } })
            .populate('productId')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        if (inventory.length > 0) {
            return res.json({
                success: true,
                data: inventory.map(item => ({
                    ...item.productId,
                    inventoryId: item._id,
                    price: item.price,
                    stock: item.stock
                }))
            });
        }

        // Try Manufacturer direct products
        const products = await Product.find({ manufacturerId: id, status: 'APPROVED' })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch seller products' });
    }
};

export default {
    getPublicProfile,
    getSellerProducts
};
