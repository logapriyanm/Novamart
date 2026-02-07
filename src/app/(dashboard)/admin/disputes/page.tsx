'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaGavel,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimesCircle,
    FaHistory,
    FaEye,
    FaSearch,
    FaArrowLeft,
    FaComments,
    FaFileInvoice,
    FaTruckLoading
} from 'react-icons/fa';
import Link from 'next/link';

const activeDisputes = [
    { id: 'DSP-9042', order: '#ORD-LX21', buyer: 'Rahul Sharma', dealer: 'Elite Mumbai', reason: 'Damaged Goods', status: 'Escalated', amount: '₹42,999' },
    { id: 'DSP-9045', order: '#ORD-LX25', buyer: 'Sunil Verma', dealer: 'South Tech', reason: 'Incorrect Specs', status: 'Pending Review', amount: '₹8,500' },
    { id: 'DSP-9048', order: '#ORD-LX30', buyer: 'Meera K', dealer: 'Capital Appliances', reason: 'Non-Delivery', status: 'Inquiry', amount: '₹18,200' },
];

export default function DisputeManagementPanel() {
    const [selectedDispute, setSelectedDispute] = useState<any>(null);
    const [isResolving, setIsResolving] = useState(false);

    const handleResolution = (decision: string) => {
        setIsResolving(true);
        setTimeout(() => {
            setIsResolving(false);
            setSelectedDispute(null);
        }, 1500);
    };

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
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Conflict <span className="text-[#10367D]">Arbitration</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Final Authority Tribunal Interface</p>
                    </div>
                    <div className="px-5 py-2.5 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                        <span className="text-sm font-black text-rose-600">{activeDisputes.length} High-Value Escalations</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Dispute List */}
                <div className="xl:col-span-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Arbitration Case Queue</h2>
                        <div className="relative w-48">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                            <input type="text" placeholder="Search Case ID..." className="w-full bg-white border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none" />
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {activeDisputes.map((caseItem) => (
                            <div
                                key={caseItem.id}
                                onClick={() => setSelectedDispute(caseItem)}
                                className={`p-8 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-all ${selectedDispute?.id === caseItem.id ? 'bg-white border-l-4 border-rose-500 shadow-inner' : ''}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                                        <FaGavel className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="text-base font-black text-[#1E293B]">{caseItem.id}</h4>
                                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-rose-100 text-rose-600 rounded-md">{caseItem.status}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{caseItem.reason} • {caseItem.dealer}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-[#1E293B]">{caseItem.amount}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{caseItem.order}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Case Review Panel */}
                <div className="xl:col-span-6 relative">
                    <AnimatePresence mode="wait">
                        {selectedDispute ? (
                            <motion.div
                                key={selectedDispute.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#1E293B] rounded-[3rem] text-white shadow-2xl sticky top-28 p-10 lg:p-12 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500" />

                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight">Case Review: {selectedDispute.id}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Order Transaction Detail AUDIT</p>
                                    </div>
                                    <FaExclamationTriangle className="w-6 h-6 text-rose-500" />
                                </div>

                                <div className="space-y-8">
                                    {/* Quick Evidence Links */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <button className="flex flex-col items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                                            <FaComments className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Chat Logs</span>
                                        </button>
                                        <button className="flex flex-col items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                                            <FaTruckLoading className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">POD Scan</span>
                                        </button>
                                        <button className="flex flex-col items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                                            <FaFileInvoice className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Invoices</span>
                                        </button>
                                    </div>

                                    {/* Case Context */}
                                    <div className="p-6 bg-slate-800/50 rounded-[2rem] border border-white/5">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-1 h-8 bg-rose-500 rounded-full" />
                                            <h4 className="text-xs font-black uppercase tracking-widest">Buyer Statement</h4>
                                        </div>
                                        <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                                            "Item arrived with a cracked screen block. Dealer Refusing replacement saying it's shipping damage, but shipping box was intact."
                                        </p>
                                    </div>

                                    {/* Judicial Actions */}
                                    <div className="pt-6 border-t border-white/10 space-y-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Decision Protocol</span>
                                            <span className="text-[9px] font-bold text-[#10367D]">Escrow ID: ESC-9902</span>
                                        </div>
                                        <button
                                            onClick={() => handleResolution('REFUND')}
                                            disabled={isResolving}
                                            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                                        >
                                            {isResolving ? 'Executing Smart Payout...' : 'Issue Full Refund (Buyer Win)'}
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => handleResolution('REJECT')}
                                                disabled={isResolving}
                                                className="py-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all"
                                            >
                                                Dismiss Claim
                                            </button>
                                            <button className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all">
                                                Penalize Dealer
                                            </button>
                                        </div>
                                        <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-widest pt-2 flex items-center justify-center gap-2">
                                            <FaHistory className="w-3 h-3" />
                                            Admin decisions are logged for legal audit
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[600px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center text-slate-400">
                                <FaGavel className="w-12 h-12 text-slate-200 mb-6" />
                                <h4 className="text-sm font-black uppercase tracking-widest mb-2">Initiate Arbitration Review</h4>
                                <p className="text-[10px] font-bold leading-relaxed max-w-[200px]">Perform judicial review of escrow transactions by selecting an escalated case.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

