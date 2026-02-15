/**
 * Shipment Service
 * Manages the logistics journey and delivery lifecycle.
 */

import { Order, Escrow, Inventory } from '../models/index.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';
import logger from '../lib/logger.js';
import mongoose from 'mongoose';

class ShipmentService {
    /**
     * Simulate a delivery journey for an order.
     * Transitions: CONFIRMED -> SHIPPED -> OUT_FOR_DELIVERY -> DELIVERED
     */
    async simulateJourney(orderId) {
        logger.info(`Starting tracking simulation for Order ${orderId}`);

        const steps = [
            { status: 'CONFIRMED', reason: 'Order confirmed by seller', delay: 2000 },
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
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const currentOrder = await Order.findById(orderId).session(session);

            if (!currentOrder) throw new Error('Order not found');

            // 1. Logic for DELIVERED
            if (status === 'DELIVERED') {
                const escrow = await Escrow.findOne({ orderId }).session(session);
                if (escrow && escrow.status === 'HOLD') {
                    await Escrow.findByIdAndUpdate(escrow._id, {
                        status: 'RELEASED',
                        releasedAt: new Date()
                    }, { session });
                }

                // Unlock inventory
                for (const item of currentOrder.items) {
                    await Inventory.findByIdAndUpdate(item.inventoryId, {
                        $inc: { locked: -item.quantity }
                    }, { session });
                }
            }

            // 2. Update Order Status & Timeline
            const updatedOrder = await Order.findByIdAndUpdate(orderId, {
                status,
                $push: {
                    timeline: {
                        fromState: currentOrder.status,
                        toState: status,
                        reason: reason || 'System update',
                        metadata: metadata || {}
                    }
                }
            }, { session, new: true });

            await session.commitTransaction();

            // 3. Emit Event
            if (status === 'DELIVERED') {
                systemEvents.emit(EVENTS.ORDER.DELIVERED, { orderId, userId: currentOrder.customerId });
            } else if (status === 'SHIPPED') {
                systemEvents.emit(EVENTS.ORDER.SHIPPED, { orderId, userId: currentOrder.customerId, trackingDetails: metadata?.tracking });
            }

            return updatedOrder;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

export default new ShipmentService();
