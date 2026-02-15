'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaChartBar,
    FaArrowLeft,
    FaArrowUp,
    FaSync,
    FaCalendarAlt,
    FaGlobe,
    FaTrophy,
    FaIndustry,
    FaUsers
} from 'react-icons/fa';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import Loader from '@/client/components/ui/Loader';

interface ManufacturerAnalytics {
    products: {
        total: number;
        approved: number;
        pending: number;
    };
    network: {
        totalDealers: number;
    };
    orders: {
        total: number;
        recent: number;
        totalRevenue: number;
    };
}

export default function ManufacturerAnalytics() {
    const [stats, setStats] = useState<ManufacturerAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const data = await apiClient.get<any>('/manufacturer/analytics');
            setStats(data || null);
        } catch (error: any) {
            console.error('Analytics error:', error);
            toast.error(error.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader size="lg" variant="primary" />
            </div>
        );
    }



    return (

        <div className="space-y-8 animate-fade-in pb-12 text-slate-900">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/manufacturer" className="flex items-center gap-2 text-sm font-black text-[#067FF9] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Production <span className="text-[#067FF9]">Intel</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">Manufacturing Performance & Network Metrics</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchAnalytics}
                            className="flex items-center gap-2 px-6 py-2 bg-[#067FF9] text-white border border-[#067FF9] rounded-[10px] text-sm font-black uppercase tracking-widest hover:bg-[#067FF9]/90 transition-all"
                        >
                            <FaSync className="w-3 h-3" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Momentum */}
                <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full" />
                    <div className="relative z-10 flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Total Revenue</h2>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1 italic">Realized B2B Income</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-[#067FF9]">₹{(stats?.orders.totalRevenue || 0).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="h-64 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-200">
                        <FaChartBar className="w-16 h-16 opacity-10" />
                        <span className="text-sm font-black uppercase tracking-widest ml-4">Revenue History Graph</span>
                    </div>
                </div>

                {/* Score & Ranking */}
                <div className="space-y-8">
                    <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm divide-y divide-slate-50">
                        {[
                            { label: 'Active Partners', val: stats?.network.totalDealers || 0 },
                            { label: 'Total Orders', val: stats?.orders.total || 0 },
                            { label: 'Product Catalog', val: stats?.products.total || 0 },
                        ].map((s, i) => (
                            <div key={i} className="py-6 first:pt-0 last:pb-0 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                                    <p className="text-lg font-black text-slate-900">{s.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

