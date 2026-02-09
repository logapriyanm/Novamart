
import prisma from '../../lib/prisma.js';
import { isValidTransition, validatePaymentState } from '../../lib/stateMachine.js';

// --- Create Order ---
export const createOrder = async (req, res) => {
    try {
        const { dealerId, items, shippingAddress = 'Not provided' } = req.body;
        // User info from auth middleware (assuming verifyToken adds user to req)
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        // 1. Fetch products & calculate totals
        let totalAmount = 0;
        let taxAmount = 0; // Simplified for now
        let commissionAmount = 0;
        const orderItemsData = [];

        // Validate items
        for (const item of items) {
            const product = await prisma.inventory.findUnique({
                where: { id: item.inventoryId }, // Assuming frontend sends inventory ID
                include: { product: true }
            });

            if (!product) {
                return res.status(404).json({ success: false, error: `Product not found: ${item.inventoryId}` });
            }

            // Check stock
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, error: `Insufficient stock for ${product.product.name}` });
            }

            const lineTotal = Number(product.price) * item.quantity;
            totalAmount += lineTotal;

            orderItemsData.push({
                productId: product.productId, // Link to Product master
                inventoryId: item.inventoryId, // Direct link to inventory
                quantity: item.quantity,
                price: product.price
            });
        }

        // 2. Create Order Transactionally
        const order = await prisma.$transaction(async (tx) => {
            // Get customer for this user
            const customer = await tx.customer.findUnique({
                where: { userId }
            });

            if (!customer) {
                throw new Error('Customer not found');
            }

            // Create Order
            const newOrder = await tx.order.create({
                data: {
                    customerId: customer.id,
                    dealerId,
                    totalAmount,
                    taxAmount,
                    commissionAmount,
                    status: 'CREATED',
                    shippingAddress,
                    items: {
                        create: orderItemsData
                    }
                },
                include: { items: true }
            });

            // Update Inventory (Lock Stock)
            for (const item of items) {
                await tx.inventory.update({
                    where: { id: item.inventoryId },
                    data: {
                        stock: { decrement: item.quantity },
                        locked: { increment: item.quantity }
                    }
                });
            }

            // Clear cart after successful order
            const cart = await tx.cart.findUnique({
                where: { customerId: customer.id }
            });

            if (cart) {
                await tx.cartItem.deleteMany({
                    where: { cartId: cart.id }
                });
            }

            return newOrder;
        });

        // Send order confirmation email (non-blocking)
        import('../services/emailService.js').then((module) => {
            module.sendOrderConfirmation(order).catch(err =>
                console.error('Failed to send order confirmation email:', err)
            );
        }).catch(err => console.error('Email service import error:', err));

        res.status(201).json({ success: true, data: order });

    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ success: false, error: 'Failed to create order' });
    }
};

// --- Get All Orders (with filters) ---
export const getOrders = async (req, res) => {
    try {
        const { dealerId, status: queryStatus } = req.query;
        const where = {};
        const userRole = req.user?.role;
        const userId = req.user?.id;

        // Role-based filtering
        if (userRole === 'DEALER') {
            // Find the dealer record for this user
            const dealer = await prisma.dealer.findUnique({
                where: { userId }
            });
            if (!dealer) return res.status(404).json({ success: false, error: 'Dealer profile not found' });
            where.dealerId = dealer.id;
        } else if (userRole === 'ADMIN') {
            if (dealerId) where.dealerId = dealerId;
        } else {
            // Customers should use /my route, but if they hit this, return unauthorized or empty
            return res.status(403).json({ success: false, error: 'Forbidden. Use /my for personal orders.' });
        }

        if (queryStatus && queryStatus !== 'All') where.status = queryStatus.toUpperCase();

        const orders = await prisma.order.findMany({
            where,
            include: {
                customer: { select: { name: true, email: true } },
                items: { include: { linkedProduct: true } },
                dealer: { select: { businessName: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Get Orders Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
};

// --- Get My Orders (Customer) ---
export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

        // Verify if user is a customer
        // This logic depends on how User <-> Customer is linked. 
        // Schema has Customer.userId -> User.id

        const customer = await prisma.customer.findUnique({
            where: { userId },
            select: { id: true }
        });

        if (!customer) {
            return res.status(404).json({ success: false, error: 'Customer profile not found' });
        }

        const orders = await prisma.order.findMany({
            where: { customerId: customer.id },
            include: {
                items: { include: { linkedProduct: true } },
                dealer: { select: { businessName: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Get My Orders Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch your orders' });
    }
};

// --- Get Order by ID ---
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: { include: { linkedProduct: true } },
                customer: { include: { user: true } },
                dealer: { include: { user: true } },
                timeline: true,
                escrow: true
            }
        });

        if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

        // SECURITY: Role-based ownership verification
        if (userRole === 'CUSTOMER') {
            // Customers can only access their own orders
            if (order.customer.userId !== userId) {
                return res.status(403).json({ success: false, error: 'Forbidden: You can only access your own orders' });
            }
        } else if (userRole === 'DEALER') {
            // Dealers can only access orders they're fulfilling
            if (order.dealer.userId !== userId) {
                return res.status(403).json({ success: false, error: 'Forbidden: You can only access orders assigned to you' });
            }
        } else if (userRole === 'MANUFACTURER') {
            // Manufacturers can access orders containing their products
            const manufacturerProfile = await prisma.manufacturer.findUnique({
                where: { userId }
            });
            if (!manufacturerProfile) {
                return res.status(403).json({ success: false, error: 'Manufacturer profile not found' });
            }

            // Check if any order item belongs to this manufacturer's products
            const hasManufacturerProduct = await prisma.orderItem.findFirst({
                where: {
                    orderId: order.id,
                    linkedProduct: {
                        manufacturerId: manufacturerProfile.id
                    }
                }
            });

            if (!hasManufacturerProduct) {
                return res.status(403).json({ success: false, error: 'Forbidden: This order does not contain your products' });
            }
        }
        // ADMIN can access all orders (no restriction)

        res.json({ success: true, data: order });
    } catch (error) {
        console.error('Get Order Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch order details' });
    }
};

// --- Update Order Status & Handle State Machine ---
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason, metadata } = req.body;

        const result = await prisma.$transaction(async (tx) => {
            const currentOrder = await tx.order.findUnique({
                where: { id },
                include: { items: true, escrow: true }
            });

            if (!currentOrder) throw new Error('Order not found');

            // CRITICAL: Validate state transition
            if (!isValidTransition(currentOrder.status, status)) {
                throw new Error(`Invalid state transition: ${currentOrder.status} -> ${status}`);
            }

            // State Machine Logic
            if (status === 'DELIVERED') {
                // Release Escrow
                // Escrow remains HOLD until Buyer confirms or timeout
                // if (currentOrder.escrow) {
                //    // Removed automatic release.
                // }

                // Reduce 'locked' stock (since it's now sold/delivered)
                for (const item of currentOrder.items) {
                    if (item.inventoryId) {
                        await tx.inventory.update({
                            where: { id: item.inventoryId },
                            data: { locked: { decrement: item.quantity } }
                        });
                    }
                }

            } else if (status === 'CANCELLED') {
                // Revert Stock
                for (const item of currentOrder.items) {
                    if (item.inventoryId) {
                        await tx.inventory.update({
                            where: { id: item.inventoryId },
                            data: {
                                stock: { increment: item.quantity },
                                locked: { decrement: item.quantity }
                            }
                        });
                    }
                }

                // Refund Escrow if paid
                if (currentOrder.escrow && currentOrder.escrow.status === 'HOLD') {
                    await tx.escrow.update({
                        where: { id: currentOrder.escrow.id },
                        data: {
                            status: 'REFUNDED',
                            refundedAt: new Date()
                        }
                    });
                }
            }

            // Update Order
            const updated = await tx.order.update({
                where: { id },
                data: {
                    status,
                    timeline: {
                        create: {
                            fromState: currentOrder.status,
                            toState: status,
                            reason: reason || 'Status updated by system',
                            metadata: metadata || {}
                        }
                    }
                }
            });

            return updated;
        });

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to update order status' });
    }
};
