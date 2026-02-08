'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';

interface RecommendedSectionProps {
    data: any[];
}

import CustomerProductCard from '../../ui/CustomerProductCard';

interface RecommendedSectionProps {
    data: any[];
}

export default function RecommendedSection({ data }: RecommendedSectionProps) {
    if (!data || data.length === 0) return null;

    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight italic">
                    Recommended <span className="text-blue-600">for you</span>
                </h2>
                <Link href="/products" className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-blue-600 transition-colors">
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.map((product) => (
                    <CustomerProductCard
                        key={product.id}
                        {...product}
                        // Adapter for mismatched property names if necessary
                        image={product.images?.[0] || 'https://via.placeholder.com/300'}
                        price={parseFloat(product.basePrice)}
                        rating={4.5} // Placeholder
                        reviewsCount={120} // Placeholder
                        brand={product.manufacturer?.companyName || 'NovaMart'}
                        seller={{ name: 'Verified Seller', isVerified: true }}
                        highlights={{ freeDelivery: true, installation: false, warranty: '1 Year' }}
                    />
                ))}
            </div>
        </section>
    );
}
