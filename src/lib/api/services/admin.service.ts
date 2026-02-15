import { apiClient } from '../client';
import { ENDPOINTS } from '../contract';

export const adminService = {
    async getDashboardStats(): Promise<any> {
        return apiClient.get('/admin/stats');
    },

    async getUsers(): Promise<any[]> {
        return apiClient.get<any[]>('/admin/users');
    },

    async updateUserStatus(userId: string, status: string): Promise<any> {
        return apiClient.put(`/admin/users/${userId}/status`, { status });
    },

    async getManufacturers(): Promise<any[]> {
        return apiClient.get<any[]>('/admin/manufacturers');
    },

    async getSellers(): Promise<any[]> {
        return apiClient.get<any[]>('/admin/sellers');
    },

    async getPendingProducts(): Promise<any[]> {
        return apiClient.get<any[]>('/admin/products/pending');
    },

    async getAllProducts(): Promise<any[]> {
        return apiClient.get<any[]>('/admin/products');
    },

    async approveProduct(productId: string, isApproved: boolean, rejectionReason?: string, status?: string): Promise<any> {
        return apiClient.put(`/admin/products/${productId}/approve`, { isApproved, rejectionReason, status });
    },

    async getAllOrders(status?: string): Promise<any[]> {
        const query = status ? `?status=${status}` : '';
        return apiClient.get<any[]>(`/admin/orders${query}`);
    },

    async updateOrderStatus(orderId: string, action: string, details: any): Promise<any> {
        return apiClient.put(`/admin/orders/${orderId}/status`, { action, ...details });
    },

    async getAuditLogs(): Promise<any[]> {
        return apiClient.get<any[]>('/admin/audit-logs');
    },

    async verifyManufacturer(id: string, isVerified: boolean): Promise<any> {
        return apiClient.put(`/admin/manufacturers/${id}/verify`, { isVerified });
    },

    async verifySeller(id: string, isVerified: boolean): Promise<any> {
        return apiClient.put(`/admin/sellers/${id}/verify`, { isVerified });
    },

    async updateSellerManufacturers(sellerId: string, manufacturerId: string): Promise<any> {
        return apiClient.put(`/admin/sellers/${sellerId}/manufacturers`, { manufacturerId });
    },

    async getPendingReviews(): Promise<any[]> {
        return apiClient.get<any[]>('/reviews/pending');
    },

    async moderateReview(reviewId: string, type: string, status: string): Promise<any> {
        return apiClient.post('/reviews/moderate', { reviewId, type, status });
    }
};

export default adminService;
