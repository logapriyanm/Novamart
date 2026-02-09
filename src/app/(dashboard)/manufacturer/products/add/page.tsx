
import React from 'react';
import { ProductFormProvider } from '../../../../../client/context/ProductFormContext';
import ProductFormWizard from '../../../../../client/components/features/dashboard/manufacturer/product-form/ProductFormWizard';

export default function ManufacturerAddProductPage() {
    return (
        <ProductFormProvider>
            <ProductFormWizard />
        </ProductFormProvider>
    );
}
