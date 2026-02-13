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
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // 1. Verify Product Ownership & Stock Availability
            const product = await Product.findById(productId).session(session);

            if (!product || product.manufacturerId.toString() !== mfgId.toString()) {
                throw new Error('UNAUTHORIZED_PRODUCT_ALLOCATION');
            }

            // Check if Manufacturer has enough unallocated stock
            if (product.stockQuantity < quantity) {
                throw new Error(`INSUFFICIENT_STOCK: Available ${product.stockQuantity}, Requested ${quantity}`);
            }

            // 2. Ensure Seller is in network (Approved)
            const manufacturer = await Manufacturer.findById(mfgId).session(session);

            if (!manufacturer.approvedBy?.includes(sellerId)) {
                await Manufacturer.findByIdAndUpdate(mfgId, {
                    $addToSet: { approvedBy: sellerId }
                }, { session });
            }

            // 3. Check if seller is blocked
            const isBlocked = await ManufacturerSellerBlock.findOne({
                manufacturerId: mfgId,
                sellerId: sellerId,
                isActive: true
            }).session(session);

            if (isBlocked) {
                throw new Error('SELLER_IS_BLOCKED');
            }

            // 4. Update or Create Inventory Record
            const query = { productId, sellerId, region };
            const existingInventory = await Inventory.findOne(query).session(session);

            let result;
            if (existingInventory) {
                result = await Inventory.findByIdAndUpdate(existingInventory._id, {
                    $inc: { allocatedStock: quantity }, // Total allocated increases
                    sellerBasePrice: sellerBasePrice || product.basePrice,
                    sellerMoq: sellerMoq || 1,
                    maxMargin: maxMargin || 20,
                    isAllocated: true,
                    // If previously allocated, price logic persists unless overwritten
                    price: existingInventory.price || sellerBasePrice || product.basePrice
                }, { new: true, session });
            } else {
                result = await Inventory.create([{
                    productId,
                    sellerId,
                    region,
                    stock: 0, // Actual physical stock held by seller is 0 until shipment? 
                    // Wait, if allocation = physical transfer?
                    // Prompt says "Inventory Model: Total Stock – Allocated to sellers = Available Stock".
                    // Usually Allocation != Shipment. Allocation is "Reserved for Seller".
                    // Seller might "Pull" stock later. 
                    // But here, let's track allocatedStock explicitly.
                    allocatedStock: quantity,
                    sellerBasePrice: sellerBasePrice || product.basePrice,
                    sellerMoq: sellerMoq || 1,
                    maxMargin: maxMargin || 20,
                    isAllocated: true,
                    price: sellerBasePrice || product.basePrice
                }], { session });
                result = result[0];
            }

            // 5. Deduct from Manufacturer Global Stock
            await Product.findByIdAndUpdate(productId, {
                $inc: { stockQuantity: -quantity }
            }, { session });

            await session.commitTransaction();
            return result;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
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
