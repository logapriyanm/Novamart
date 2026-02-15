'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import Link from 'next/link';
import CustomerProductCard from '../../ui/CustomerProductCard';

interface AIFeaturedProductsProps {
    products: any[];
}

export default function AIFeaturedProducts({ products }: AIFeaturedProductsProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl shadow-lg border border-primary/20">
                        <FaRobot className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight italic flex items-center gap-2">
                            AI <span className="text-primary italic">Featured Picks</span>
                        </h2>
                        <p className="text-sm font-medium text-slate-400 flex items-center gap-1">
                            <HiSparkles className="text-yellow-500 w-2.5 h-2.5" />
                            Smart suggestions based on your behavior
                        </p>
                    </div>
                </div>
                <Link href="/products" className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-primary transition-colors">
                    View Discovery
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative group"
                    >
                        {/* AI Badge Overlay */}
                        <div className="absolute top-6 left-6 z-20 bg-primary shadow-lg shadow-primary/30 text-white text-sm font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 group-hover:scale-110 transition-transform cursor-default">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                            98% Match
                        </div>

                        <CustomerProductCard
                            {...product}
                            image={product.images?.[0] || 'https://via.placeholder.com/300'}
                            price={parseFloat(product.basePrice)}
                            rating={product.averageRating || 4.8}
                            reviewsCount={product.reviewCount || 42}
                            brand={product.manufacturer?.companyName || 'NovaMart'}
                            seller={{ name: 'AI Verified', isVerified: true }}
                            inventoryId={product.inventory?.[0]?._id}
                            stock={product.inventory?.[0]?.stock || 0}
                            highlights={{ freeDelivery: true, installation: true, warranty: '2 Year' }}
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
