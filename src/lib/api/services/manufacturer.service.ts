import { apiClient } from '../client';
import { ENDPOINTS } from '../contract';

export const manufacturerService = {
    async getProfile(): Promise<any> {
        return apiClient.get('/manufacturer/profile');
    },

    async updateProfile(data: any): Promise<any> {
        return apiClient.put('/manufacturer/profile', data);
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

    async handleSellerRequest(sellerId: string, status: string): Promise<any> {
        return apiClient.post('/manufacturer/network/handle', { sellerId, status });
    },

    async allocateStock(productId: string, sellerId: string, region: string, quantity: number, price: number): Promise<any> {
        return apiClient.post('/manufacturer/inventory/allocate', { productId, sellerId, region, quantity, price });
    },

    async updateProduct(id: string, data: any): Promise<any> {
        return apiClient.put(`/products/${id}`, data);
    },

    async deleteProduct(id: string): Promise<any> {
        return apiClient.delete(`/products/${id}`);
    },

    async bulkImport(products: any[]): Promise<any> {
        return apiClient.post('/products/bulk', { products });
    },

    async confirmOrderPayment(orderId: string): Promise<any> {
        return apiClient.patch(`/orders/${orderId}/status`, { status: 'PAID', reason: 'Manufacturer confirmed receipt' });
    }
};

export default manufacturerService;
