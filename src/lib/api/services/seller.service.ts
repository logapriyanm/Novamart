import { apiClient } from '../client';
import { ENDPOINTS } from '../contract';

export const sellerService = {
    async getProfile(): Promise<any> {
        return apiClient.get('/seller/profile');
    },

    async updateProfile(data: any): Promise<any> {
        return apiClient.put('/seller/profile', data);
    },

    async getAnalytics(): Promise<any> {
        return apiClient.get('/seller/analytics');
    },

    async getInventory(): Promise<any[]> {
        return apiClient.get<any[]>(ENDPOINTS.SELLER.INVENTORY);
    },

    async updateStock(inventoryId: string, stock: number): Promise<any> {
        return apiClient.patch(`/seller/inventory/${inventoryId}/stock`, { stock });
    },

    async updatePrice(inventoryId: string, price: number): Promise<any> {
        return apiClient.patch(`/seller/inventory/${inventoryId}/price`, { price });
    },

    async getOrders(): Promise<any[]> {
        return apiClient.get<any[]>(ENDPOINTS.SELLER.ORDERS);
    },

    async updateOrderStatus(orderId: string, status: string): Promise<any> {
        return apiClient.patch(`/seller/orders/${orderId}/status`, { status });
    },

    async getPublicProfile(id: string): Promise<any> {
        return apiClient.get(`/seller/public/${id}`);
    }
};

export default sellerService;
