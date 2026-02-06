'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaChartPie,
    FaChartBar,
    FaChartLine,
    FaArrowLeft,
    FaArrowUp,
    FaArrowDown,
    FaInfoCircle,
    FaCompass,
    FaSync
} from 'react-icons/fa';
import Link from 'next/link';

export default function ProductionPlanningAnalytics() {
    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/manufacturer" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Command Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Production <span className="text-[#10367D]">Intel</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Strategic Demand Forecasting & Capacity Allocation</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Demand Prediction */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#10367D]/5 blur-3xl rounded-full -mr-32 -mt-32 transition-colors group-hover:bg-[#10367D]/10" />
                    <div className="relative z-10 flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Zone-Wise Demand Index</h2>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Projected Demand for Q2 2026</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <FaCompass className="w-3 h-3 text-[#10367D]" />
                                Pan-India
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {[
                            { zone: 'West (Mumbai/Pune)', current: '₹42.8L', growth: '+12%', val: 88, color: 'bg-[#10367D]' },
                            { zone: 'South (Bangalore/Chennai)', current: '₹31.2L', growth: '+18%', val: 72, color: 'bg-emerald-500' },
                            { zone: 'North (Delhi/Punjab)', current: '₹18.4L', growth: '-2%', val: 45, color: 'bg-amber-500' },
                            { zone: 'East (Kolkata/Assam)', current: '₹5.2L', growth: '+5%', val: 28, color: 'bg-indigo-500' },
                        ].map((z) => (
                            <div key={z.zone} className="group/zone">
                                <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-500">{z.zone}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[#1E293B] italic">{z.current} Current</span>
                                        <span className={`${z.growth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'} flex items-center gap-1`}>
                                            {z.growth.startsWith('+') ? <FaArrowUp className="w-2 h-2" /> : <FaArrowDown className="w-2 h-2" />}
                                            {z.growth}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${z.val}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={`h-full ${z.color} rounded-full`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Capacity Corner */}
                <div className="space-y-8">
                    <div className="bg-[#1E293B] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-60 flex items-center gap-3">
                            <FaChartPie className="w-4 h-4 text-[#10367D]" />
                            Factory Utilization
                        </h3>
                        <div className="text-center mb-10">
                            <p className="text-5xl font-black italic tracking-tighter">84<span className="text-blue-500">%</span></p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Operating at Peak Capacity</p>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Next Batch Window</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black text-blue-400">12 Feb 2026</span>
                                <FaSync className="text-slate-500/40 w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-blue-50/50 rounded-[3.5rem] border border-[#10367D]/10 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-white text-[#10367D] flex items-center justify-center shadow-lg border border-blue-100">
                            <FaInfoCircle className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black text-[#1E293B] tracking-tight">Eco-System Alert</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                            "High demand surge detected in North Zone for **Smart Climate Control** units. Adjusting production priority by +15% recommended."
                        </p>
                    </div>
                </div>
            </div>

            {/* Product Performance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Most Requested', val: 'Inverter AC 2.0', sub: 'Elite Electronics' },
                    { label: 'Return Rate', val: '0.04%', sub: 'Global Standard' },
                    { label: 'Avg Settle Time', val: '4.2 Days', sub: 'B2B Handshake' },
                    { label: 'Dealer Growth', val: '+5 Entities', sub: 'This Month' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                        <h4 className="text-xl font-black text-[#1E293B]">{stat.val}</h4>
                        <p className="text-[9px] font-black text-[#10367D] uppercase tracking-widest mt-1">{stat.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

