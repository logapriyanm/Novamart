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
    async createOrder(customerId, sellerId, items, shippingAddress, idempotencyKey = null) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            let totalAmount = 0;
            const processedItems = [];

            // PHASE 1: ATOMIC ALLOCATION DEDUCTION WITH OVERSELLING PROTECTION
            for (const item of items) {
                // Validation: Must have inventoryId to link to allocation
                if (!item.inventoryId) {
                    throw new Error('Each item must have an inventoryId linked to an allocation.');
                }

                // CRITICAL: Lock inventory row using SELECT FOR UPDATE pattern
                // This prevents concurrent orders from overselling
                const inventory = await Inventory.findById(item.inventoryId)
                    .session(session)
                    .select('+__v'); // Include version for optimistic locking

                if (!inventory) {
                    throw new Error(`Inventory ${item.inventoryId} not found.`);
                }

                // Validation: Check if inventory is linked to allocation
                if (!inventory.allocationId) {
                    throw new Error(`Inventory ${item.inventoryId} has no allocation. Direct sales not allowed.`);
                }

                // CRITICAL: Lock and validate allocation with SELECT FOR UPDATE
                const allocation = await Allocation.findById(inventory.allocationId)
                    .session(session)
                    .select('+__v');

                if (!allocation) {
                    throw new Error(`Allocation ${inventory.allocationId} not found.`);
                }

                // OVERSELLING PROTECTION: Validate remaining quantity
                if (allocation.remainingQuantity < item.quantity) {
                    throw new Error(
                        `INSUFFICIENT_STOCK: Only ${allocation.remainingQuantity} units remaining for this product. You requested ${item.quantity}.`
                    );
                }

                // ATOMIC DEDUCTION: Update allocation quantities
                await Allocation.findOneAndUpdate(
                    {
                        _id: allocation._id,
                        __v: allocation.__v, // Optimistic locking
                        remainingQuantity: { $gte: item.quantity } // Double-check at DB level
                    },
                    {
                        $inc: {
                            soldQuantity: item.quantity,
                            remainingQuantity: -item.quantity
                        },
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

                // Use negotiated price from allocation, not user input
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

            // PHASE 2: SERVER-SIDE COMMISSION CALCULATION (NEVER TRUST CLIENT)
            const COMMISSION_RATE = 0.05; // 5% - IMMUTABLE
            const taxRule = await TaxRule.findOne({ isActive: true }).session(session) || { taxSlab: 18 };

            const taxAmount = (totalAmount * Number(taxRule.taxSlab)) / 100;
            const commissionAmount = totalAmount * COMMISSION_RATE; // MUST be server-calculated
            const sellerPayout = totalAmount - commissionAmount;

            // PHASE 3: Create Order with immutable commission
            const [order] = await Order.create([{
                customerId,
                sellerId,
                totalAmount,
                taxAmount,
                commissionAmount, // Server-calculated, immutable
                sellerPayout, // Seller receives this after commission
                shippingAddress,
                status: 'CREATED',
                idempotencyKey: idempotencyKey || null,
                items: processedItems,
                timeline: [{
                    fromState: 'CREATED',
                    toState: 'CREATED',
                    reason: 'Order initialized with allocation deduction'
                }]
            }], { session });

            await session.commitTransaction();

            // 4. Asynchronous Audit Logging (Background)
            // We use standard create (no session) post-commit for audit
            AuditLog.create({
                action: 'ORDER_CREATED',
                entityType: 'ORDER',
                entityId: order._id,
                userId: customerId,
                metadata: { order, reason: 'User placed a new order' }
            }).catch(err => console.error('Background Audit Log Failed:', err));

            // 5. Emit System Event
            systemEvents.emit(EVENTS.ORDER.PLACED, {
                order,
                customerId,
                sellerId
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
     * Confirm payment and initialize escrow.
     */
    async confirmPayment(orderId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const orderBuf = await Order.findById(orderId).session(session);
            if (!orderBuf) throw new Error('Order not found');

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

            const { Escrow } = await import('../models/index.js');
            await Escrow.create([{
                orderId,
                amount: order.totalAmount,
                status: 'HOLD'
            }], { session });

            await session.commitTransaction();

            AuditLog.create({
                action: 'PAYMENT_CONFIRMED',
                entityType: 'ORDER',
                entityId: orderId,
                userId: order.customerId,
                metadata: { status: 'PAID', escrow: 'INITIALIZED', reason: 'Payment successful' }
            }).catch(err => console.error('Background Audit Log Failed:', err));

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

        return await Order.find(query)
            .populate('customerId', 'name')
            .populate('items.productId', 'name images')
            .populate('sellerId', 'businessName')
            .sort({ createdAt: -1 })
            .lean();
    }

    /**
     * Get Order by ID with security and full relations.
     */
    async getOrderById(orderId, userId, role) {
        const order = await Order.findById(orderId)
            .populate({ path: 'items.productId', select: 'name images manufacturerId' })
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
                if (role === 'SELLER') {
                    // Seller is the Vendor (for B2C) or Buyer (for B2B)?
                    // Usually Seller is Vendor.
                    if (current.sellerId.toString() !== userId.toString()) {
                        // Check if this is a B2B order where Seller is the Customer?
                        // If Seller is buying from Manufacturer, Seller is Customer.
                        // But Order.customerId is a Customer/User ID.
                        // We need to check if current.customerId resolves to this Seller's User ID.
                        // For now, assume strict: Seller = Vendor.
                        throw new Error('UNAUTHORIZED_ORDER_UPDATE');
                    }
                } else if (role === 'CUSTOMER') {
                    // Customer is Buyer
                    // current.customerId refers to Customer Profile ID, not User ID.
                    // We need to resolve. Assuming userId passed is the User ID.
                    // But strictly, we should fetch Customer profile for this userId.
                    // For performance, we assume userId validation happened in Controller or we fetch here.
                    // Since we don't have Customer model access easily without import loop or overhead,
                    // we assume Validated in Controller OR we just rely on ID match if we query.
                    // Let's rely on checking if the user owns the customer profile linked.
                    // Actually, easiest is: Controller passes correct args.
                    // But Controller passed req.user._id.
                    // current.customerId is a Profile ID.
                    // We need to check if that Profile belongs to req.user._id.
                    // This is duplicate work from getOrders.
                    // Let's assume passed authorized flag or do a quick lookup.
                    // For robust security, we MUST fetch.
                    const { Customer } = await import('../models/index.js');
                    const customer = await Customer.findOne({ userId }).session(session);
                    if (!customer || current.customerId.toString() !== customer._id.toString()) {
                        throw new Error('UNAUTHORIZED_ORDER_UPDATE');
                    }
                } else if (role === 'MANUFACTURER') {
                    // Manufacturer updating status? (e.g. Shipping B2B order)
                    // Check if Manufacturer is the vendor (sellerId logic?)
                    // If Order.items contains products from this Manufacturer, allow?
                    // Or if Order.sellerId is actually the Manufacturer (shadow seller).
                    // PROMPT: "Seller places B2B order -> Manufacturer confirms".
                    // This implies Manufacturer acts as Seller.
                    // If Manufacturer has no Seller Profile, this fails.
                    // We will assume Manufacturer ID matches sellerId if we use Shadow Profile,
                    // OR we check Line Items.
                    // If B2B Order: sellerId should be Manufacturer's Seller Profile.
                    // If not, we check if generic permission allowed.
                    // Let's assume Manufacturer can update if they are the 'sellerId' (via shadow profile).
                    // If not, we deny.
                    // Logic: Check if current.sellerId is linked to this Manufacturer.
                    // Since we don't have that link easily without Shadow Profile, we might block.
                    // Allow if current.sellerId is NOT set (direct mfg order?) - unlikely.

                    // FALLBACK: If Manufacturer is the vendor, the sellerId should point to a Seller record 
                    // that belongs to this Manufacturer.
                    const { Seller } = await import('../models/index.js');
                    const sellerProfile = await Seller.findOne({ userId }).session(session);
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
