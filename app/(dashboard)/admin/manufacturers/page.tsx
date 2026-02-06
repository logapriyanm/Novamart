'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaIndustry,
    FaFileAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationCircle,
    FaEye,
    FaSearch,
    FaArrowLeft
} from 'react-icons/fa';
import Link from 'next/link';

const pendingManufacturers = [
    { id: 'MFG-RQ-001', name: 'Mega-Mart Manufacturing Inc.', gst: '27AAECM1234F1Z5', registered: '2026-02-01', location: 'Maharashtra, India', docs: ['GST Cert', 'Factory License', 'ISO 9001'] },
    { id: 'MFG-RQ-002', name: 'Nexus Appliance Corp', gst: '29ABCDE1234G1Z2', registered: '2026-02-03', location: 'Karnataka, India', docs: ['GST Cert', 'Trade License'] },
    { id: 'MFG-RQ-003', name: 'Hind Silicon Systems', gst: '09AAACH1122J1Z0', registered: '2026-02-04', location: 'Uttar Pradesh, India', docs: ['GST Cert', 'Plant Registry'] },
];

export default function ManufacturerApprovalPanel() {
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleAction = (status: 'APPROVED' | 'REJECTED') => {
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setSelectedRequest(null);
            // In a real app, this would refresh the list
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
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Manufacturer <span className="text-[#10367D]">Verification</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Audit Protocol for Industrial Entities</p>
                    </div>
                    <div className="px-5 py-2.5 bg-[#10367D]/5 border border-[#10367D]/10 rounded-xl">
                        <span className="text-sm font-black text-[#10367D]">{pendingManufacturers.length} Requests Pending</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Pending Requests List */}
                <div className="xl:col-span-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Active Request Queue</h2>
                        <div className="relative w-64">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                            <input type="text" placeholder="Search by GST or ID..." className="w-full bg-white border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none" />
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {pendingManufacturers.map((mfg) => (
                            <div
                                key={mfg.id}
                                onClick={() => setSelectedRequest(mfg)}
                                className={`p-8 flex items-center justify-between hover:bg-[#10367D]/5 cursor-pointer transition-all ${selectedRequest?.id === mfg.id ? 'bg-[#10367D]/5 border-l-4 border-[#10367D]' : ''}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#10367D]/10 group-hover:text-[#10367D] transition-colors">
                                        <FaIndustry className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-black text-[#1E293B]">{mfg.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-black text-[#10367D] uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-[#10367D]/10">{mfg.id}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mfg.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <FaEye className="w-4 h-4 text-slate-300" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Audit & Verification Panel */}
                <div className="xl:col-span-5 relative">
                    <AnimatePresence mode="wait">
                        {selectedRequest ? (
                            <motion.div
                                key={selectedRequest.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-[#1E293B] rounded-[3rem] p-10 text-white shadow-2xl sticky top-28"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-xl font-black tracking-tight">Audit Checklist</h3>
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-[#10367D] px-3 py-1 rounded-full">Protocol V2.4</span>
                                </div>

                                <div className="space-y-8">
                                    {/* GST Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GST Verification</p>
                                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                                <FaCheckCircle className="w-2.5 h-2.5" />
                                                API Validated
                                            </span>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 font-mono text-xs tracking-wider">
                                            {selectedRequest.gst}
                                        </div>
                                    </div>

                                    {/* Documents Section */}
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted Assets</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {selectedRequest.docs.map((doc: string) => (
                                                <button key={doc} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-left">
                                                    <div className="flex items-center gap-3">
                                                        <FaFileAlt className="w-4 h-4 text-[#10367D]" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{doc}</span>
                                                    </div>
                                                    <FaEye className="w-3 h-3 text-slate-500" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Area */}
                                    <div className="pt-8 space-y-4">
                                        <button
                                            onClick={() => handleAction('APPROVED')}
                                            disabled={isVerifying}
                                            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {isVerifying ? 'Updating Platform State...' : 'Approve Entity Gateway'}
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => handleAction('REJECTED')}
                                                disabled={isVerifying}
                                                className="py-4 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-600/30 text-rose-500 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all"
                                            >
                                                Deny Entry
                                            </button>
                                            <button className="py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all">
                                                Request Info
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[600px] border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center text-slate-400">
                                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                                    <FaExclamationCircle className="w-10 h-10 text-slate-200" />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-widest mb-2">Audit Selection Required</h4>
                                <p className="text-[10px] font-bold leading-relaxed max-w-[200px]">Select a request from the queue to initiate verification protocol.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

