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
    },

    async getProfile(): Promise<any> {
        return apiClient.get<any>(ENDPOINTS.CUSTOMER.PROFILE);
    },

    async updateProfile(data: any): Promise<any> {
        return apiClient.put<any>(ENDPOINTS.CUSTOMER.PROFILE, data);
    },

    async addAddress(address: any): Promise<any> {
        return apiClient.post<any>('/customer/addresses', address);
    },

    async removeAddress(addressId: string): Promise<any> {
        return apiClient.delete<any>(`/customer/addresses/${addressId}`);
    },

    async updateAddress(addressId: string, address: any): Promise<any> {
        return apiClient.put<any>(`/customer/addresses/${addressId}`, address);
    }
};

export default customerService;
