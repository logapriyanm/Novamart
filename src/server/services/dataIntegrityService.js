/**
 * Data Integrity Audit Service
 * Background checks for orphan records, negative stock, and referential integrity.
 */

import mongoose from 'mongoose';
import { Product, Allocation, Inventory, Negotiation, Order } from '../models/index.js';
import Escrow from '../models/Escrow.js';
import logger from '../lib/logger.js';

class DataIntegrityService {
    /**
     * Run full integrity audit and return a comprehensive report.
     */
    async runFullAudit() {
        const report = {
            timestamp: new Date().toISOString(),
            checks: {},
            totalIssues: 0,
            status: 'HEALTHY'
        };

        // 1. Orphan Allocations (allocation references a product that doesn't exist)
        const orphanAllocations = await this._checkOrphanAllocations();
        report.checks.orphanAllocations = orphanAllocations;
        report.totalIssues += orphanAllocations.count;

        // 2. Orphan Negotiations (negotiation references deleted product)
        const orphanNegotiations = await this._checkOrphanNegotiations();
        report.checks.orphanNegotiations = orphanNegotiations;
        report.totalIssues += orphanNegotiations.count;

        // 3. Negative Stock Detection
        const negativeStock = await this._checkNegativeStock();
        report.checks.negativeStock = negativeStock;
        report.totalIssues += negativeStock.count;

        // 4. Allocation Without Product
        const allocationWithoutProduct = await this._checkAllocationWithoutProduct();
        report.checks.allocationWithoutProduct = allocationWithoutProduct;
        report.totalIssues += allocationWithoutProduct.count;

        // 5. Inventory Without Allocation
        const inventoryWithoutAllocation = await this._checkInventoryWithoutAllocation();
        report.checks.inventoryWithoutAllocation = inventoryWithoutAllocation;
        report.totalIssues += inventoryWithoutAllocation.count;

        // 6. Allocation Formula Violations (allocated - sold != remaining)
        const formulaViolations = await this._checkAllocationFormula();
        report.checks.formulaViolations = formulaViolations;
        report.totalIssues += formulaViolations.count;

        // 7. Escrow Without Order
        const orphanEscrows = await this._checkOrphanEscrows();
        report.checks.orphanEscrows = orphanEscrows;
        report.totalIssues += orphanEscrows.count;

        // 8. Orders with invalid status/escrow pairing
        const statusMismatches = await this._checkOrderEscrowConsistency();
        report.checks.orderEscrowMismatch = statusMismatches;
        report.totalIssues += statusMismatches.count;

        if (report.totalIssues > 0) {
            report.status = report.totalIssues > 10 ? 'CRITICAL' : 'DEGRADED';
        }

        logger.info(`[DataIntegrity] Audit complete: ${report.totalIssues} issues found (${report.status})`);
        return report;
    }

    async _checkOrphanAllocations() {
        const allProductIds = await Product.distinct('_id');
        const orphans = await Allocation.find({
            productId: { $nin: allProductIds }
        }).select('_id productId sellerId status').lean();

        return { count: orphans.length, items: orphans.slice(0, 20) };
    }

    async _checkOrphanNegotiations() {
        const allProductIds = await Product.distinct('_id');
        const orphans = await Negotiation.find({
            productId: { $nin: allProductIds },
            status: { $nin: ['REJECTED', 'DEAL_CLOSED'] }
        }).select('_id productId status').lean();

        return { count: orphans.length, items: orphans.slice(0, 20) };
    }

    async _checkNegativeStock() {
        const negativeProducts = await Product.find({
            stockQuantity: { $lt: 0 }
        }).select('_id name stockQuantity').lean();

        const negativeAllocations = await Allocation.find({
            $or: [
                { remainingQuantity: { $lt: 0 } },
                { soldQuantity: { $lt: 0 } }
            ]
        }).select('_id productId remainingQuantity soldQuantity').lean();

        const negativeInventory = await Inventory.find({
            $or: [
                { stock: { $lt: 0 } },
                { remainingQuantity: { $lt: 0 } }
            ]
        }).select('_id productId stock remainingQuantity').lean();

        const total = negativeProducts.length + negativeAllocations.length + negativeInventory.length;
        return {
            count: total,
            products: negativeProducts.slice(0, 10),
            allocations: negativeAllocations.slice(0, 10),
            inventory: negativeInventory.slice(0, 10)
        };
    }

    async _checkAllocationWithoutProduct() {
        const productIds = await Product.distinct('_id', { isDeleted: { $ne: true } });
        const orphans = await Allocation.find({
            productId: { $nin: productIds },
            status: 'ACTIVE'
        }).select('_id productId sellerId').lean();

        return { count: orphans.length, items: orphans.slice(0, 20) };
    }

    async _checkInventoryWithoutAllocation() {
        const items = await Inventory.find({
            isAllocated: true,
            allocationId: { $exists: true, $ne: null }
        }).select('_id productId allocationId sellerId').lean();

        const allocationIds = await Allocation.distinct('_id');
        const allocationIdStrings = allocationIds.map(id => id.toString());

        const orphans = items.filter(inv =>
            inv.allocationId && !allocationIdStrings.includes(inv.allocationId.toString())
        );

        return { count: orphans.length, items: orphans.slice(0, 20) };
    }

    async _checkAllocationFormula() {
        const allocations = await Allocation.find({ status: 'ACTIVE' })
            .select('_id allocatedQuantity soldQuantity remainingQuantity')
            .lean();

        const violations = allocations.filter(a =>
            a.allocatedQuantity - a.soldQuantity !== a.remainingQuantity
        );

        return { count: violations.length, items: violations.slice(0, 20) };
    }

    async _checkOrphanEscrows() {
        const allOrderIds = await Order.distinct('_id');
        const orphans = await Escrow.find({
            orderId: { $nin: allOrderIds }
        }).select('_id orderId status amount').lean();

        return { count: orphans.length, items: orphans.slice(0, 20) };
    }

    async _checkOrderEscrowConsistency() {
        // Orders marked PAID should have escrow in HOLD
        const paidWithoutEscrow = [];
        const paidOrders = await Order.find({ status: 'PAID' }).select('_id').lean();

        for (const order of paidOrders.slice(0, 50)) {
            const escrow = await Escrow.findOne({ orderId: order._id });
            if (!escrow || escrow.status !== 'HOLD') {
                paidWithoutEscrow.push({
                    orderId: order._id,
                    escrowStatus: escrow?.status || 'MISSING'
                });
            }
        }

        return { count: paidWithoutEscrow.length, items: paidWithoutEscrow.slice(0, 20) };
    }
}

export default new DataIntegrityService();
