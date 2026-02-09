import { apiClient } from '../client';

export const poolingService = {
    /**
     * Get all active pools
     */
    getPools: async (filters: any = {}) => {
        return await apiClient.get<any[]>('/pooling', {
            params: filters
        });
    },

    /**
     * Get specific pool details
     */
    getPoolDetails: async (poolId: string) => {
        return await apiClient.get<any>(`/pooling/${poolId}`);
    },

    /**
     * Create a new pool (Manufacturer only)
     */
    createPool: async (data: { productId: string; targetQuantity: number; expiresAt: string }) => {
        return await apiClient.post<any>('/pooling/create', data);
    },

    /**
     * Join a pool (Dealer)
     */
    joinPool: async (poolId: string, quantity: number) => {
        return await apiClient.post<any>(`/pooling/${poolId}/join`, { quantity });
    }
};
