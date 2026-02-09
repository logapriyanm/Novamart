import { apiClient } from '../client';
import { ApiResponse } from '../contract';

export interface OrderItem {
    inventoryId: string;
    quantity: number;
}

export interface OrderCreateData {
    dealerId: string;
    shippingAddress: string;
    items: OrderItem[];
}

export const orderService = {
    async createOrder(data: OrderCreateData): Promise<ApiResponse<any>> {
        return apiClient.post<ApiResponse<any>>('/orders/create', data);
    },

    async getOrderById(id: string): Promise<ApiResponse<any>> {
        return apiClient.get<ApiResponse<any>>(`/orders/${id}`);
    },

    async getCustomerOrders(): Promise<any[]> {
        return apiClient.get<any[]>('/orders/my');
    },

    async updateStatus(orderId: string, status: string): Promise<ApiResponse<any>> {
        return apiClient.patch<ApiResponse<any>>(`/orders/${orderId}/status`, { status });
    },

    async getPaymentDetails(orderId: string): Promise<ApiResponse<any>> {
        return apiClient.get<ApiResponse<any>>(`/orders/${orderId}/payment`);
    }
};

export default orderService;
