'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import CustomerProductCard from '../../ui/CustomerProductCard';

interface ComboOfferProductsProps {
    products: any[];
}

export default function ComboOfferProducts({ products }: ComboOfferProductsProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="mb-16 bg-surface/50 rounded-[3rem] p-8 border border-foreground/5 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />

            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-emerald-500/20">
                        <FaBoxOpen />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                            Combo <span className="text-emerald-600">Bundle Savings</span>
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Buy more, save more on essential pairs</p>
                    </div>
                </div>
                <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Limited Time Bundles</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product, idx) => (
                    <div key={product.id} className="relative">
                        {idx < products.length - 1 && (
                            <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-slate-100 rounded-full items-center justify-center shadow-md">
                                <FaPlus className="text-emerald-500 w-3 h-3" />
                            </div>
                        )}
                        <CustomerProductCard
                            {...product}
                            image={product.images?.[0] || 'https://via.placeholder.com/300'}
                            price={parseFloat(product.basePrice)}
                            rating={4.7}
                            reviewsCount={89}
                            brand={product.manufacturer?.companyName || 'NovaMart'}
                            seller={{ name: 'Verified Bundle', isVerified: true }}
                            highlights={{ freeDelivery: true, installation: true, warranty: '1 Year' }}
                        />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] bg-emerald-500 text-white text-[8px] font-black py-1 rounded-full uppercase tracking-widest text-center shadow-lg shadow-emerald-900/20 pointer-events-none">
                            Save 15% in Combo
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link href="/products?q=combo" className="inline-flex items-center gap-3 text-xs font-black text-[#10367D] uppercase tracking-widest hover:gap-4 transition-all">
                    View All Combo Offers
                    <div className="w-6 h-6 bg-[#10367D] rounded-lg text-white flex items-center justify-center">
                        <FaPlus className="w-2.5 h-2.5" />
                    </div>
                </Link>
            </div>
        </section>
    );
}
