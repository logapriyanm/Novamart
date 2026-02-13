'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaRegClock, FaShieldAlt, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function SellerPendingVerification() {
    return (
        <div className="min-h-screen bg-[#EBEBEB] flex items-center justify-center p-6">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
                {/* Left: Illustration/Info */}
                <div className="bg-[#1E293B] p-12 lg:p-16 text-white relative flex flex-col justify-between">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10367D]/20 to-transparent" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-[#10367D] flex items-center justify-center mb-10 shadow-lg shadow-[#10367D]/20">
                            <FaShieldAlt className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-6">Marketplace <br />Safety Audit</h1>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            NovaMart maintains a high-trust ecosystem. Every seller is manually verified to ensure tax compliance and business legitimacy.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6 pt-12 border-t border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <FaCheckCircle className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Documents Received</span>
                        </div>
                        <div className="flex items-center gap-4 opacity-50">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="text-xs font-black">2</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Admin Review</span>
                        </div>
                        <div className="flex items-center gap-4 opacity-50">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="text-xs font-black">3</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Batch ID Issued</span>
                        </div>
                    </div>
                </div>

                {/* Right: Status */}
                <div className="p-12 lg:p-16 flex flex-col justify-center text-center">
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-24 h-24 bg-amber-50 rounded-[2.5rem] flex items-center justify-center text-amber-500 mx-auto mb-8 border border-amber-100"
                    >
                        <FaRegClock className="w-10 h-10" />
                    </motion.div>
                    <h2 className="text-2xl font-black text-[#1E293B] mb-4 tracking-tight">Access Gate Locked</h2>
                    <p className="text-slate-400 font-medium text-sm leading-relaxed mb-10">
                        Your application is currently in the <span className="text-amber-600 font-bold">Review Pipeline</span>.
                        Verification typically concludes within 24 hours. You will be notified once supply channels are activated.
                    </p>
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center justify-center gap-2 w-full py-4 bg-[#10367D] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all">
                            Explore Marketplace
                        </Link>
                        <Link href="/support" className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-[#1E293B] transition-all">
                            Contact Verification Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

