'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CategoryLayout from '../../../../../client/components/layout/CategoryLayout';

export default function CategoryPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const categoryTitle = slug
        ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : 'Category';

    return (
        <CategoryLayout
            categoryName={categoryTitle}
            description={`Premium selection of high-performance ${categoryTitle.toLowerCase()} for your home and kitchen.`}
            categorySlug={slug}
        />
    );
}
