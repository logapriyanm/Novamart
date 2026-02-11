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
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';
import OptimizedImage from './OptimizedImage';

interface ProductCardProps {
    id: string; // Product ID
    inventoryId?: string; // Inventory ID for cart (optional for previews)
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
    hoverImage,
    rating,
    reviewsCount = 124,
    brand,
    spec = 'Premium Series',
    seller,
    highlights
}: ProductCardProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    // const { showSnackbar } = useSnackbar();
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
            className="bg-surface border border-foreground/10 rounded-[10px] overflow-hidden group transition-all duration-300 flex flex-col h-full relative text-foreground shadow-sm hover:shadow-xl hover:-translate-y-1"
        >
            {/* 1️⃣ Product Image Container */}
            <div
                className="aspect-square relative overflow-hidden bg-background/50 cursor-pointer group-hover:bg-background transition-colors duration-500"
                onClick={() => router.push(`/products/${id}`)}
            >
                <div className="w-full h-full relative p-8">
                    <OptimizedImage
                        src={image}
                        alt={name}
                        width={400}
                        height={400}
                        className={`w-full h-full object-contain transition-all duration-700 ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`}
                    />
                    {hoverImage && (
                        <OptimizedImage
                            src={hoverImage}
                            alt={`${name} hover`}
                            width={400}
                            height={400}
                            className="absolute inset-0 w-full h-full object-contain p-8 opacity-0 group-hover:opacity-100 transition-all duration-700 scale-105"
                        />
                    )}
                </div>

                {/* Quick Actions Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-2 bg-gradient-to-t from-black/10 to-transparent">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Quick View functionality can be implemented in future
                        }}
                        className="bg-white text-black text-[10px] font-bold px-4 py-2 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors uppercase tracking-widest"
                    >
                        Quick View
                    </button>
                </div>

                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <button
                        onClick={handleWishlist}
                        className={`w-9 h-9 rounded-[10px] flex items-center justify-center transition-all ${isWishlisted ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white/80 text-foreground/40 border border-foreground/10 hover:text-foreground backdrop-blur-sm'}`}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
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
                {/* 4️⃣ Product Name */}
                <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest truncate">
                        {brand}
                    </span>
                    {seller.isVerified && (
                        <div className="flex items-center gap-1 shrink-0">
                            <img src="/verify.png" className="w-3.5 h-3.5 object-contain" alt="Verified" />
                        </div>
                    )}
                </div>
                <h3
                    className="font-black text-foreground text-sm leading-tight mb-3 group-hover:text-black transition-colors line-clamp-2 min-h-[2.5rem] cursor-pointer italic uppercase"
                    onClick={() => router.push(`/products/${id}`)}
                >
                    {name}
                </h3>

                {/* 5️⃣ Ratings */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-0.5">
                        <Star className="text-amber-400 fill-current w-3 h-3" />
                        <span className="text-[11px] font-black text-foreground">{rating}</span>
                    </div>
                    <span className="text-[11px] font-bold text-foreground/40">({reviewsCount.toLocaleString()} reviews)</span>
                </div>

                <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl font-black text-foreground">₹{price.toLocaleString()}</span>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-foreground/40 line-through font-bold">₹{originalPrice.toLocaleString()}</span>
                        <span className="text-[10px] font-black text-black uppercase tracking-widest">
                            {Math.round((1 - price / originalPrice) * 100)}% OFF
                        </span>
                    </div>
                </div>

                {/* 8️⃣ Primary CTA */}
                <div className="mt-auto">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!inventoryId || !seller.id) {
                                alert('This product is currently out of stock or unavailable for purchase.');
                                return;
                            }
                            addToCart({
                                inventoryId,
                                productId: id,
                                name,
                                price,
                                image,
                                quantity: 1,
                                sellerId: seller.id,
                                sellerName: seller.name,
                                region: 'West'
                            });
                        }}
                        className="btn-primary w-full py-4 text-[11px] tracking-[0.2em]"
                        aria-label={`Add ${name} to cart`}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

