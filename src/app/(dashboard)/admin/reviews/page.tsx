'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaStar,
    FaShieldAlt,
    FaSearch,
    FaArrowLeft,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
    FaUserEdit,
    FaCommentSlash
} from 'react-icons/fa';
import Link from 'next/link';

const flaggedReviews = [
    { id: 'REV-4401', user: 'Ankit P.', product: 'PowerMix 500', rating: 1, text: 'Terrible product refused to work after 2 days!!!', flag: 'Potential Spam', date: '2026-02-06' },
    { id: 'REV-4402', user: 'Sanjay S.', product: 'EcoCool Fridge', rating: 5, text: 'BEST SERVICE EVER DEFINITELY BUY FROM THIS DEALER', flag: 'Incentivized suspected', date: '2026-02-05' },
    { id: 'REV-4403', user: 'Neha R.', product: 'Smart Iron', rating: 2, text: 'Delivery was late by 10 days, product is okay.', flag: 'Logistic Complaint', date: '2026-02-04' },
];

export default function ReviewGovernancePanel() {
    const [selectedReview, setSelectedReview] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAction = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setSelectedReview(null);
        }, 1200);
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
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Social <span className="text-[#10367D]">Governance</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Review Moderation & Trust Index Audit</p>
                    </div>
                    <div className="px-5 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                        <span className="text-sm font-black text-amber-600">{flaggedReviews.length} Flagged Reviews Awaiting Audit</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Review Stream */}
                <div className="xl:col-span-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Flagged Content Stream</h2>
                        <div className="relative w-48">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                            <input type="text" placeholder="Filter by ID..." className="w-full bg-white border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none" />
                        </div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {flaggedReviews.map((rev) => (
                            <div
                                key={rev.id}
                                onClick={() => setSelectedReview(rev)}
                                className={`p-8 hover:bg-slate-50 cursor-pointer transition-all ${selectedReview?.id === rev.id ? 'bg-[#10367D]/5 border-l-4 border-[#10367D]' : ''}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#1E293B] flex flex-col items-center justify-center text-white">
                                            <span className="text-xs font-black">{rev.rating}</span>
                                            <FaStar className="w-3 h-3 text-amber-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-[#1E293B]">{rev.user} <span className="text-slate-400 font-bold ml-2">• On {rev.product}</span></h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Case {rev.id} • {rev.date}</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md border border-amber-200">{rev.flag}</span>
                                </div>
                                <p className="mt-4 text-xs font-medium text-slate-600 line-clamp-2 leading-relaxed italic">"{rev.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Audit Action Panel */}
                <div className="xl:col-span-5 relative">
                    <AnimatePresence mode="wait">
                        {selectedReview ? (
                            <motion.div
                                key={selectedReview.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-[#1E293B] rounded-[3rem] p-10 lg:p-12 text-white shadow-2xl sticky top-28 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#10367D]/10 blur-2xl rounded-full" />

                                <h3 className="text-xl font-black mb-10 flex items-center gap-3">
                                    <FaShieldAlt className="text-[#10367D]" />
                                    Trust Moderation
                                </h3>

                                <div className="space-y-8">
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 italic text-sm text-slate-300 leading-relaxed">
                                        "{selectedReview.text}"
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audit Context</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                                <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Reason for Flag</p>
                                                <p className="text-[10px] font-black text-amber-400">{selectedReview.flag}</p>
                                            </div>
                                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                                <p className="text-[8px] font-black text-slate-500 uppercase mb-1">User Trust Score</p>
                                                <p className="text-[10px] font-black text-emerald-400">84/100</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 space-y-4">
                                        <button
                                            onClick={handleAction}
                                            disabled={isProcessing}
                                            className="w-full py-5 bg-[#10367D] hover:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {isProcessing ? 'Updating Trust Signals...' : 'Confirm Content Validity'}
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={handleAction}
                                                disabled={isProcessing}
                                                className="py-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all"
                                            >
                                                Suppress Review
                                            </button>
                                            <button className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all">
                                                Warning User
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[600px] border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center text-slate-400">
                                <FaCommentSlash className="w-12 h-12 text-slate-100 mb-6" />
                                <h4 className="text-sm font-black uppercase tracking-widest mb-2">Audit Flagged Feedback</h4>
                                <p className="text-[10px] font-bold leading-relaxed max-w-[200px]">Protect ecosystem trust by moderating suspicious or non-compliant customer feedback.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

