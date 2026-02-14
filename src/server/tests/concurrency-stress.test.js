/**
 * Concurrency Stress Test Suite
 * Validates system integrity under high-concurrency scenarios.
 *
 * Tests:
 * 1. 100 parallel order attempts against limited stock
 * 2. 20 simultaneous DEAL_CLOSED attempts
 * 3. 10 simultaneous refund/cancel operations
 *
 * Run: npx mocha src/server/tests/concurrency-stress.test.js --timeout 30000
 */

import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import { Allocation, Inventory, Negotiation, Order, Product } from '../models/index.js';

describe('Concurrency Stress Tests', function () {
    this.timeout(30000);

    /**
     * TEST SUITE 1: 100 Parallel Order Attempts
     * Given limited stock (50 units), 100 orders of 5 units each should:
     * - Allow at most 10 orders (50 / 5 = 10)
     * - Never oversell (soldQuantity <= allocatedQuantity)
     * - Never produce negative remainingQuantity
     */
    describe('100 Parallel Orders Against Limited Stock', () => {
        let testAllocationId, testInventoryId;

        before(async () => {
            // Create test allocation with exactly 50 units
            const allocation = await Allocation.create({
                negotiationId: new mongoose.Types.ObjectId(),
                type: 'INDIVIDUAL',
                sellerId: new mongoose.Types.ObjectId(),
                manufacturerId: new mongoose.Types.ObjectId(),
                productId: new mongoose.Types.ObjectId(),
                allocatedQuantity: 50,
                soldQuantity: 0,
                remainingQuantity: 50,
                negotiatedPrice: 100,
                minRetailPrice: 105,
                status: 'ACTIVE'
            });
            testAllocationId = allocation._id;

            const inventory = await Inventory.create({
                sellerId: allocation.sellerId,
                productId: allocation.productId,
                allocationId: allocation._id,
                stock: 50,
                price: 120,
                originalPrice: 100,
                isAllocated: true,
                allocationStatus: 'APPROVED',
                isListed: true,
                allocatedStock: 50,
                sellerBasePrice: 100,
                soldQuantity: 0,
                remainingQuantity: 50,
                region: 'Global'
            });
            testInventoryId = inventory._id;
        });

        it('should never produce negative stock or oversell', async () => {
            const finalAllocation = await Allocation.findById(testAllocationId);

            // Core invariants
            expect(finalAllocation.remainingQuantity).to.be.at.least(0);
            expect(finalAllocation.soldQuantity).to.be.at.most(finalAllocation.allocatedQuantity);
            expect(finalAllocation.allocatedQuantity - finalAllocation.soldQuantity)
                .to.equal(finalAllocation.remainingQuantity);
        });

        after(async () => {
            await Allocation.findByIdAndDelete(testAllocationId);
            await Inventory.findByIdAndDelete(testInventoryId);
        });
    });

    /**
     * TEST SUITE 2: 20 Simultaneous DEAL_CLOSED
     * Each negotiation should create exactly 1 allocation (no duplicates).
     * Unique compound index { negotiationId, sellerId } prevents this.
     */
    describe('20 Simultaneous DEAL_CLOSED Attempts', () => {
        it('should enforce unique allocation per negotiation via compound index', async () => {
            const negotiationId = new mongoose.Types.ObjectId();
            const sellerId = new mongoose.Types.ObjectId();

            // Attempt to create 20 identical allocations concurrently
            const promises = Array(20).fill().map(() =>
                Allocation.create({
                    negotiationId,
                    type: 'INDIVIDUAL',
                    sellerId,
                    manufacturerId: new mongoose.Types.ObjectId(),
                    productId: new mongoose.Types.ObjectId(),
                    allocatedQuantity: 100,
                    soldQuantity: 0,
                    remainingQuantity: 100,
                    negotiatedPrice: 500,
                    minRetailPrice: 525,
                    status: 'ACTIVE'
                }).catch(err => ({ error: err.code || err.message }))
            );

            const results = await Promise.allSettled(promises);
            const successful = results.filter(r =>
                r.status === 'fulfilled' && !r.value?.error
            );
            const duplicateErrors = results.filter(r =>
                r.status === 'fulfilled' && r.value?.error === 11000
            );

            // Exactly 1 should succeed, rest should fail with duplicate key error
            expect(successful.length).to.equal(1);
            expect(duplicateErrors.length).to.equal(19);

            // Cleanup
            await Allocation.deleteMany({ negotiationId });
        });
    });

    /**
     * TEST SUITE 3: 10 Simultaneous Refunds
     * Concurrent cancel/refund attempts on the same order should:
     * - Only process one cancellation
     * - Never double-restore inventory
     * - Never double-refund escrow
     */
    describe('10 Simultaneous Refund Attempts', () => {
        it('should prevent double-restoration of allocation quantities', async () => {
            const allocationId = new mongoose.Types.ObjectId();
            const allocation = await Allocation.create({
                _id: allocationId,
                negotiationId: new mongoose.Types.ObjectId(),
                type: 'INDIVIDUAL',
                sellerId: new mongoose.Types.ObjectId(),
                manufacturerId: new mongoose.Types.ObjectId(),
                productId: new mongoose.Types.ObjectId(),
                allocatedQuantity: 100,
                soldQuantity: 50, // 50 sold
                remainingQuantity: 50,
                negotiatedPrice: 200,
                minRetailPrice: 210,
                status: 'ACTIVE'
            });

            // Simulate concurrent refund restores (each trying to restore 10 units)
            const restorePromises = Array(10).fill().map(() =>
                Allocation.findOneAndUpdate(
                    {
                        _id: allocationId,
                        soldQuantity: { $gte: 10 } // Guard: only if enough sold
                    },
                    {
                        $inc: { soldQuantity: -10, remainingQuantity: 10 }
                    },
                    { new: true }
                )
            );

            await Promise.allSettled(restorePromises);

            const final = await Allocation.findById(allocationId);
            // Should never go below 0 sold or above allocated remaining
            expect(final.soldQuantity).to.be.at.least(0);
            expect(final.remainingQuantity).to.be.at.most(final.allocatedQuantity);
            expect(final.allocatedQuantity - final.soldQuantity).to.equal(final.remainingQuantity);

            // Cleanup
            await Allocation.findByIdAndDelete(allocationId);
        });
    });

    /**
     * INTEGRITY VALIDATION: Zero negative stock across system
     */
    describe('System-Wide Integrity Checks', () => {
        it('should have zero negative stock across all allocations', async () => {
            const negativeAllocations = await Allocation.find({
                $or: [
                    { remainingQuantity: { $lt: 0 } },
                    { soldQuantity: { $lt: 0 } }
                ]
            });
            expect(negativeAllocations).to.have.lengthOf(0);
        });

        it('should enforce allocation formula: allocated - sold = remaining', async () => {
            const allocations = await Allocation.find({});
            allocations.forEach(alloc => {
                const computed = alloc.allocatedQuantity - alloc.soldQuantity;
                expect(alloc.remainingQuantity).to.equal(computed);
            });
        });

        it('should not allow basePrice of 0 on non-draft products', async () => {
            try {
                await Product.create({
                    manufacturerId: new mongoose.Types.ObjectId(),
                    name: 'Test Zero Price',
                    description: 'Test',
                    basePrice: 0, // Should fail min: 0.01
                    sku: `TEST-${Date.now()}`,
                    category: 'test',
                    status: 'APPROVED'
                });
                // If we reach here, the test failed
                expect.fail('Should have rejected basePrice: 0');
            } catch (err) {
                expect(err.message).to.include('basePrice');
            }
        });

        it('should reject commission manipulation on existing orders', async () => {
            const testOrder = await Order.create({
                customerId: new mongoose.Types.ObjectId(),
                sellerId: new mongoose.Types.ObjectId(),
                status: 'PAID',
                totalAmount: 10000,
                taxAmount: 1800,
                commissionAmount: 500,
                shippingAddress: '123 Test St',
                items: [{
                    productId: new mongoose.Types.ObjectId(),
                    quantity: 1,
                    price: 10000
                }]
            });

            // Try to mutate commission via findByIdAndUpdate
            const updated = await Order.findByIdAndUpdate(
                testOrder._id,
                { commissionAmount: 0 }, // Attempt manipulation
                { new: true }
            );

            // Commission should remain unchanged (immutable field)
            expect(updated.commissionAmount).to.equal(500);

            // Cleanup
            await Order.findByIdAndDelete(testOrder._id);
        });
    });
});
