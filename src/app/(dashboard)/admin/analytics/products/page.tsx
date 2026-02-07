'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaChartLine,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimesCircle,
    FaFilter,
    FaSearch,
    FaGavel,
    FaArrowRight,
    FaInfoCircle
} from 'react-icons/fa';
import Link from 'next/link';

const performanceData = [
    { id: 'MFP-101', name: 'Ultra-Quiet AC 2.0', returnRate: '1.2%', rating: 4.8, complaints: 2, status: 'STABLE' },
    { id: 'MFP-102', name: 'Pro-Mix Grinder X', returnRate: '8.5%', rating: 3.2, complaints: 14, status: 'AT RISK' },
    { id: 'MFP-105', name: 'Solar Panel 400W', returnRate: '0.5%', rating: 4.9, complaints: 0, status: 'STABLE' },
];

export default function AdminPerformanceMonitor() {
    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">Ecosystem <span className="text-[#10367D]">Intel</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Platform Performance Oversight & Governance Audits</p>
                </div>
                <div className="flex items-center gap-4 bg-white border border-slate-100 p-2 rounded-2xl">
                    <div className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl">
                        <p className="text-[9px] font-black text-rose-500 uppercase">High Risk Alerts</p>
                        <p className="text-xs font-black text-rose-600">03 Asset Flags</p>
                    </div>
                </div>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { l: 'Avg Return Rate', v: '2.4%', c: 'text-[#10367D]', b: 'bg-blue-50' },
                    { l: 'Quality Compliance', v: '98.2%', c: 'text-emerald-600', b: 'bg-emerald-50' },
                    { l: 'Resolution Speed', v: '4.2h', c: 'text-indigo-600', b: 'bg-indigo-50' },
                ].map((s, i) => (
                    <div key={i} className={`p-10 rounded-[3.5rem] border border-slate-100 shadow-sm ${s.b}`}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">{s.l}</p>
                        <p className={`text-4xl font-black ${s.c}`}>{s.v}</p>
                        <div className="h-1.5 w-full bg-white/50 rounded-full mt-6 overflow-hidden">
                            <div className={`h-full ${s.c.replace('text', 'bg')}`} style={{ width: '70%' }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Risk Terminal */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                <div className="xl:col-span-8 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                        <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em] italic flex items-center gap-3">
                            <FaExclamationTriangle className="text-amber-500" /> Quality Audit Queue
                        </h2>
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-[#10367D] transition-colors">
                            <FaFilter className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50">
                                <tr>
                                    <th className="px-10 py-6">Asset Identity</th>
                                    <th className="px-10 py-6">Performance</th>
                                    <th className="px-10 py-6">Risk Quotient</th>
                                    <th className="px-10 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {performanceData.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50/30 transition-all">
                                        <td className="px-10 py-8">
                                            <h4 className="text-sm font-black text-[#1E293B]">{item.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{item.id}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-[#1E293B]">{item.returnRate} Returns</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{item.complaints} Escalations</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${item.status === 'STABLE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button className="px-6 py-2.5 bg-[#1E293B] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#1E293B]/20">
                                                Audit History
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Delisting Control Sidebar */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="p-10 bg-[#1E293B] rounded-[3.5rem] text-white space-y-10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent pointer-events-none" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-3 italic">
                            <FaGavel className="text-rose-500" /> Governance Controls
                        </h3>
                        <div className="space-y-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl group-hover:border-rose-500/30 transition-all">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Delist Product</p>
                                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">Instantly remove asset from marketplace. Notifies all dealers holding stock.</p>
                                <button className="mt-4 px-6 py-3 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all w-full">Execute Delisting</button>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl group-hover:border-amber-500/30 transition-all">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Issue Correction</p>
                                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">Force specs update for all retail listings. Manufacturer re-audit required.</p>
                                <button className="mt-4 px-6 py-3 bg-amber-500 text-[#1E293B] text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all w-full">Request Correction</button>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-slate-50 border border-slate-100 rounded-[3.5rem] space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#10367D] shadow-sm">
                                <FaInfoCircle className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-tight italic text-[#1E293B]">Auto-Delist Triggers</h4>
                        </div>
                        <ul className="space-y-4">
                            {[
                                { t: 'Return Rate > 12%', v: 'Critical Threshold' },
                                { t: 'Unresolved Disputes > 5', v: 'Safety Risk' },
                                { t: 'Specs Mismatch Reports', v: 'Legal Threshold' },
                            ].map((p, i) => (
                                <li key={i} className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <span className="text-[9px] font-black text-slate-400 uppercase">{p.t}</span>
                                    <span className="text-[8px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-widest">{p.v}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

