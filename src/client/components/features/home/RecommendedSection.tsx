'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';

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
                {data.map((product) => {
                    const bestInventory = product.inventory?.[0];
                    const displayPrice = bestInventory?.price ? parseFloat(bestInventory.price) : parseFloat(product.basePrice);

                    return (
                        <CustomerProductCard
                            key={product.id}
                            id={product.id}
                            inventoryId={bestInventory?.id} // Critical for Add to Cart
                            name={product.name}
                            image={product.images?.[0] || '/assets/Novamart.png'} // Fallback to logo
                            price={displayPrice}
                            rating={product.averageRating || 4.5}
                            reviewsCount={product.reviewCount || 120}
                            brand={product.manufacturer?.companyName || 'NovaMart'}
                            seller={{
                                id: bestInventory?.sellerId, // Critical for Add to Cart
                                name: bestInventory?.seller?.businessName || 'NovaMart Official',
                                isVerified: product.manufacturer?.isVerified || true
                            }}
                            highlights={{
                                freeDelivery: true,
                                installation: product.category === 'Appliances',
                                warranty: product.specifications?.warranty || '1 Year Manufacturer Warranty'
                            }}
                        />
                    );
                })}
            </div>
        </section>
    );
}
