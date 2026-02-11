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
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-100 rounded-[10px] overflow-hidden group transition-all duration-300 flex flex-col h-full relative text-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1"
        >
            {/* Image Container */}
            <div
                className="aspect-square relative overflow-hidden bg-slate-50/50 cursor-pointer group-hover:bg-white transition-colors duration-500 p-4 xs:p-6 flex items-center justify-center"
                onClick={() => router.push(`/products/${id}`)}
            >
                <div className="w-full h-full relative">
                    <OptimizedImage
                        src={image}
                        alt={name}
                        width={400}
                        height={400}
                        className="w-full h-full object-contain transition-all duration-700 group-hover:scale-110"
                    />
                </div>

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {originalPrice > price && (
                        <div className="bg-emerald-500 text-white px-2 py-1 rounded-[5px] text-[8px] font-black uppercase tracking-widest shadow-sm">
                            {Math.round((1 - price / originalPrice) * 100)}% Discount
                        </div>
                    )}
                    {seller.isVerified && (
                        <div className="bg-blue-600 text-white p-1 rounded-full shadow-md" title="Authorized Dealer">
                            <FaCheckCircle className="w-3 h-3" />
                        </div>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isWishlisted ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/80 text-slate-400 border border-slate-100 hover:text-slate-900 backdrop-blur-sm shadow-sm'}`}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <FaHeart className={`w-3 h-3 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Shipping Highlight */}
                {highlights.freeDelivery && (
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-slate-100 px-2 py-1 rounded-[5px] flex items-center gap-1.5 shadow-sm">
                        <Truck className="w-2.5 h-2.5 text-slate-600" />
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Fast Delivery</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-1 bg-white border-t border-slate-50">
                <div className="mb-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {brand}
                    </span>
                    <h3
                        className="font-bold text-slate-800 text-sm leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem] cursor-pointer mt-1"
                        onClick={() => router.push(`/products/${id}`)}
                    >
                        {name}
                    </h3>
                </div>

                {/* Ratings */}
                <div className="flex items-center gap-1.5 mb-4">
                    <div className="flex items-center gap-0.5">
                        <Star className="text-amber-400 fill-current w-3 h-3" />
                        <span className="text-[11px] font-black text-slate-900">{rating}</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-300">({reviewsCount})</span>
                </div>

                {/* Price Section */}
                <div className="mt-auto pt-4 flex flex-col gap-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900">₹{price.toLocaleString()}</span>
                        {originalPrice > price && (
                            <span className="text-xs text-slate-400 line-through font-medium">₹{originalPrice.toLocaleString()}</span>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!inventoryId || !seller.id) {
                                toast.error('This product is unavailable.');
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
                                region: 'National'
                            });
                        }}
                        className="w-full py-3 bg-slate-900 text-white rounded-[10px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-md active:scale-95"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

