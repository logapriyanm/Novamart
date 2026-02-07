'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaBox,
    FaPlus,
    FaSearch,
    FaFilter,
    FaCheckCircle,
    FaHistory,
    FaShieldAlt,
    FaRegClock,
    FaExclamationCircle,
    FaArrowRight
} from 'react-icons/fa';
import Link from 'next/link';

const manufacturerProducts = [
    { id: 'MFP-101', name: 'Ultra-Quiet AC 2.0', status: 'APPROVED', price: '₹34,500', stock: 500, category: 'Home Appliances' },
    { id: 'MFP-102', name: 'Pro-Mix Grinder X', status: 'SUBMITTED', price: '₹8,400', stock: 1200, category: 'Kitchen Tech' },
    { id: 'MFP-103', name: 'Industrial Heat Pump', status: 'DRAFT', price: '₹89,000', stock: 50, category: 'Climate' },
];

export default function ManufacturerInventory() {
    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">Bulk <span className="text-[#10367D]">Portfolio</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Production Planning & Governance Queue</p>
                </div>
                <Link href="/manufacturer/inventory/add" className="px-10 py-5 bg-[#10367D] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center gap-3">
                    <FaPlus className="w-3 h-3" />
                    Initialize New Batch
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { l: 'Total SKUs', v: '18', c: 'text-[#10367D]', b: 'bg-blue-50' },
                    { l: 'Approved Distribution', v: '12', c: 'text-emerald-600', b: 'bg-emerald-50' },
                    { l: 'In Governor Review', v: '04', c: 'text-amber-600', b: 'bg-amber-50' },
                    { l: 'Draft Designs', v: '02', c: 'text-slate-400', b: 'bg-slate-50' },
                ].map((s, i) => (
                    <div key={i} className={`p-8 rounded-[2.5rem] border border-slate-100 shadow-sm ${s.b}`}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.l}</p>
                        <p className={`text-3xl font-black ${s.c}`}>{s.v}</p>
                    </div>
                ))}
            </div>

            {/* Catalog Table */}
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1 max-w-md">
                        <div className="relative w-full">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                            <input type="text" placeholder="Search Master Catalog..." className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-[#10367D]/30" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-4 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-[#10367D] transition-colors shadow-sm">
                            <FaFilter className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/20 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                <th className="px-10 py-6 font-black">Asset Identity</th>
                                <th className="px-10 py-6 font-black">Governance Status</th>
                                <th className="px-10 py-6 font-black">Wholesale Base</th>
                                <th className="px-10 py-6 font-black">Supply Stock</th>
                                <th className="px-10 py-6 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {manufacturerProducts.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-xl bg-[#10367D]/5 text-[#10367D] flex items-center justify-center border border-[#10367D]/10 shadow-sm group-hover:scale-110 transition-transform">
                                                <FaBox className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-[#1E293B] italic">{item.name}</h4>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mt-1">{item.id} • {item.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2 h-2 rounded-full ${item.status === 'APPROVED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                    item.status === 'SUBMITTED' ? 'bg-amber-500 animate-pulse' :
                                                        'bg-slate-300'
                                                }`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'APPROVED' ? 'text-emerald-600' :
                                                    item.status === 'SUBMITTED' ? 'text-amber-600' :
                                                        'text-slate-400'
                                                }`}>{item.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-sm font-black text-[#1E293B]">{item.price}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-sm font-black text-[#1E293B] italic">{item.stock} <span className="text-slate-300 text-[10px] uppercase font-bold ml-1">Units</span></span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        {item.status === 'DRAFT' ? (
                                            <button className="px-6 py-2 bg-[#10367D] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#10367D]/20 hover:scale-105 transition-all">
                                                Submit Audit
                                            </button>
                                        ) : (
                                            <button className="px-6 py-2 bg-white border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all">
                                                View Specs
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Compliance Note */}
            <div className="p-10 bg-[#1E293B] rounded-[3.5rem] border border-[#10367D]/20 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent pointer-events-none" />
                <div className="w-16 h-16 rounded-[1.8rem] bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <FaShieldAlt className="w-8 h-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-lg font-black tracking-tight text-white">Immutable Governance Bridge</h4>
                    <p className="text-sm font-bold text-slate-500 mt-1 max-w-2xl leading-relaxed uppercase">
                        Approved products are strictly locked. Technical spec changes require a full <span className="text-white">Batch Reset</span> or Admin correction request.
                    </p>
                </div>
                <FaHistory className="text-white/5 w-24 h-24 absolute -right-4 -bottom-4 group-hover:rotate-12 transition-transform duration-700" />
            </div>
        </div>
    );
}

