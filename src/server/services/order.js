/**
 * Order Service
 * Manages order lifecycle and inventory locking.
 */

import prisma from '../lib/prisma.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';
import { isValidTransition } from '../lib/stateMachine.js';

class OrderService {
    /**
     * Create an order and lock inventory.
     */
    async createOrder(customerId, dealerId, items, shippingAddress) {
        return await prisma.$transaction(async (tx) => {
            let totalAmount = 0;

            // 1. Calculate base total and validate regional inventory
            for (const item of items) {
                const where = {
                    dealerId,
                    stock: { gte: item.quantity }
                };

                if (item.inventoryId) {
                    where.id = item.inventoryId;
                } else if (item.productId) {
                    where.productId = item.productId;
                } else {
                    throw new Error('Each item must have a productId or inventoryId.');
                }

                const inventory = await tx.inventory.findFirst({
                    where,
                    include: { product: true }
                });

                if (!inventory) throw new Error(`Insufficient stock for item at this dealer.`);

                // Check if negotiation exists for this item
                if (item.negotiationId) {
                    const negotiation = await tx.negotiation.findUnique({
                        where: { id: item.negotiationId }
                    });

                    if (!negotiation) throw new Error('Invalid negotiation ID');
                    if (negotiation.status !== 'ACCEPTED') throw new Error('Negotiation must be ACCEPTED to place order');
                    if (negotiation.productId !== inventory.productId) throw new Error('Negotiation product mismatch');

                    // Use negotiated price
                    item.price = negotiation.currentOffer;
                } else {
                    item.price = inventory.price;
                }

                await tx.inventory.update({
                    where: { id: inventory.id },
                    data: { stock: { decrement: item.quantity }, locked: { increment: item.quantity } }
                });

                totalAmount += Number(item.price) * item.quantity;
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
                    shippingAddress,
                    status: 'CREATED',
                    items: {
                        create: items.map(i => ({
                            productId: i.productId,
                            quantity: i.quantity,
                            price: i.price,
                            inventoryId: i.inventoryId // Saving inventory link
                        }))
                    }
                },
                include: { items: true }
            });

            await tx.orderTimeline.create({
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

            // 5. Emit System Event for Notifications
            systemEvents.emit(EVENTS.ORDER.PLACED, {
                order,
                customerId,
                dealerId
            });

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

            await tx.orderTimeline.create({
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

            // Emit System Event
            systemEvents.emit(EVENTS.ORDER.PAID, {
                orderId,
                userId: order.customerId
            });

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

            await tx.orderTimeline.create({
                data: { orderId, fromState: 'PAID', toState: 'CONFIRMED', reason: 'Dealer confirmed stock availability.' }
            });

            return order;
        });
    }

    /**
     * Mark order as shipped.
     */
    async shipOrder(orderId, trackingNumber, carrier = 'NovaExpress') {
        return await prisma.$transaction(async (tx) => {
            const order = await tx.order.update({
                where: { id: orderId },
                data: {
                    status: 'SHIPPED',
                    shipmentTracking: {
                        upsert: {
                            create: {
                                trackingNumber,
                                carrier,
                                status: 'SHIPPED',
                                estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // T+3 days
                            },
                            update: {
                                trackingNumber,
                                carrier,
                                status: 'SHIPPED'
                            }
                        }
                    }
                }
            });

            await tx.orderTimeline.create({
                data: {
                    orderId,
                    fromState: 'CONFIRMED',
                    toState: 'SHIPPED',
                    reason: `Order shipped via ${carrier}. Tracking: ${trackingNumber}`
                }
            });

            // Emit System Event
            systemEvents.emit(EVENTS.ORDER.SHIPPED, {
                orderId,
                userId: order.customerId,
                trackingNumber
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

            await tx.shipmentTracking.update({
                where: { orderId },
                data: { status: 'DELIVERED', actualDelivery: new Date() }
            });

            await tx.orderTimeline.create({
                data: {
                    orderId,
                    fromState: 'SHIPPED',
                    toState: 'DELIVERED',
                    reason: 'Logistics provider confirmed delivery.'
                }
            });

            // Emit System Event
            systemEvents.emit(EVENTS.ORDER.DELIVERED, {
                orderId,
                userId: order.customerId
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
                const inventoryWhere = item.inventoryId
                    ? { id: item.inventoryId }
                    : { productId: item.productId, dealerId: order.dealerId };

                await tx.inventory.updateMany({
                    where: inventoryWhere,
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
            await tx.orderTimeline.create({
                data: { orderId, fromState: order.status, toState: 'CANCELLED', reason }
            });

            return cancelledOrder;
        });
    }

    /**
     * Get orders for a specific user role with filters.
     */
    async getOrders(role, userId, filters = {}) {
        const { status, dealerId } = filters;
        const where = {};

        if (role === 'DEALER') {
            const dealer = await prisma.dealer.findUnique({ where: { userId } });
            if (!dealer) throw new Error('DEALER_PROFILE_NOT_FOUND');
            where.dealerId = dealer.id;
        } else if (role === 'CUSTOMER') {
            const customer = await prisma.customer.findUnique({ where: { userId } });
            if (!customer) throw new Error('CUSTOMER_PROFILE_NOT_FOUND');
            where.customerId = customer.id;
        } else if (role === 'ADMIN' && dealerId) {
            where.dealerId = dealerId;
        }

        if (status && status !== 'All') {
            where.status = status.toUpperCase();
        }

        return await prisma.order.findMany({
            where,
            include: {
                customer: {
                    select: {
                        name: true,
                        user: { select: { email: true } }
                    }
                },
                items: { include: { linkedProduct: { select: { name: true, images: true } } } },
                dealer: { select: { businessName: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Get Order by ID with security and full relations.
     */
    async getOrderById(orderId, userId, role) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: { include: { linkedProduct: true } },
                customer: { include: { user: true } },
                dealer: { include: { user: true } },
                timeline: { orderBy: { createdAt: 'desc' } },
                escrow: true,
                shipmentTracking: true
            }
        });

        if (!order) throw new Error('ORDER_NOT_FOUND');

        // Security Checks
        if (role === 'CUSTOMER' && order.customer.userId !== userId) throw new Error('UNAUTHORIZED_ACCESS');
        if (role === 'DEALER' && order.dealer.userId !== userId) throw new Error('UNAUTHORIZED_ACCESS');
        if (role === 'MANUFACTURER') {
            const mfg = await prisma.manufacturer.findUnique({ where: { userId } });
            const hasProduct = await prisma.orderItem.findFirst({
                where: { orderId, linkedProduct: { manufacturerId: mfg.id } }
            });
            if (!hasProduct) throw new Error('UNAUTHORIZED_ACCESS');
        }

        return order;
    }

    /**
     * Unified Status Update with State Machine and Rules.
     */
    async updateStatus(orderId, status, { reason, metadata } = {}) {
        return await prisma.$transaction(async (tx) => {
            const current = await tx.order.findUnique({
                where: { id: orderId },
                include: { items: true, escrow: true }
            });

            if (!current) throw new Error('ORDER_NOT_FOUND');
            if (!isValidTransition(current.status, status)) {
                throw new Error(`INVALID_TRANSITION: ${current.status} -> ${status}`);
            }

            // Side Effects
            if (status === 'DELIVERED') {
                // Unlock inventory
                for (const item of current.items) {
                    if (item.inventoryId) {
                        await tx.inventory.update({
                            where: { id: item.inventoryId },
                            data: { locked: { decrement: item.quantity } }
                        });
                    }
                }
            } else if (status === 'CANCELLED') {
                // Revert stock
                for (const item of current.items) {
                    if (item.inventoryId) {
                        await tx.inventory.update({
                            where: { id: item.inventoryId },
                            data: { stock: { increment: item.quantity }, locked: { decrement: item.quantity } }
                        });
                    }
                }
                // Handle Escrow Refund
                if (current.escrow && current.escrow.status === 'HOLD') {
                    await tx.escrow.update({
                        where: { id: current.escrow.id },
                        data: { status: 'REFUNDED', refundedAt: new Date() }
                    });
                }
            }

            return await tx.order.update({
                where: { id: orderId },
                data: {
                    status,
                    timeline: {
                        create: {
                            fromState: current.status,
                            toState: status,
                            reason: reason || 'Status updated by system',
                            metadata: metadata || {}
                        }
                    }
                }
            });
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

