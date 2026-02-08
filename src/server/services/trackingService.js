import prisma from '../lib/prisma.js';

class TrackingService {
    /**
     * Simulate a delivery journey for an order.
     * Transitions: CONFIRMED -> SHIPPED -> OUT_FOR_DELIVERY -> DELIVERED
     * For demo purposes, this happens over a few intervals.
     */
    async simulateJourney(orderId) {
        console.log(`Starting tracking simulation for Order ${orderId}`);

        const steps = [
            { status: 'CONFIRMED', reason: 'Order confirmed by dealer', delay: 2000 },
            { status: 'SHIPPED', reason: 'Order picked up by courier', metadata: { carrier: 'NovaExpress', tracking: 'NX12345678' }, delay: 5000 },
            { status: 'OUT_FOR_DELIVERY', reason: 'Delivery associate is nearby', metadata: { agent: 'Rahul K.', phone: '+91 9876543210' }, delay: 5000 },
            { status: 'DELIVERED', reason: 'Package handed over to customer', metadata: { location: 'Front Door' }, delay: 5000 }
        ];

        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, step.delay));

            try {
                await this.updateStatus(orderId, step);
                console.log(`[SIMULATION] Order ${orderId} moved to ${step.status}`);
            } catch (err) {
                console.error(`[SIMULATION ERROR] Failed to update ${orderId} to ${step.status}:`, err.message);
                break; // Stop on error
            }
        }
    }

    async updateStatus(orderId, { status, reason, metadata }) {
        return await prisma.$transaction(async (tx) => {
            const currentOrder = await tx.order.findUnique({
                where: { id: orderId },
                include: { items: true, escrow: true }
            });

            if (!currentOrder) throw new Error('Order not found');

            // Business logic for DELIVERED (copied from orderController for consistency)
            if (status === 'DELIVERED') {
                if (currentOrder.escrow) {
                    await tx.escrow.update({
                        where: { id: currentOrder.escrow.id },
                        data: {
                            status: 'RELEASED',
                            releasedAt: new Date()
                        }
                    });
                }

                for (const item of currentOrder.items) {
                    if (item.inventoryId) {
                        await tx.inventory.update({
                            where: { id: item.inventoryId },
                            data: { locked: { decrement: item.quantity } }
                        });
                    }
                }
            }

            return await tx.order.update({
                where: { id: orderId },
                data: {
                    status,
                    timeline: {
                        create: {
                            fromState: currentOrder.status,
                            toState: status,
                            reason: reason || 'System update',
                            metadata: metadata || {}
                        }
                    }
                }
            });
        });
    }
}

export default new TrackingService();
