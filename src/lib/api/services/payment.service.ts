import { apiClient } from '../client';
import { ApiResponse } from '../contract';

export interface PaymentVerifyData {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export const paymentService = {
    async createPaymentOrder(orderId: string): Promise<ApiResponse<any>> {
        return apiClient.post<ApiResponse<any>>('/payments/create-order', { orderId });
    },

    async verifyPayment(data: PaymentVerifyData): Promise<ApiResponse<any>> {
        return apiClient.post<ApiResponse<any>>('/payments/verify', data);
    }
};

export default paymentService;
