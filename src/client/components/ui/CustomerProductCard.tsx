'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaStar as Star,
    FaHeart,
    FaCheckCircle,
    FaShippingFast as Truck,
    FaShoppingCart
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../hooks/useWishlist';
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
    stock?: number; // Added stock prop
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
    originalPrice, // Optional now, defaults handled in logic
    image,
    rating,
    reviewsCount = 124,
    brand,
    spec,
    stock = 100, // Default to plenty if not provided
    seller,
    highlights
}: ProductCardProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const isWishlisted = isInWishlist(id);

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleWishlist(id);
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!inventoryId) {
            // If no inventory ID (e.g. abstract product), go to details
            router.push(`/products/${id}`);
            return;
        }

        try {
            await addToCart({
                inventoryId,
                productId: id,
                name,
                price,
                image,
                quantity: 1,
                sellerId: seller.id || '',
                sellerName: seller.name,
                stock,
                originalPrice
            });
            // toast handled in addToCart usually, but if not we can add here
        } catch (error) {
            console.error("Add to cart failed", error);
        }
    };

    // Calculate discount
    const hasDiscount = originalPrice && originalPrice > price;
    const discount = hasDiscount ? Math.round(((originalPrice! - price) / originalPrice!) * 100) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group bg-white p-3 rounded-[4px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300 flex flex-col h-full relative border border-transparent hover:border-gray-100 cursor-pointer"
            onClick={() => router.push(`/products/${id}`)}
        >
            {/* Image Container */}
            <div className="aspect-[1/1] relative overflow-hidden bg-white mb-3 cursor-pointer">
                <div className="w-full h-full flex items-center justify-center p-2">
                    <OptimizedImage
                        src={image}
                        alt={name}
                        width={300}
                        height={300}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Top Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
                    {/* Best Seller or other badges could go here */}
                </div>

                {/* Action Icons Top Right */}
                <div className="absolute top-2 right-2 flex items-center gap-2">
                    {seller.isVerified && (
                        <div className="bg-white/90 rounded-full p-1 shadow-sm text-blue-600" title="Verified Seller">
                            <FaCheckCircle className="w-4 h-4" />
                        </div>
                    )}
                    <button
                        onClick={handleWishlist}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-gray-100/80 text-gray-400 hover:bg-gray-200 hover:text-gray-900'}`}
                    >
                        <FaHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1 gap-2">
                {/* Product Name & Verified Tick (Alternative placement if requested, but user said 'near like icon', so kept above) */}
                <h3 className="font-bold text-gray-900 text-[15px] leading-tight line-clamp-2 min-h-[2.5rem]">
                    {name}
                </h3>
                {/* Rating */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                        {rating} <Star className="w-2 h-2" />
                    </span>
                    <span className="text-xs text-gray-500 font-medium">({reviewsCount.toLocaleString()} reviews)</span>
                </div>

                {/* Price Section */}
                <div className="flex items-baseline gap-2 mt-auto">
                    <span className="text-lg font-bold text-gray-900">
                        ₹{price.toLocaleString()}
                    </span>
                    {hasDiscount && (
                        <>
                            <span className="text-sm text-gray-500 line-through">
                                ₹{originalPrice!.toLocaleString()}
                            </span>
                            <span className="text-sm font-bold text-green-600">
                                {discount}% off
                            </span>
                        </>
                    )}
                </div>

                {/* Low Stock Warning */}
                {stock < 10 && stock > 0 && (
                    <div className="text-[10px] font-bold text-red-600 mt-1">
                        Only {stock} left
                    </div>
                )}

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    className="w-full mt-2 py-2.5 bg-black text-white text-sm font-bold rounded-[4px] hover:bg-gray-900 transition-colors uppercase tracking-wide flex items-center justify-center gap-2"
                >
                    <FaShoppingCart className="w-3 h-3" />
                    Add to Cart
                </button>
            </div>
        </motion.div>
    );
}


