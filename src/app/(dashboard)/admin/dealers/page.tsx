'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaStore,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationCircle,
    FaEye,
    FaSearch,
    FaArrowLeft,
    FaArrowRight,
    FaIdCard
} from 'react-icons/fa';
import Link from 'next/link';

const pendingDealers = [
    { id: 'DLR-RQ-001', name: 'Elite Electronics Mumbai', gst: '27DLRM2234K1Z0', registered: '2026-02-05', location: 'Andheri, Mumbai', type: 'Premium Dealer', address: 'Shop 22, Crystal Plaza, Andheri West' },
    { id: 'DLR-RQ-002', name: 'South Tech Solutions', gst: '29STCH1122L1Z9', registered: '2026-02-05', location: 'Whitefield, Bangalore', type: 'Authorized Outlet', address: 'Plot 4a, IT Park Road, Whitefield' },
    { id: 'DLR-RQ-003', name: 'Capital Home Appliances', gst: '07CAPA1122M1Z8', registered: '2026-02-06', location: 'Nehru Place, Delhi', type: 'Regional Distributor', address: 'B-Block, Nehru Place Commercial Complex' },
];

export default function DealerApprovalPanel() {
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleAction = (status: 'APPROVED' | 'REJECTED') => {
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setSelectedRequest(null);
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
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Dealer <span className="text-[#10367D]">Onboarding</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">High-Trust Retail Verification Protocol</p>
                    </div>
                    <div className="px-5 py-2.5 bg-[#10367D]/5 border border-[#10367D]/10 rounded-xl">
                        <span className="text-sm font-black text-[#10367D]">{pendingDealers.length} Outlets Pending</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Pending Requests List */}
                <div className="xl:col-span-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white">
                        <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Retail Enrollment Queue</h2>
                        <div className="relative w-64">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                            <input type="text" placeholder="Search by Dealer ID..." className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:bg-white transition-all" />
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {pendingDealers.map((dlr) => (
                            <div
                                key={dlr.id}
                                onClick={() => setSelectedRequest(dlr)}
                                className={`p-8 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-all ${selectedRequest?.id === dlr.id ? 'bg-[#10367D]/5 border-l-4 border-[#10367D]' : ''}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-[#10367D]/5 flex items-center justify-center text-[#10367D]">
                                        <FaStore className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-base font-black text-[#1E293B]">{dlr.name}</h4>
                                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-md border border-emerald-500/20">{dlr.type}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-[#10367D] uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-[#10367D]/10">{dlr.id}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                <FaMapMarkerAlt className="w-2.5 h-2.5" />
                                                {dlr.location}
                                            </span>
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
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl sticky top-28"
                            >
                                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                                    <h3 className="text-xl font-black text-[#1E293B]">Retail Audit</h3>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-black text-[#10367D] uppercase tracking-[0.2em]">Queue Priority</span>
                                        <span className="text-xs font-black text-[#10367D]">LEVEL 2 ENROLLMENT</span>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {/* Location Verification */}
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-[#10367D]" />
                                            Physical Existence Check
                                        </p>
                                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-xs font-bold text-[#1E293B]">{selectedRequest.address}</p>
                                            <button className="mt-3 text-[9px] font-black text-[#10367D] uppercase tracking-widest flex items-center gap-2 hover:underline">
                                                View on Satellite Map
                                                <FaArrowRight className="w-2 h-2" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Business Profile */}
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FaIdCard className="text-[#10367D]" />
                                            Legal Registration
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">GST Identification</p>
                                                <p className="text-xs font-black text-[#1E293B]">{selectedRequest.gst}</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Store Type</p>
                                                <p className="text-xs font-black text-[#1E293B]">{selectedRequest.type}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Actions */}
                                    <div className="pt-8 space-y-3">
                                        <button
                                            onClick={() => handleAction('APPROVED')}
                                            disabled={isVerifying}
                                            className="w-full py-5 bg-[#10367D] hover:bg-[#1E5F86] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#10367D]/20 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {isVerifying ? 'Generating Dealer ID...' : 'Authorize Retail Operations'}
                                        </button>
                                        <button
                                            onClick={() => handleAction('REJECTED')}
                                            disabled={isVerifying}
                                            className="w-full py-4 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-colors rounded-2xl"
                                        >
                                            Refuse Dealer License
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[600px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center text-slate-400">
                                <FaStore className="w-12 h-12 text-slate-200 mb-6" />
                                <h4 className="text-sm font-black uppercase tracking-widest mb-2">Select Onboarding Request</h4>
                                <p className="text-[10px] font-bold leading-relaxed max-w-[200px]">Perform business existence audit by selecting a dealer from the enrollment queue.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

