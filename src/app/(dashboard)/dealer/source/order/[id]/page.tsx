'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaArrowLeft,
    FaArrowRight,
    FaCheckCircle,
    FaBox,
    FaTruck,
    FaFileInvoiceDollar,
    FaShieldAlt,
    FaIndustry,
    FaInfoCircle
} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function BulkPurchaseRequest() {
    const router = useRouter();
    const params = useParams();
    const [quantity, setQuantity] = useState(10);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsComplete(true);
        }, 2000);
    };

    if (isComplete) {
        return (
            <div className="min-h-screen bg-[#EBEBEB] flex items-center justify-center p-6 animate-fade-in">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white rounded-[3.5rem] p-12 text-center shadow-2xl border border-slate-100"
                >
                    <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl shadow-emerald-500/20">
                        <FaCheckCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-black text-[#1E293B] mb-4">Request Logged</h2>
                    <p className="text-sm font-medium text-slate-400 mb-10 leading-relaxed">
                        Your bulk request has been transmitted to the Manufacturer.
                        Stock will be added to your <span className="text-[#10367D] font-black">Dealer Inventory</span> upon fulfillment.
                    </p>
                    <Link href="/dealer" className="inline-block w-full py-5 bg-[#10367D] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                        Return to Command Center
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/dealer/source" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Cancel and Return to Catalog
                </Link>
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Initiate <span className="text-[#10367D]">Supply</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Bulk Acquisition Protocol</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Product Info Card */}
                <div className="lg:col-span-12 xl:col-span-8 bg-white rounded-[3.5rem] p-10 lg:p-14 border border-slate-100 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
                        <div className="w-48 h-48 bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center justify-center text-[#10367D]">
                            <FaBox className="w-20 h-20" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <span className="text-[10px] font-black text-[#10367D] uppercase tracking-[0.2em] bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 mb-4 inline-block">Product Code: {params.id || 'MP-881'}</span>
                            <h2 className="text-3xl font-black tracking-tight mb-3">Ultra-Quiet AC 2.0 (Commercial Grade)</h2>
                            <div className="flex items-center justify-center md:justify-start gap-3 text-slate-400">
                                <FaIndustry className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Mega-Mart Manufacturing Inc.</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 mb-12">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Wholesale Per Unit</p>
                            <p className="text-2xl font-black">₹34,500</p>
                        </div>
                        <div className="border-l-0 md:border-l border-slate-200 md:pl-8">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Protocol MOQ</p>
                            <p className="text-2xl font-black text-[#10367D]">10 Units</p>
                        </div>
                        <div className="border-l-0 md:border-l border-slate-200 md:pl-8">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Dispatch</p>
                            <p className="text-2xl font-black text-emerald-500">48h SLA</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-4 flex items-center gap-2">
                                <FaTruck className="text-[#10367D]" /> Supply Quantity Selection
                            </h3>
                            <div className="flex items-center gap-6">
                                <button onClick={() => setQuantity(q => Math.max(10, q - 5))} className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 text-[#1E293B] font-black text-xl hover:bg-slate-100 transition-all">-</button>
                                <div className="flex-1 bg-white border-2 border-[#10367D]/10 rounded-2xl py-5 px-8 text-center">
                                    <span className="text-2xl font-black text-[#10367D]">{quantity} Units</span>
                                </div>
                                <button onClick={() => setQuantity(q => q + 5)} className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 text-[#1E293B] font-black text-xl hover:bg-slate-100 transition-all">+</button>
                            </div>
                        </div>

                        {/* Payment Zone (B2B) */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                <FaFileInvoiceDollar className="text-[#10367D]" /> B2B Payment Protocol
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'bank', name: 'RTGS / NEFT', d: 'Industrial Bank Transfer' },
                                    { id: 'credit', name: 'Credit Terms', d: 'Line of Credit (30-45 Days)' },
                                ].map((p) => (
                                    <div key={p.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-[#10367D]/30 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black text-[#1E293B] uppercase">{p.name}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{p.d}</p>
                                            </div>
                                            <div className="w-4 h-4 rounded-full border-2 border-slate-200 group-hover:border-[#10367D]" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center space-y-3 group hover:border-[#10367D]/30 transition-all cursor-pointer bg-slate-50/30">
                                <FaFileInvoiceDollar className="w-6 h-6 mx-auto text-slate-200 group-hover:text-[#10367D] transition-colors" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#1E293B]">Upload Remittance Advice / Payment Proof</p>
                                <p className="text-[8px] font-bold text-slate-300 uppercase italic">PDF, JPG or PNG (Max 5MB)</p>
                            </div>
                        </div>

                        <div className="p-10 bg-[#1E293B] rounded-[3rem] text-white space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10367D]/20 blur-2xl rounded-full" />
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                                    <FaFileInvoiceDollar className="text-[#10367D]" /> Settlement Calculation
                                </h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-medium text-slate-400">
                                    <span>Bulk Base (₹34,500 x {quantity})</span>
                                    <span className="text-white font-black">₹{(34500 * quantity).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-slate-400">
                                    <span>GST (18% Slab)</span>
                                    <span className="text-blue-400 font-black">+ ₹{(34500 * quantity * 0.18).toLocaleString()}</span>
                                </div>
                                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gross B2B Payable</p>
                                    <p className="text-3xl font-black tracking-tight text-white italic">₹{(34500 * quantity * 1.18).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full py-6 bg-[#10367D] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#10367D]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Syncing Finance Ledger...' : 'Commence B2B Settlement'}
                            <FaArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Right: Policy & Verification Side */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                    <div className="p-10 bg-blue-50/50 rounded-[3rem] border border-[#10367D]/10 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-white text-[#10367D] flex items-center justify-center shadow-lg border border-blue-100">
                            <FaShieldAlt className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black tracking-tight">Supply Protocol</h4>
                        <div className="space-y-6">
                            {[
                                { t: 'Escrow Lock', d: 'Funds are locked until dispatch confirmation.' },
                                { t: 'Retail Margin', d: 'Dealer controls retail tags above base + 15%.' },
                                { t: 'SLA Tracking', d: 'Manufacturer dispatch time affects trust index.' },
                            ].map((pol, i) => (
                                <div key={i} className="space-y-1">
                                    <p className="text-[10px] font-black text-[#10367D] uppercase tracking-[0.2em]">{pol.t}</p>
                                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">{pol.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                        <FaInfoCircle className="text-slate-100 w-16 h-16 mb-4" />
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Authenticated Dealer</h5>
                        <p className="text-xs font-black text-[#1E293B]">DLR-MU-2026-X4401</p>
                        <button className="mt-8 text-[9px] font-black text-[#10367D] uppercase tracking-[0.2em] border-b border-[#10367D]/20 pb-1 hover:border-[#10367D] transition-all">
                            Negotiate Bulk Terms with Mfg
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
