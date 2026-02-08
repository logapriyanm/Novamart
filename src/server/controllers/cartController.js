import prisma from '../lib/prisma.js';

// Get Cart for authenticated customer
export const getCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

                // Find/Create customer profile
        let customer = req.user.customer;
        
        if (!customer) {
            if (req.user.role === 'CUSTOMER') {
                customer = await prisma.customer.create({
                    data: { userId, name: req.user.email?.split('@')[0] || 'Customer' }
                });
            } else {
                // Determine response based on function context if needed, 
                // but usually for non-customers, we want success:true with empty data for GET/SYNC, and error for others.
                // To keep it simple and safe for all endpoints:
                if (req.method === 'GET' || req.path === '/sync') {
                    return res.json({ success: true, data: { id: null, items: [], itemCount: 0, mergedCount: 0 } });
                }
                return res.status(403).json({ success: false, error: 'Action restricted to customers' });
            }
        }


        // Find or create cart
        let cart = await prisma.cart.findUnique({
            where: { customerId: customer.id },
            include: {
                items: {
                    include: {
                        // We'll need to join inventory and product to get full details
                    }
                }
            }
        });

        // If no cart exists, create one
        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    customerId: customer.id
                },
                include: {
                    items: true
                }
            });
        }

        // Fetch full product and inventory details for each cart item
        const enrichedItems = await Promise.all(
            cart.items.map(async (item) => {
                const inventory = await prisma.inventory.findUnique({
                    where: { id: item.inventoryId },
                    include: {
                        product: {
                            include: {
                                manufacturer: true
                            }
                        },
                        dealer: true
                    }
                });

                return {
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    product: inventory?.product,
                    dealer: inventory?.dealer,
                    inventoryId: item.inventoryId,
                    stock: inventory?.stock || 0
                };
            })
        );

        res.json({
            success: true,
            data: {
                id: cart.id,
                items: enrichedItems,
                itemCount: enrichedItems.length
            }
        });
    } catch (error) {
        console.error('Get Cart Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch cart' });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { inventoryId, quantity = 1 } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        if (!inventoryId) {
            return res.status(400).json({ success: false, error: 'Inventory ID required' });
        }

                // Find/Create customer profile
        let customer = req.user.customer;
        
        if (!customer) {
            if (req.user.role === 'CUSTOMER') {
                customer = await prisma.customer.create({
                    data: { userId, name: req.user.email?.split('@')[0] || 'Customer' }
                });
            } else {
                // Determine response based on function context if needed, 
                // but usually for non-customers, we want success:true with empty data for GET/SYNC, and error for others.
                // To keep it simple and safe for all endpoints:
                if (req.method === 'GET' || req.path === '/sync') {
                    return res.json({ success: true, data: { id: null, items: [], itemCount: 0, mergedCount: 0 } });
                }
                return res.status(403).json({ success: false, error: 'Action restricted to customers' });
            }
        }


        // Verify inventory exists and has stock
        const inventory = await prisma.inventory.findUnique({
            where: { id: inventoryId },
            include: { product: true }
        });

        if (!inventory) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        if (inventory.stock < quantity) {
            return res.status(400).json({ success: false, error: 'Insufficient stock' });
        }

        // Find or create cart
        let cart = await prisma.cart.findUnique({
            where: { customerId: customer.id }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { customerId: customer.id }
            });
        }

        // Check if item already in cart
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_inventoryId: {
                    cartId: cart.id,
                    inventoryId
                }
            }
        });

        let cartItem;
        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;
            if (inventory.stock < newQuantity) {
                return res.status(400).json({
                    success: false,
                    error: `Only ${inventory.stock} items available`
                });
            }

            cartItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: newQuantity,
                    price: inventory.price
                }
            });
        } else {
            // Create new cart item
            cartItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    inventoryId,
                    productId: inventory.productId,
                    quantity,
                    price: inventory.price
                }
            });
        }

        res.json({ success: true, data: cartItem });
    } catch (error) {
        console.error('Add to Cart Error:', error);
        res.status(500).json({ success: false, error: 'Failed to add item to cart' });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { cartItemId, quantity } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        if (!cartItemId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Cart item ID and quantity required'
            });
        }

                // Find/Create customer profile
        let customer = req.user.customer;
        
        if (!customer) {
            if (req.user.role === 'CUSTOMER') {
                customer = await prisma.customer.create({
                    data: { userId, name: req.user.email?.split('@')[0] || 'Customer' }
                });
            } else {
                // Determine response based on function context if needed, 
                // but usually for non-customers, we want success:true with empty data for GET/SYNC, and error for others.
                // To keep it simple and safe for all endpoints:
                if (req.method === 'GET' || req.path === '/sync') {
                    return res.json({ success: true, data: { id: null, items: [], itemCount: 0, mergedCount: 0 } });
                }
                return res.status(403).json({ success: false, error: 'Action restricted to customers' });
            }
        }


        // Verify cart item belongs to user's cart
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true }
        });

        if (!cartItem || cartItem.cart.customerId !== customer.id) {
            return res.status(404).json({ success: false, error: 'Cart item not found' });
        }

        // Check stock
        const inventory = await prisma.inventory.findUnique({
            where: { id: cartItem.inventoryId }
        });

        if (!inventory) {
            return res.status(404).json({ success: false, error: 'Product no longer available' });
        }

        if (inventory.stock < quantity) {
            return res.status(400).json({
                success: false,
                error: `Only ${inventory.stock} items available`
            });
        }

        // Update quantity
        const updated = await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity, price: inventory.price }
        });

        res.json({ success: true, data: updated });
    } catch (error) {
        console.error('Update Cart Item Error:', error);
        res.status(500).json({ success: false, error: 'Failed to update cart item' });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { cartItemId } = req.params;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

                // Find/Create customer profile
        let customer = req.user.customer;
        
        if (!customer) {
            if (req.user.role === 'CUSTOMER') {
                customer = await prisma.customer.create({
                    data: { userId, name: req.user.email?.split('@')[0] || 'Customer' }
                });
            } else {
                // Determine response based on function context if needed, 
                // but usually for non-customers, we want success:true with empty data for GET/SYNC, and error for others.
                // To keep it simple and safe for all endpoints:
                if (req.method === 'GET' || req.path === '/sync') {
                    return res.json({ success: true, data: { id: null, items: [], itemCount: 0, mergedCount: 0 } });
                }
                return res.status(403).json({ success: false, error: 'Action restricted to customers' });
            }
        }


        // Verify cart item belongs to user's cart
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true }
        });

        if (!cartItem || cartItem.cart.customerId !== customer.id) {
            return res.status(404).json({ success: false, error: 'Cart item not found' });
        }

        // Delete cart item
        await prisma.cartItem.delete({
            where: { id: cartItemId }
        });

        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from Cart Error:', error);
        res.status(500).json({ success: false, error: 'Failed to remove item' });
    }
};

// Clear entire cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

                // Find/Create customer profile
        let customer = req.user.customer;
        
        if (!customer) {
            if (req.user.role === 'CUSTOMER') {
                customer = await prisma.customer.create({
                    data: { userId, name: req.user.email?.split('@')[0] || 'Customer' }
                });
            } else {
                // Determine response based on function context if needed, 
                // but usually for non-customers, we want success:true with empty data for GET/SYNC, and error for others.
                // To keep it simple and safe for all endpoints:
                if (req.method === 'GET' || req.path === '/sync') {
                    return res.json({ success: true, data: { id: null, items: [], itemCount: 0, mergedCount: 0 } });
                }
                return res.status(403).json({ success: false, error: 'Action restricted to customers' });
            }
        }


        // Find cart
        const cart = await prisma.cart.findUnique({
            where: { customerId: customer.id }
        });

        if (cart) {
            // Delete all cart items
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
        }

        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear Cart Error:', error);
        res.status(500).json({ success: false, error: 'Failed to clear cart' });
    }
};

// Sync cart from local storage (merge logic for when user logs in)
export const syncCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { items } = req.body; // Array of {inventoryId, quantity}

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, error: 'Items array required' });
        }

                // Find/Create customer profile
        let customer = req.user.customer;
        
        if (!customer) {
            if (req.user.role === 'CUSTOMER') {
                customer = await prisma.customer.create({
                    data: { userId, name: req.user.email?.split('@')[0] || 'Customer' }
                });
            } else {
                // Determine response based on function context if needed, 
                // but usually for non-customers, we want success:true with empty data for GET/SYNC, and error for others.
                // To keep it simple and safe for all endpoints:
                if (req.method === 'GET' || req.path === '/sync') {
                    return res.json({ success: true, data: { id: null, items: [], itemCount: 0, mergedCount: 0 } });
                }
                return res.status(403).json({ success: false, error: 'Action restricted to customers' });
            }
        }


        // Find or create cart
        let cart = await prisma.cart.findUnique({
            where: { customerId: customer.id },
            include: { items: true }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { customerId: customer.id },
                include: { items: true }
            });
        }

        // Merge items from local storage
        const mergedItems = [];
        for (const item of items) {
            const { inventoryId, quantity } = item;

            // Validate inventory
            const inventory = await prisma.inventory.findUnique({
                where: { id: inventoryId }
            });

            if (!inventory || inventory.stock < quantity) {
                continue; // Skip invalid/out-of-stock items
            }

            // Check if already in cart
            const existing = cart.items.find(ci => ci.inventoryId === inventoryId);

            if (existing) {
                // Update to max quantity
                const newQty = Math.max(existing.quantity, quantity);
                const updated = await prisma.cartItem.update({
                    where: { id: existing.id },
                    data: {
                        quantity: Math.min(newQty, inventory.stock),
                        price: inventory.price
                    }
                });
                mergedItems.push(updated);
            } else {
                // Add new item
                const created = await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        inventoryId,
                        productId: inventory.productId,
                        quantity: Math.min(quantity, inventory.stock),
                        price: inventory.price
                    }
                });
                mergedItems.push(created);
            }
        }

        res.json({ success: true, data: { mergedCount: mergedItems.length } });
    } catch (error) {
        console.error('Sync Cart Error:', error);
        res.status(500).json({ success: false, error: 'Failed to sync cart' });
    }
};
