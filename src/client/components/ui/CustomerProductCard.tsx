'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaStar as Star,
    FaShieldAlt as ShieldCheck,
    FaShippingFast as Truck,
    FaTools as Tools,
    FaUserCheck as UserCheck,
    FaArrowRight,
    FaHeart
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import OptimizedImage from '../common/OptimizedImage';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    hoverImage?: string;
    rating: number;
    reviewsCount?: number;
    brand: string;
    spec?: string;
    seller: {
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
    name,
    price,
    originalPrice = price * 1.2,
    image,
    rating,
    reviewsCount = 124,
    brand,
    spec = 'Premium Series',
    seller,
    highlights
}: ProductCardProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [isWishlisted, setIsWishlisted] = React.useState(false);

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            router.push(`/auth/login?redirect=/products`);
            return;
        }
        setIsWishlisted(!isWishlisted);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface border border-foreground/5 rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full relative text-foreground"
        >
            {/* 1️⃣ Product Image Container */}
            <div
                className="aspect-square relative overflow-hidden bg-background/50 cursor-pointer group-hover:bg-background transition-colors duration-500"
                onClick={() => router.push(`/products/${id}`)}
            >
                <OptimizedImage
                    src={image}
                    alt={name}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain p-8 transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                    {seller.isVerified && (
                        <div className="bg-primary text-background px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-primary/20">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            Verified Seller
                        </div>
                    )}
                </div>

                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <button
                        onClick={handleWishlist}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isWishlisted ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-background/80 backdrop-blur-md text-foreground/40 border border-foreground/10 hover:text-foreground'}`}
                    >
                        <FaHeart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    {price > 40000 && (
                        <div className="bg-rose-500 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20">
                            Limited Deal
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1 bg-surface">
                {/* 3️⃣ Brand & Spec Row */}
                <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">{brand}</span>
                    <span className="text-foreground/20">•</span>
                    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">{spec}</span>
                </div>

                {/* 4️⃣ Product Name */}
                <h3
                    className="font-black text-foreground text-base leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] cursor-pointer"
                    onClick={() => router.push(`/products/${id}`)}
                >
                    {name}
                </h3>

                {/* 5️⃣ Ratings */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-0.5">
                        <Star className="text-primary fill-current w-3 h-3" />
                        <span className="text-[11px] font-black text-foreground">{rating}</span>
                    </div>
                    <span className="text-[11px] font-bold text-foreground/40">({reviewsCount.toLocaleString()} reviews)</span>
                </div>

                {/* 6️⃣ Price Block */}
                <div className="space-y-1 mb-5">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-foreground">₹{price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-foreground/40 line-through font-bold">₹{originalPrice.toLocaleString()}</span>
                        <span className="text-[11px] font-black text-primary uppercase tracking-widest">
                            {Math.round((1 - price / originalPrice) * 100)}% OFF
                        </span>
                    </div>
                </div>

                {/* 7️⃣ Feature Icons */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 border-t border-foreground/5 pt-5">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-foreground/60 uppercase tracking-wider">
                        <Truck className="w-3.5 h-3.5 text-primary" />
                        Free Delivery
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-foreground/60 uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        2 Yr Warranty
                    </div>
                    {highlights.installation && (
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-foreground/60 uppercase tracking-wider">
                            <Tools className="w-3.5 h-3.5 text-primary" />
                            Install Incl.
                        </div>
                    )}
                </div>

                {/* 8️⃣ Primary CTA */}
                <button
                    onClick={() => router.push(`/products/${id}`)}
                    className="mt-auto w-full py-4 bg-primary text-background font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/25 transform active:scale-95 transition-all duration-300"
                >
                    View Details
                </button>
            </div>
        </motion.div>
    );
}

