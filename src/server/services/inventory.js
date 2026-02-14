/**
 * Inventory Service
 * Handles retail listing creation with Phase 7 enforcement:
 * - Allocation existence validation
 * - Remaining quantity check
 * - Retail price >= negotiated + 5% validation
 */

import Allocation from '../models/Allocation.js';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import logger from '../lib/logger.js';
import mongoose from 'mongoose';

class InventoryService {
    /**
     * Create retail listing from allocation
     * Enforces Phase 7 rules
     */
    async createRetailListing(sellerId, allocationId, retailPrice, region = 'NATIONAL') {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Validation 1: Allocation exists
            const allocation = await Allocation.findById(allocationId).session(session);

            if (!allocation) {
                throw new Error('NO_ALLOCATION: No valid allocation found for this product');
            }

            // Validation 2: Seller owns this allocation
            if (allocation.sellerId.toString() !== sellerId.toString()) {
                throw new Error('UNAUTHORIZED: This allocation does not belong to you');
            }

            // Validation 3: Allocation is active
            if (allocation.status !== 'ACTIVE') {
                throw new Error(`INVALID_ALLOCATION_STATUS: Allocation status is ${allocation.status}`);
            }

            // Validation 4: Remaining quantity > 0
            if (allocation.remainingQuantity <= 0) {
                throw new Error('NO_STOCK: No remaining stock in this allocation');
            }

            // Validation 5: Price rule - retail >= negotiated * 1.05 (5% commission)
            const minPrice = allocation.minRetailPrice; // Already calculated as negotiatedPrice * 1.05

            if (retailPrice < minPrice) {
                throw new Error(`PRICE_TOO_LOW: Minimum retail price is ₹${minPrice.toFixed(2)} (negotiated price + 5% commission). You provided ₹${retailPrice}`);
            }

            // Validation 6: Check for duplicate listing
            const existing = await Inventory.findOne({
                sellerId,
                allocationId,
                region
            }).session(session);

            if (existing) {
                throw new Error('DUPLICATE_LISTING: A retail listing already exists for this allocation');
            }

            // Create inventory record
            const inventory = await Inventory.create([{
                productId: allocation.productId,
                sellerId,
                allocationId,
                region,
                stock: allocation.remainingQuantity, // Initially equal to remaining
                allocatedStock: allocation.remainingQuantity,
                soldQuantity: 0,
                remainingQuantity: allocation.remainingQuantity,
                retailPrice,
                price: retailPrice, // Legacy field
                negotiatedPrice: allocation.negotiatedPrice,
                minRetailPrice: allocation.minRetailPrice,
                isAllocated: true,
                isListed: false, // Seller must explicitly publish
                sellerBasePrice: allocation.negotiatedPrice
            }], { session });

            await session.commitTransaction();

            logger.info(`Retail listing created: Seller ${sellerId}, Allocation ${allocationId}, Retail Price: ${retailPrice}`);

            return inventory[0];
        } catch (error) {
            await session.abortTransaction();
            logger.error('Create retail listing error:', error);
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Update retail price with validation
     */
    async updateRetailPrice(inventoryId, sellerId, newPrice) {
        const inventory = await Inventory.findById(inventoryId).populate('allocationId');

        if (!inventory) {
            throw new Error('INVENTORY_NOT_FOUND');
        }

        if (inventory.sellerId.toString() !== sellerId.toString()) {
            throw new Error('UNAUTHORIZED');
        }

        // Enforce minimum price rule
        if (inventory.allocationId && inventory.allocationId.minRetailPrice) {
            if (newPrice < inventory.allocationId.minRetailPrice) {
                throw new Error(`PRICE_TOO_LOW: Minimum price is ₹${inventory.allocationId.minRetailPrice}`);
            }
        }

        inventory.retailPrice = newPrice;
        inventory.price = newPrice; // Update legacy field
        await inventory.save();

        return inventory;
    }

    /**
     * Toggle listing visibility
     */
    async toggleListing(inventoryId, sellerId, isListed) {
        const inventory = await Inventory.findById(inventoryId);

        if (!inventory) {
            throw new Error('INVENTORY_NOT_FOUND');
        }

        if (inventory.sellerId.toString() !== sellerId.toString()) {
            throw new Error('UNAUTHORIZED');
        }

        // Cannot list if no stock
        if (isListed && inventory.remainingQuantity <= 0) {
            throw new Error('NO_STOCK: Cannot list product with zero stock');
        }

        inventory.isListed = isListed;
        inventory.listedAt = isListed ? new Date() : inventory.listedAt;
        await inventory.save();

        return inventory;
    }

    /**
     * Get seller's retail listings
     */
    async getSellerListings(sellerId) {
        return await Inventory.find({
            sellerId,
            isAllocated: true
        })
            .populate('productId', 'name images category')
            .populate('allocationId')
            .sort({ createdAt: -1 })
            .lean();
    }
}

export default new InventoryService();
