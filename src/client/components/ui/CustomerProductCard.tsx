'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaStar as Star,
    FaHeart,
    FaCheckCircle,
    FaShippingFast as Truck
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';
import OptimizedImage from './OptimizedImage';
import VerifiedBadge from '../common/VerifiedBadge';

interface ProductCardProps {
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
}

export default function CustomerProductCard({
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
    highlights
}: ProductCardProps) {
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
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group card-enterprise p-4 transition-all duration-300 hover:shadow-lg hover:border-blue-100 flex flex-col h-full relative"
        >
            {/* Image Container */}
            <div
                className="aspect-[1.1/1] relative overflow-hidden bg-slate-50 rounded-[8px] mb-4 cursor-pointer"
                onClick={() => router.push(`/products/${id}`)}
            >
                <div className="w-full h-full flex items-center justify-center p-4">
                    <OptimizedImage
                        src={image}
                        alt={name}
                        width={300}
                        height={300}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {seller.isVerified && (
                        <div className="shadow-sm z-10 w-fit rounded-full">
                            <VerifiedBadge type="SELLER" size="sm" showText={true} />
                        </div>
                    )}
                    {highlights.freeDelivery && (
                        <div className="px-2 py-1 bg-emerald-50/90 backdrop-blur-sm border border-emerald-100 text-emerald-600 text-sm font-semibold rounded-[4px] flex items-center gap-1 shadow-sm">
                            <Truck className="w-2.5 h-2.5" />
                            Free shipping
                        </div>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isWishlisted ? 'bg-rose-50 text-rose-500' : 'bg-white/60 text-slate-400 hover:bg-white hover:text-rose-500'} backdrop-blur-sm`}
                >
                    <FaHeart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1">
                {/* Brand */}
                <span className="text-sm font-semibold text-slate-400 mb-1.5">
                    {brand}
                </span>

                {/* Product Name */}
                <h3
                    className="font-bold text-slate-800 text-sm leading-relaxed mb-2 line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => router.push(`/products/${id}`)}
                >
                    {name}
                </h3>

                {/* Ratings */}
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />
                        ))}
                    </div>
                    <span className="text-sm font-medium text-slate-400">({reviewsCount})</span>
                </div>

                <div className="mt-auto pt-2 flex items-end justify-between gap-2">
                    <div className="flex flex-col">
                        {originalPrice > price && (
                            <span className="text-sm text-slate-400 line-through font-medium decoration-slate-300">
                                ₹{originalPrice.toLocaleString()}
                            </span>
                        )}
                        <span className="text-lg font-black text-slate-900 tracking-tight">
                            ₹{price.toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={() => router.push(`/products/${id}`)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-[6px] shadow-sm shadow-blue-200 transition-all active:scale-95"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

