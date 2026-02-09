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
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-slate-800"
                >
                    <HiOutlineRefresh className="w-8 h-8 opacity-50" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12 font-sans text-slate-800">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dealer Portal</h1>
                    <p className="text-sm font-medium text-slate-400 mt-2">Sales Overview & Inventory Management</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dealer/marketplace" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-xs font-semibold tracking-wide shadow-lg shadow-indigo-100">
                        Browse Marketplace
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
                    bgColor="bg-emerald-50/50"
                />
                <StatsCard
                    icon={FaShoppingCart}
                    label="Active Orders"
                    value="14"
                    trend="Processing"
                    color="text-blue-600"
                    bgColor="bg-blue-50/50"
                />
                <StatsCard
                    icon={FaHandshake}
                    label="Negotiations"
                    value="3"
                    trend="Pending"
                    color="text-amber-600"
                    bgColor="bg-amber-50/50"
                />
                <StatsCard
                    icon={FaStore}
                    label="Inventory Value"
                    value="₹12.5L"
                    trend="Healthy"
                    color="text-indigo-600"
                    bgColor="bg-indigo-50/50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Sales Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-bold text-slate-800">Weekly Performance</h3>
                        <div className="flex gap-2">
                            <span className="text-xs font-medium text-slate-400">Total:</span>
                            <span className="text-xs font-bold text-slate-900">₹1,63,000</span>
                        </div>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockSalesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#1e293b', fontSize: '12px', fontWeight: 600 }}
                                />
                                <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity / Status */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-slate-800">Pending Actions</h3>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <FaClock className="w-3 h-3" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">Confirm Receipt for Order #ORD-202{i}</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">
                            View All Tasks
                        </button>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden shadow-lg">
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">Premium Subscription</p>
                            <h3 className="text-lg font-bold mb-1">Platinum Dealer</h3>
                            <p className="text-xs text-slate-400 mb-6">Valid until Dec 2026</p>
                            <button className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-md hover:bg-slate-100 transition-colors">
                                Manage Plan
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, trend, color, bgColor }: any) {
    return (
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">{label}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                </div>
                <div className={`w-10 h-10 ${bgColor} ${color} rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <span className={`text-xs font-medium ${color} bg-white px-1.5 py-0.5 rounded border border-slate-100`}>
                    {trend}
                </span>
                <span className="text-xs text-slate-400">vs last week</span>
            </div>
        </div>
    );
}
