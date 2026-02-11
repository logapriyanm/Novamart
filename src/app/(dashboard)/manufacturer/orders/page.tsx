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
        <div className="space-y-6 animate-fade-in pb-12 font-sans text-slate-800 bg-slate-50/50 min-h-screen p-6">
            {/* Header */}
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Production Outbox</h1>
                        <p className="text-sm text-slate-500 mt-1">B2B Distribution Management & Finance Control</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:h-[calc(100vh-200px)]">
                {/* Order Stream */}
                <div className="xl:col-span-7 bg-white rounded-[10px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-white text-indigo-600 rounded-[10px] shadow-sm border border-slate-200">
                                <FaIndustry className="w-4 h-4" />
                            </span>
                            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Distribution Ledger</h2>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                        {b2bOrders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`p-6 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group ${selectedOrder?.id === order.id ? 'bg-indigo-50/50' : ''}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-[10px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                        <FaBox className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-base font-bold text-slate-900">{order.id}</h4>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-[10px] ${order.status === 'Payment Pending' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                                                }`}>{order.status}</span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 mt-1">{order.dealer} • {order.qty} Units</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-bold text-slate-900">{order.total}</p>
                                    <p className="text-xs font-medium text-slate-400 mt-0.5">{order.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Verification Control */}
                <div className={`xl:col-span-5 xl:relative transition-all ${selectedOrder ? 'fixed inset-0 z-50 bg-white xl:bg-transparent xl:z-auto' : 'hidden xl:block'}`}>
                    <AnimatePresence mode="wait">
                        {selectedOrder ? (
                            <motion.div
                                key={selectedOrder.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="h-full bg-white xl:rounded-[10px] xl:border border-slate-200 shadow-sm flex flex-col overflow-hidden"
                            >
                                <div className="p-8 border-b border-slate-200 bg-slate-900 text-white space-y-6 relative">
                                    {/* Mobile Back Button */}
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="absolute top-6 right-6 p-2 bg-white/10 rounded-[10px] text-white xl:hidden hover:bg-white/20"
                                    >
                                        <FaTimesCircle className="w-5 h-5" />
                                    </button>

                                    <div>
                                        <p className="text-xs font-medium text-indigo-300 uppercase tracking-wider mb-1">Finance Audit Mode</p>
                                        <h3 className="text-2xl font-bold tracking-tight">{selectedOrder.id}</h3>
                                    </div>
                                    <div className="p-4 bg-white/10 border border-white/10 rounded-[10px] flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FaFileInvoiceDollar className="text-indigo-300 w-5 h-5" />
                                            <div>
                                                <p className="text-xs font-medium text-slate-300 uppercase">Gross Wholesale Value</p>
                                                <p className="text-lg font-bold text-white">{selectedOrder.total}</p>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-[10px] bg-white/10 flex items-center justify-center">
                                            <FaInfoCircle className="text-slate-300 w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar bg-white">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <FaFileInvoiceDollar className="text-indigo-600" /> B2B Payment Proof
                                        </h4>
                                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-[10px] flex flex-col items-center justify-center text-center space-y-3">
                                            <div className="w-12 h-12 bg-white rounded-[10px] flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100">
                                                <FaCheckCircle className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">Remittance_Advice_4401.pdf</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Uploaded Feb 06, 14:24</p>
                                            </div>
                                            <button className="px-4 py-2 bg-white border border-slate-200 text-xs font-semibold text-indigo-600 uppercase tracking-wide rounded-[10px] shadow-sm hover:bg-slate-50 transition-all">View Full Scan</button>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-[10px] flex items-start gap-4">
                                        <FaRegClock className="text-indigo-600 w-5 h-5 mt-0.5" />
                                        <p className="text-xs font-medium text-slate-700 leading-relaxed">
                                            Verify against bank statement before confirming. Once confirmed, stock is <span className="text-indigo-700 font-bold">legally transferred</span> to dealer.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-slate-100 flex items-center gap-4 bg-slate-50/50">
                                    <button className="flex-1 py-3 bg-indigo-600 text-white rounded-[10px] font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                                        <FaCheckCircle className="w-4 h-4" />
                                        Confirm Receipt
                                    </button>
                                    <button className="p-3 bg-white border border-slate-200 text-rose-500 rounded-[10px] hover:bg-rose-50 transition-all shadow-sm">
                                        <FaTimesCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full bg-white rounded-[10px] border border-slate-200 flex flex-col items-center justify-center text-center p-12 shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-[10px] flex items-center justify-center text-slate-300 mb-6">
                                    <FaArrowRight className="w-8 h-8 -rotate-45" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">Select Order</h3>
                                <p className="text-xs font-medium text-slate-500 mt-2 max-w-[200px]">Validate payment proofs and initialize distribution.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
