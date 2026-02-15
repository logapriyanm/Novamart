/**
 * Order Service
 * Manages order lifecycle and inventory locking.
 */

import { Order, Inventory, Negotiation, TaxRule, MarginRule, Notification, AuditLog, Allocation } from '../models/index.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';
import { isValidTransition } from '../lib/stateMachine.js';
import mongoose from 'mongoose';

class OrderService {
    /**
     * Find order by idempotency key (for duplicate request prevention)
     */
    async findOrderByIdempotencyKey(idempotencyKey, userId) {
        if (!idempotencyKey) return null;
        const order = await Order.findOne({ idempotencyKey, customerId: userId }).lean();
        return order;
    }

    /**
     * Create an order and lock inventory.
     */
    /**
     * INTERNAL: Create a single order within a session.
     * Does NOT commit transaction.
     */
    async _createOrderInternal(session, customerId, sellerId, items, shippingAddress) {
        let totalAmount = 0;
        const processedItems = [];

        // PHASE 1: ATOMIC ALLOCATION DEDUCTION WITH OVERSELLING PROTECTION
        for (const item of items) {
            // Validation: Must have inventoryId to link to allocation
            if (!item.inventoryId) {
                throw new Error('Each item must have an inventoryId linked to an allocation.');
            }

            // CRITICAL: Lock inventory row using SELECT FOR UPDATE pattern
            const inventory = await Inventory.findById(item.inventoryId)
                .session(session)
                .select('+__v');

            if (!inventory) {
                throw new Error(`Inventory ${item.inventoryId} not found.`);
            }

            // Direct sales requires allocation check
            if (!inventory.allocationId) {
                throw new Error(`Inventory ${item.inventoryId} has no allocation. Direct sales not allowed.`);
            }

            const allocation = await Allocation.findById(inventory.allocationId)
                .session(session)
                .select('+__v');

            if (!allocation) {
                throw new Error(`Allocation ${inventory.allocationId} not found.`);
            }

            // OVERSELLING PROTECTION
            if (allocation.remainingQuantity < item.quantity) {
                throw new Error(
                    `INSUFFICIENT_STOCK: Only ${allocation.remainingQuantity} units remaining for this product.`
                );
            }

            // ATOMIC DEDUCTION: Update allocation
            await Allocation.findOneAndUpdate(
                {
                    _id: allocation._id,
                    __v: allocation.__v,
                    remainingQuantity: { $gte: item.quantity }
                },
                {
                    $inc: { soldQuantity: item.quantity, remainingQuantity: -item.quantity },
                    $set: { __v: allocation.__v + 1 }
                },
                { session, new: true }
            );

            // ATOMIC DEDUCTION: Update inventory
            await Inventory.findByIdAndUpdate(
                inventory._id,
                {
                    $inc: {
                        soldQuantity: item.quantity,
                        remainingQuantity: -item.quantity,
                        stock: -item.quantity,
                        locked: item.quantity
                    }
                },
                { session }
            );

            // Use negotiated price
            item.price = inventory.retailPrice || inventory.price;
            totalAmount += Number(item.price) * item.quantity;

            processedItems.push({
                productId: inventory.productId,
                inventoryId: inventory._id,
                allocationId: allocation._id,
                quantity: item.quantity,
                price: item.price
            });
        }

        // PHASE 2: SERVER-SIDE COMMISSION
        const COMMISSION_RATE = 0.05;
        const taxRule = await TaxRule.findOne({ isActive: true }).session(session) || { taxSlab: 18 };
        const taxAmount = (totalAmount * Number(taxRule.taxSlab)) / 100;
        const commissionAmount = totalAmount * COMMISSION_RATE;
        const sellerPayout = totalAmount - commissionAmount;

        // PHASE 3: Create Order
        const [order] = await Order.create([{
            customerId,
            sellerId,
            totalAmount,
            taxAmount,
            commissionAmount,
            sellerPayout,
            shippingAddress,
            status: 'CREATED',
            items: processedItems,
            timeline: [{
                fromState: 'CREATED',
                toState: 'CREATED',
                reason: 'Order initialized via Batch Checkout'
            }]
        }], { session });

        return order;
    }

    /**
     * Create Batch Orders (Atomic Checkout).
     * Groups items by seller, creates orders, and initializes single Payment.
     */
    async createBatchOrders(customerId, items, shippingAddress) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // Group items by Seller
            const sellerGroups = {};
            for (const item of items) {
                const sId = item.sellerId || item.manufacturerId; // Fallback? Ideally item should have sellerId attached from Cart
                if (!sId) throw new Error('Item missing sellerId');
                if (!sellerGroups[sId]) sellerGroups[sId] = [];
                sellerGroups[sId].push(item);
            }

            const createdOrders = [];
            let grandTotal = 0;

            // Create Order per Seller
            for (const sellerId of Object.keys(sellerGroups)) {
                const sellerItems = sellerGroups[sellerId];
                const order = await this._createOrderInternal(session, customerId, sellerId, sellerItems, shippingAddress);
                createdOrders.push(order);
                grandTotal += order.totalAmount;
            }

            // Initialize Payment (RAZORPAY)
            const { default: paymentService } = await import('./paymentService.js');
            const razorpayOrder = await paymentService.createBatchRazorpayOrder(
                grandTotal,
                createdOrders.map(o => o._id),
                customerId
            );

            // Create Pending Payment Records for ALL orders linked to same Razorpay Order ID
            const { Payment } = await import('../models/index.js');
            for (const order of createdOrders) {
                await Payment.create([{
                    orderId: order._id,
                    razorpayOrderId: razorpayOrder.id,
                    amount: order.totalAmount,
                    status: 'PENDING',
                    method: 'PENDING'
                }], { session });
            }

            await session.commitTransaction();

            // Background Audit Log
            createdOrders.forEach(order => {
                AuditLog.create({
                    action: 'ORDER_CREATED',
                    entityType: 'ORDER',
                    entityId: order._id,
                    userId: customerId,
                    metadata: { orderId: order._id, type: 'BATCH' }
                }).catch(console.error);

                systemEvents.emit(EVENTS.ORDER.PLACED, { order, customerId, sellerId: order.sellerId });
            });

            return {
                success: true,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount, // in paisa
                currency: razorpayOrder.currency,
                orderIds: createdOrders.map(o => o._id),
                key: process.env.RAZORPAY_KEY_ID
            };

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Legacy Single Order Creation (Deprecated/Wrapped)
     * Kept for backward compatibility but routes should move to createBatchOrders.
     */
    async createOrder(customerId, sellerId, items, shippingAddress, idempotencyKey = null) {
        // Redirect to new internal logic wrapped in transaction
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const order = await this._createOrderInternal(session, customerId, sellerId, items, shippingAddress);
            await session.commitTransaction();
            return order;
        } catch (e) {
            await session.abortTransaction();
            throw e;
        } finally {
            session.endSession();
        }
    }

    /**
     * Confirm payment and update order status.
     * NOTE: Escrow is created ONLY in paymentService.processPaymentSuccess — NOT here.
     */
    async confirmPayment(orderId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const orderBuf = await Order.findById(orderId).session(session);
            if (!orderBuf) throw new Error('Order not found');

            // SECURITY: Enforce state machine — only valid transitions to PAID
            const { isValidTransition } = await import('../lib/stateMachine.js');
            if (!isValidTransition(orderBuf.status, 'PAID')) {
                throw new Error(`Invalid state transition: ${orderBuf.status} → PAID`);
            }

            const order = await Order.findByIdAndUpdate(orderId, {
                status: 'PAID',
                $push: {
                    timeline: {
                        fromState: orderBuf.status,
                        toState: 'PAID',
                        reason: 'Payment confirmed. Funds held in escrow.'
                    }
                }
            }, { session, new: true });

            // NOTE: Escrow creation removed — handled exclusively by paymentService.processPaymentSuccess

            await session.commitTransaction();

            AuditLog.create({
                action: 'PAYMENT_CONFIRMED',
                entityType: 'ORDER',
                entityId: orderId,
                userId: order.customerId,
                metadata: { status: 'PAID', reason: 'Payment successful' }
            }).catch(err => logger.error('Background Audit Log Failed:', err));

            systemEvents.emit(EVENTS.ORDER.PAID, {
                orderId,
                userId: order.customerId
            });

            return order;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Confirm order by Seller.
     */
    async confirmOrder(orderId) {
        const orderBuf = await Order.findById(orderId);
        if (!orderBuf) throw new Error('Order not found');

        // V-007: Enforce state machine validation
        if (!isValidTransition(orderBuf.status, 'CONFIRMED')) {
            throw new Error(`INVALID_TRANSITION: Cannot transition from ${orderBuf.status} to CONFIRMED`);
        }

        return await Order.findByIdAndUpdate(orderId, {
            status: 'CONFIRMED',
            $push: {
                timeline: {
                    fromState: orderBuf.status,
                    toState: 'CONFIRMED',
                    reason: 'Seller confirmed stock availability.'
                }
            }
        }, { new: true });
    }

    /**
     * Mark order as shipped.
     */
    async shipOrder(orderId, trackingNumber, carrier = 'NovaExpress') {
        const orderBuf = await Order.findById(orderId);
        if (!orderBuf) throw new Error('Order not found');

        // V-007: Enforce state machine validation
        if (!isValidTransition(orderBuf.status, 'SHIPPED')) {
            throw new Error(`INVALID_TRANSITION: Cannot transition from ${orderBuf.status} to SHIPPED`);
        }

        const order = await Order.findByIdAndUpdate(orderId, {
            status: 'SHIPPED',
            shipmentTracking: {
                trackingNumber,
                carrier,
                status: 'SHIPPED',
                estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            },
            $push: {
                timeline: {
                    fromState: orderBuf.status,
                    toState: 'SHIPPED',
                    reason: `Order shipped via ${carrier}. Tracking: ${trackingNumber}`
                }
            }
        }, { new: true });

        systemEvents.emit(EVENTS.ORDER.SHIPPED, {
            orderId,
            userId: order.customerId,
            trackingNumber
        });

        return order;
    }

    /**
     * Mark order as delivered. Trigger for T+N settlement window.
     */
    async deliverOrder(orderId) {
        const orderBuf = await Order.findById(orderId);
        if (!orderBuf) throw new Error('Order not found');

        // Enforce state machine validation
        if (!isValidTransition(orderBuf.status, 'DELIVERED')) {
            throw new Error(`INVALID_TRANSITION: Cannot transition from ${orderBuf.status} to DELIVERED`);
        }

        const order = await Order.findByIdAndUpdate(orderId, {
            status: 'DELIVERED',
            'shipmentTracking.status': 'DELIVERED',
            'shipmentTracking.actualDelivery': new Date(),
            $push: {
                timeline: {
                    fromState: orderBuf.status,
                    toState: 'DELIVERED',
                    reason: 'Logistics provider confirmed delivery.'
                }
            }
        }, { new: true });

        systemEvents.emit(EVENTS.ORDER.DELIVERED, {
            orderId,
            userId: order.customerId
        });

        return order;
    }

    /**
     * Cancel an order and restore inventory.
     */
    async cancelOrder(orderId, reason) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const order = await Order.findById(orderId).session(session);

            if (!order || ['SETTLED', 'CANCELLED'].includes(order.status)) {
                throw new Error(`Order cannot be cancelled in its current state (${order.status}).`);
            }

            // 1. ATOMIC ALLOCATION RESTORATION (CRITICAL FOR REFUNDS)
            for (const item of order.items) {
                // Restore inventory quantities
                await Inventory.findByIdAndUpdate(item.inventoryId, {
                    $inc: {
                        stock: item.quantity,
                        locked: -item.quantity,
                        soldQuantity: -item.quantity, // Reduce sold count
                        remainingQuantity: item.quantity // Restore available quantity
                    }
                }, { session });

                // CRITICAL: Restore allocation remaining quantity
                if (item.allocationId) {
                    await Allocation.findByIdAndUpdate(item.allocationId, {
                        $inc: {
                            soldQuantity: -item.quantity, // Reduce sold count
                            remainingQuantity: item.quantity // Restore available quantity
                        }
                    }, { session });
                }
            }

            // 2. Handle Escrow Refund
            const { Escrow } = await import('../models/index.js');
            const escrow = await Escrow.findOne({ orderId }).session(session);
            if (escrow && escrow.status === 'HOLD') {
                await Escrow.findByIdAndUpdate(escrow._id, {
                    status: 'REFUNDED',
                    refundedAt: new Date()
                }, { session });
            }

            // 3. Update Status
            const cancelledOrder = await Order.findByIdAndUpdate(orderId, {
                status: 'CANCELLED',
                $push: {
                    timeline: {
                        fromState: order.status,
                        toState: 'CANCELLED',
                        reason
                    }
                }
            }, { session, new: true });

            await session.commitTransaction();
            return cancelledOrder;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Get orders for a specific user role with filters.
     */
    async getOrders(role, userId, filters = {}) {
        const { status, sellerId } = filters;
        const query = {};

        if (role === 'SELLER') {
            const { Seller } = await import('../models/index.js');
            const seller = await Seller.findOne({ userId });
            if (!seller) throw new Error('SELLER_PROFILE_NOT_FOUND');
            query.sellerId = seller._id;
        } else if (role === 'CUSTOMER') {
            const { Customer } = await import('../models/index.js');
            const customer = await Customer.findOne({ userId });
            if (!customer) throw new Error('CUSTOMER_PROFILE_NOT_FOUND');
            query.customerId = customer._id;
        } else if (role === 'ADMIN' && sellerId) {
            query.sellerId = sellerId;
        }

        if (status && status !== 'All') {
            query.status = status.toUpperCase();
        }

        const orders = await Order.find(query)
            .populate('customerId', 'name')
            .populate('items.productId', 'name images')
            .populate('items.inventoryId', 'customName customImages') // Populate overrides
            .populate('sellerId', 'businessName')
            .sort({ createdAt: -1 })
            .lean();

        // Merge Overrides
        return orders.map(order => ({
            ...order,
            items: order.items.map(item => ({
                ...item,
                product: {
                    ...item.productId,
                    name: item.inventoryId?.customName || item.productId?.name,
                    image: (item.inventoryId?.customImages?.length > 0)
                        ? item.inventoryId.customImages[0]
                        : (item.productId?.images?.[0] || '')
                },
                productId: item.productId // Keep original reference if needed
            }))
        }));
    }

    /**
     * Get Order by ID with security and full relations.
     */
    async getOrderById(orderId, userId, role) {
        const order = await Order.findById(orderId)
            .populate({ path: 'items.productId', select: 'name images manufacturerId description' })
            .populate({ path: 'items.inventoryId', select: 'customName customImages customDescription' }) // Populate overrides
            .populate('customerId')
            .populate('sellerId')
            .populate('escrow')
            .lean();

        if (!order) throw new Error('ORDER_NOT_FOUND');

        // Security Checks
        if (role === 'CUSTOMER' && order.customerId.userId.toString() !== userId.toString()) throw new Error('UNAUTHORIZED_ACCESS');
        if (role === 'SELLER' && order.sellerId.userId.toString() !== userId.toString()) throw new Error('UNAUTHORIZED_ACCESS');
        if (role === 'MANUFACTURER') {
            const { Manufacturer } = await import('../models/index.js');
            const mfg = await Manufacturer.findOne({ userId });
            const hasProduct = order.items.some(item => item.productId.manufacturerId.toString() === mfg._id.toString());
            if (!hasProduct) throw new Error('UNAUTHORIZED_ACCESS');
        }

        // Merge Overrides
        order.items = order.items.map(item => ({
            ...item,
            product: {
                ...item.productId,
                name: item.inventoryId?.customName || item.productId?.name,
                description: item.inventoryId?.customDescription || item.productId?.description,
                image: (item.inventoryId?.customImages?.length > 0)
                    ? item.inventoryId.customImages[0]
                    : (item.productId?.images?.[0] || '')
            }
        }));

        return order;
    }

    /**
     * Unified Status Update with State Machine and Rules.
     */
    async updateStatus(orderId, status, { reason, metadata, userId, role } = {}) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const current = await Order.findById(orderId).session(session);

            if (!current) throw new Error('ORDER_NOT_FOUND');

            // Security / Permission Check
            if (role !== 'ADMIN') {
                const { Seller, Customer, Manufacturer } = await import('../models/index.js');

                if (role === 'SELLER') {
                    // Verify the User owns the Seller Profile linked to this Order
                    const seller = await Seller.findOne({ userId }).session(session);
                    // Check if seller exists and matches the order's sellerId
                    if (!seller || current.sellerId.toString() !== seller._id.toString()) {
                        throw new Error('UNAUTHORIZED_ORDER_UPDATE');
                    }
                } else if (role === 'CUSTOMER') {
                    // Verify the User owns the Customer Profile linked to this Order
                    const customer = await Customer.findOne({ userId }).session(session);
                    // Order.customerId is a reference to Customer Profile
                    if (!customer || current.customerId.toString() !== customer._id.toString()) {
                        throw new Error('UNAUTHORIZED_ORDER_UPDATE');
                    }
                } else if (role === 'MANUFACTURER') {
                    // Manufacturer acting as a Seller (Direct to Consumer or B2B)
                    // They must own the Seller Profile listed on the order
                    const sellerProfile = await Seller.findOne({ userId }).session(session);

                    // If they don't have a seller profile, they might be a pure manufacturer.
                    // But if they are fulfilling an order, they are the 'sellerId' on that order record.
                    // Strict check:
                    if (!sellerProfile || current.sellerId.toString() !== sellerProfile._id.toString()) {
                        throw new Error('UNAUTHORIZED_ORDER_UPDATE');
                    }
                }
            }

            if (!isValidTransition(current.status, status)) {
                throw new Error(`INVALID_TRANSITION: ${current.status} -> ${status}`);
            }

            // Side Effects
            if (status === 'DELIVERED') {
                for (const item of current.items) {
                    await Inventory.findByIdAndUpdate(item.inventoryId, {
                        $inc: { locked: -item.quantity }
                    }, { session });
                }
            } else if (status === 'CANCELLED') {
                for (const item of current.items) {
                    // Restore Inventory stock
                    await Inventory.findByIdAndUpdate(item.inventoryId, {
                        $inc: { stock: item.quantity, locked: -item.quantity }
                    }, { session });

                    // V-008: Restore Allocation quantities
                    const inv = await Inventory.findById(item.inventoryId).session(session);
                    if (inv && inv.allocationId) {
                        await Allocation.findByIdAndUpdate(inv.allocationId, {
                            $inc: { soldQuantity: -item.quantity, remainingQuantity: item.quantity }
                        }, { session });

                        // Reactivate allocation if it was DEPLETED
                        const updatedAlloc = await Allocation.findById(inv.allocationId).session(session);
                        if (updatedAlloc && updatedAlloc.status === 'DEPLETED' && updatedAlloc.remainingQuantity > 0) {
                            updatedAlloc.status = 'ACTIVE';
                            await updatedAlloc.save({ session });
                        }
                    }
                }
                // Handle Escrow Refund
                const { Escrow } = await import('../models/index.js');
                const escrow = await Escrow.findOne({ orderId }).session(session);
                if (escrow && escrow.status === 'HOLD') {
                    await Escrow.findByIdAndUpdate(escrow._id, {
                        status: 'REFUNDED',
                        refundedAt: new Date()
                    }, { session });
                }
            }

            const updatedOrder = await Order.findByIdAndUpdate(orderId, {
                status,
                $push: {
                    timeline: {
                        fromState: current.status,
                        toState: status,
                        reason: reason || 'Status updated by system',
                        metadata: metadata || {}
                    }
                }
            }, { session, new: true });

            await session.commitTransaction();
            return updatedOrder;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Audit Stock: Re-calculate 'locked' counts based on active orders.
     * Identifies discrepancies between physical stock and DB records.
     */
    async auditStock() {
        const stockDiscrepancies = [];
        const inventories = await Inventory.find({}).populate('productId').lean();

        for (const inv of inventories) {
            const activeOrders = await Order.find({
                sellerId: inv.sellerId,
                status: { $in: ['CREATED', 'PAID', 'CONFIRMED', 'SHIPPED'] },
                'items.productId': inv.productId._id
            }).lean();

            const expectedLocked = activeOrders.reduce((sum, order) => {
                const item = order.items.find(i => i.productId.toString() === inv.productId._id.toString());
                return sum + (item?.quantity || 0);
            }, 0);

            if (inv.locked !== expectedLocked) {
                stockDiscrepancies.push({
                    inventoryId: inv._id,
                    product: inv.productId.name,
                    sellerId: inv.sellerId,
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
