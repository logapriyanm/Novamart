import { apiClient } from '../client';

export const homeService = {
    async getPersonalizedHome(): Promise<any> {
        return apiClient.get('/home/personalized');
    },

    async trackEvent(event: string, metadata?: any): Promise<any> {
        return apiClient.post('/home/track', { event, metadata });
    }
};

export default homeService;
