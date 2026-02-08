import { apiClient } from '../client';
import { ENDPOINTS } from '../contract';

export const customerService = {
    async getOrders(): Promise<any[]> {
        return apiClient.get<any[]>(ENDPOINTS.CUSTOMER.ORDERS);
    },

    async getStats(): Promise<any> {
        return apiClient.get<any>(ENDPOINTS.CUSTOMER.STATS);
    },

    async browseProducts(params?: any): Promise<any[]> {
        return apiClient.get<any[]>(ENDPOINTS.CUSTOMER.PRODUCTS, { params });
    }
};

export default customerService;
