import React, { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { ProductsContent } from '@/app/(public)/products/page';
import { productService } from '@/lib/api/services/product.service';

interface Props {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

// Map common slugs to display names if API isn't available, or fetch from API
const getCategoryName = (slug: string) => {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const categoryName = getCategoryName(params.slug);

    return {
        title: `${categoryName} Products | Wholesale Price | NovaMart`,
        description: `Buy ${categoryName} online at wholesale prices from verified manufacturers on NovaMart. Secure payments and fast delivery.`,
        openGraph: {
            title: `${categoryName} | NovaMart Industrial Marketplace`,
            description: `Explore our extensive collection of ${categoryName}. Direct from verified sellers.`,
        },
        alternates: {
            canonical: `https://novamart.com/categories/${params.slug}`
        }
    };
}

export default function CategoryDynamicPage({ params }: Props) {
    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Add schema markup for CollectionPage if needed */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        name: getCategoryName(params.slug),
                        url: `https://novamart.com/categories/${params.slug}`,
                        description: `Wholesale ${getCategoryName(params.slug)} on NovaMart`
                    })
                }}
            />

            {/* Reuse the Product Listing UI with forced category */}
            <Suspense fallback={
                <div className="min-h-screen pt-40 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                </div>
            }>
                <ProductsContent forcedCategory={params.slug} />
            </Suspense>
        </div>
    );
}
