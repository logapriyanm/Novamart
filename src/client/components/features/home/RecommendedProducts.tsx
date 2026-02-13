'use client';

import React from 'react';
import Link from 'next/link';
import { FaStar, FaHeart } from 'react-icons/fa';

interface Product {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    images: string[];
    rating: number;
}

interface RecommendedProductsProps {
    title: string;
    products: Product[];
}

import { useAuth } from '@/client/hooks/useAuth';

export default function RecommendedProducts({ title, products }: RecommendedProductsProps) {
    const { user } = useAuth();

    // Strict safeguard: Personalized products should only be visible to logged-in users
    if (!user) return null;

    if (!products || products.length === 0) return null;

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                <FaStar className="text-black" /> {title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`} className="group">
                        <div className="bg-white rounded-[10px] p-4 border border-foreground/5 shadow-sm hover:border-black/20 transition-all duration-300 h-full flex flex-col">
                            <div className="relative aspect-square rounded-[10px] overflow-hidden mb-4 bg-slate-50 border border-foreground/5">
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/300'}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <button className="absolute top-3 right-3 p-2 bg-white text-foreground/40 hover:text-rose-500 transition-colors border border-foreground/5 rounded-[10px]">
                                    <FaHeart />
                                </button>
                            </div>

                            <h3 className="font-bold text-black mb-1 line-clamp-2 leading-tight uppercase text-xs group-hover:text-black transition-colors">
                                {product.name}
                            </h3>

                            <div className="flex items-center gap-1 mb-3">
                                <FaStar className="text-black w-3 h-3" />
                                <span className="text-xs font-bold text-foreground/40">{product.rating || 4.5}</span>
                            </div>

                            <div className="mt-auto flex items-center justify-between">
                                <p className="text-lg font-black text-black">₹{product.basePrice.toLocaleString()}</p>
                                <span className="text-sm font-semibold text-black bg-black/5 border border-foreground/5 px-3 py-1.5 rounded-[10px] group-hover:bg-black group-hover:text-white transition-colors">
                                    View
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
