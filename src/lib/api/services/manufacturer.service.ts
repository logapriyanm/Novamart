import { apiClient } from '../client';
import { ENDPOINTS } from '../contract';

export const manufacturerService = {
    async getProfile(): Promise<any> {
        return apiClient.get('/manufacturer/profile');
    },

    async getStats(): Promise<any> {
        return apiClient.get('/manufacturer/stats');
    },

    async getProducts(): Promise<any[]> {
        return apiClient.get<any[]>(ENDPOINTS.MANUFACTURER.PRODUCTS);
    },

    async getOrders(): Promise<any[]> {
        return apiClient.get<any[]>(ENDPOINTS.MANUFACTURER.ORDERS);
    },

    async handleDealerRequest(dealerId: string, status: string): Promise<any> {
        return apiClient.post('/manufacturer/dealers/handle', { dealerId, status });
    },

    async allocateStock(productId: string, dealerId: string, region: string, quantity: number, price: number): Promise<any> {
        return apiClient.post('/manufacturer/inventory/allocate', { productId, dealerId, region, quantity, price });
    }
};

export default manufacturerService;
