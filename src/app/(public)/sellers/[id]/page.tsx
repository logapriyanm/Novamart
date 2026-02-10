import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import SellerClient from './SellerClient';

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
    const { id } = await params;
    const seller = await getSeller(id);

    if (!seller) {
        return {
            title: 'Seller Not Found | NovaMart',
        };
    }

    return {
        title: `Verified ${seller.role === 'MANUFACTURER' ? 'Manufacturer' : 'Dealer'} – ${seller.businessName} | NovaMart`,
        description: `Connect with ${seller.businessName}, a verified ${seller.role.toLowerCase()} on NovaMart. Located in ${seller.city}, ${seller.state}. Browse their wholesale portfolio and verified products.`,
        openGraph: {
            title: `${seller.businessName} | NovaMart Seller`,
            description: `Shop wholesale products from ${seller.businessName}. Secure payments and fast delivery via NovaMart.`,
        },
        alternates: {
            canonical: `https://novamart.com/sellers/${id}`
        },
    };
}

export default async function SellerPage({ params }: Props) {
    const { id } = await params;
    const seller = await getSeller(id);

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
            <SellerClient id={id} initialData={seller} />
        </>
    );
}

