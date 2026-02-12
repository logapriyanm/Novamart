'use client';

import React, { useState, useEffect } from 'react';
import {
    FaBox, FaShoppingCart, FaWallet, FaHandshake,
    FaArrowUp, FaChartBar, FaStore, FaClock
} from 'react-icons/fa';
import { HiOutlineRefresh } from 'react-icons/hi';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/client/hooks/useAuth';
import Loader from '@/client/components/ui/Loader';

const mockSalesData = [
    { name: 'Mon', sales: 12000 },
    { name: 'Tue', sales: 19000 },
    { name: 'Wed', sales: 15000 },
    { name: 'Thu', sales: 22000 },
    { name: 'Fri', sales: 28000 },
    { name: 'Sat', sales: 35000 },
    { name: 'Sun', sales: 32000 },
];

export default function DealerDashboard() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false); // Mock loading for consistency

    // Simulate loading
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-[600px] flex items-center justify-center">
                <div className="min-h-[600px] flex items-center justify-center">
                    <Loader size="xl" variant="primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12 font-sans text-slate-800">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/60 font-sans">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Market <span className="text-primary text-indigo-600">Portal</span></h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Sales Overview & Network Management</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dealer/marketplace" className="px-6 py-2.5 bg-indigo-600 text-white rounded-[10px] hover:bg-indigo-700 transition-all text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center gap-2">
                        <FaStore className="w-3.5 h-3.5" /> Browse Marketplace
                    </Link>
                </div>
            </div>

            {/* Core KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={FaWallet}
                    label="Total Sales"
                    value="₹4.2L"
                    trend="+8%"
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
                <StatsCard
                    icon={FaShoppingCart}
                    label="Active Orders"
                    value="14"
                    trend="Processing"
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <StatsCard
                    icon={FaHandshake}
                    label="Negotiations"
                    value="3"
                    trend="Pending"
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
                <StatsCard
                    icon={FaStore}
                    label="Inventory Value"
                    value="₹12.5L"
                    trend="Healthy"
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Sales Chart */}
                <div className="lg:col-span-2 card-enterprise p-8 bg-white">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Weekly Performance</h3>
                            <p className="text-lg font-bold text-slate-900 mt-1">Sales Velocity</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase">Total Revenue</p>
                                <p className="text-sm font-black text-slate-900 uppercase">₹1,63,000</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-[320px] w-full relative overflow-hidden">
                        {!isLoading && (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <BarChart data={mockSalesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#4f46e5', fontSize: '11px', fontWeight: 800 }}
                                    />
                                    <Bar dataKey="sales" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Recent Activity / Status */}
                <div className="space-y-6">
                    <div className="card-enterprise p-8 bg-white">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Action Queue</h3>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-[10px] hover:bg-slate-50 transition-all table-row-enterprise border border-slate-100/50">
                                    <div className="w-10 h-10 rounded-[10px] bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-sm border border-amber-50/50">
                                        <FaClock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Order #ORD-202{i}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">Confirm receipt to release escrow</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-[10px] hover:bg-slate-100 hover:text-slate-900 transition-all">
                            View Mission Board
                        </button>
                    </div>

                    <div className="bg-indigo-600 rounded-[10px] p-8 text-white relative overflow-hidden shadow-xl group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2 opacity-80">Membership Cluster</p>
                            <h3 className="text-xl font-black mb-1 tracking-tight">Platinum Dealer</h3>
                            <p className="text-[10px] font-bold text-indigo-100/60 mb-8 uppercase tracking-widest">Validated thru Dec 2026</p>
                            <button className="px-6 py-2.5 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:bg-indigo-50 active:scale-[0.98] transition-all shadow-sm">
                                Upgrade Plan
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -ml-12 -mb-12"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, trend, color, bgColor }: any) {
    return (
        <div className="card-enterprise p-6 bg-white flex flex-col justify-between group h-full">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
                </div>
                <div className={`w-12 h-12 ${bgColor} ${color} rounded-[10px] flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ring-1 ring-slate-100`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
                <span className={`text-[9px] font-black uppercase tracking-widest ${color} bg-white px-2 py-1 rounded-[10px] border border-slate-100 shadow-sm`}>
                    {trend}
                </span>
                <span className="text-[10px] font-bold text-slate-400">vs week 4</span>
            </div>
        </div>
    );
}
