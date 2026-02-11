'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaLock,
    FaUnlock,
    FaFilter,
    FaShieldAlt,
    FaArrowRight,
    FaRegClock,
    FaGavel,
    FaExclamationTriangle,
    FaCheckCircle,
    FaInfoCircle
} from 'react-icons/fa';
import Link from 'next/link';

const escrowFunds = [
    { id: 'TXN-88001', order: 'ORD-RT-99801', amount: '₹42,200', seller: 'LuxeHome Ltd.', status: 'HELD', time: '2h 15m ago', risk: 'LOW' },
    { id: 'TXN-88002', order: 'ORD-RT-99800', amount: '₹8,400', seller: 'Metro Distributors', status: 'IN DISPUTE', time: '5h 40m ago', risk: 'HIGH' },
    { id: 'TXN-88003', order: 'ORD-RT-99799', amount: '₹22,200', seller: 'North-Zone Retail', status: 'PENDING RELEASE', time: 'Feb 05, 14:22', risk: 'LOW' },
];

export default function AdminEscrowControl() {
    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">Escrow <span className="text-[#10367D]">Reserve</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Platform Settlement Authority • Triple-Zone Protection</p>
                </div>
                <div className="px-6 py-4 bg-[#1E293B] rounded-[10px] text-white shadow-2xl flex items-center gap-6 border border-[#10367D]/20">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Aggregate Reserve</span>
                        <span className="text-xl font-black tracking-tighter italic">₹1,44,02,800.00</span>
                    </div>
                    <div className="w-10 h-10 rounded-[10px] bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                        <FaShieldAlt className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Fund Stream */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                <div className="xl:col-span-8 bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em] italic flex items-center gap-3">
                            <FaLock className="text-[#10367D]" /> Active Held Assets
                        </h2>
                        <div className="flex items-center gap-3">
                            {['All Funds', 'In Dispute', 'Pending Release'].map(f => (
                                <button key={f} className={`px-5 py-2 rounded-[10px] text-[9px] font-black uppercase tracking-widest transition-all ${f === 'All Funds' ? 'bg-[#10367D] text-white' : 'bg-white border border-slate-100 text-slate-400'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/30 text-[9px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50">
                                <tr>
                                    <th className="px-10 py-6">Transaction Nexus</th>
                                    <th className="px-10 py-6">Origin Order</th>
                                    <th className="px-10 py-6">Current Status</th>
                                    <th className="px-10 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {escrowFunds.map((fund) => (
                                    <tr key={fund.id} className="group hover:bg-slate-50/30 transition-all">
                                        <td className="px-10 py-8">
                                            <h4 className="text-sm font-black text-[#1E293B]">{fund.id}</h4>
                                            <p className="text-[10px] font-black text-[#10367D] uppercase mt-1 tracking-tight">{fund.amount} • {fund.seller}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-[#1E293B]">{fund.order}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{fund.time}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-[10px] border flex items-center gap-2 w-fit ${fund.status === 'HELD' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                fund.status === 'IN DISPUTE' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {fund.status === 'HELD' ? <FaLock className="w-2 h-2" /> : <FaExclamationTriangle className="w-2 h-2" />}
                                                {fund.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button className="px-6 py-2.5 bg-[#1E293B] text-white text-[9px] font-black uppercase tracking-widest rounded-[10px] hover:scale-105 transition-all shadow-lg shadow-[#1E293B]/20">
                                                Manage Assets
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Audit & Mediation Sidebar */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="p-10 bg-[#1E293B] rounded-[10px] text-white space-y-10 relative overflow-hidden group border border-[#10367D]/20 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-3 italic">
                            <FaGavel className="text-blue-400" /> Mediation Protocol
                        </h3>
                        <div className="space-y-6">
                            <div className="p-8 bg-white/5 border border-white/10 rounded-[10px] group-hover:border-blue-500/30 transition-all">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Force Release</p>
                                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">Instantly release held funds to dealer regardless of timer. Used for priority settlement.</p>
                                <button className="mt-6 px-6 py-4 bg-[#10367D] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-[10px] hover:scale-[1.02] transition-all w-full flex items-center justify-center gap-3">
                                    <FaUnlock className="w-3 h-3" /> Execute Release
                                </button>
                            </div>
                            <div className="p-8 bg-white/5 border border-white/10 rounded-[10px] group-hover:border-rose-500/30 transition-all">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Interim Hold</p>
                                <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">Freeze funds during active customer dispute. Prevents automated release timer.</p>
                                <button className="mt-6 px-6 py-4 bg-rose-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-[10px] hover:scale-[1.02] transition-all w-full flex items-center justify-center gap-3">
                                    <FaLock className="w-3 h-3" /> Initiate Freeze
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-white border border-slate-100 rounded-[10px] space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#10367D] flex items-center justify-center text-white shadow-lg border border-blue-50">
                                <FaCheckCircle className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-tight italic text-[#1E293B]">Settlement Engine</h4>
                        </div>
                        <ul className="space-y-4">
                            {[
                                { t: 'Commission Rate', v: 'Flat 5.0%' },
                                { t: 'Gateway Surcharge', v: 'Zone-Covered' },
                                { t: 'GST Processing', v: 'Dealer-Responsibility' },
                            ].map((p, i) => (
                                <li key={i} className="flex justify-between items-center border-b border-slate-50 pb-3">
                                    <span className="text-[9px] font-black text-slate-400 uppercase">{p.t}</span>
                                    <span className="text-[10px] font-black text-[#1E293B] italic">{p.v}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4 p-6 bg-slate-50 rounded-[10px] flex items-center gap-4">
                            <FaInfoCircle className="text-[#10367D] w-5 h-5 shrink-0" />
                            <p className="text-[8px] font-black text-slate-500 uppercase leading-tight italic">
                                Next Global Settlement Cycle: Feb 07, 00:00 IST
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

