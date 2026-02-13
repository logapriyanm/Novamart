import React from 'react';
import { Metadata } from 'next';
import CategoryLayout from '@/client/components/layout/CategoryLayout';

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { slug } = await params;

    // Capitalize Slug for Title (e.g., "washing-machines" -> "Washing Machines")
    const title = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return {
        title: `${title} | NovaMart Wholesale`,
        description: `Browse our extensive collection of ${title.toLowerCase()} from verified manufacturers. Best wholesale prices and bulk deals available.`,
        openGraph: {
            title: `${title} - NovaMart Wholesale Marketplace`,
            description: `Buy ${title} in bulk directly from manufacturers. Secure payments and verified quality.`,
            type: 'website',
        },
        alternates: {
            canonical: `https://novamart.com/products/category/${slug}`
        }
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;

    return (
        <CategoryLayout
            categorySlug={slug}
        />
    );
}
