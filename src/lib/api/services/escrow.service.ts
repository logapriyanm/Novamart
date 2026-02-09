import { apiClient } from '../client';
import { ENDPOINTS, ApiResponse } from '../contract';

export interface EscrowDetails {
    id: string;
    orderId: string;
    amount: number;
    status: 'HELD' | 'RELEASED' | 'REFUNDED' | 'DISPUTED';
    createdAt: string;
    releasedAt?: string;
}

export const escrowService = {
    async getEscrowDetails(orderId: string): Promise<EscrowDetails> {
        return apiClient.get<EscrowDetails>(ENDPOINTS.ESCROW.GET(orderId));
    },

    async confirmDelivery(orderId: string): Promise<any> {
        return apiClient.post(ENDPOINTS.ESCROW.CONFIRM_DELIVERY, { orderId });
    },

    async requestRefund(orderId: string, reason: string): Promise<any> {
        return apiClient.post(ENDPOINTS.ESCROW.REQUEST_REFUND, { orderId, reason });
    }
};

export default escrowService;
