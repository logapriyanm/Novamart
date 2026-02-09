/**
 * Shipment Service
 * Manages the logistics journey and delivery lifecycle.
 */

import prisma from '../lib/prisma.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';
import logger from '../lib/logger.js';

class ShipmentService {
    /**
     * Simulate a delivery journey for an order.
     * Transitions: CONFIRMED -> SHIPPED -> OUT_FOR_DELIVERY -> DELIVERED
     */
    async simulateJourney(orderId) {
        logger.info(`Starting tracking simulation for Order ${orderId}`);

        const steps = [
            { status: 'CONFIRMED', reason: 'Order confirmed by dealer', delay: 2000 },
            { status: 'SHIPPED', reason: 'Order picked up by courier', metadata: { carrier: 'NovaExpress', tracking: 'NX' + Math.random().toString(36).substring(7).toUpperCase() }, delay: 5000 },
            { status: 'OUT_FOR_DELIVERY', reason: 'Delivery associate is nearby', metadata: { agent: 'Rahul K.', phone: '+91 9876543210' }, delay: 5000 },
            { status: 'DELIVERED', reason: 'Package handed over to customer', metadata: { location: 'Front Door' }, delay: 5000 }
        ];

        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, step.delay));

            try {
                await this.updateShipmentStatus(orderId, step);
                logger.info(`[SIMULATION] Order ${orderId} moved to ${step.status}`);
            } catch (err) {
                logger.error(`[SIMULATION ERROR] Failed to update ${orderId} to ${step.status}:`, err.message);
                break;
            }
        }
    }

    /**
     * Update Shipment Status with side effects (Escrow release, inventory unlock).
     */
    async updateShipmentStatus(orderId, { status, reason, metadata }) {
        return await prisma.$transaction(async (tx) => {
            const currentOrder = await tx.order.findUnique({
                where: { id: orderId },
                include: { items: true, escrow: true }
            });

            if (!currentOrder) throw new Error('Order not found');

            // 1. Logic for DELIVERED
            if (status === 'DELIVERED') {
                if (currentOrder.escrow && currentOrder.escrow.status === 'HOLD') {
                    await tx.escrow.update({
                        where: { id: currentOrder.escrow.id },
                        data: {
                            status: 'RELEASED',
                            releasedAt: new Date()
                        }
                    });
                }

                // Unlock inventory (Physical flow complete)
                for (const item of currentOrder.items) {
                    if (item.inventoryId) {
                        await tx.inventory.update({
                            where: { id: item.inventoryId },
                            data: { locked: { decrement: item.quantity } }
                        });
                    }
                }
            }

            // 2. Update Order Status & Timeline
            const updatedOrder = await tx.order.update({
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

            // 3. Emit Event
            if (status === 'DELIVERED') {
                systemEvents.emit(EVENTS.ORDER.DELIVERED, { orderId, userId: currentOrder.customerId });
            } else if (status === 'SHIPPED') {
                systemEvents.emit(EVENTS.ORDER.SHIPPED, { orderId, userId: currentOrder.customerId, trackingDetails: metadata?.tracking });
            }

            return updatedOrder;
        });
    }
}

export default new ShipmentService();
