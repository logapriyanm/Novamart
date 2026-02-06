'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaIndustry,
    FaBoxOpen,
    FaUsers,
    FaChartBar,
    FaTruck,
    FaPlus,
    FaArrowRight,
    FaRegClock,
    FaShieldAlt,
    FaCheckCircle,
    FaWallet,
    FaEllipsisV,
    FaSync
} from 'react-icons/fa';
import Link from 'next/link';

const stats = [
    { name: 'Total Production', value: '14,204 Units', icon: FaIndustry, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Active Inventory', value: '1,280 Units', icon: FaBoxOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Pending Approvals', value: '08 Products', icon: FaRegClock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { name: 'Verified Dealers', value: '42 Entities', icon: FaUsers, color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

const bulkOrders = [
    { id: 'B-ORD-880', dealer: 'Elite Electronics', status: 'Pending', total: '₹4.2L', items: 150, date: '1h ago' },
    { id: 'B-ORD-879', dealer: 'South Tech Solutions', status: 'Dispatched', total: '₹1.8L', items: 80, date: '4h ago' },
    { id: 'B-ORD-878', dealer: 'Mumbai Appliance Hub', status: 'Processing', total: '₹12.4L', items: 500, date: 'Yesterday' },
];

export default function ManufacturerDashboardCentric() {
    // Simulated state for demonstration
    const [userStatus, setUserStatus] = useState<'PENDING_VERIFICATION' | 'APPROVED'>('APPROVED');
    const [batchId] = useState('MFG-NS-2026-X8801');

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center text-white shadow-lg">
                            <FaIndustry className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Production <span className="text-[#10367D]">Command</span></h1>
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1 ml-1">Ecosystem-Wide Supply Authority & Bulk Distribution</p>
                </div>

                {userStatus === 'APPROVED' && (
                    <div className="flex items-center gap-4">
                        <div className="px-6 py-3 bg-[#10367D]/5 border border-[#10367D]/10 rounded-2xl flex items-center gap-4">
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocol Batch ID</p>
                                <p className="text-xs font-black text-[#10367D] tracking-wider">{batchId}</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <FaCheckCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <Link href="/manufacturer/inventory/add" className="px-8 py-3 bg-[#10367D] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center gap-3">
                            <FaPlus className="w-3 h-3" />
                            Initialize Bulk Product
                        </Link>
                    </div>
                )}
            </div>

            {/* Verification Banner */}
            {userStatus === 'PENDING_VERIFICATION' && (
                <div className="bg-[#1E293B] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full -mr-32 -mt-32" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-20 h-20 rounded-[2rem] bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-2xl">
                            <FaRegClock className="w-10 h-10 animate-pulse" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-black mb-2 tracking-tight">Identity Handshake in Progress</h3>
                            <p className="text-sm font-medium text-slate-400 max-w-xl">
                                Your factory credentials and tax details are being audited by the **Platform Governor**.
                                Supply channels will unlock once your Batch ID is minted.
                            </p>
                        </div>
                        <button className="px-8 py-4 bg-white text-[#1E293B] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                            Check Audit Logs
                        </button>
                    </div>
                </div>
            )}

            {/* Operational Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#10367D]/5 transition-all group">
                        <div className="flex items-center justify-between mb-8">
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <button className="text-slate-200 hover:text-slate-400 transition-colors">
                                <FaEllipsisV className="w-3 h-3" />
                            </button>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
                            <h3 className="text-2xl font-black text-[#1E293B]">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Bulk Order Stream */}
                <div className="xl:col-span-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Active Bulk Purchase Requests</h2>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Direct Dealer-to-Manufacturer Stream</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-[10px] font-black text-[#10367D] uppercase tracking-widest rounded-xl hover:bg-[#10367D] hover:text-white transition-all border border-[#10367D]/10">
                            <FaSync className="w-3 h-3" />
                            Sync All
                        </button>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {bulkOrders.map((order) => (
                            <div key={order.id} className="p-8 hover:bg-slate-50 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#10367D] group-hover:text-white transition-all">
                                        <FaTruck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-[#1E293B]">{order.dealer}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-black text-[#10367D] uppercase tracking-widest">{order.id}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.items} Units</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-base font-black text-[#1E293B]">{order.total}</p>
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{order.status}</span>
                                    </div>
                                    <button className="p-4 bg-white border border-slate-100 text-[#10367D] rounded-xl hover:bg-[#10367D] hover:text-white transition-all">
                                        <FaArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-10 border-t border-slate-50 text-center">
                        <Link href="/manufacturer/orders" className="text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:underline">View All Bulk Requests</Link>
                    </div>
                </div>

                {/* Fiscal & Compliance Corner */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-[#1E293B] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-60 flex items-center gap-3">
                            <FaWallet className="w-4 h-4 text-[#10367D]" />
                            Supply Revenue
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-4xl font-black italic tracking-tighter">₹24.8L</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Current Quarter B2B Volume</p>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Escrow Settlement Status</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-black text-emerald-400">Stable</span>
                                    <FaShieldAlt className="text-emerald-500/40 w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                            <FaChartBar className="text-[#10367D]" />
                            Strategic Demand
                        </h3>
                        <div className="space-y-4">
                            {[
                                { cat: 'South Zone', val: 75 },
                                { cat: 'North Zone', val: 42 },
                                { cat: 'West Zone', val: 90 },
                            ].map((zone) => (
                                <div key={zone.cat} className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">{zone.cat}</span>
                                        <span className="text-[#1E293B]">{zone.val}% Demand</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${zone.val}%` }}
                                            className="h-full bg-[#10367D]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

