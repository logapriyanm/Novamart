'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaStore,
    FaShoppingCart,
    FaBox,
    FaWallet,
    FaStar,
    FaChartLine,
    FaPlus,
    FaArrowRight,
    FaRegClock,
    FaCheckCircle,
    FaEllipsisV,
    FaSync,
    FaUserCircle,
    FaShieldAlt
} from 'react-icons/fa';
import Link from 'next/link';

const stats = [
    { name: 'Total Revenue', value: '₹14.2L', icon: FaWallet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Active Orders', value: '18 Units', icon: FaShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Inventory Count', value: '840 Skus', icon: FaBox, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { name: 'Store Rating', value: '4.85 / 5', icon: FaStar, color: 'text-amber-500', bg: 'bg-amber-50' },
];

const recentOrders = [
    { id: 'ORD-RT-770', customer: 'Aryan Sharma', status: 'Processing', total: '₹12,400', date: '12m ago' },
    { id: 'ORD-RT-769', customer: 'Priya Patel', status: 'Shipped', total: '₹4,500', date: '2h ago' },
    { id: 'ORD-RT-768', customer: 'Rahul Verma', status: 'Delivered', total: '₹22,100', date: 'Yesterday' },
];

export default function DeepDealerDashboard() {
    const [userStatus] = useState<'PENDING' | 'APPROVED'>('APPROVED');
    const [batchId] = useState('DLR-MU-2026-X4401');

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[#10367D] flex items-center justify-center text-white shadow-lg">
                            <FaStore className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Retail <span className="text-[#10367D]">Command</span></h1>
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1 ml-1">Verified Supply Chain Bridge & Consumer Sales Oversight</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Batch ID</p>
                            <p className="text-xs font-black text-[#10367D] tracking-wider">{batchId}</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#10367D] flex items-center justify-center border border-blue-100">
                            <FaShieldAlt className="w-4 h-4" />
                        </div>
                    </div>
                    <Link href="/dealer/inventory" className="px-8 py-3 bg-[#10367D] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center gap-3">
                        <FaPlus className="w-3 h-3" />
                        List Retail Product
                    </Link>
                </div>
            </div>

            {/* Performance Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#10367D]/5 transition-all group">
                        <div className="flex items-center justify-between mb-8">
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-emerald-500 text-[10px] font-black bg-emerald-50 px-2 py-1 rounded-lg">+12.4%</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
                            <h3 className="text-2xl font-black text-[#1E293B]">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Active Orders Stream */}
                <div className="xl:col-span-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Client Order Stream</h2>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Retail Fulfillment Pipeline</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-[10px] font-black text-[#10367D] uppercase tracking-widest rounded-xl hover:bg-[#10367D] hover:text-white transition-all border border-[#10367D]/10">
                            <FaSync className="w-3 h-3" />
                            Refresh
                        </button>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="p-8 hover:bg-slate-50 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#10367D] group-hover:text-white transition-all">
                                        <FaUserCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-[#1E293B]">{order.customer}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-black text-[#10367D] uppercase tracking-widest">{order.id}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-base font-black text-[#1E293B]">{order.total}</p>
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-emerald-100 text-emerald-700'
                                            }`}>{order.status}</span>
                                    </div>
                                    <button className="p-4 bg-white border border-slate-100 text-[#10367D] rounded-xl hover:bg-[#10367D] hover:text-white transition-all">
                                        <FaArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-10 border-t border-slate-50 text-center">
                        <Link href="/dealer/orders" className="text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:underline">View All Active Orders</Link>
                    </div>
                </div>

                {/* Sourcing & Trust Corner */}
                <div className="xl:col-span-4 space-y-8">
                    <Link href="/dealer/source" className="block group">
                        <div className="bg-[#1E293B] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10367D]/20 blur-2xl rounded-full group-hover:bg-[#10367D]/40 transition-colors" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-60 flex items-center gap-3">
                                <FaSync className="w-4 h-4 text-blue-400" />
                                Inventory Sourcing
                            </h3>
                            <div className="space-y-4">
                                <p className="text-2xl font-black tracking-tight group-hover:text-blue-400 transition-colors">Browse Bulk Catalog</p>
                                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                                    Connect directly with verified Manufacturers. Settle bulk purchase requests and restock your retail units.
                                </p>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#10367D]">Manufacturer Network Enabled</span>
                                <FaArrowRight className="text-blue-400 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </Link>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                            <FaChartLine className="text-emerald-500" />
                            Market Intelligence
                        </h3>
                        <div className="space-y-6">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Demand Forecast</p>
                                <p className="text-sm font-black text-[#1E293B]">High demand surge for **Modern Kitchen Gear** in your region.</p>
                            </div>
                            <button className="w-full py-4 bg-[#10367D]/5 text-[#10367D] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#10367D] hover:text-white transition-all">
                                View Full Analytics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

