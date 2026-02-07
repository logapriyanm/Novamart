'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { apiClient as api } from '../../lib/api/client';
import { useRouter } from 'next/navigation';

// Define the shape of the product data
interface ProductData {
    name: string;
    description: string;
    category: string;
    basePrice: string;
    moq: string;
    colors: string[];
    sizes: string[];
    images: string[];
    video: string;
    specifications: Record<string, string>;
    [key: string]: any; // Allow flexibility for now
}

interface ProductFormContextType {
    productData: ProductData;
    updateProductData: (updates: Partial<ProductData>) => void;
    submitProduct: (overrides?: Partial<ProductData>) => Promise<void>;
    isSubmitting: boolean;
}

const ProductFormContext = createContext<ProductFormContextType | undefined>(undefined);

export function ProductFormProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [productData, setProductData] = useState<ProductData>({
        name: '',
        description: '',
        category: '',
        basePrice: '',
        moq: '1',
        colors: [],
        sizes: [],
        images: [],
        video: '',
        specifications: {}
    });

    const updateProductData = (updates: Partial<ProductData>) => {
        setProductData(prev => ({ ...prev, ...updates }));
    };

    const submitProduct = async (overrides?: Partial<ProductData>) => {
        setIsSubmitting(true);
        try {
            const data = { ...productData, ...overrides };
            await api.post('/products', data);
            // Redirect or show success
            // For now, we rely on the component to handle redirection or showing the success step
            // But usually we might redirect to product list. 
            // The Wizard has a "Success Step" (Step 7?) or just replaces content.
        } catch (error) {
            console.error('Failed to submit product:', error);
            throw error; // Re-throw to let component handle UI error
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ProductFormContext.Provider value={{ productData, updateProductData, submitProduct, isSubmitting }}>
            {children}
        </ProductFormContext.Provider>
    );
}

export function useProductForm() {
    const context = useContext(ProductFormContext);
    if (context === undefined) {
        throw new Error('useProductForm must be used within a ProductFormProvider');
    }
    return context;
}
