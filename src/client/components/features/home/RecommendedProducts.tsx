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

export default function RecommendedProducts({ title, products }: RecommendedProductsProps) {
    if (!products || products.length === 0) return null;

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <FaStar className="text-amber-400" /> {title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`} className="group">
                        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-50">
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/300'}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                                    <FaHeart />
                                </button>
                            </div>

                            <h3 className="font-bold text-slate-800 mb-1 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                {product.name}
                            </h3>

                            <div className="flex items-center gap-1 mb-3">
                                <FaStar className="text-amber-400 w-3 h-3" />
                                <span className="text-xs font-bold text-slate-500">{product.rating || 4.5}</span>
                            </div>

                            <div className="mt-auto flex items-center justify-between">
                                <p className="text-lg font-black text-slate-900">₹{product.basePrice.toLocaleString()}</p>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
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
