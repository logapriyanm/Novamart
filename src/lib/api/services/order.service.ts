import { apiClient } from '../client';
import { ApiResponse } from '../contract';

export interface OrderItem {
    inventoryId: string;
    quantity: number;
}

export interface OrderCreateData {
    sellerId: string;
    shippingAddress: string;
    items: OrderItem[];
}

export const orderService = {
    async createOrder(data: OrderCreateData): Promise<any> {
        return apiClient.post<any>('/orders', data);
    },

    async getOrderById(id: string): Promise<any> {
        return apiClient.get<any>(`/orders/${id}`);
    },

    async getCustomerOrders(): Promise<any[]> {
        return apiClient.get<any[]>('/orders/my');
    },

    async updateStatus(orderId: string, status: string): Promise<any> {
        return apiClient.patch<any>(`/orders/${orderId}/status`, { status });
    },

    async getPaymentDetails(orderId: string): Promise<any> {
        return apiClient.get<any>(`/orders/${orderId}/payment`);
    }
};

export default orderService;
