'use client';

import React from 'react';
import CustomerProductCard from '../ui/CustomerProductCard';

const mockProducts = [
    {
        id: '101',
        name: 'Professional Con-Opener Tool',
        price: 22.94,
        originalPrice: 30.00,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400',
        brand: 'FORZA',
        spec: 'Stainless Steel',
        rating: 4.8,
        reviewsCount: 124,
        seller: { name: 'Forza Official', isVerified: true },
        highlights: { freeDelivery: true, installation: false, warranty: '1 Yr Warranty' }
    },
    {
        id: '102',
        name: 'Full Cookware Set (10 Pcs)',
        price: 327.84,
        originalPrice: 420.00,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400',
        brand: 'FORZA',
        spec: 'Non-Stick Coat',
        rating: 4.9,
        reviewsCount: 89,
        seller: { name: 'Kitchen Masters', isVerified: true },
        highlights: { freeDelivery: true, installation: false, warranty: '2 Yr Warranty' }
    },
    {
        id: '103',
        name: 'Double Egg Roller Maker',
        price: 27.84,
        originalPrice: 35.00,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400',
        brand: 'FORZA',
        spec: 'Automatic',
        rating: 4.5,
        reviewsCount: 56,
        seller: { name: 'Home Gadgets', isVerified: false },
        highlights: { freeDelivery: true, installation: true, warranty: '6 Mo Warranty' }
    },
    {
        id: '104',
        name: 'Fish Turner Spatula',
        price: 15.42,
        originalPrice: 20.00,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400',
        brand: 'FORZA',
        spec: 'Heat Resistant',
        rating: 4.7,
        reviewsCount: 231,
        seller: { name: 'Nova Express', isVerified: true },
        highlights: { freeDelivery: true, installation: false, warranty: 'No Warranty' }
    }
];

interface FeaturedProductsGridProps {
    columns?: number;
}

export default function FeaturedProductsGrid({ columns = 4 }: FeaturedProductsGridProps) {
    const gridClass = columns === 5
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

    return (
        <div className={gridClass}>
            {mockProducts.map((product) => (
                <CustomerProductCard key={product.id} {...product} />
            ))}
        </div>
    );
}
