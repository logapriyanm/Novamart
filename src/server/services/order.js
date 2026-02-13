/**
 * Order Service
 * Manages order lifecycle and inventory locking.
 */

import { Order, Inventory, Negotiation, TaxRule, MarginRule, Notification, AuditLog } from '../models/index.js';
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

            // 1. Calculate base total and validate regional inventory
            for (const item of items) {
                const query = {
                    sellerId,
                    stock: { $gte: item.quantity }
                };

                if (item.inventoryId) {
                    query._id = item.inventoryId;
                } else if (item.productId) {
                    query.productId = item.productId;
                } else {
                    throw new Error('Each item must have a productId or inventoryId.');
                }

                const inventory = await Inventory.findOne(query).session(session);

                if (!inventory) throw new Error(`Insufficient stock for item at this seller.`);

                // Check if negotiation exists
                if (item.negotiationId) {
                    const negotiation = await Negotiation.findById(item.negotiationId).session(session);

                    if (!negotiation) throw new Error('Invalid negotiation ID');
                    if (negotiation.status !== 'ACCEPTED') throw new Error('Negotiation must be ACCEPTED to place order');
                    if (negotiation.productId.toString() !== inventory.productId.toString()) throw new Error('Negotiation product mismatch');

                    item.price = negotiation.currentOffer;
                } else {
                    item.price = inventory.price;
                }

                await Inventory.findByIdAndUpdate(inventory._id, {
                    $inc: { stock: -item.quantity, locked: item.quantity }
                }, { session });

                totalAmount += Number(item.price) * item.quantity;
            }

            // 2. Dynamic Rules (GST & Commission)
            const taxRule = await TaxRule.findOne({ isActive: true }).session(session) || { taxSlab: 18 };
            const marginRule = await MarginRule.findOne({ isActive: true }).session(session) || { maxCap: 5 };

            const taxAmount = (totalAmount * Number(taxRule.taxSlab)) / 100;
            const commissionAmount = (totalAmount * Number(marginRule.maxCap)) / 100;

            // 3. Create Order
            const [order] = await Order.create([{
                customerId,
                sellerId,
                totalAmount,
                taxAmount,
                commissionAmount,
                shippingAddress,
                status: 'CREATED',
                idempotencyKey: idempotencyKey || null,
                items: items.map(i => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    price: i.price,
                    inventoryId: i.inventoryId
                })),
                timeline: [{
                    fromState: 'CREATED',
                    toState: 'CREATED',
                    reason: 'Order initialized'
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

            // 1. Restore Inventory
            for (const item of order.items) {
                await Inventory.findByIdAndUpdate(item.inventoryId, {
                    $inc: { stock: item.quantity, locked: -item.quantity }
                }, { session });
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
                    await Inventory.findByIdAndUpdate(item.inventoryId, {
                        $inc: { stock: item.quantity, locked: -item.quantity }
                    }, { session });
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
