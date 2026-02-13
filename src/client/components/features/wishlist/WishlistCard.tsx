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
    sellerId?: string;
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
    sellerId,
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
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
                <FaTrash className="w-3 h-3" />
            </button>

            {/* Image */}
            <div className="aspect-[4/3] mb-4 relative flex items-center justify-center bg-muted/20 rounded-[10px] overflow-hidden p-4">
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
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{brand}</div>
                    <Link href={`/products/${id}`} className="block">
                        <h3 className="text-sm font-black text-foreground leading-snug hover:text-foreground/60 transition-colors line-clamp-2 italic uppercase">
                            {name}
                        </h3>
                    </Link>
                </div>

                <div className="mt-auto pt-4 border-t border-border">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Starting at</span>
                        <span className="text-lg font-black text-foreground italic">₹{price.toLocaleString()}</span>
                    </div>

                    <button className="btn-primary w-full flex items-center justify-center gap-2 italic">
                        <FaShoppingCart className="w-3.5 h-3.5" />
                        Buy Now
                    </button>
                    {/* Replaced 'Check Dealer Availability' with 'Buy Now' as requested */}
                </div>
            </div>
        </motion.div>
    );
}
