import { apiClient } from '../client';
import { ENDPOINTS } from '../contract';

export const adminService = {
    async getDashboardStats(): Promise<any> {
        return apiClient.get('/admin/stats');
    },

    async getUsers(): Promise<any[]> {
        return apiClient.get<any[]>(ENDPOINTS.ADMIN.USERS);
    },

    async updateUserStatus(userId: string, status: string): Promise<any> {
        return apiClient.patch(`/admin/users/${userId}/status`, { status });
    },

    async getPendingProducts(): Promise<any[]> {
        return apiClient.get<any[]>('/admin/products/pending');
    },

    async approveProduct(productId: string): Promise<any> {
        return apiClient.patch(`/admin/products/${productId}/approve`, {});
    },

    async rejectProduct(productId: string, reason: string): Promise<any> {
        return apiClient.patch(`/admin/products/${productId}/reject`, { reason });
    },

    async getAuditLogs(): Promise<any[]> {
        return apiClient.get<any[]>('/admin/audit-logs');
    },

    async getManufacturers(): Promise<any[]> {
        return apiClient.get<any[]>('/admin/manufacturers');
    },

    async getDealers(): Promise<any[]> {
        return apiClient.get<any[]>('/admin/dealers');
    },

    async verifyManufacturer(id: string, isVerified: boolean): Promise<any> {
        return apiClient.put(`/admin/manufacturers/${id}/verify`, { isVerified });
    },

    async verifyDealer(id: string, isVerified: boolean): Promise<any> {
        return apiClient.put(`/admin/dealers/${id}/verify`, { isVerified });
    }
};

export default adminService;
