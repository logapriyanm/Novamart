/**
 * Escrow Service
 * Manages the state-driven wallet logic for the platform.
 */

import { Escrow, Order, Dispute, AuditLog } from '../models/index.js'; // Dealer removed if unused, or change to Seller if needed
import systemEvents, { EVENTS } from '../lib/systemEvents.js';
import mongoose from 'mongoose';

class EscrowService {
    /**
     * Initialize escrow for a newly paid order.
     * CRITICAL: Commission is calculated server-side ONLY - never from frontend
     */
    async holdFunds(orderId, providedAmount, providedCommission = null) {
        // SECURITY: Fetch order to recalculate commission server-side
        const order = await Order.findById(orderId);

        if (!order) {
            throw new Error('Order not found for escrow initialization');
        }

        // IMMUTABLE COMMISSION RATE: 5% - NEVER TRUST CLIENT
        const COMMISSION_RATE = 0.05;
        const grossAmount = Number(order.totalAmount);
        const serverCommission = grossAmount * COMMISSION_RATE;
        const sellerNet = grossAmount - serverCommission;

        // SECURITY: Ignore client provided commission and enforce server calculation
        // We do not throw error, we simply ignore the client input to prevent any bypass attempt
        // if (providedCommission !== null && Math.abs(providedCommission - serverCommission) > 0.01) { ... } -> REMOVED

        // CRITICAL: Store immutable ledger
        const releaseDate = new Date();
        releaseDate.setDate(releaseDate.getDate() + 7); // T+7 auto-release

        return await Escrow.create({
            orderId,
            amount: grossAmount,
            grossAmount, // Total paid by customer
            commissionAmount: serverCommission, // Platform fee (5%)
            sellerAmount: sellerNet, // What seller receives
            status: 'HOLD',
            releaseDate, // Cannot release before T+7
            createdAt: new Date()
        });
    }

    /**
     * Freeze funds during an active dispute.
     */
    async freezeFunds(orderId) {
        return await Escrow.findOneAndUpdate({ orderId }, { status: 'FROZEN' }, { new: true });
    }

    /**
     * Unfreeze funds after a dispute is resolved (back to HOLD).
     */
    async unfreezeFunds(orderId) {
        return await Escrow.findOneAndUpdate({ orderId }, { status: 'HOLD' }, { new: true });
    }

    /**
     * Release funds to stakeholders (Dealer, Manufacturer, Platform).
     * Enforces the T+N settlement window logic.
     */
    async releaseFunds(orderId) {
        const escrow = await Escrow.findOne({ orderId })
            .populate({
                path: 'orderId',
                populate: [
                    { path: 'items.productId' },
                    { path: 'sellerId' }
                ]
            });

        if (!escrow) throw new Error('Escrow record not found.');
        const order = escrow.orderId;

        // 1. Strict State Machine Enforcement
        if (escrow.status !== 'HOLD') {
            throw new Error(`Funds are currently in ${escrow.status} state. Only 'HOLD' funds can be released.`);
        }

        // 2. Settlement Condition: Order must be DELIVERED
        if (order.status !== 'DELIVERED') {
            throw new Error(`Settlement blocked: Order status is '${order.status}'. Must be 'DELIVERED'.`);
        }

        // 3. Settlement Condition: No Active Disputes
        const activeDispute = await Dispute.findOne({
            orderId,
            status: { $in: ['OPEN', 'EVIDENCE_COLLECTION', 'UNDER_REVIEW'] }
        });

        if (activeDispute) {
            throw new Error('Settlement blocked: There is an active dispute for this order.');
        }

        // 4. Settlement Window (T+7 or T+14)
        const deliveryLog = order.timeline
            .filter(t => t.toState === 'DELIVERED')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        if (!deliveryLog) {
            throw new Error('Settlement blocked: Delivery log not found.');
        }

        const daysSinceDelivery = (Date.now() - new Date(deliveryLog.createdAt).getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceDelivery < 7) {
            throw new Error(`Settlement blocked: Within T+7 return window (${daysSinceDelivery.toFixed(1)} days elapsed).`);
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // 1. Calculate Multi-Party Splits
            const total = Number(escrow.amount);
            const tax = Number(order.taxAmount);
            const platformCommission = Number(order.commissionAmount);

            // Calculate Manufacturer Share (Based on Base Price)
            let mfgPayout = 0;
            for (const item of order.items) {
                mfgPayout += Number(item.productId.basePrice) * item.quantity;
            }

            // Dealer Share (Remainder)
            const dealerPayout = total - tax - platformCommission - mfgPayout;

            // 2. Update Escrow Status
            const updatedEscrow = await Escrow.findByIdAndUpdate(escrow._id, {
                status: 'RELEASED',
                releasedAt: new Date()
            }, { session, new: true });

            // 3. Update Order Status
            await Order.findByIdAndUpdate(orderId, { status: 'SETTLED' }, { session });

            await session.commitTransaction();

            // 4. Ledger Entry (Audit Log)
            AuditLog.create({
                action: 'FUNDS_SETTLED_SPLIT',
                entity: updatedEscrow._id,
                actorId: 'SYSTEM_FINANCE',
                role: 'SYSTEM',
                details: {
                    entityType: 'ESCROW',
                    distribution: {
                        manufacturer: mfgPayout,
                        dealer: dealerPayout,
                        platform: platformCommission,
                        tax_withheld: tax
                    },
                    total_volume: total,
                    reason: 'Post-delivery return window closure.'
                }
            }).catch(err => console.error('Background Audit Log Failed:', err));

            // Emit System Event
            systemEvents.emit(EVENTS.ESCROW.RELEASE, {
                orderId,
                sellerId: order.sellerId._id,
                amount: dealerPayout
            });

            return { updatedEscrow, distribution: { mfgPayout, dealerPayout, platformCommission } };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Partial or Full Refund Logic
     */
    async processRefund(orderId, amount, isPartial = false) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const escrow = await Escrow.findOne({ orderId }).session(session);

            if (Number(amount) > Number(escrow.amount)) {
                throw new Error('Refund amount exceeds escrow balance.');
            }

            const updatedEscrow = await Escrow.findByIdAndUpdate(escrow._id, {
                status: isPartial ? 'HOLD' : 'REFUNDED',
                $inc: { amount: -amount },
                refundedAt: new Date()
            }, { session, new: true });

            await Order.findByIdAndUpdate(orderId, {
                $push: {
                    timeline: {
                        fromState: 'PAID',
                        toState: isPartial ? 'PAID' : 'CANCELLED',
                        reason: `${isPartial ? 'Partial' : 'Full'} refund processed: ₹${amount}`
                    }
                }
            }, { session });

            await session.commitTransaction();
            return updatedEscrow;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Refund funds to the customer.
     */
    async refundFunds(orderId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const updatedEscrow = await Escrow.findOneAndUpdate({ orderId }, {
                status: 'REFUNDED',
                refundedAt: new Date()
            }, { session, new: true });

            const order = await Order.findByIdAndUpdate(orderId, { status: 'CANCELLED' }, { session, new: true });

            await session.commitTransaction();

            // Emit System Event
            systemEvents.emit(EVENTS.ESCROW.REFUND, {
                orderId,
                userId: order.customerId,
                amount: updatedEscrow.amount
            });

            return updatedEscrow;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

export default new EscrowService();
