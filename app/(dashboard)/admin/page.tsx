'use client';

import React from 'react';
import {
    FaShieldAlt,
    FaUserShield,
    FaCube,
    FaGavel,
    FaExclamationTriangle,
    FaChartLine,
    FaClock,
    FaCheckCircle,
    FaArrowRight
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const governanceStatCards = [
    { name: 'Pending Verifications', value: '42', desc: 'Sellers/Manufacturers', icon: FaUserShield, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Product Approvals', value: '184', desc: 'Inventory Queue', icon: FaCube, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Active Disputes', value: '12', desc: 'Manual Intervention Needed', icon: FaGavel, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { name: 'Fraud Alerts', value: '03', desc: 'Anomaly Detection System', icon: FaShieldAlt, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

const priorityActions = [
    { title: 'Mega-Mart Manufacturing Inc.', type: 'Manufacturer Verification', time: '2h ago', level: 'HIGH' },
    { title: 'Global Retail Hub', type: 'Dealer Verification', time: '4h ago', level: 'MID' },
    { title: 'ProClean 500W Mixer Pro', type: 'Product Compliance Review', time: '5h ago', level: 'HIGH' },
    { title: 'Payment Dispute #ORD-1102', type: 'Arbitration Case', time: '6h ago', level: 'CRITICAL' },
];

export default function AdminMissionControl() {
    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Mission Control Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-[#1E293B] tracking-tight flex items-center gap-4">
                        <div className="w-1.5 h-8 bg-[#10367D] rounded-full" />
                        Platform Governance <span className="text-[#10367D]">Mission Control</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-6">NovaMart Ecosystem Oversight • Global Authority</p>
                </div>
                <div className="flex items-center gap-3 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <FaClock className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase leading-none">System Status</p>
                        <p className="text-xs font-black text-emerald-600 uppercase mt-1">Operational • Latency: 42ms</p>
                    </div>
                </div>
            </div>

            {/* Governance Snapshot Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {governanceStatCards.map((stat) => (
                    <motion.div
                        key={stat.name}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#10367D]/5 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.name.split(' ')[0]}</span>
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400 opacity-50">{stat.name.split(' ')[1] || ''}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-[#1E293B] mb-2">{stat.value}</h3>
                            <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase tracking-wider">{stat.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Governance View */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Priority Action Queue */}
                <div className="xl:col-span-8 bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
                    {/* Ambient BG Accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#10367D]/5 blur-3xl rounded-full -mr-32 -mt-32" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                            <div>
                                <h2 className="text-2xl font-black text-[#1E293B] flex items-center gap-3">
                                    <FaExclamationTriangle className="w-6 h-6 text-amber-500" />
                                    Priority Action Queue
                                </h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manual Governance Required</p>
                            </div>
                            <button className="text-xs font-black text-[#10367D] uppercase tracking-widest hover:underline px-4 py-2 bg-[#10367D]/5 rounded-xl">View Full Queue</button>
                        </div>

                        <div className="space-y-4">
                            {priorityActions.map((action, i) => (
                                <div key={i} className="group p-6 rounded-[2rem] bg-slate-50 border border-transparent hover:border-[#10367D]/20 hover:bg-white hover:shadow-xl hover:shadow-[#10367D]/5 transition-all flex items-center gap-6">
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${action.level === 'CRITICAL' ? 'bg-rose-500 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.5)]' : action.level === 'HIGH' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-black text-[#1E293B] truncate">{action.title}</h4>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#10367D] px-2 py-0.5 bg-[#10367D]/5 rounded-md border border-[#10367D]/10">{action.type}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                <FaClock className="w-2.5 h-2.5" />
                                                {action.time}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="px-6 py-3 bg-white border border-[#10367D]/10 text-[#10367D] text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-[#10367D] hover:text-white flex items-center gap-2">
                                        Resolve
                                        <FaArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Health & Compliance */}
                <div className="xl:col-span-4 space-y-8">
                    {/* Platform Health Chart Area (Mock for now, Recharts later) */}
                    <div className="bg-[#1E293B] rounded-[3rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#10367D]/20 to-transparent pointer-events-none" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 opacity-60">
                            <FaChartLine className="w-4 h-4" />
                            Global Demand Index
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-4xl font-black mb-1">₹4.2M</h4>
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400">Search Throughput Today</p>
                            </div>
                            {/* Visual Placeholder for a small chart */}
                            <div className="h-24 flex items-end gap-1 px-2">
                                {[30, 50, 40, 70, 80, 50, 90, 100, 60, 40].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        className="flex-1 bg-[#10367D] rounded-t-lg opacity-40 hover:opacity-100 transition-opacity"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Governance Links */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Access Protocol Links</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {['Manufacturers', 'Dealers', 'Disputes', 'Risk Audit'].map((link) => (
                                <button key={link} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-black text-[#1E293B] uppercase tracking-widest hover:bg-[#10367D]/5 hover:border-[#10367D]/20 transition-all text-left">
                                    {link}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

