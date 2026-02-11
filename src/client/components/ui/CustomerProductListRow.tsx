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
            className="bg-white border border-slate-100 rounded-[10px] overflow-hidden group transition-all duration-300 flex flex-col md:flex-row shadow-sm hover:shadow-md h-full md:h-64"
        >
            {/* Left: Image Section */}
            <div className="w-full md:w-64 h-64 md:h-full relative bg-slate-50/50 p-6 flex items-center justify-center shrink-0 border-r border-slate-50">
                <div className="relative w-full h-full cursor-pointer" onClick={() => router.push(`/products/${id}`)}>
                    <OptimizedImage
                        src={image}
                        alt={name}
                        width={300}
                        height={300}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
                <button
                    onClick={handleWishlist}
                    className={`absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center transition-all ${isWishlisted ? 'bg-rose-500 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:text-slate-600 shadow-sm'}`}
                >
                    <FaHeart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                {originalPrice > price && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-2.5 py-1 rounded-[5px] text-[9px] font-black uppercase tracking-widest shadow-sm">
                        {Math.round((1 - price / originalPrice) * 100)}% OFF
                    </div>
                )}
            </div>

            {/* Center: Content Section */}
            <div className="flex-1 p-6 flex flex-col min-w-0">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{brand}</span>
                    <span className="text-slate-200">|</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{spec || 'Industrial Model'}</span>
                </div>

                <h3
                    className="text-lg font-bold text-slate-800 mb-2 cursor-pointer hover:text-blue-600 transition-colors truncate"
                    onClick={() => router.push(`/products/${id}`)}
                >
                    {name}
                </h3>

                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-slate-400">({reviewsCount} Technical Reviews)</span>
                </div>

                <p className="text-sm text-slate-500 line-clamp-2 md:line-clamp-3 mb-4 leading-relaxed max-w-2xl">
                    {description}
                </p>

                <div className="mt-auto flex flex-wrap gap-3">
                    {seller.isVerified && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#0F6CBD] rounded-[5px] text-[10px] font-black uppercase tracking-wider">
                            <FaCheckCircle className="w-3 h-3" />
                            Authorized Distributor
                        </div>
                    )}
                    {highlights.freeDelivery && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-[5px] text-[10px] font-black uppercase tracking-wider">
                            <Truck className="w-3 h-3" />
                            Fast Shipping
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-[5px] text-[10px] font-black uppercase tracking-wider">
                        <FaBox className="w-3 h-3" />
                        Stock: {stockStatus === 'IN_STOCK' ? 'Available' : stockStatus === 'LOW_STOCK' ? 'Limited' : 'Expected Soon'}
                    </div>
                </div>
            </div>

            {/* Right: Actions Section */}
            <div className="w-full md:w-64 p-6 border-t md:border-t-0 md:border-l border-slate-50 bg-slate-50/30 flex flex-col justify-center items-center md:items-start text-center md:text-left shrink-0">
                <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900">₹{price.toLocaleString()}</span>
                        {originalPrice > price && (
                            <span className="text-sm text-slate-400 line-through font-medium">₹{originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Excl. VAT & Shipping</p>
                </div>

                <div className="w-full space-y-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!inventoryId || !seller.id) {
                                toast.error('This product is currently unavailable.');
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
                        className="w-full py-3.5 bg-blue-600 text-white rounded-[10px] text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                        Add to Cart
                    </button>
                    <button
                        onClick={() => router.push(`/products/${id}`)}
                        className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 rounded-[10px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                        View Details
                    </button>
                </div>

                <label className="mt-4 flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Compare product</span>
                </label>
            </div>
        </motion.div>
    );
}
