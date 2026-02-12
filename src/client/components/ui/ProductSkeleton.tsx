import React from 'react';
import { Skeleton } from './Skeleton';

export default function ProductSkeleton() {
    return (
        <div className="bg-white border border-slate-100 rounded-[10px] overflow-hidden flex flex-col h-full shadow-sm">
            {/* Image Skeleton */}
            <div className="aspect-square bg-slate-50 p-6 flex items-center justify-center relative">
                <Skeleton className="w-3/4 h-3/4 rounded-lg" />
                {/* Badge Skeletons */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Skeleton className="w-16 h-5 rounded-[5px]" />
                </div>
                {/* Heart Skeleton */}
                <div className="absolute top-3 right-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-4 flex flex-col flex-1 border-t border-slate-50">
                {/* Brand */}
                <Skeleton className="w-20 h-3 mb-2" />

                {/* Title (2 lines) */}
                <Skeleton className="w-full h-4 mb-1" />
                <Skeleton className="w-2/3 h-4 mb-3" />

                {/* Ratings */}
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="w-24 h-3" />
                </div>

                {/* Price & Button */}
                <div className="mt-auto pt-4 flex flex-col gap-4">
                    <div className="flex items-baseline gap-2">
                        <Skeleton className="w-28 h-6" />
                        <Skeleton className="w-16 h-4" />
                    </div>

                    <Skeleton className="w-full h-10 rounded-[10px]" />
                </div>
            </div>
        </div>
    );
}
