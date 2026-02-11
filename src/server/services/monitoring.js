import { Payment, Escrow, Inventory } from '../models/index.js';

class MonitoringService {
    /**
     * Run full system health check
     */
    async getSystemHealth() {
        const [paymentAlerts, escrowAlerts, inventoryAlerts] = await Promise.all([
            this.checkFailedPayments(),
            this.checkStuckEscrows(),
            this.checkInventoryIntegrity()
        ]);

        const status = (paymentAlerts.length > 0 || escrowAlerts.length > 0 || inventoryAlerts.length > 0)
            ? 'WARNING'
            : 'HEALTHY';

        return {
            status,
            timestamp: new Date(),
            alerts: {
                payments: paymentAlerts,
                escrows: escrowAlerts,
                inventory: inventoryAlerts
            }
        };
    }

    /**
     * Detect high failure rates or specific payment issues (Last 24h)
     */
    async checkFailedPayments() {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const failures = await Payment.find({
            status: 'FAILED',
            createdAt: { $gte: twentyFourHoursAgo }
        }).populate('orderId', 'totalAmount')
            .limit(20);

        return failures.map(f => ({
            severity: 'HIGH',
            message: `Payment Failed: ${f.orderId?._id} (Amount: ${f.amount})`,
            timestamp: f.createdAt
        }));
    }

    /**
     * Detect Escrows stuck in HOLD/FROZEN for > 7 days
     */
    async checkStuckEscrows() {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const stuckEscrows = await Escrow.find({
            status: { $in: ['HOLD', 'FROZEN'] },
            updatedAt: { $lt: sevenDaysAgo }
        }).populate('orderId', 'status')
            .limit(20);

        return stuckEscrows.map(e => ({
            severity: 'MEDIUM',
            message: `Escrow Stuck (${e.status}): Order ${e.orderId?._id} last updated ${e.updatedAt.toLocaleDateString()}`,
            id: e._id
        }));
    }

    /**
     * Detect Negative Stock or Locked > Stock
     */
    async checkInventoryIntegrity() {
        try {
            // Mongoose/MongoDB field comparison requires $expr
            const mismatches = await Inventory.find({
                $or: [
                    { stock: { $lt: 0 } },
                    { $expr: { $gt: ['$locked', '$stock'] } }
                ]
            }).limit(20);

            return mismatches.map(i => ({
                severity: 'CRITICAL',
                message: `Inventory Mismatch: Item ${i._id} (Stock: ${i.stock}, Locked: ${i.locked})`,
                id: i._id
            }));
        } catch (error) {
            console.error('Inventory check failed:', error);
            return [{ severity: 'ERROR', message: 'Failed to run inventory check' }];
        }
    }
}

export default new MonitoringService();
