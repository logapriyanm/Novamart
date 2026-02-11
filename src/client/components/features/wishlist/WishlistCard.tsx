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
    onRemove?: (id: string) => void;
}

export default function WishlistCard({
    id,
    name,
    brand,
    price,
    originalPrice,
    image,
    status,
    dealerId,
    onRemove
}: WishlistItemProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group bg-white rounded-[10px] p-4 border border-foreground/5 hover:border-black/10 hover:shadow-xl transition-all duration-300 relative flex flex-col h-full"
        >
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                {status === 'Price Dropped' && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-[5px]">
                        Price Dropped
                    </span>
                )}
                {status === 'Low Stock' && (
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-600 text-[9px] font-black uppercase tracking-widest rounded-[5px]">
                        Low Stock
                    </span>
                )}
            </div>

            {/* Remove Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onRemove?.(id);
                }}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
            >
                <FaTrash className="w-3 h-3" />
            </button>

            {/* Image */}
            <div className="aspect-[4/3] mb-4 relative flex items-center justify-center bg-background rounded-[10px] overflow-hidden p-4">
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
                        <h3 className="text-sm font-black text-black leading-snug hover:text-black/60 transition-colors line-clamp-2 italic uppercase">
                            {name}
                        </h3>
                    </Link>
                </div>

                <div className="mt-auto pt-4 border-t border-foreground/5">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Starting at</span>
                        <span className="text-lg font-black text-black italic">₹{price.toLocaleString()}</span>
                    </div>

                    <button className="w-full py-3 bg-black text-white rounded-[10px] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/20 active:scale-95 transition-all flex items-center justify-center gap-2 italic">
                        <FaShoppingCart className="w-3.5 h-3.5" />
                        Buy Now
                    </button>
                    {/* Replaced 'Check Dealer Availability' with 'Buy Now' as requested */}
                </div>
            </div>
        </motion.div>
    );
}
