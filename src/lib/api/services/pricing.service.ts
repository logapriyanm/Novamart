import { apiClient } from '../client';

export interface PricingRule {
    _id: string;
    name: string;
    type: 'BULK' | 'PROMOTIONAL' | 'EXCLUSIVE';
    minQuantity: number;
    discountPercentage: number;
    validFrom: string;
    validUntil?: string;
    isActive: boolean;
    productId?: string | any;
    sellerId?: string | any;
}

export const pricingService = {
    getRules: async (params?: { type?: string, active?: boolean }) => {
        return apiClient.get<PricingRule[]>('/manufacturer/pricing', { params });
    },

    createRule: async (data: Partial<PricingRule>) => {
        return apiClient.post<PricingRule>('/manufacturer/pricing', data);
    },

    deleteRule: async (id: string) => {
        return apiClient.delete(`/manufacturer/pricing/${id}`);
    },

    toggleRuleStatus: async (id: string) => {
        return apiClient.patch<PricingRule>(`/manufacturer/pricing/${id}/toggle`, {});
    }
};
