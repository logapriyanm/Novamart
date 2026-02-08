'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaStar as Star, FaEllipsisH as MoreHorizontal } from 'react-icons/fa';
import OptimizedImage from '../../ui/OptimizedImage';

interface ProductCardProps {
    image: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    stock: number;
    orders: number;
    publishDate: string;
}

export const ProductManagementCard = ({
    image,
    name,
    category,
    price,
    originalPrice,
    discount,
    rating,
    stock,
    orders,
    publishDate
}: ProductCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-surface/40 backdrop-blur-md border border-primary/10 rounded-[2rem] p-5 flex flex-col group"
        >
            {/* Header: Discount & Menu */}
            <div className="flex items-center justify-between mb-4">
                {discount ? (
                    <span className="bg-primary text-background text-[10px] font-black px-2 py-1 rounded-full shadow-lg shadow-primary/20">
                        {discount}%
                    </span>
                ) : <div />}
                <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-surface/40 border border-foreground/5 text-foreground/40 hover:text-primary transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Product Image */}
            <div className="aspect-square rounded-2xl bg-background/50 mb-6 p-4 flex items-center justify-center overflow-hidden border border-foreground/5 transition-transform group-hover:scale-[1.02]">
                <OptimizedImage src={image} alt={name} width={300} height={300} className="w-full h-full object-contain" />
            </div>

            {/* Info */}
            <div className="space-y-2 mb-6">
                <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-primary">${price}</span>
                        {originalPrice && (
                            <span className="text-xs text-foreground/30 font-bold line-through">${originalPrice}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-black text-foreground/70">{rating}</span>
                        <Star className="w-3 h-3 fill-primary text-primary" />
                    </div>
                </div>
                <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-1">{name}</h3>
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">{category}</p>
            </div>

            {/* Footer Metrics */}
            <div className="mt-auto pt-6 border-t border-foreground/5 grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col">
                    <span className="text-xs font-black text-foreground">{stock}</span>
                    <span className="text-[9px] font-bold text-foreground/30 uppercase">Stocks</span>
                </div>
                <div className="flex flex-col border-x border-foreground/5">
                    <span className="text-xs font-black text-foreground">{orders}</span>
                    <span className="text-[9px] font-bold text-foreground/30 uppercase">Orders</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-black text-foreground whitespace-nowrap">{publishDate}</span>
                    <span className="text-[9px] font-bold text-foreground/30 uppercase">Publish</span>
                </div>
            </div>
        </motion.div>
    );
};

