import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import ProductClient from './ProductClient';

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Function to fetch product data
async function getProduct(id: string) {
    // In production, use your actual API URL or DB call
    // Fallback to localhost if env not set
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

    try {
        const res = await fetch(`${apiUrl}/public/products/${id}`, {
            next: { revalidate: 60 } // Revalidate every 60 seconds
        });

        if (!res.ok) {
            // Handle error or return null
            return null;
        }

        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error('Error fetching product for metadata:', error);
        return null;
    }
}

// Dynamic Metadata Generation
export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Product Not Found | NovaMart',
            description: 'The requested product could not be found.'
        };
    }

    const previousImages = (await parent).openGraph?.images || [];
    const mainImage = product.images?.[0] || '/og-image.jpg';

    return {
        title: `${product.name} Price, Specs & Wholesale – NovaMart`,
        description: `Get the best price and full specifications for ${product.name} on NovaMart. Buy wholesale from verified manufacturers and dealers with secure escrow payments.`,
        openGraph: {
            title: product.name,
            description: product.description.substring(0, 200),
            images: [mainImage, ...previousImages],
        },
        alternates: {
            canonical: `https://novamart.com/products/${id}`
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description.substring(0, 200),
            images: [mainImage],
        },
    };
}

// Server Component
export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = await getProduct(id);

    // JSON-LD Structured Data
    const jsonLd = product ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description,
        brand: {
            '@type': 'Brand',
            name: product.manufacturer?.businessName || 'Generic'
        },
        offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'INR',
            lowPrice: product.inventory?.[0]?.price || product.basePrice,
            offerCount: product.inventory?.length || 0,
            availability: product.inventory?.some((i: any) => i.stock > 0)
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock'
        }
    } : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ProductClient id={id} initialData={product} />
        </>
    );
}

