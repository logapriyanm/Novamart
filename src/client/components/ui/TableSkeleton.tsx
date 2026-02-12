import React from 'react';
import { Skeleton } from '@/client/components/ui/Skeleton';

export default function TableSkeleton() {
    return (
        <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden animate-pulse">
            {/* Toolbar Skeleton */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <Skeleton className="h-10 w-64 rounded-[10px]" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-24 rounded-[10px]" />
                    <Skeleton className="h-10 w-32 rounded-[10px]" />
                </div>
            </div>

            {/* Table Header */}
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>

            {/* Table Rows */}
            <div className="p-0">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-4 border-b border-slate-50 flex items-center gap-4">
                        <div className="flex items-center gap-3 w-64 shrink-0">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-3 w-3/4" />
                                <Skeleton className="h-2 w-1/2" />
                            </div>
                        </div>
                        <Skeleton className="h-3 flex-1" />
                        <Skeleton className="h-3 flex-1" />
                        <Skeleton className="h-6 w-20 rounded-[5px]" />
                        <Skeleton className="h-8 w-8 rounded-[5px] ml-auto" />
                    </div>
                ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <Skeleton className="h-3 w-32" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-[5px]" />
                    <Skeleton className="h-8 w-8 rounded-[5px]" />
                    <Skeleton className="h-8 w-8 rounded-[5px]" />
                </div>
            </div>
        </div>
    );
}
