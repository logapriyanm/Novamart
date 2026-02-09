'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBox,
    FaCheckCircle,
    FaTimesCircle,
    FaIndustry,
    FaFileInvoiceDollar,
    FaTruck,
    FaInfoCircle,
    FaArrowRight,
    FaSearch,
    FaRegClock
} from 'react-icons/fa';
import Link from 'next/link';

const b2bOrders = [
    { id: 'B2B-ORD-8801', dealer: 'North-Zone Distributors', total: '₹4,07,100', date: 'Feb 06, 14:22', status: 'Payment Pending', item: 'Ultra-Quiet AC 2.0', qty: 10 },
    { id: 'B2B-ORD-8800', dealer: 'Metro Retail Group', total: '₹8,14,200', date: 'Feb 06, 11:10', status: 'Processing', item: 'EcoCool Refrigerator', qty: 25 },
];

export default function ManufacturerOrderControl() {
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight italic">Production <span className="text-[#10367D]">Outbox</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">B2B Distribution Management & Finance Control</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:h-[calc(100vh-250px)]">
                {/* Order Stream */}
                <div className="xl:col-span-7 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-4">
                            <span className="p-3 bg-white text-[#10367D] rounded-2xl shadow-sm border border-slate-100">
                                <FaIndustry className="w-5 h-5" />
                            </span>
                            <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em] italic">Distribution Ledger</h2>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
                        {b2bOrders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`p-10 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group ${selectedOrder?.id === order.id ? 'bg-blue-50/30' : ''}`}
                            >
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 rounded-[1.8rem] bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:bg-[#10367D] group-hover:text-white transition-all shadow-sm">
                                        <FaBox className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-lg font-black text-[#1E293B] italic leading-none">{order.id}</h4>
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${order.status === 'Payment Pending' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>{order.status}</span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{order.dealer} • {order.qty} Units</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-[#1E293B]">{order.total}</p>
                                    <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">{order.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Verification Control */}
                <div className={`xl:col-span-5 xl:relative transition-all ${selectedOrder ? 'fixed inset-0 z-50 bg-background xl:bg-transparent xl:z-auto' : 'hidden xl:block'}`}>
                    <AnimatePresence mode="wait">
                        {selectedOrder ? (
                            <motion.div
                                key={selectedOrder.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="h-full bg-white xl:rounded-[3.5rem] xl:border border-slate-100 shadow-sm flex flex-col overflow-hidden"
                            >
                                <div className="p-8 md:p-12 border-b border-slate-50 bg-[#1E293B] text-white space-y-8 relative">
                                    {/* Mobile Back Button */}
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white xl:hidden"
                                    >
                                        <FaTimesCircle className="w-6 h-6" />
                                    </button>

                                    <div>
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2 italic">Finance Audit Mode</p>
                                        <h3 className="text-3xl font-black tracking-tight leading-none">{selectedOrder.id}</h3>
                                    </div>
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <FaFileInvoiceDollar className="text-blue-400 w-5 h-5" />
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase">Gross Wholesale Value</p>
                                                <p className="text-xl font-black">{selectedOrder.total}</p>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                            <FaInfoCircle className="text-slate-600 w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 p-8 md:p-12 space-y-12 overflow-y-auto custom-scrollbar">
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3 italic">
                                            <FaFileInvoiceDollar className="text-[#10367D]" /> B2B Payment Proof (Manual Audit)
                                        </h4>
                                        <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
                                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
                                                <FaCheckCircle className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-[#1E293B]">Remittance_Advice_4401.pdf</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Uploaded Feb 06, 14:24</p>
                                            </div>
                                            <button className="px-6 py-2 bg-white border border-slate-100 text-[9px] font-black text-[#10367D] uppercase tracking-widest rounded-xl shadow-sm hover:scale-105 transition-all">View Full Scan</button>
                                        </div>
                                    </div>

                                    <div className="p-10 bg-blue-50/50 border border-blue-100 rounded-[2.5rem] flex items-center gap-8">
                                        <FaRegClock className="text-[#10367D] w-10 h-10" />
                                        <p className="text-[10px] font-bold text-[#1E293B] uppercase tracking-widest leading-relaxed">
                                            Verify against bank statement before confirming. Once confirmed, stock is <span className="text-[#10367D] font-black underline">legally transferred</span> to dealer.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-8 md:p-12 border-t border-slate-50 flex items-center gap-6 bg-slate-50/30">
                                    <button className="flex-1 py-6 bg-[#10367D] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-[#10367D]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 group">
                                        <FaCheckCircle className="w-4 h-4 group-hover:scale-125 transition-transform" />
                                        Confirm Fund Receipt
                                    </button>
                                    <button className="p-6 bg-white border border-slate-200 text-rose-500 rounded-[2rem] hover:bg-rose-50 transition-all shadow-sm">
                                        <FaTimesCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12">
                                <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-8 shadow-sm">
                                    <FaArrowRight className="w-10 h-10 -rotate-45" />
                                </div>
                                <h3 className="text-lg font-black text-slate-400 uppercase tracking-[0.2em] italic">Select B2B Asset</h3>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-3 max-w-[240px] leading-relaxed">Validate payment proofs and initialize distribution protocols for incoming bulk requests.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

