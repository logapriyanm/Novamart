'use client';

import { use } from 'react';
import { ProductFormProvider } from '@/client/context/ProductFormContext';
import ProductFormWizard from '@/client/components/features/dashboard/manufacturer/product-form/ProductFormWizard';

interface PageProps {
    params: Promise<{
        id: string;
    }>
}

export default function ManufacturerEditProductPage({ params }: PageProps) {
    const { id } = use(params);
    return (
        <ProductFormProvider>
            <ProductFormWizard productId={id} />
        </ProductFormProvider>
    );
}
