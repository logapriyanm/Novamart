import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import SellerClient from './SellerClient';

interface Props {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

// Function to fetch seller data
async function getSeller(id: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

    try {
        const res = await fetch(`${apiUrl}/public/dealers/${id}`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) return null;

        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error('Error fetching seller for metadata:', error);
        return null;
    }
}

// Dynamic Metadata Generation
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const seller = await getSeller(params.id);

    if (!seller) {
        return {
            title: 'Seller Not Found | NovaMart',
        };
    }

    return {
        title: `${seller.businessName} - Verified Seller | NovaMart`,
        description: `Shop from ${seller.businessName} on NovaMart. ${seller.city}, ${seller.state}. ${seller.stats.totalProducts} products available. Verified and trusted.`,
        openGraph: {
            title: `${seller.businessName} | NovaMart Seller`,
            description: `Shop wholesale products from ${seller.businessName}. Secure payments and fast delivery via NovaMart.`,
        },
        alternates: {
            canonical: `https://novamart.com/sellers/${params.id}`
        },
    };
}

export default async function SellerPage({ params }: Props) {
    const seller = await getSeller(params.id);

    // JSON-LD for LocalBusiness or Organization
    const jsonLd = seller ? {
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: seller.businessName,
        image: seller.logo || undefined,
        address: {
            '@type': 'PostalAddress',
            addressLocality: seller.city,
            addressRegion: seller.state,
            addressCountry: 'IN'
        },
        telephone: seller.phone,
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: seller.stats.averageRating,
            reviewCount: seller.stats.reviewCount
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
            <SellerClient id={params.id} initialData={seller} />
        </>
    );
}
