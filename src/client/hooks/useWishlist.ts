import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { wishlistService } from '../../lib/api/services/wishlist.service';
import { useAuth } from './useAuth';

export function useWishlist() {
    const [wishlistItems, setWishlistItems] = useState<string[]>([]); // Store product IDs
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            // Load from local storage if not authenticated
            const saved = localStorage.getItem('novamart_wishlist');
            if (saved) {
                try {
                    setWishlistItems(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to parse wishlist from local storage', e);
                }
            }
            return;
        }

        try {
            setIsLoading(true);
            const response = await wishlistService.getWishlist();
            // Assuming response is an array of products or contains ids. 
            // Based on wishlist.service.ts, it returns Promise<Product[]>.
            // We need to extract IDs to check if an item is wishlisted efficiently.
            const ids = Array.isArray(response) ? response.map((item: any) => item.id) : [];
            setWishlistItems(ids);

            // Sync local storage to backend if needed? For now, just trust backend.
        } catch (error) {
            console.error('Failed to fetch wishlist', error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (productId: string) => {
        if (!isAuthenticated) {
            const updated = [...wishlistItems, productId];
            setWishlistItems(updated);
            localStorage.setItem('novamart_wishlist', JSON.stringify(updated));
            toast.success('Added to wishlist');
            return;
        }

        try {
            // Optimistic update
            setWishlistItems(prev => [...prev, productId]);
            await wishlistService.addToWishlist(productId);
            toast.success('Added to wishlist');
        } catch (error) {
            console.error('Failed to add to wishlist', error);
            // Revert on failure
            setWishlistItems(prev => prev.filter(id => id !== productId));
            toast.error('Failed to add to wishlist');
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!isAuthenticated) {
            const updated = wishlistItems.filter(id => id !== productId);
            setWishlistItems(updated);
            localStorage.setItem('novamart_wishlist', JSON.stringify(updated));
            toast.success('Removed from wishlist');
            return;
        }

        try {
            // Optimistic update
            setWishlistItems(prev => prev.filter(id => id !== productId));
            await wishlistService.removeFromWishlist(productId);
            toast.success('Removed from wishlist');
        } catch (error) {
            console.error('Failed to remove from wishlist', error);
            // Revert on failure
            setWishlistItems(prev => [...prev, productId]);
            toast.error('Failed to remove from wishlist');
        }
    };

    const toggleWishlist = async (productId: string) => {
        if (wishlistItems.includes(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    const isInWishlist = (productId: string) => wishlistItems.includes(productId);

    return {
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        isLoading,
        refreshWishlist: fetchWishlist
    };
}
