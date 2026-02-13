'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaStar as Star,
    FaHeart,
    FaCheckCircle,
    FaShippingFast as Truck,
    FaBox,
    FaInfoCircle
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';
import OptimizedImage from './OptimizedImage';

interface ProductListRowProps {
    id: string;
    inventoryId?: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviewsCount?: number;
    brand: string;
    spec?: string;
    seller: {
        id?: string;
        name: string;
        isVerified: boolean;
        isTopSeller?: boolean;
    };
    highlights: {
        freeDelivery: boolean;
        installation: boolean;
        warranty: string;
    };
    description?: string;
    stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export default function CustomerProductListRow({
    id,
    inventoryId,
    name,
    price,
    originalPrice = price * 1.2,
    image,
    rating,
    reviewsCount = 124,
    brand,
    spec,
    seller,
    highlights,
    description = "High-performance industrial-grade equipment designed for maximum efficiency and durability in professional environments.",
    stockStatus = 'IN_STOCK'
}: ProductListRowProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const [isWishlisted, setIsWishlisted] = React.useState(false);

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            router.push(`/auth/login?redirect=/products`);
            return;
        }
        const newState = !isWishlisted;
        setIsWishlisted(newState);
        toast.success(newState ? 'Added to wishlist' : 'Removed from wishlist');
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white border border-slate-100 rounded-[12px] p-4 flex flex-col md:flex-row gap-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] items-center md:items-stretch transition-all duration-300"
        >
            {/* Left: Image Section */}
            <div className="w-full md:w-56 h-56 md:h-auto relative bg-slate-50 flex items-center justify-center shrink-0 rounded-[8px] p-4 cursor-pointer" onClick={() => router.push(`/products/${id}`)}>
                <OptimizedImage
                    src={image}
                    alt={name}
                    width={220}
                    height={220}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Center: Content Section */}
            <div className="flex-1 flex flex-col justify-center min-w-0 py-2">
                {/* Badges Row */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-sm font-semibold rounded-[4px]">
                        {brand}
                    </span>
                    {seller.isVerified && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-[4px]">
                            <FaCheckCircle className="w-3 h-3" />
                            Verified seller
                        </div>
                    )}
                </div>

                {/* Product Title */}
                <h3
                    className="text-lg md:text-xl font-bold text-slate-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => router.push(`/products/${id}`)}
                >
                    {name}
                </h3>

                {/* Features List */}
                <ul className="space-y-1 mb-4">
                    <li className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        {spec || 'High Efficiency Cooling'}
                    </li>
                    <li className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        {brand} Premium Technology
                    </li>
                    <li className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        Energy Star Rated
                    </li>
                </ul>

                {/* Bottom Info */}
                <div className="flex items-center gap-4 mt-auto">
                    {highlights.freeDelivery && (
                        <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
                            <Truck className="w-3.5 h-3.5" />
                            Free delivery
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                        <FaInfoCircle className="w-3.5 h-3.5" />
                        {highlights.warranty} warranty
                    </div>
                </div>
            </div>

            {/* Right: Price & Action */}
            <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-slate-100 pl-0 md:pl-6 pt-4 md:pt-0 flex flex-col justify-center gap-4 shrink-0">
                <div className="text-right md:text-right flex items-center justify-between md:block">
                    {originalPrice > price && (
                        <span className="block text-sm text-slate-400 line-through font-medium decoration-slate-300 mb-1">
                            ₹{originalPrice.toLocaleString()}
                        </span>
                    )}
                    <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                            ₹{price.toLocaleString()}
                        </span>
                        {originalPrice > price && (
                            <span className="text-sm font-semibold text-emerald-600">
                                Save ₹{(originalPrice - price).toLocaleString()} ({Math.round((1 - price / originalPrice) * 100)}%)
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-2 w-full">
                    <button
                        onClick={() => router.push(`/products/${id}`)}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-[8px] text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        View Details
                        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </div>
                    </button>
                    {/* Optional secondary button if needed later */}
                </div>
            </div>
        </motion.div>
    );
}
