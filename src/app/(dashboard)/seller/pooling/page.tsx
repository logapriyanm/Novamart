'use client';

import React from 'react';
import PoolList from '@/client/components/features/pooling/PoolList';
import { FaBolt } from 'react-icons/fa';

export default function DealerPoolingPage() {
    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Demand Pooling</h1>
                    <p className="text-sm font-medium text-slate-400 mt-1">Combine orders with other dealers to unlock lower MOQs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-[10px] text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <FaBolt /> Active Beta
                    </div>
                </div>
            </div>

            {/* Content */}
            <PoolList />
        </div>
    );
}
