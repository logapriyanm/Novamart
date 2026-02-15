import { apiClient } from '../client';
import { ApiResponse } from '../contract';
import { Product } from './product.service';

export const wishlistService = {
    async getWishlist(): Promise<Product[]> {
        return apiClient.get<Product[]>('/wishlist');
    },

    async addToWishlist(productId: string): Promise<ApiResponse<any>> {
        return apiClient.post<ApiResponse<any>>('/wishlist', { productId });
    },

    async removeFromWishlist(productId: string): Promise<ApiResponse<any>> {
        return apiClient.delete<ApiResponse<any>>(`/wishlist/${productId}`);
    },

    async toggleWishlist(productId: string): Promise<ApiResponse<any>> {
        return apiClient.post<ApiResponse<any>>('/wishlist/toggle', { productId });
    },

    async clearWishlist(): Promise<ApiResponse<any>> {
        return apiClient.delete<ApiResponse<any>>('/wishlist');
    }
};

export default wishlistService;
