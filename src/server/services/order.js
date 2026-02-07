/**
 * Order Service
 * Manages order lifecycle and inventory locking.
 */

import prisma from '../lib/prisma.js';

class OrderService {
    /**
     * Create an order and lock inventory.
     */
    async createOrder(customerId, dealerId, items) {
        return await prisma.$transaction(async (tx) => {
            let totalAmount = 0;

            // 1. Calculate base total and validate regional inventory
            for (const item of items) {
                const inventory = await tx.inventory.findFirst({
                    where: {
                        productId: item.productId,
                        dealerId,
                        // Region check: Ensure dealer inventory is in the right location
                        stock: { gte: item.quantity }
                    },
                    include: { product: true }
                });

                if (!inventory) throw new Error(`Insufficient stock for ${item.productId} at this dealer.`);

                await tx.inventory.update({
                    where: { id: inventory.id },
                    data: { stock: { decrement: item.quantity }, locked: { increment: item.quantity } }
                });

                totalAmount += Number(inventory.price) * item.quantity;
            }

            // 2. Dynamic Rules (GST & Commission)
            const taxRule = await tx.taxRule.findFirst({ where: { isActive: true } }) || { taxSlab: 18 };
            const marginRule = await tx.marginRule.findFirst({ where: { isActive: true } }) || { maxCap: 5 };

            const taxAmount = (totalAmount * Number(taxRule.taxSlab)) / 100;
            const commissionAmount = (totalAmount * Number(marginRule.maxCap)) / 100;

            // 3. Create Order
            const order = await tx.order.create({
                data: {
                    customerId,
                    dealerId,
                    totalAmount,
                    taxAmount,
                    commissionAmount,
                    status: 'CREATED',
                    items: {
                        create: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price }))
                    }
                },
                include: { items: true }
            });

            await tx.orderLog.create({
                data: { orderId: order.id, fromState: 'CREATED', toState: 'CREATED', reason: 'Order initialized' }
            });

            // 4. Asynchronous Audit Logging (MongoDB)
            // We use a separate catch to ensure order success isn't blocked by log failure
            import('./audit.js').then(service => {
                service.default.logAction('ORDER_CREATED', 'ORDER', order.id, {
                    userId: customerId,
                    newData: order,
                    reason: 'User placed a new order'
                });
            }).catch(err => console.error('Background Audit Log Failed:', err));

            return order;
        });
    }

    /**
     * Confirm payment and initialize escrow.
     */
    async confirmPayment(orderId) {
        return await prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({ where: { id: orderId } });
            if (!order) throw new Error('Order not found');

            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: { status: 'PAID' }
            });

            // Initialize Escrow
            await tx.escrow.create({
                data: { orderId, amount: order.totalAmount, status: 'HOLD' }
            });

            await tx.orderLog.create({
                data: { orderId, fromState: 'CREATED', toState: 'PAID', reason: 'Payment confirmed. Funds held in escrow.' }
            });

            // 4. Asynchronous Audit Logging (MongoDB)
            import('./audit.js').then(service => {
                service.default.logAction('PAYMENT_CONFIRMED', 'ORDER', orderId, {
                    userId: order.customerId,
                    newData: { status: 'PAID', escrow: 'INITIALIZED' },
                    reason: 'Payment successful'
                });
            }).catch(err => console.error('Background Audit Log Failed:', err));

            return updatedOrder;
        });
    }

    /**
     * Confirm order by Dealer.
     */
    async confirmOrder(orderId) {
        return await prisma.$transaction(async (tx) => {
            const order = await tx.order.update({
                where: { id: orderId },
                data: { status: 'CONFIRMED' }
            });

            await tx.orderLog.create({
                data: { orderId, fromState: 'PAID', toState: 'CONFIRMED', reason: 'Dealer confirmed stock availability.' }
            });

            return order;
        });
    }

    /**
     * Mark order as shipped.
     */
    async shipOrder(orderId, trackingDetails) {
        return await prisma.$transaction(async (tx) => {
            const order = await tx.order.update({
                where: { id: orderId },
                data: { status: 'SHIPPED' }
            });

            await tx.orderLog.create({
                data: {
                    orderId,
                    fromState: 'CONFIRMED',
                    toState: 'SHIPPED',
                    reason: `Order shipped via logistics partner. Tracking: ${trackingDetails}`
                }
            });

            return order;
        });
    }

    /**
     * Mark order as delivered. Trigger for T+N settlement window.
     */
    async deliverOrder(orderId) {
        return await prisma.$transaction(async (tx) => {
            const order = await tx.order.update({
                where: { id: orderId },
                data: { status: 'DELIVERED' }
            });

            await tx.orderLog.create({
                data: {
                    orderId,
                    fromState: 'SHIPPED',
                    toState: 'DELIVERED',
                    reason: 'Logistics provider confirmed delivery.'
                }
            });

            return order;
        });
    }

    /**
     * Cancel an order and restore inventory.
     */
    async cancelOrder(orderId, reason) {
        return await prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: { items: true }
            });

            if (!order || order.status === 'SETTLED' || order.status === 'CANCELLED') {
                throw new Error('Order cannot be cancelled in its current state.');
            }

            // 1. Restore Inventory
            for (const item of order.items) {
                await tx.inventory.updateMany({
                    where: { productId: item.productId, dealerId: order.dealerId },
                    data: {
                        stock: { increment: item.quantity },
                        locked: { decrement: item.quantity }
                    }
                });
            }

            // 2. Update Status
            const cancelledOrder = await tx.order.update({
                where: { id: orderId },
                data: { status: 'CANCELLED' }
            });

            // 3. Log Action
            await tx.orderLog.create({
                data: { orderId, fromState: order.status, toState: 'CANCELLED', reason }
            });

            return cancelledOrder;
        });
    }

    /**
     * Logistics Hook: Update Tracking Information
     */
    async updateTracking(orderId, trackingNumber, carrier) {
        return await prisma.orderLog.create({
            data: {
                orderId,
                fromState: 'SHIPPED',
                toState: 'SHIPPED',
                reason: `Shipping update: ${carrier} (${trackingNumber}) - In Transit`
            }
        });
    }
    /**
     * Audit Stock: Re-calculate 'locked' counts based on active orders.
     * Identifies discrepancies between physical stock and DB records.
     */
    async auditStock() {
        const stockDiscrepancies = [];

        const inventories = await prisma.inventory.findMany({ include: { product: true } });

        for (const inv of inventories) {
            const activeOrders = await prisma.orderItem.findMany({
                where: {
                    productId: inv.productId,
                    order: {
                        dealerId: inv.dealerId,
                        status: { in: ['CREATED', 'PAID', 'CONFIRMED', 'SHIPPED'] }
                    }
                }
            });

            const expectedLocked = activeOrders.reduce((sum, item) => sum + item.quantity, 0);

            if (inv.locked !== expectedLocked) {
                stockDiscrepancies.push({
                    inventoryId: inv.id,
                    product: inv.product.name,
                    dealerId: inv.dealerId,
                    currentLocked: inv.locked,
                    expectedLocked,
                    variance: expectedLocked - inv.locked
                });
            }
        }

        return {
            timestamp: new Date(),
            totalChecked: inventories.length,
            discrepanciesFound: stockDiscrepancies.length,
            discrepancies: stockDiscrepancies
        };
    }
}

export default new OrderService();

