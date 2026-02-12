import React from 'react';
import { Skeleton } from '@/client/components/ui/Skeleton';

export default function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse pb-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/60">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 rounded-[5px]" />
                    <Skeleton className="h-3 w-64 rounded-[5px]" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-32 rounded-[10px]" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-6 bg-white rounded-[10px] border border-slate-100 shadow-sm flex flex-col justify-between h-32">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                            <Skeleton className="h-10 w-10 rounded-[10px]" />
                        </div>
                        <Skeleton className="h-5 w-24 rounded-[10px]" />
                    </div>
                ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="xl:col-span-2 p-8 bg-white rounded-[10px] border border-slate-100 shadow-sm h-[400px]">
                    <div className="flex justify-between mb-8">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-6 w-48" />
                        </div>
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="w-full h-[280px] rounded-[10px]" />
                </div>

                {/* Activity Feed Section */}
                <div className="p-8 bg-white rounded-[10px] border border-slate-100 shadow-sm h-[400px] flex flex-col">
                    <div className="flex justify-between mb-8">
                        <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="space-y-4 flex-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="w-3 h-3 rounded-full mt-1" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-3 w-3/4" />
                                    <Skeleton className="h-2 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Skeleton className="h-4 w-32 mx-auto mt-4" />
                </div>
            </div>
        </div>
    );
}
