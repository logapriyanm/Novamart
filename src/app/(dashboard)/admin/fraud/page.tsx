'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaShieldAlt,
    FaExclamationTriangle,
    FaSearch,
    FaArrowLeft,
    FaUserSecret,
    FaMapMarkerAlt,
    FaRegClock,
    FaBan,
    FaSearchPlus
} from 'react-icons/fa';
import Link from 'next/link';

const riskAlerts = [
    { id: 'ALR-001', type: 'Velocity Spike', entity: 'Dealer: South Tech', impact: 'CRITICAL', time: '12m ago', score: 92 },
    { id: 'ALR-002', type: 'IP Mismatch', entity: 'Manufacturer: Nexus', impact: 'HIGH', time: '1h ago', score: 78 },
    { id: 'ALR-003', type: 'High Return Ratio', entity: 'Dealer: Elite Mumbai', impact: 'MID', time: '3h ago', score: 45 },
];

export default function FraudRiskPanel() {
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
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Risk <span className="text-[#10367D]">Oversight</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Automated Anomaly & Fraud Detection Engine</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Threat Monitor */}
                <div className="lg:col-span-8 bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 lg:p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Active Threat Stream</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-[10px]">Filter: Unresolved</span>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {riskAlerts.map((alert) => (
                            <div key={alert.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all group">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-[10px] flex items-center justify-center ${alert.impact === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500' : alert.impact === 'HIGH' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                        <FaExclamationTriangle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="text-base font-black text-[#1E293B]">{alert.type}</h4>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-[10px] ${alert.impact === 'CRITICAL' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{alert.impact}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{alert.entity} • Case {alert.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-lg font-black text-[#1E293B]">{alert.score}%</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Risk Score</p>
                                    </div>
                                    <button className="px-6 py-3 bg-white border border-slate-200 text-[#1E293B] text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:bg-[#10367D] hover:text-white hover:border-[#10367D] transition-all">
                                        Investigate
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Watchlist */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#1E293B] rounded-[10px] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-2xl rounded-full" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-10 opacity-60 flex items-center gap-3">
                            <FaShieldAlt className="w-4 h-4 text-rose-500" />
                            Entity Watchlist
                        </h3>
                        <div className="space-y-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-5 bg-white/5 rounded-[10px] border border-white/10 hover:bg-white/10 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-[10px] bg-[#10367D]/20 flex items-center justify-center text-[#10367D]">
                                                <FaUserSecret className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black">Shadow User #772</p>
                                                <p className="text-[8px] font-bold text-slate-500 uppercase">Multiple Fake GST Attempts</p>
                                            </div>
                                        </div>
                                        <FaBan className="w-4 h-4 text-rose-500 opacity-40 hover:opacity-100 cursor-pointer" />
                                    </div>
                                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><FaMapMarkerAlt /> 192.168.1.1 (VPN detected)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[10px] p-8 border border-slate-100">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Detection Presets</h3>
                        <div className="space-y-3">
                            {['Order Velocity Limit', 'Refund Threshold', 'Login Geo-Guard', 'Document MD5 Hash Check'].map((preset) => (
                                <div key={preset} className="flex items-center justify-between p-4 bg-slate-50 rounded-[10px] border border-slate-100 group cursor-pointer hover:border-[#10367D]/20 transition-all">
                                    <span className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest">{preset}</span>
                                    <div className="w-8 h-4 bg-emerald-500 rounded-[10px] p-1 flex justify-end">
                                        <div className="w-2 h-2 bg-white rounded-full" />
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

