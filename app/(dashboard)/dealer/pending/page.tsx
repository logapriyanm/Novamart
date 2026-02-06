'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaClock as Clock, FaShieldAlt as ShieldCheck, FaEnvelope as Mail, FaPhoneAlt as Phone, FaArrowLeft as ArrowLeft, FaFileContract as FileSearch } from 'react-icons/fa';
import Link from 'next/link';

export default function DealerPendingPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2772A0]/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white/60 backdrop-blur-2xl border border-amber-500/10 rounded-[3rem] p-10 lg:p-16 text-center relative z-10 shadow-2xl shadow-amber-500/5"
            >
                <div className="w-24 h-24 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-amber-500/20 relative">
                    <Clock className="w-12 h-12 text-amber-600 animate-pulse" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-amber-500/20">
                        <FileSearch className="w-4 h-4 text-amber-600" />
                    </div>
                </div>

                <h1 className="text-4xl font-black text-[#1E293B] mb-6 tracking-tight">Credentials <span className="text-amber-600 opacity-80">Under Audit</span></h1>

                <p className="text-[#1E293B]/60 text-lg font-medium italic leading-relaxed mb-12">
                    Your dealer application is currently being verified against our **ledger integrity standards**.
                    Access to the marketplace will be granted once your business details are authenticated.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 text-left">
                    <div className="bg-white/40 p-6 rounded-2xl border border-[#2772A0]/5">
                        <div className="flex items-center gap-3 text-amber-600 mb-3">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1E293B]">SLA Timeline</span>
                        </div>
                        <p className="text-xs text-[#1E293B]/60 font-bold italic">Verification typically completes within 24-48 Business Hours.</p>
                    </div>
                    <div className="bg-white/40 p-6 rounded-2xl border border-[#2772A0]/5">
                        <div className="flex items-center gap-3 text-[#2772A0] mb-3">
                            <Mail className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1E293B]">Notifications</span>
                        </div>
                        <p className="text-xs text-[#1E293B]/60 font-bold italic">We'll alert you via email once your portal is activated.</p>
                    </div>
                </div>

                <div className="pt-8 border-t border-amber-500/10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/" className="w-full sm:w-auto">
                        <button className="w-full px-8 py-4 bg-white border border-[#2772A0]/10 text-[#2772A0] font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-[#2772A0]/5 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                            Return to Home
                        </button>
                    </Link>
                    <button className="w-full sm:w-auto px-8 py-4 bg-[#2772A0] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-[#2772A0]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" />
                        Support Hotline
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
