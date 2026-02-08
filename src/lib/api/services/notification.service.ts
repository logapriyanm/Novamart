import { apiClient } from '../client';

export const notificationService = {
    async getNotifications(): Promise<any[]> {
        return apiClient.get<any[]>('/notifications');
    },

    async markAsRead(id: string): Promise<any> {
        return apiClient.put(`/notifications/${id}/read`, {});
    },

    async markAllAsRead(): Promise<any> {
        return apiClient.put('/notifications/read-all', {});
    }
};

export default notificationService;
