import { apiClient } from '../client';

export const cartService = {
    async getCart(): Promise<any> {
        return apiClient.get('/cart');
    },

    async addToCart(inventoryId: string, quantity: number, color?: string, size?: string): Promise<any> {
        return apiClient.post('/cart/add', { inventoryId, quantity, color, size });
    },

    async updateQuantity(cartItemId: string, quantity: number): Promise<any> {
        return apiClient.put('/cart/update', { cartItemId, quantity });
    },

    async removeFromCart(cartItemId: string): Promise<any> {
        return apiClient.delete(`/cart/remove/${cartItemId}`);
    },

    async clearCart(): Promise<any> {
        return apiClient.delete('/cart/clear');
    },

    async syncCart(items: { inventoryId: string; quantity: number }[]): Promise<any> {
        return apiClient.post('/cart/sync', { items });
    }
};

export default cartService;
