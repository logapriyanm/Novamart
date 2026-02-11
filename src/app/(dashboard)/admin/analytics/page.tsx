'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaChartBar,
    FaArrowUp,
    FaArrowDown,
    FaArrowLeft,
    FaGlobe,
    FaUserShield,
    FaChartPie,
    FaSync
} from 'react-icons/fa';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Mock Recharts usage with dynamic import to avoid SSR errors
const StrategicIntel = () => {
    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Mission Control
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Strategic <span className="text-[#10367D]">Intel</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Macro-Economic Platform Health Analytics</p>
                    </div>
                    <button className="px-6 py-3 bg-[#10367D] text-white text-[10px] font-black uppercase tracking-widest rounded-[10px] shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center gap-2">
                        <FaSync className="w-3 h-3" />
                        Refresh Global Data
                    </button>
                </div>
            </div>

            {/* Macro Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Quarterly GMV', value: '₹48.2M', change: '+18.2%', isUp: true },
                    { label: 'Merchant Growth', value: '542', change: '+9.4%', isUp: true },
                    { label: 'Dispute Ratio', value: '0.42%', change: '-0.02%', isUp: false },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-[10px] p-10 border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-4xl font-black text-[#1E293B]">{stat.value}</h3>
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-[10px] ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {stat.isUp ? <FaArrowUp /> : <FaArrowDown />}
                                {stat.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Strategic Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-[#1E293B] rounded-[10px] p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#10367D]/20 blur-[100px] rounded-full" />
                    <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                        <div>
                            <h2 className="text-2xl font-black flex items-center gap-4">
                                <FaGlobe className="text-[#10367D]" />
                                Global Supply Density
                            </h2>
                            <p className="text-sm font-medium text-slate-400 mt-2 max-w-md">Monitoring industrial throughput and retail absorption across the pan-India logistics network.</p>
                        </div>

                        {/* Mock Chart Visual */}
                        <div className="h-64 flex items-end gap-2 px-10">
                            {[40, 70, 45, 90, 65, 80, 55, 95, 30, 85, 45, 100].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex-1 bg-gradient-to-t from-[#10367D] to-blue-400 rounded-t-[10px] opacity-60 hover:opacity-100 transition-opacity"
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-8 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-[#10367D]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Industrial Output</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-blue-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Retail Burn</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-[10px] p-10 border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-widest mb-8 flex items-center gap-3">
                            <FaChartPie className="text-[#10367D]" />
                            Category Dominance
                        </h3>
                        <div className="space-y-6">
                            {[
                                { name: 'Home Appliances', share: '42%' },
                                { name: 'Kitchen Tech', share: '28%' },
                                { name: 'Smart Climate', share: '18%' },
                                { name: 'Others', share: '12%' },
                            ].map((cat) => (
                                <div key={cat.name} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">{cat.name}</span>
                                        <span className="text-[#1E293B]">{cat.share}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#10367D]" style={{ width: cat.share }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#10367D] rounded-[10px] p-10 text-white shadow-2xl shadow-[#10367D]/30 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-[10px] bg-white/10 flex items-center justify-center mb-6">
                            <FaUserShield className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-black tracking-tight mb-2">Platform Power Reserve</h3>
                        <p className="text-[10px] font-bold text-blue-200 leading-relaxed max-w-[200px] uppercase tracking-widest">Escrow Hold-Index is currently at 98% Safety Compliance.</p>
                        <button className="mt-8 px-8 py-3 bg-white text-[#10367D] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:scale-105 transition-all">Export Insight</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StrategicIntel;

