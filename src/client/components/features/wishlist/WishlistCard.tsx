'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaShoppingCart, FaStore } from 'react-icons/fa';
import Link from 'next/link';
import OptimizedImage from '../../ui/OptimizedImage';

interface WishlistItemProps {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    image: string;
    status?: 'Price Dropped' | 'Low Stock' | 'In Stock';
    dealerId?: string;
}

export default function WishlistCard({
    id,
    name,
    brand,
    price,
    originalPrice,
    image,
    status,
    dealerId
}: WishlistItemProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group bg-white rounded-3xl p-4 border border-slate-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300 relative flex flex-col h-full"
        >
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                {status === 'Price Dropped' && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest rounded-lg">
                        Price Dropped
                    </span>
                )}
                {status === 'Low Stock' && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-lg">
                        Low Stock
                    </span>
                )}
            </div>

            {/* Remove Button */}
            <button className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                <FaTrash className="w-3 h-3" />
            </button>

            {/* Image */}
            <div className="aspect-[4/3] mb-4 relative flex items-center justify-center bg-slate-50/50 rounded-2xl overflow-hidden p-4">
                <OptimizedImage
                    src={image}
                    alt={name}
                    width={300}
                    height={300}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
                <div className="mb-2">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{brand}</div>
                    <Link href={`/products/${id}`} className="block">
                        <h3 className="text-sm font-black text-slate-800 leading-snug hover:text-blue-600 transition-colors line-clamp-2">
                            {name}
                        </h3>
                    </Link>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-bold text-slate-400">Starting at</span>
                        <span className="text-lg font-black text-blue-600">₹{price.toLocaleString()}</span>
                    </div>

                    <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <FaShoppingCart className="w-3.5 h-3.5" />
                        Buy Now
                    </button>
                    {/* Replaced 'Check Dealer Availability' with 'Buy Now' as requested */}
                </div>
            </div>
        </motion.div>
    );
}
