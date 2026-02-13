/**
 * Customer Service
 * Logic for customer-specific actions like ratings and discovery.
 */

import { Product, Customer, Order, Review } from '../models/index.js';
import userService from './userService.js';

class CustomerService {
    /**
     * Browse Products with Regional Availability.
     */
    async browseProducts({ region, category, search }) {
        const query = {
            isApproved: true
        };

        if (category) query.category = category;
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query)
            .populate({
                path: 'inventory',
                match: region ? { region, stock: { $gt: 0 } } : { stock: { $gt: 0 } },
                populate: { path: 'sellerId', select: 'businessName' }
            });

        // Filter out products with no matching inventory
        return products.filter(p => p.inventory && p.inventory.length > 0);
    }

    /**
     * Get Customer Profile.
     */
    async getProfile(customerId) {
        return await Customer.findById(customerId).populate('userId', 'email phone avatar status createdAt');
    }

    /**
     * Update Customer Profile.
     */
    async updateProfile(customerId, data) {
        const customer = await Customer.findById(customerId);
        if (!customer) throw new Error('CUSTOMER_NOT_FOUND');

        return await userService.updateFullProfile(customer.userId, 'CUSTOMER', 'account', data);
    }

    /**
     * Get Customer Order History with Status & Escrow Info.
     */
    async getOrderHistory(customerId) {
        return await Order.find({ customerId })
            .populate({
                path: 'items.inventoryId',
                populate: { path: 'productId' }
            })
            .populate('escrow')
            .sort({ createdAt: -1 });
    }
}

export default new CustomerService();
