'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../../lib/api/services/cart.service';
import { useAuth } from '../hooks/useAuth';
// import { useSnackbar } from './SnackbarContext';
import { toast } from 'sonner';

export interface CartItem {
    id: string; // cart item ID
    inventoryId: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    sellerId: string;
    sellerName: string;
    region?: string;
    stock?: number;
    originalPrice?: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
    removeFromCart: (cartItemId: string) => Promise<void>;
    updateQuantity: (cartItemId: string, delta: number) => Promise<void>;
    clearCart: () => Promise<void>;
    subtotal: number;
    total: number;
    totalSavings: number;
    isLoading: boolean;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, user } = useAuth();
    // const { showSnackbar } = useSnackbar();

    // Fetch cart from backend
    const fetchCart = async () => {
        // Only fetch from backend if authenticated AND user is a CUSTOMER
        if (!isAuthenticated || user?.role !== 'CUSTOMER') {
            // Load from localStorage if not authenticated or not a customer
            const savedCart = localStorage.getItem('novamart_cart');
            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart));
                } catch (e) {
                    console.error('Failed to load cart:', e);
                }
            }
            return;
        }

        setIsLoading(true);
        try {
            const response = await cartService.getCart();
            if (response.success && response.data) {
                // Map backend response to frontend format
                const items = response.data.items.map((item: any) => ({
                    id: item.id,
                    inventoryId: item.inventoryId,
                    productId: item.product?.id || item.productId,
                    name: item.product?.name || 'Product',
                    price: Number(item.price),
                    image: item.product?.images?.[0] || '',
                    quantity: item.quantity,
                    sellerId: item.seller?.id || '',
                    sellerName: item.seller?.businessName || '',
                    stock: item.stock,
                    originalPrice: Number(item.originalPrice || item.price)
                }));
                setCart(items);
                // Also save to localStorage for offline access
                localStorage.setItem('novamart_cart', JSON.stringify(items));
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Sync cart on login
    useEffect(() => {
        if (isAuthenticated && user?.role === 'CUSTOMER') {
            // Sync local storage cart with backend
            const syncLocalCart = async () => {
                const savedCart = localStorage.getItem('novamart_cart');
                if (savedCart) {
                    try {
                        const localItems = JSON.parse(savedCart);
                        if (localItems.length > 0) {
                            // Sync to backend
                            const itemsToSync = localItems.map((item: CartItem) => ({
                                inventoryId: item.inventoryId,
                                quantity: item.quantity
                            }));
                            await cartService.syncCart(itemsToSync);
                            localStorage.removeItem('novamart_cart'); // Clear local storage after sync
                        }
                    } catch (e) {
                        console.error('Failed to sync cart:', e);
                    }
                }
                // Fetch updated cart from backend
                await fetchCart();
            };

            syncLocalCart();
        } else {
            // Load from localStorage if not logged in
            fetchCart();
        }
    }, [isAuthenticated]);

    // Add item to cart
    const addToCart = async (item: Omit<CartItem, 'id'>) => {
        if (!isAuthenticated) {
            // Check stock for local cart
            const existing = cart.find(i => i.inventoryId === item.inventoryId);
            const currentQty = existing ? existing.quantity : 0;
            const newQty = currentQty + item.quantity;

            if (item.stock !== undefined && newQty > item.stock) {
                toast.error(`Cannot add more. Only ${item.stock} left in stock.`);
                return;
            }

            // Add to localStorage
            setCart(prev => {
                let updated;
                if (existing) {
                    updated = prev.map(i =>
                        i.inventoryId === item.inventoryId
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i
                    );
                } else {
                    updated = [...prev, { ...item, id: `local-${Date.now()}` }];
                }
                localStorage.setItem('novamart_cart', JSON.stringify(updated));
                return updated;
            });
            toast.success('Product added to cart');
            return;
        }

        // Check stock for backend cart (optimistic check)
        // We might not have the current cart item stock here if it's a new item, 
        // but we rely on the passed 'item.stock' or the existing item's stock in context.
        const existing = cart.find(i => i.inventoryId === item.inventoryId);
        const currentQty = existing ? existing.quantity : 0;
        const newQty = currentQty + item.quantity;

        if (item.stock !== undefined && newQty > item.stock) {
            toast.error(`Cannot add more. Only ${item.stock} left in stock.`);
            return;
        }

        setIsLoading(true);
        try {
            await cartService.addToCart(item.inventoryId, item.quantity);
            await fetchCart(); // Refresh cart
            toast.success('Product added to cart');
        } catch (error: any) {
            console.error('Failed to add to cart:', error);
            toast.error('Something went wrong. Please try again.');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Remove item from cart
    const removeFromCart = async (cartItemId: string) => {
        if (!isAuthenticated) {
            // Remove from localStorage
            setCart(prev => {
                const updated = prev.filter(i => i.id !== cartItemId);
                localStorage.setItem('novamart_cart', JSON.stringify(updated));
                return updated;
            });
            toast.success('Item removed from cart');
            return;
        }

        setIsLoading(true);
        try {
            await cartService.removeFromCart(cartItemId);
            await fetchCart(); // Refresh cart
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            toast.error('Something went wrong. Please try again.');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Update quantity
    const updateQuantity = async (cartItemId: string, delta: number) => {
        if (!isAuthenticated) {
            // Update localStorage
            setCart(prev => {
                const updated = prev.map(i => {
                    if (i.id === cartItemId) {
                        const newQty = Math.max(1, i.quantity + delta);
                        if (i.stock !== undefined && newQty > i.stock) {
                            toast.error(`Cannot add more. Only ${i.stock} left in stock.`);
                            return i;
                        }
                        return { ...i, quantity: newQty };
                    }
                    return i;
                });
                localStorage.setItem('novamart_cart', JSON.stringify(updated));
                return updated;
            });
            toast.success('Cart updated');
            return;
        }

        setIsLoading(true);
        try {
            const item = cart.find(i => i.id === cartItemId);
            if (item) {
                const newQuantity = Math.max(1, item.quantity + delta);

                if (item.stock !== undefined && newQuantity > item.stock) {
                    toast.error(`Cannot add more. Only ${item.stock} left in stock.`);
                    return;
                }

                await cartService.updateQuantity(cartItemId, newQuantity);
                await fetchCart(); // Refresh cart
                toast.success('Cart updated');
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
            toast.error('Something went wrong. Please try again.');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Clear cart
    const clearCart = async () => {
        if (!isAuthenticated) {
            setCart([]);
            localStorage.removeItem('novamart_cart');
            return;
        }

        setIsLoading(true);
        try {
            await cartService.clearCart();
            setCart([]);
            localStorage.removeItem('novamart_cart');
        } catch (error) {
            console.error('Failed to clear cart:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalSavings = cart.reduce((acc, item) => {
        const original = item.originalPrice || item.price;
        return acc + (Math.max(0, original - item.price) * item.quantity);
    }, 0);
    const total = subtotal; // Simplified for now

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                subtotal,
                total,
                totalSavings,
                isLoading,
                refreshCart: fetchCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
