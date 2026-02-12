import React, { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import ProductsClient from './ProductsClient';
import Loader from '@/client/components/ui/Loader';

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
    { searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const sParams = await searchParams;
    const category = sParams.cat as string;
    const query = sParams.q as string;

    let title = 'Shop Quality Products | Wholesale & Retail – NovaMart';
    let description = 'Browse our extensive collection of high-quality products across various industrial and consumer categories. Secure payments and wholesale pricing.';

    if (category) {
        const formattedCategory = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        title = `Buy ${formattedCategory} Online | Wholesale & Retail – NovaMart`;
        description = `Find the best deals on ${formattedCategory} on NovaMart. Browse verified sellers and manufacturers for wholesale ${formattedCategory}.`;
    } else if (query) {
        title = `Search results for "${query}" | NovaMart Portfolio`;
        description = `Viewing products matching "${query}" on NovaMart. Secure B2B2C marketplace with escrow protection.`;
    }

    return {
        title,
        description,
        alternates: {
            canonical: '/products',
        },
        openGraph: {
            title,
            description,
        }
    };
}

export default async function ProductsPage({ searchParams }: Props) {
    const sParams = await searchParams;
    const category = sParams.cat as string;
    const description = category
        ? `Find the best deals on ${category} on NovaMart. Browse verified sellers and manufacturers for wholesale ${category}.`
        : 'Browse our extensive collection of high-quality products across various industrial and consumer categories.';

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": category ? `${category} Products` : "NovaMart Product Inventory",
        "description": description,
        "url": `https://novamart.com/products${category ? `?cat=${category}` : ''}`
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />
            <Suspense fallback={
                <div className="min-h-screen pt-40 flex items-center justify-center">
                    <Loader size="lg" variant="primary" />
                </div>
            }>
                <ProductsClient />
            </Suspense>
        </>
    );
}
