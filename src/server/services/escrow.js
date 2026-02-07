/**
 * Escrow Service
 * Manages the state-driven wallet logic for the platform.
 */

import prisma from '../lib/prisma.js';

class EscrowService {
    /**
     * Initialize escrow for a newly paid order.
     */
    async holdFunds(orderId, amount) {
        return await prisma.escrow.create({
            data: {
                orderId,
                amount,
                status: 'HOLD'
            }
        });
    }

    /**
     * Freeze funds during an active dispute.
     */
    async freezeFunds(orderId) {
        return await prisma.escrow.update({
            where: { orderId },
            data: { status: 'FROZEN' }
        });
    }

    /**
     * Unfreeze funds after a dispute is resolved (back to HOLD).
     */
    async unfreezeFunds(orderId) {
        return await prisma.escrow.update({
            where: { orderId },
            data: { status: 'HOLD' }
        });
    }

    /**
     * Release funds to stakeholders (Dealer, Manufacturer, Platform).
     * Enforces the T+N settlement window logic.
     */
    async releaseFunds(orderId) {
        const escrow = await prisma.escrow.findUnique({
            where: { orderId },
            include: {
                order: {
                    include: {
                        items: { include: { product: true } },
                        dealer: true
                    }
                }
            }
        });

        if (!escrow) throw new Error('Escrow record not found.');

        // 1. Strict State Machine Enforcement
        if (escrow.status !== 'HOLD') {
            throw new Error(`Funds are currently in ${escrow.status} state. Only 'HOLD' funds can be released.`);
        }

        // 2. Settlement Condition: Order must be DELIVERED
        if (escrow.order.status !== 'DELIVERED') {
            throw new Error(`Settlement blocked: Order status is '${escrow.order.status}'. Must be 'DELIVERED'.`);
        }

        // 3. Settlement Condition: No Active Disputes
        const activeDispute = await prisma.dispute.findFirst({
            where: { orderId, status: { in: ['OPEN', 'EVIDENCE_COLLECTION', 'UNDER_REVIEW'] } }
        });

        if (activeDispute) {
            throw new Error('Settlement blocked: There is an active dispute for this order.');
        }

        // 4. Settlement Window (T+7 or T+14)
        const deliveryDate = await prisma.orderLog.findFirst({
            where: { orderId, toState: 'DELIVERED' },
            orderBy: { timestamp: 'desc' }
        });

        if (!deliveryDate) {
            throw new Error('Settlement blocked: Delivery log not found.');
        }

        const daysSinceDelivery = (Date.now() - new Date(deliveryDate.timestamp).getTime()) / (1000 * 60 * 60 * 24);

        // Threshold check (Configurable per dealer/item, default T+7)
        if (daysSinceDelivery < 7) {
            throw new Error(`Settlement blocked: Within T+7 return window (${daysSinceDelivery.toFixed(1)} days elapsed).`);
        }

        return await prisma.$transaction(async (tx) => {
            // 1. Calculate Multi-Party Splits
            const total = Number(escrow.amount);
            const tax = Number(escrow.order.taxAmount);
            const platformCommission = Number(escrow.order.commissionAmount);

            // Calculate Manufacturer Share (Based on Base Price)
            let mfgPayout = 0;
            for (const item of escrow.order.items) {
                mfgPayout += Number(item.product.basePrice) * item.quantity;
            }

            // Dealer Share (Remainder)
            const dealerPayout = total - tax - platformCommission - mfgPayout;

            // 2. Update Escrow Status
            const updatedEscrow = await tx.escrow.update({
                where: { orderId },
                data: {
                    status: 'RELEASED',
                    releasedAt: new Date()
                }
            });

            // 3. Update Order Status
            await tx.order.update({
                where: { id: orderId },
                data: { status: 'SETTLED' }
            });

            // 4. Ledger Entry (Audit Log)
            import('./audit.js').then(service => {
                service.default.logAction('FUNDS_SETTLED_SPLIT', 'ESCROW', updatedEscrow.id, {
                    userId: 'SYSTEM_FINANCE',
                    newData: {
                        distribution: {
                            manufacturer: mfgPayout,
                            dealer: dealerPayout,
                            platform: platformCommission,
                            tax_withheld: tax
                        },
                        total_volume: total
                    },
                    reason: 'Post-delivery return window closure.'
                });
            }).catch(err => console.error('Background Audit Log Failed:', err));

            return { updatedEscrow, distribution: { mfgPayout, dealerPayout, platformCommission } };
        });
    }

    /**
     * Partial or Full Refund Logic
     */
    async processRefund(orderId, amount, isPartial = false) {
        return await prisma.$transaction(async (tx) => {
            const escrow = await tx.escrow.findUnique({ where: { orderId } });

            if (Number(amount) > Number(escrow.amount)) {
                throw new Error('Refund amount exceeds escrow balance.');
            }

            const updatedEscrow = await tx.escrow.update({
                where: { orderId },
                data: {
                    status: isPartial ? 'HOLD' : 'REFUNDED',
                    amount: { decrement: amount },
                    refundedAt: new Date()
                }
            });

            await tx.orderLog.create({
                data: {
                    orderId,
                    fromState: 'PAID',
                    toState: isPartial ? 'PAID' : 'CANCELLED',
                    reason: `${isPartial ? 'Partial' : 'Full'} refund processed: ₹${amount}`
                }
            });

            return updatedEscrow;
        });
    }

    /**
     * Refund funds to the customer.
     */
    async refundFunds(orderId) {
        return await prisma.$transaction(async (tx) => {
            const updatedEscrow = await tx.escrow.update({
                where: { orderId },
                data: {
                    status: 'REFUNDED',
                    refundedAt: new Date()
                }
            });

            await tx.order.update({
                where: { id: orderId },
                data: { status: 'CANCELLED' } // Or REFUNDED status if added
            });

            return updatedEscrow;
        });
    }
}

export default new EscrowService();

