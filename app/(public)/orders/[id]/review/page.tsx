'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaStar,
    FaCheckCircle,
    FaShieldAlt,
    FaCamera,
    FaArrowRight,
    FaInfoCircle,
    FaGavel
} from 'react-icons/fa';
import Link from 'next/link';

export default function CustomerReviewPortal() {
    const [rating, setRating] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white rounded-[3.5rem] p-12 text-center shadow-2xl border border-slate-100"
                >
                    <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-10 shadow-xl shadow-emerald-500/20">
                        <FaCheckCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-black text-[#1E293B] mb-4">Feedback Locked</h2>
                    <p className="text-sm font-medium text-slate-400 mb-10 leading-relaxed uppercase">
                        Your review has been logged into the <span className="text-[#10367D]">Platform Trust Ledger</span>. Feedback directly impacts dealer reputation scores.
                    </p>
                    <Link href="/orders" className="inline-block w-full py-5 bg-[#10367D] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#10367D]/20">
                        Return to Orders
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 bg-slate-50/50">
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-[#1E293B] tracking-tight">Governance <span className="text-[#10367D]">Feedback</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Post-Delivery Experience Protocol • Order #ORD-8821</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-10">
                        <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm space-y-12">
                            {/* Product Satisfaction */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-widest italic">1. Product Integrity</h3>
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onMouseEnter={() => setRating(s)}
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${rating >= s ? 'bg-[#10367D] text-white shadow-lg shadow-[#10367D]/20' : 'bg-slate-50 text-slate-200'}`}
                                        >
                                            <FaStar className="w-6 h-6" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Detailed Feedback */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Describe Performance & Condition</label>
                                <textarea
                                    rows={5}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-6 px-8 text-sm font-medium focus:outline-none focus:border-[#10367D]/30"
                                    placeholder="Was the original seal intact? Does it match manufacturer specifications?"
                                />
                            </div>

                            {/* Proof Upload */}
                            <div className="p-10 border-2 border-dashed border-slate-100 rounded-[3rem] text-center space-y-4 group hover:border-[#10367D]/30 transition-all cursor-pointer">
                                <FaCamera className="w-8 h-8 mx-auto text-slate-200 group-hover:text-[#10367D] transition-colors" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#1E293B]">Attach Quality Photo Evidence</p>
                            </div>
                        </div>

                        <button className="w-full py-6 bg-[#10367D] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#10367D]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                            Log Feedback for Audit
                            <FaArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Sidebar: Governance Rules */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="p-10 bg-[#1E293B] rounded-[3rem] text-white shadow-2xl space-y-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#10367D] flex items-center justify-center text-white">
                                <FaShieldAlt className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-black tracking-tight italic">Quality Governance</h4>
                            <p className="text-xs font-medium text-slate-500 leading-relaxed italic uppercase">
                                "Reviews are verified against the <span className="text-white">Batch ID</span> to prevent fake rating manipulation."
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[
                                    { t: 'Fraud Protection', d: 'Reviews are moderated by platform governors.' },
                                    { t: 'Reputation Impact', d: 'Low scores trigger dealer warning protocols.' },
                                    { t: 'Batch Trace', d: 'Feedback is linked to original production batch.' },
                                ].map((p, i) => (
                                    <li key={i} className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#10367D]">{p.t}</span>
                                        <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase leading-tight">{p.d}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-10 bg-white border border-slate-100 rounded-[3rem] space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FaInfoCircle className="text-[#10367D]" /> Resolution Path
                            </h3>
                            <p className="text-[10px] font-black text-[#1E293B] uppercase italic">Product Mismatch?</p>
                            <Link href="/support/dispute" className="text-[10px] font-black text-[#10367D] uppercase tracking-[0.1em] flex items-center gap-2 hover:translate-x-2 transition-transform">
                                Initiate Governance Dispute
                                <FaArrowRight className="w-2 h-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
