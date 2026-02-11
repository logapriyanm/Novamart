/**
 * Stock Allocation Service
 * Logic for manufacturers to allocate stock, set dealer-specific pricing and MOQ.
 */

import Product from '../models/Product.js';
import Manufacturer from '../models/Manufacturer.js';
import Inventory from '../models/Inventory.js';
import User from '../models/User.js';
import ManufacturerDealerBlock from '../models/ManufacturerDealerBlock.js';
import mongoose from 'mongoose';

class StockAllocationService {
    /**
     * Allocate stock to a dealer for a specific product.
     * Updates or creates an inventory record with allocation constraints.
     */
    async allocateStock(mfgId, { productId, dealerId, region, quantity, dealerBasePrice, dealerMoq, maxMargin }) {
        // 1. Verify Product Ownership
        const product = await Product.findById(productId);

        if (!product || product.manufacturerId.toString() !== mfgId.toString()) {
            throw new Error('UNAUTHORIZED_PRODUCT_ALLOCATION');
        }

        // 2. Ensure Dealer is in network (Approved)
        const manufacturer = await Manufacturer.findById(mfgId);

        if (!manufacturer.approvedBy?.includes(dealerId)) {
            // Automatically add to network if allocating stock
            await Manufacturer.findByIdAndUpdate(mfgId, {
                $addToSet: { approvedBy: dealerId }
            });
        }

        // 3. Check if dealer is blocked (Logic simplified for Mongoose)
        // Note: Blocked logic in MongoDB will depend on how ManufacturerDealerBlock is implemented.
        // For now, mirroring Prisma flow.
        // 3. Check if dealer is blocked
        const isBlocked = await ManufacturerDealerBlock.findOne({
            manufacturerId: mfgId,
            dealerId: dealerId,
            isActive: true
        });

        if (isBlocked) {
            throw new Error('DEALER_IS_BLOCKED');
        }

        // 4. Update or Create Inventory Record
        const query = { productId, dealerId, region };
        const existingInventory = await Inventory.findOne(query);

        if (existingInventory) {
            return await Inventory.findByIdAndUpdate(existingInventory._id, {
                $inc: { allocatedStock: quantity },
                dealerBasePrice: dealerBasePrice || product.basePrice,
                dealerMoq: dealerMoq || 1,
                maxMargin: maxMargin || 20,
                isAllocated: true,
                price: existingInventory.price || dealerBasePrice || product.basePrice
            }, { new: true });
        } else {
            return await Inventory.create({
                productId,
                dealerId,
                region,
                stock: 0,
                allocatedStock: quantity,
                dealerBasePrice: dealerBasePrice || product.basePrice,
                dealerMoq: dealerMoq || 1,
                maxMargin: maxMargin || 20,
                isAllocated: true,
                price: dealerBasePrice || product.basePrice
            });
        }
    }

    /**
     * Get all allocations for a manufacturer across their dealer network.
     */
    async getManufacturerAllocations(mfgId) {
        const products = await Product.find({ manufacturerId: mfgId }).select('_id');
        const productIds = products.map(p => p._id);

        return await Inventory.find({
            productId: { $in: productIds },
            isAllocated: true
        })
            .populate('dealerId', 'businessName city')
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
            dealerBasePrice: updateData.dealerBasePrice,
            dealerMoq: updateData.dealerMoq,
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
     * Get allocations for a specific dealer (for dealer dashboard).
     */
    async getDealerAllocations(dealerId) {
        return await Inventory.find({
            dealerId,
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
