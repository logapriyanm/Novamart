'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaAward,
    FaCheckCircle,
    FaShieldAlt,
    FaStar,
    FaBolt,
    FaStar as Star,
    FaPlus as Plus,
    FaArrowLeft,
    FaSearch,
    FaPlus,
    FaSync
} from 'react-icons/fa';
import Link from 'next/link';

const trustBadges = [
    { id: 'BDG-001', name: 'Verified Manufacturer', icon: FaShieldAlt, color: 'text-[#10367D]', holders: 142, criteria: 'GST + Factory Audit' },
    { id: 'BDG-002', name: 'Premium Dealer', icon: FaStar, color: 'text-amber-500', holders: 89, criteria: '95%+ Fulfillment' },
    { id: 'BDG-003', name: 'Escrow Elite', icon: FaBolt, color: 'text-emerald-500', holders: 310, criteria: 'Zero Dispute Month' },
];

export default function BadgesGovernancePortal() {
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
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Trust <span className="text-[#10367D]">Signals</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Ecosystem Status & Badge Governance</p>
                    </div>
                    <button className="px-5 py-2.5 bg-[#10367D] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center gap-2">
                        <FaPlus className="w-3 h-3" />
                        Mint New Badge
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trustBadges.map((badge) => (
                    <motion.div
                        key={badge.id}
                        whileHover={{ y: -8 }}
                        className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-[#10367D]/5 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className={`w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center ${badge.color} group-hover:scale-110 transition-transform`}>
                                <badge.icon className="w-8 h-8" />
                            </div>
                            <div className="text-right">
                                <span className="text-[9px] font-black text-[#10367D] uppercase tracking-[0.2em]">{badge.id}</span>
                                <p className="text-xs font-black text-slate-400 mt-1 uppercase">Active Signal</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-black text-[#1E293B] mb-2">{badge.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry Gate: {badge.criteria}</p>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valid Holders</span>
                                <span className="text-lg font-black text-[#1E293B]">{badge.holders}</span>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button className="flex-1 py-3 bg-white border border-slate-200 text-[#1E293B] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#10367D] hover:text-white hover:border-[#10367D] transition-all">
                                    Revoke
                                </button>
                                <button className="flex-1 py-3 bg-white border border-slate-200 text-[#1E293B] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#10367D] hover:text-white hover:border-[#10367D] transition-all">
                                    Audit Data
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Badge Management Logic Area */}
            <div className="bg-[#1E293B] rounded-[3rem] p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#10367D]/10 blur-3xl rounded-full -mr-32 -mt-32" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="max-w-xl">
                        <h2 className="text-2xl font-black tracking-tight mb-4 flex items-center gap-4">
                            <FaAward className="text-[#74B4DA]" />
                            Automated Badge Trigger Logic
                        </h2>
                        <p className="text-sm font-medium text-slate-400 leading-relaxed">
                            Configure system rules that automatically assign or revoke trust signals based on merchant performance, dispute logs, and GST verification status.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] text-center">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Health Latency</p>
                            <span className="text-2xl font-black text-emerald-400">Stable</span>
                        </div>
                        <button className="px-10 py-5 bg-[#10367D] hover:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all flex items-center gap-3">
                            <FaSync className="w-3 h-3" />
                            Force Recalculate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

