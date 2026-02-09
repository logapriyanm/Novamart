import { apiClient } from '../client';
import { ENDPOINTS, ApiResponse } from '../contract';

export interface Negotiation {
    id: string;
    dealerId: string;
    manufacturerId: string;
    productId: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED';
    currentPrice: number;
    quantity: number;
    history: any[];
}

export const negotiationService = {
    async createNegotiation(data: { productId: string; quantity: number; proposedPrice: number }): Promise<Negotiation> {
        return apiClient.post<Negotiation>(ENDPOINTS.NEGOTIATION.CREATE, data);
    },

    async getNegotiations(): Promise<Negotiation[]> {
        return apiClient.get<Negotiation[]>(ENDPOINTS.NEGOTIATION.LIST);
    },

    async updateNegotiation(id: string, data: { status: string; counterPrice?: number }): Promise<Negotiation> {
        return apiClient.put<Negotiation>(ENDPOINTS.NEGOTIATION.UPDATE(id), data);
    }
};

export default negotiationService;
