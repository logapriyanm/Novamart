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

    async getInventoryItem(id: string): Promise<any> {
        return apiClient.get(`/seller/inventory/${id}`);
    },

    async updateStock(inventoryId: string, stock: number): Promise<any> {
        return apiClient.put('/seller/inventory/stock', { inventoryId, stock });
    },

    async updatePrice(inventoryId: string, price: number): Promise<any> {
        return apiClient.put('/seller/inventory/price', { inventoryId, price });
    },

    async getOrders(): Promise<any[]> {
        return apiClient.get<any[]>(ENDPOINTS.SELLER.ORDERS);
    },

    async updateOrderStatus(orderId: string, status: string): Promise<any> {
        return apiClient.patch(`/seller/orders/${orderId}/status`, { status });
    },

    async getPublicProfile(id: string): Promise<any> {
        return apiClient.get(`/seller/public/${id}`);
    },

    async sourceProduct(productId: string, region: string, stock: number, price: number): Promise<any> {
        return apiClient.post('/seller/source', { productId, region, stock, price });
    },

    async toggleListing(inventoryId: string, isListed: boolean): Promise<any> {
        return apiClient.put('/seller/inventory/toggle-listing', { inventoryId, isListed });
    }
};

export default sellerService;
