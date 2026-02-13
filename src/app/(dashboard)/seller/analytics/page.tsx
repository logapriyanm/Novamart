'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaChartBar,
    FaArrowLeft,
    FaArrowUp,
    FaArrowDown,
    FaSync,
    FaCalendarAlt,
    FaGlobe,
    FaTrophy
} from 'react-icons/fa';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import Loader from '@/client/components/ui/Loader';

interface AnalyticsData {
    revenue?: number;
    growth?: number;
    ranking?: number | string;
    returnRate?: number;
    avgPayoutTime?: number;
    repeatClients?: number;
    geoCoverage?: any;
}

export default function SellerAnalytics() {
    const [analytics, setAnalytics] = useState<AnalyticsData>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const data = await apiClient.get<any>('/seller/analytics');
            setAnalytics(data || {});
        } catch (error: any) {
            console.error('Analytics error:', error);
            toast.error(error.message || 'Failed to load analytics');
            // Use fallback data
            setAnalytics({
                revenue: 1420400,
                growth: 18,
                ranking: 12,
                returnRate: 0.8,
                avgPayoutTime: 1.2,
                repeatClients: 12
            });
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
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/seller" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Sales <span className="text-[#10367D]">Intel</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Retail Performance & Demand Analytics</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <FaCalendarAlt className="w-3 h-3 text-[#10367D]" />
                            Last 30 Days
                        </div>
                        <button
                            onClick={fetchAnalytics}
                            className="flex items-center gap-2 px-6 py-2 bg-[#10367D] text-white border border-[#10367D] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#10367D]/90 transition-all"
                        >
                            <FaSync className="w-3 h-3" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Curve Placeholder */}
                <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full" />
                    <div className="relative z-10 flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Revenue Momentum</h2>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Gross Value Transacted (Daily)</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-[#10367D]">₹{(analytics.revenue || 0).toLocaleString()}</p>
                            <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1 justify-end">
                                <FaArrowUp className="w-2 h-2" /> +{analytics.growth || 0}% Monthly
                            </span>
                        </div>
                    </div>

                    <div className="h-64 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-200">
                        <FaChartBar className="w-16 h-16 opacity-10" />
                        <span className="text-[10px] font-black uppercase tracking-widest ml-4">Momentum Graph Terminal</span>
                    </div>
                </div>

                {/* Score & Ranking */}
                <div className="space-y-8">
                    <div className="bg-[#1E293B] rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent" />
                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#10367D] mx-auto mb-6 shadow-xl">
                                <FaTrophy className="w-8 h-8" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Market Ranking</h3>
                            <p className="text-4xl font-black tracking-tight mb-2 italic">#{analytics.ranking || 'N/A'} <span className="text-[#10367D] text-xl">Top Partner</span></p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-6">Based on SLA & Volume</p>
                        </div>
                    </div>

                    <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm divide-y divide-slate-50">
                        {[
                            { label: 'Return Index', val: `${analytics.returnRate || 0}%`, change: '-0.2%', up: false },
                            { label: 'Avg Payout Time', val: `${analytics.avgPayoutTime || 0} Days`, change: '+5%', up: true },
                            { label: 'Repeat Clients', val: `${analytics.repeatClients || 0}%`, change: '+2%', up: true },
                        ].map((s, i) => (
                            <div key={i} className="py-6 first:pt-0 last:pb-0 flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                                    <p className="text-lg font-black text-[#1E293B]">{s.val}</p>
                                </div>
                                <span className={`text-[9px] font-black uppercase ${s.up ? 'text-emerald-500' : 'text-rose-500'}`}>{s.change}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Geographic Coverage */}
            <div className="p-10 bg-blue-50/50 rounded-[3.5rem] border border-[#10367D]/10 flex flex-col md:flex-row items-center gap-12">
                <div className="w-20 h-20 rounded-[2rem] bg-white text-[#10367D] border border-blue-100 flex items-center justify-center shrink-0 shadow-lg">
                    <FaGlobe className="w-10 h-10" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-black tracking-tight">Geo-Spatial Reach</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1 max-w-2xl leading-relaxed">
                        Your retail reach currently covers **8 Major Pincodes**. Expansion into North-East zone would reduce your average shipping TAT by 12 hours.
                    </p>
                </div>
                <button className="px-8 py-4 bg-[#10367D] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all">Download PDF Report</button>
            </div>
        </div>
    );
}

