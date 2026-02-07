'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaShieldAlt, FaTruck, FaFileAlt, FaArrowRight, FaHome } from 'react-icons/fa';

export default function OrderSuccessPage() {
    const orderNumber = "NM-" + Math.random().toString().slice(2, 10);

    return (
        <div className="min-h-screen pt-40 pb-20 bg-slate-50/20">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-[4rem] p-12 lg:p-20 border border-slate-100 shadow-2xl shadow-[#10367D]/10 text-center relative overflow-hidden">
                    {/* Background Accents */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -ml-32 -mt-32" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#10367D]/5 blur-3xl rounded-full -mr-32 -mb-32" />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", damping: 12 }}
                            className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-10 shadow-xl shadow-emerald-500/30"
                        >
                            <FaCheckCircle className="w-12 h-12" />
                        </motion.div>

                        <h1 className="text-4xl lg:text-5xl font-black text-[#1E293B] mb-6 tracking-tight">
                            Escrow <span className="text-emerald-500">Secured</span>
                        </h1>

                        <p className="text-lg text-slate-500 font-bold mb-12 uppercase tracking-widest text-xs">
                            Order ID: <span className="text-[#10367D]">{orderNumber}</span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 text-left">
                            <div className="p-8 rounded-[2.5rem] bg-[#10367D]/5 border border-[#10367D]/10">
                                <div className="flex items-center gap-4 mb-4 text-[#10367D]">
                                    <FaShieldAlt className="w-6 h-6" />
                                    <h3 className="font-black uppercase tracking-widest text-sm text-[10px]">Governance Status</h3>
                                </div>
                                <p className="text-sm font-bold text-[#1E293B]">FUNDS IN ESCROW</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 leading-relaxed">
                                    Protected by NovaMart State-Backed Protocol. Funds will remain in suspension until your verification.
                                </p>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-emerald-50/50 border border-emerald-100">
                                <div className="flex items-center gap-4 mb-4 text-emerald-600">
                                    <FaTruck className="w-6 h-6" />
                                    <h3 className="font-black uppercase tracking-widest text-sm text-[10px]">Logistics Protocol</h3>
                                </div>
                                <p className="text-sm font-bold text-[#1E293B]">READY FOR TRANSIT</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 leading-relaxed">
                                    The Manufacturer has been notified. Estimated Hub Arrival within 72 Governance Hours.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 max-w-sm mx-auto">
                            <Link href="/">
                                <button className="w-full py-5 bg-[#10367D] text-white font-black text-xs rounded-2xl shadow-xl shadow-[#10367D]/20 hover:scale-[1.05] transition-all uppercase tracking-widest flex items-center justify-center gap-3">
                                    <FaHome className="w-4 h-4" />
                                    Return to Hub
                                </button>
                            </Link>
                            <Link href="/dashboard/customer">
                                <button className="w-full py-5 text-[#10367D] font-black text-xs rounded-2xl hover:bg-[#10367D]/5 transition-all uppercase tracking-widest flex items-center justify-center gap-3">
                                    <FaFileAlt className="w-4 h-4" />
                                    View Transaction Ledger
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center opacity-40">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        Novamart Platform Governance • State Authorized Escrow
                    </p>
                </div>
            </div>
        </div>
    );
}

