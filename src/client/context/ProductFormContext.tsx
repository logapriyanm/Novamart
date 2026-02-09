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
    images: string[];
    specifications: Record<string, string>;
    // New fields for appliances
    mainCategory?: string;
    subCategory?: string;
    powerConsumption?: string;
    capacity?: string;
    energyRating?: string;
    installationType?: string;
    usageType?: string;
    warranty?: string;
    isSmart?: boolean;
    [key: string]: any;
}

interface ProductFormContextType {
    productData: ProductData;
    updateProductData: (updates: Partial<ProductData>) => void;
    submitProduct: (overrides?: Partial<ProductData>) => Promise<any>;
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
        mainCategory: '',
        subCategory: '',
        basePrice: '',
        moq: '1',
        images: [],
        specifications: {},
        // Defaults
        powerConsumption: '',
        capacity: '',
        energyRating: '',
        installationType: '',
        usageType: '',
        warranty: '',
        isSmart: false
    });

    const updateProductData = (updates: Partial<ProductData>) => {
        setProductData(prev => ({ ...prev, ...updates }));
    };

    const submitProduct = async (overrides?: Partial<ProductData>) => {
        setIsSubmitting(true);
        try {
            const data = { ...productData, ...overrides };
            const response = await api.post<any>('/products', data);
            router.push('/manufacturer/products');
            return response;
        } catch (error) {
            console.error('Failed to submit product:', error);
            throw error;
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
