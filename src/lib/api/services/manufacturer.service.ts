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
    },

    async updateProduct(id: string, data: any): Promise<any> {
        return apiClient.put(`/products/${id}`, data);
    },

    async deleteProduct(id: string): Promise<any> {
        return apiClient.delete(`/products/${id}`);
    },

    async bulkImport(products: any[]): Promise<any> {
        return apiClient.post('/products/bulk', { products });
    }
};

export default manufacturerService;
