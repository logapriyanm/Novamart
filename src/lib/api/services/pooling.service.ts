import axios from 'axios';
import { getAuthHeader } from '../utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const poolingService = {
    /**
     * Get all active pools
     */
    getPools: async (filters: any = {}) => {
        const response = await axios.get(`${API_URL}/pooling`, {
            headers: getAuthHeader(),
            params: filters
        });
        return response.data.data;
    },

    /**
     * Get specific pool details
     */
    getPoolDetails: async (poolId: string) => {
        const response = await axios.get(`${API_URL}/pooling/${poolId}`, {
            headers: getAuthHeader()
        });
        return response.data.data;
    },

    /**
     * Create a new pool (Manufacturer only)
     */
    createPool: async (data: { productId: string; targetQuantity: number; expiresAt: string }) => {
        const response = await axios.post(`${API_URL}/pooling/create`, data, {
            headers: getAuthHeader()
        });
        return response.data.data;
    },

    /**
     * Join a pool (Dealer)
     */
    joinPool: async (poolId: string, quantity: number) => {
        const response = await axios.post(`${API_URL}/pooling/${poolId}/join`, { quantity }, {
            headers: getAuthHeader()
        });
        return response.data.data;
    }
};
