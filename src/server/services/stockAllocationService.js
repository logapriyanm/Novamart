/**
 * Stock Allocation Service
 * Logic for manufacturers to allocate stock, set seller-specific pricing and MOQ.
 */

import Product from '../models/Product.js';
import Manufacturer from '../models/Manufacturer.js';
import Inventory from '../models/Inventory.js';
import User from '../models/User.js';
import ManufacturerSellerBlock from '../models/ManufacturerSellerBlock.js';
import mongoose from 'mongoose';

class StockAllocationService {
    /**
     * Allocate stock to a seller for a specific product.
     * Updates or creates an inventory record with allocation constraints.
     */
    async allocateStock(mfgId, { productId, sellerId, region, quantity, sellerBasePrice, sellerMoq, maxMargin }) {
        // 1. Verify Product Ownership
        const product = await Product.findById(productId);

        if (!product || product.manufacturerId.toString() !== mfgId.toString()) {
            throw new Error('UNAUTHORIZED_PRODUCT_ALLOCATION');
        }

        // 2. Ensure Seller is in network (Approved)
        const manufacturer = await Manufacturer.findById(mfgId);

        if (!manufacturer.approvedBy?.includes(sellerId)) {
            // Automatically add to network if allocating stock
            await Manufacturer.findByIdAndUpdate(mfgId, {
                $addToSet: { approvedBy: sellerId }
            });
        }

        // 3. Check if seller is blocked
        const isBlocked = await ManufacturerSellerBlock.findOne({
            manufacturerId: mfgId,
            sellerId: sellerId,
            isActive: true
        });

        if (isBlocked) {
            throw new Error('SELLER_IS_BLOCKED');
        }

        // 4. Update or Create Inventory Record
        const query = { productId, sellerId, region };
        const existingInventory = await Inventory.findOne(query);

        if (existingInventory) {
            return await Inventory.findByIdAndUpdate(existingInventory._id, {
                $inc: { allocatedStock: quantity },
                sellerBasePrice: sellerBasePrice || product.basePrice,
                sellerMoq: sellerMoq || 1,
                maxMargin: maxMargin || 20,
                isAllocated: true,
                price: existingInventory.price || sellerBasePrice || product.basePrice
            }, { new: true });
        } else {
            return await Inventory.create({
                productId,
                sellerId,
                region,
                stock: 0,
                allocatedStock: quantity,
                sellerBasePrice: sellerBasePrice || product.basePrice,
                sellerMoq: sellerMoq || 1,
                maxMargin: maxMargin || 20,
                isAllocated: true,
                price: sellerBasePrice || product.basePrice
            });
        }
    }

    /**
     * Get all allocations for a manufacturer across their seller network.
     */
    async getManufacturerAllocations(mfgId) {
        const products = await Product.find({ manufacturerId: mfgId }).select('_id');
        const productIds = products.map(p => p._id);

        return await Inventory.find({
            productId: { $in: productIds },
            isAllocated: true
        })
            .populate('sellerId', 'businessName city')
            .populate('productId', 'name basePrice images')
            .sort({ listedAt: -1 })
            .lean();
    }

    /**
     * Update an existing allocation's parameters.
     */
    async updateAllocation(mfgId, allocationId, updateData) {
        const inventory = await Inventory.findById(allocationId).populate('productId');

        if (!inventory || inventory.productId.manufacturerId.toString() !== mfgId.toString()) {
            throw new Error('UNAUTHORIZED_ALLOCATION_UPDATE');
        }

        return await Inventory.findByIdAndUpdate(allocationId, {
            allocatedStock: updateData.allocatedStock,
            sellerBasePrice: updateData.sellerBasePrice,
            sellerMoq: updateData.sellerMoq,
            maxMargin: updateData.maxMargin
        }, { new: true });
    }

    /**
     * Revoke an allocation.
     * Does not delete the record but removes allocation status and limits.
     */
    async revokeAllocation(mfgId, allocationId) {
        const inventory = await Inventory.findById(allocationId).populate('productId');

        if (!inventory || inventory.productId.manufacturerId.toString() !== mfgId.toString()) {
            throw new Error('UNAUTHORIZED_ALLOCATION_REVOKE');
        }

        return await Inventory.findByIdAndUpdate(allocationId, {
            isAllocated: false,
            isListed: false,
            allocatedStock: 0
        }, { new: true });
    }

    /**
     * Get allocations for a specific seller (for seller dashboard).
     */
    async getSellerAllocations(sellerId) {
        return await Inventory.find({
            sellerId,
            isAllocated: true
        })
            .populate({
                path: 'productId',
                populate: { path: 'manufacturerId', select: 'companyName businessType' }
            })
            .lean();
    }
}

export default new StockAllocationService();
