'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaArrowLeft,
    FaHeadset,
    FaUndo,
    FaExclamationTriangle,
    FaCheckCircle,
    FaEnvelopeOpenText,
    FaUserCircle,
    FaArrowRight,
    FaHistory
} from 'react-icons/fa';
import Link from 'next/link';

const supportTickets = [
    { id: 'TIC-9901', customer: 'Rohan Gupta', subject: 'Installation Query', status: 'Open', priority: 'Medium', date: '2h ago' },
    { id: 'TIC-9900', customer: 'Isha Khan', subject: 'Damaged Packaging', status: 'Resolved', priority: 'High', date: '5h ago' },
];

const returnRequests = [
    { id: 'RET-8801', order: 'ORD-RT-99801', item: 'Ultra-Quiet AC 2.0', reason: 'Defective Unit', status: 'Pending Approval', date: '1h ago' },
];

export default function SellerSupportPortal() {
    return (
        <div className="space-y-8 animate-fade-in pb-12 text-slate-900">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/seller" className="flex items-center gap-2 text-sm font-black text-[#067FF9] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Command Center
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Support <span className="text-[#067FF9]">Desk</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">Returns Management & Consumer Conflict Resolution</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Returns Management */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="p-3 bg-rose-50 text-rose-500 rounded-[10px] border border-rose-100">
                                <FaUndo className="w-5 h-5" />
                            </span>
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Return Requests</h2>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {returnRequests.map((ret) => (
                            <div key={ret.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm group hover:border-rose-100 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-sm font-black text-[#067FF9] uppercase tracking-widest">{ret.id}</span>
                                        <h3 className="text-lg font-black tracking-tight mt-1">{ret.item}</h3>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Ref Order: {ret.order}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-widest rounded-full">{ret.status}</span>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-[10px] border border-slate-100 mb-6">
                                    <p className="text-xs font-black text-slate-400 uppercase mb-1">Reason for Return</p>
                                    <p className="text-xs font-bold text-slate-900">{ret.reason}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button className="flex-1 py-3 bg-[#067FF9] text-white rounded-[10px] text-sm font-black uppercase tracking-widest hover:scale-105 transition-all">Approve & Settle</button>
                                    <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-400 rounded-[10px] text-sm font-black uppercase tracking-widest hover:text-rose-500 transition-all">Reject Claim</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Query Stream */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="p-3 bg-blue-50 text-[#067FF9] rounded-[10px] border border-blue-100">
                                <FaHeadset className="w-5 h-5" />
                            </span>
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Consumer Queries</h2>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                        {supportTickets.map((tic) => (
                            <div key={tic.id} className="p-8 hover:bg-slate-50 transition-all group flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-[10px] bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#067FF9] group-hover:text-white transition-all shadow-sm">
                                        <FaEnvelopeOpenText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900">{tic.subject}</h4>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{tic.customer} • {tic.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${tic.status === 'Open' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                        }`}>{tic.status}</span>
                                    <button className="p-3 bg-white border border-slate-100 rounded-[10px] text-[#067FF9] hover:bg-[#067FF9] hover:text-white transition-all">
                                        <FaArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 bg-blue-50/50 border border-[#067FF9]/10 rounded-[2.5rem] flex items-center gap-6">
                        <div className="w-12 h-12 rounded-[10px] bg-white text-[#067FF9] flex items-center justify-center border border-blue-100 shadow-sm">
                            <FaExclamationTriangle className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-900 uppercase tracking-[0.15em] leading-relaxed">
                            Support SLA: Responses must be delivered within 4 hours. Persistent delays affect Batch ID Trust Ratings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

