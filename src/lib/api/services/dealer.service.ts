import { apiClient } from '../client';
import { ENDPOINTS } from '../contract';

export const dealerService = {
    async getAnalytics(): Promise<any> {
        return apiClient.get('/dealer/analytics');
    },

    async getInventory(): Promise<any[]> {
        return apiClient.get<any[]>(ENDPOINTS.DEALER.INVENTORY);
    },

    async updateStock(inventoryId: string, stock: number): Promise<any> {
        return apiClient.patch(`/dealer/inventory/${inventoryId}/stock`, { stock });
    },

    async updatePrice(inventoryId: string, price: number): Promise<any> {
        return apiClient.patch(`/dealer/inventory/${inventoryId}/price`, { price });
    },

    async getOrders(): Promise<any[]> {
        return apiClient.get<any[]>(ENDPOINTS.DEALER.ORDERS);
    },

    async updateOrderStatus(orderId: string, status: string): Promise<any> {
        return apiClient.patch(`/dealer/orders/${orderId}/status`, { status });
    },

    async getPublicProfile(id: string): Promise<any> {
        return apiClient.get(`/dealer/public/${id}`);
    }
};

export default dealerService;
