'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaChartBar,
    FaArrowUp,
    FaArrowDown,
    FaArrowLeft,
    FaGlobe,
    FaUserShield,
    FaChartPie,
    FaSync,
    FaCheckCircle
} from 'react-icons/fa';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

const StrategicIntel = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get<any>('/analytics/admin/overview');
            setData(response);
            toast.success('Analytics data refreshed');
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            toast.error('Failed to load strategic intel');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#067FF9]"></div>
            </div>
        );
    }

    const { macroStats, categoryDominance, revenueChart } = data || {};

    return (
        <div className="space-y-8 animate-fade-in pb-12 font-sans text-slate-800">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link href="/admin" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#067FF9] transition-colors w-fit">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase italic">Platform Analytics</h1>
                        <p className="text-slate-500 font-medium text-sm mt-1">Comprehensive system performance and growth metrics</p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-[#067FF9] text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-600 transition-colors flex items-center gap-2">
                        <FaSync className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Macro Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total GMV', value: `₹${macroStats?.quarterlyGMV?.toLocaleString() || '0'}`, change: 'Real-time', isUp: true },
                    { label: 'Active Merchants', value: macroStats?.merchantCount || '0', change: 'Verified Accounts', isUp: true },
                    { label: 'Dispute Ratio', value: macroStats?.disputeRatio || '0%', change: 'Platform Health', isUp: false },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-sm font-medium text-slate-500 mb-4">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                                {stat.isUp ? <FaArrowUp /> : <FaCheckCircle />}
                                {stat.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue/Activity Chart Placeholder - Replacing the "Globe" mock with something more useful if we had Recharts here.
                    Since Recharts isn't imported in this specific file but is used in AdminAnalyticsDashboard, 
                    I'll structure this to display the Category Dominance more prominently and maybe add a summary text list of top performers.
                */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <FaChartBar className="text-[#067FF9]" />
                        Revenue Trends
                    </h3>

                    <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-400 text-sm">
                        {/* If we wanted to re-add recharts here we'd need to import it. for now, simplifying the "Global Supply Density" fluff */}
                        <p>Detailed revenue graphs are available on the main Dashboard.</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <FaChartPie className="text-[#067FF9]" />
                        Category Dominance
                    </h3>
                    <div className="space-y-6">
                        {categoryDominance?.map((cat: any) => (
                            <div key={cat.name} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-600">{cat.name}</span>
                                    <span className="font-bold text-slate-900">{cat.share}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#067FF9]" style={{ width: cat.share }} />
                                </div>
                            </div>
                        )) || <p className="text-sm text-slate-400 italic">No category data available</p>}
                    </div>
                </div>
            </div>

            <div className="bg-[#067FF9] rounded-lg p-8 text-white shadow-lg shadow-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <FaUserShield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Platform Safety Status</h3>
                        <p className="text-blue-100 text-sm">Current Escrow Hold-Index meets safety compliance protocols.</p>
                    </div>
                </div>
                <button className="px-6 py-2.5 bg-white text-[#067FF9] text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-sm">
                    Download Safety Report
                </button>
            </div>
        </div>
    );
};

export default StrategicIntel;

