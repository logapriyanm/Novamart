import prisma from '../lib/prisma.js';

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

        const failures = await prisma.payment.findMany({
            where: {
                status: 'FAILED',
                createdAt: { gte: twentyFourHoursAgo }
            },
            include: { order: { select: { id: true, totalAmount: true } } },
            take: 20
        });

        // If checks are simple, just return the list. 
        // Real-world would check rate (failures / total) > threshold.
        // Here we just alert on any logged failures for visibility.
        return failures.map(f => ({
            severity: 'HIGH',
            message: `Payment Failed: ${f.order?.id} (Amount: ${f.amount})`,
            timestamp: f.createdAt
        }));
    }

    /**
     * Detect Escrows stuck in HOLD/FROZEN for > 7 days
     */
    async checkStuckEscrows() {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const stuckEscrows = await prisma.escrow.findMany({
            where: {
                status: { in: ['HOLD', 'FROZEN'] },
                updatedAt: { lt: sevenDaysAgo }
            },
            include: { order: { select: { id: true, status: true } } },
            take: 20
        });

        return stuckEscrows.map(e => ({
            severity: 'MEDIUM',
            message: `Escrow Stuck (${e.status}): Order ${e.order?.id} last updated ${e.updatedAt.toLocaleDateString()}`,
            id: e.id
        }));
    }

    /**
     * Detect Negative Stock or Locked > Stock
     */
    async checkInventoryIntegrity() {
        // Prisma doesn't support field comparison in where clause easily without raw query
        // We will fetch potentially problematic items (e.g. locked > 0 or stock < 0) and filter in JS for safety
        // Or use raw query for performance. Raw query is better.

        try {
            const mismatches = await prisma.$queryRaw`
                SELECT id, "productId", "dealerId", stock, locked 
                FROM inventories 
                WHERE stock < 0 OR locked > stock
                LIMIT 20
            `;

            return mismatches.map(i => ({
                severity: 'CRITICAL',
                message: `Inventory Mismatch: Item ${i.id} (Stock: ${i.stock}, Locked: ${i.locked})`,
                id: i.id
            }));
        } catch (error) {
            console.error('Inventory check failed:', error);
            return [{ severity: 'ERROR', message: 'Failed to run inventory check' }];
        }
    }
}

export default new MonitoringService();
