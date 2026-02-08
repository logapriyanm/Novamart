'use client';

import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../../lib/api/client';
import { usePathname } from 'next/navigation';

interface TrackingContextType {
    trackEvent: (type: string, targetId: string, metadata?: any) => Promise<void>;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export function TrackingProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const pathname = usePathname();

    const trackEvent = useCallback(async (type: string, targetId: string, metadata: any = {}) => {
        if (!user) return; // Only track logged-in users for now

        try {
            await apiClient.post('/home/track', {
                type,
                targetId,
                metadata
            });
        } catch (error) {
            console.error('Tracking failed:', error);
        }
    }, [user]);

    // Auto-track Page Views (simplified)
    useEffect(() => {
        if (pathname.startsWith('/products/')) {
            const productId = pathname.split('/products/')[1];
            if (productId) {
                trackEvent('VIEW_PRODUCT', productId);
            }
        } else if (pathname.startsWith('/categories/')) {
            const category = pathname.split('/categories/')[1];
            trackEvent('VIEW_CATEGORY', category);
        }
    }, [pathname, trackEvent]);

    return (
        <TrackingContext.Provider value={{ trackEvent }}>
            {children}
        </TrackingContext.Provider>
    );
}

export const useTracking = () => {
    const context = useContext(TrackingContext);
    if (context === undefined) {
        throw new Error('useTracking must be used within a TrackingProvider');
    }
    return context;
};
