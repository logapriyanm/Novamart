'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../../lib/api/services/cart.service';
import { useAuth } from '../hooks/useAuth';
import { useSnackbar } from './SnackbarContext';

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
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
    removeFromCart: (cartItemId: string) => Promise<void>;
    updateQuantity: (cartItemId: string, delta: number) => Promise<void>;
    clearCart: () => Promise<void>;
    subtotal: number;
    total: number;
    isLoading: boolean;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const { showSnackbar } = useSnackbar();

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
                    sellerId: item.dealer?.id || '',
                    sellerName: item.dealer?.businessName || '',
                    stock: item.stock
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
            // Add to localStorage
            setCart(prev => {
                const existing = prev.find(i => i.inventoryId === item.inventoryId);
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
            showSnackbar('Product added to cart', 'success');
            return;
        }

        setIsLoading(true);
        try {
            await cartService.addToCart(item.inventoryId, item.quantity);
            await fetchCart(); // Refresh cart
            showSnackbar('Product added to cart', 'success');
        } catch (error: any) {
            console.error('Failed to add to cart:', error);
            showSnackbar('Something went wrong. Please try again.', 'error');
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
            showSnackbar('Item removed from cart', 'success');
            return;
        }

        setIsLoading(true);
        try {
            await cartService.removeFromCart(cartItemId);
            await fetchCart(); // Refresh cart
            showSnackbar('Item removed from cart', 'success');
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            showSnackbar('Something went wrong. Please try again.', 'error');
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
                        return { ...i, quantity: newQty };
                    }
                    return i;
                });
                localStorage.setItem('novamart_cart', JSON.stringify(updated));
                return updated;
            });
            showSnackbar('Cart updated', 'success');
            return;
        }

        setIsLoading(true);
        try {
            const item = cart.find(i => i.id === cartItemId);
            if (item) {
                const newQuantity = Math.max(1, item.quantity + delta);
                await cartService.updateQuantity(cartItemId, newQuantity);
                await fetchCart(); // Refresh cart
                showSnackbar('Cart updated', 'success');
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
            showSnackbar('Something went wrong. Please try again.', 'error');
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
