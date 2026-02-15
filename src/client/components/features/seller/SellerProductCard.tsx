'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaStar as Star,
    FaShippingFast as Truck,
    FaEdit,
    FaEye,
    FaEyeSlash,
    FaBoxOpen
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import OptimizedImage from '@/client/components/ui/OptimizedImage';
import VerifiedBadge from '@/client/components/common/VerifiedBadge';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';

interface SellerProductCardProps {
    id: string; // Product ID (for navigation/display)
    inventoryId: string; // Inventory ID (for actions)
    name: string;
    customName?: string;
    price: number;
    originalPrice?: number;
    image: string;
    customImages?: string[];
    rating: number;
    reviewsCount?: number;
    brand: string;
    spec?: string;
    isListed: boolean;
    stock: number;
    highlights?: {
        freeDelivery: boolean;
        installation: boolean;
        warranty: string;
    };
    onToggleListing: (id: string, currentStatus: boolean) => void;
}

export default function SellerProductCard({
    id,
    inventoryId,
    name,
    customName,
    price,
    originalPrice,
    image,
    customImages,
    rating,
    reviewsCount = 0,
    brand,
    isListed,
    stock,
    highlights = { freeDelivery: false, installation: false, warranty: 'Standard' },
    onToggleListing
}: SellerProductCardProps) {
    const router = useRouter();

    const displayImage = (customImages && customImages.length > 0) ? customImages[0] : image;
    const displayName = customName || name;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleListing(inventoryId, isListed);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/seller/products/${inventoryId}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`group card-enterprise p-4 transition-all duration-300 hover:shadow-lg flex flex-col h-full relative border ${isListed ? 'border-emerald-100' : 'border-slate-200 bg-slate-50/50'}`}
        >
            {/* Status Badge */}
            <div className="absolute top-3 left-3 z-10 font-sans">
                <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border shadow-sm ${isListed
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-slate-200 text-slate-600 border-slate-300'
                    }`}>
                    {isListed ? 'Active' : 'Draft'}
                </span>
            </div>

            {/* Actions Overlay */}
            <div className="absolute top-3 right-3 z-10 flex gap-2">
                <button
                    onClick={handleToggle}
                    title={isListed ? "Deactivate" : "Activate"}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm backdrop-blur-sm border ${isListed
                            ? 'bg-white/90 text-emerald-600 border-emerald-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                            : 'bg-white/90 text-slate-400 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
                        }`}
                >
                    {isListed ? <FaEye className="w-3.5 h-3.5" /> : <FaEyeSlash className="w-3.5 h-3.5" />}
                </button>
                <button
                    onClick={handleEdit}
                    title="Edit Details"
                    className="w-8 h-8 rounded-full bg-white/90 text-blue-600 border border-blue-100 flex items-center justify-center transition-all shadow-sm backdrop-blur-sm hover:bg-blue-600 hover:text-white"
                >
                    <FaEdit className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Image Container */}
            <div
                className="aspect-[1.1/1] relative overflow-hidden bg-white rounded-[8px] mb-4 cursor-pointer border border-slate-100"
                onClick={handleEdit}
            >
                <div className="w-full h-full flex items-center justify-center p-4">
                    <OptimizedImage
                        src={displayImage}
                        alt={displayName}
                        width={300}
                        height={300}
                        className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 ${!isListed ? 'grayscale opacity-70' : ''}`}
                    />
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1">
                {/* Brand */}
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 line-clamp-1">
                    {brand}
                </span>

                {/* Product Name */}
                <h3
                    className="font-bold text-slate-800 text-sm leading-relaxed mb-2 line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={handleEdit}
                >
                    {displayName}
                </h3>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-3 text-xs font-medium">
                    <FaBoxOpen className={stock > 0 ? "text-slate-400" : "text-red-400"} />
                    <span className={stock > 10 ? "text-emerald-600" : stock > 0 ? "text-amber-600" : "text-red-600"}>
                        {stock > 0 ? `${stock} Units in Stock` : 'Out of Stock'}
                    </span>
                </div>

                <div className="mt-auto pt-2 flex items-end justify-between gap-2 border-t border-slate-100 pt-3">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium">Selling Price</span>
                        <span className="text-lg font-black text-slate-900 tracking-tight">
                            ₹{price.toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-white hover:border-blue-200 hover:text-blue-600 text-slate-600 text-sm font-bold rounded-[6px] transition-all"
                    >
                        Manage
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
