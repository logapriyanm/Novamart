'use client';

import React from 'react';
import {
    FaHistory,
    FaSearch,
    FaArrowLeft,
    FaCheckCircle,
    FaInfoCircle,
    FaUserShield,
    FaGavel,
    FaFilter,
    FaTerminal
} from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';

const auditEntries = [
    { id: 'AUD-8801', action: 'Approved Manufacturer', target: 'Mega-Mart Mfg', actor: 'Admin: Sam', time: '2026-02-06 14:22:10', ip: '103.44.22.11', icon: FaUserShield, color: 'text-emerald-500' },
    { id: 'AUD-8802', action: 'Denied Dispute #9902', target: 'Order #ORD-LX9', actor: 'Admin: Sam', time: '2026-02-06 15:45:30', ip: '103.44.22.11', icon: FaGavel, color: 'text-rose-500' },
    { id: 'AUD-8803', action: 'Updated Price Floor', target: 'Category: Kitchenware', actor: 'Admin: Alex', time: '2026-02-06 16:10:05', ip: '192.168.1.42', icon: FaInfoCircle, color: 'text-blue-500' },
    { id: 'AUD-8804', action: 'Modified GST Slab', target: 'Global Appliance Rule', actor: 'Admin: Alex', time: '2026-02-06 16:12:44', ip: '192.168.1.42', icon: FaTerminal, color: 'text-[#10367D]' },
];

export default function AuditLogsPanel() {
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
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Audit <span className="text-[#10367D]">Persistence</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Immutable Administrative Action Records</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#10367D]/5 border border-[#10367D]/10 text-[#10367D] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#10367D] hover:text-white transition-all">
                        <FaFilter className="w-3 h-3" />
                        Export Full Log
                    </button>
                </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 lg:p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-3">
                        <FaHistory className="text-[#10367D]" />
                        System Audit Stream
                    </h2>
                    <div className="relative w-80">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                        <input type="text" placeholder="Filter by Actor or Case ID..." className="w-full bg-white border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-[#10367D]/30" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-white">
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol ID</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Governor Action</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Entity</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Origin HWID/IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {auditEntries.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 group transition-colors">
                                    <td className="px-10 py-6">
                                        <span className="text-xs font-black text-[#10367D] tracking-wider">{log.id}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center ${log.color}`}>
                                                <log.icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#1E293B] leading-none">{log.action}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{log.actor}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-xs font-bold text-[#1E293B]">{log.target}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-600">{log.time.split(' ')[0]}</span>
                                            <span className="text-[10px] font-black text-[#10367D] opacity-40">{log.time.split(' ')[1]}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">{log.ip}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 lg:p-10 border-t border-slate-50 bg-[#10367D]/5 flex items-center justify-between">
                    <p className="text-[10px] font-black text-[#10367D] uppercase tracking-[0.2em] flex items-center gap-3">
                        <FaCheckCircle className="animate-pulse" />
                        Log Persistence Engine Verified • SEC/FINRA Style Audit Ready
                    </p>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${i === 1 ? 'bg-[#10367D] text-white' : 'hover:bg-white text-slate-400'}`}>
                                {i}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

