'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaShoppingCart } from 'react-icons/fa';

export default function RecentProducts() {
    // Mock data based on design
    const products = [
        {
            id: 1,
            name: 'Premium Wireless Headphones',
            category: 'Electronics',
            price: 299.00,
            image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300'
        },
        {
            id: 2,
            name: 'Minimalist Ceramic Watch',
            category: 'Accessories',
            price: 185.00,
            image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=300'
        },
        {
            id: 3,
            name: 'Speed-Run Elite Sneakers',
            category: 'Footwear',
            price: 120.00,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300'
        },
        {
            id: 4,
            name: 'Retro Instant Film Camera',
            category: 'Cameras',
            price: 89.00,
            image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=300'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[#1E293B]">Recently Viewed Products</h2>
                <Link href="/products" className="flex items-center gap-2 text-xs font-black text-[#0F6CBD] uppercase tracking-wider hover:underline">
                    View All <FaArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white p-4 rounded-[20px] shadow-sm border border-slate-100 group hover:shadow-md transition-all">
                        <div className="aspect-square bg-slate-50 rounded-xl mb-4 overflow-hidden relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="space-y-1 mb-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</p>
                            <h3 className="text-sm font-black text-[#1E293B] line-clamp-1">{product.name}</h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-black text-[#0F6CBD]">₹{product.price.toFixed(2)}</p>
                            <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#1E293B] hover:bg-[#1E293B] hover:text-white transition-colors">
                                <FaShoppingCart className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
