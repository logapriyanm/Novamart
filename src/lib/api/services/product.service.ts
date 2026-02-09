import { apiClient } from '../client';
import { ENDPOINTS, ApiResponse } from '../contract';

export interface Product {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    category: string;
    images: string[];
    brand?: string;
    spec?: string;
    rating?: number;
    reviewsCount?: number;
    manufacturerId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    inventory?: any[];
    manufacturer?: any;
    averageRating?: number;
    reviewCount?: number;
    specifications?: any;
    subCategory?: string;
}

export const productService = {
    async getAllProducts(params?: any): Promise<Product[]> {
        return apiClient.get<Product[]>(ENDPOINTS.PUBLIC.PRODUCTS, { params });
    },

    async getProductById(id: string): Promise<Product> {
        return apiClient.get<Product>(`${ENDPOINTS.PUBLIC.PRODUCTS}/${id}`);
    },

    async getCategories(): Promise<string[]> {
        return apiClient.get<string[]>(ENDPOINTS.PUBLIC.CATEGORIES);
    },

    async getManufacturerProducts(): Promise<Product[]> {
        return apiClient.get<Product[]>(ENDPOINTS.MANUFACTURER.PRODUCTS);
    },

    async createProduct(data: any): Promise<Product> {
        return apiClient.post<Product>(ENDPOINTS.MANUFACTURER.PRODUCTS, data);
    }
};

export default productService;
