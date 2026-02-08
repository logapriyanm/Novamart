'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationCircle,
    FaShieldAlt,
    FaArrowLeft,
    FaBox,
    FaIndustry,
    FaInfoCircle,
    FaSearch,
    FaGavel
} from 'react-icons/fa';
import Link from 'next/link';
import { apiClient } from '../../../../lib/api/client';
import { useSnackbar } from '../../../../client/context/SnackbarContext';

export default function AdminProductApproval() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [auditStatus, setAuditStatus] = useState<null | 'APPROVED' | 'REJECTED'>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    const fetchPendingProducts = async () => {
        try {
            const data = await apiClient.get<any[]>('/products?status=PENDING');
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAudit = async (status: 'APPROVED' | 'REJECTED') => {
        if (!selectedProduct) return;

        if (status === 'REJECTED' && !rejectionReason && !showRejectModal) {
            setShowRejectModal(true);
            return;
        }

        try {
            // Admin endpoint for formal approval audit
            await apiClient.put(`/admin/products/${selectedProduct.id}/approve`, {
                isApproved: status === 'APPROVED',
                rejectionReason: status === 'REJECTED' ? rejectionReason : undefined
            });

            setAuditStatus(status);
            setTimeout(() => {
                setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
                setSelectedProduct(null);
                setAuditStatus(null);
                setShowRejectModal(false);
                setRejectionReason('');
            }, 1000);
            showSnackbar(`Product ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`, 'success');
        } catch (error) {
            showSnackbar('Failed to update status', 'error');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Mission Control
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight italic">Governance <span className="text-[#10367D]">Queue</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Product Verification & Compliance Terminal</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* List View */}
                <div className="xl:col-span-7 space-y-8">
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                            <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em] italic">Awaiting Platform Audit</h2>
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                                <input type="text" placeholder="Search Filter..." className="bg-white border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-[#10367D]/30" />
                            </div>
                        </div>
                        <div className="divide-y divide-slate-50 min-h-[300px]">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Pipeline...</div>
                            ) : products.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-slate-400 text-xs font-bold uppercase tracking-widest">No Pending Audits</div>
                            ) : (
                                products.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedProduct(item)}
                                        className={`p-10 hover:bg-slate-50/50 transition-all cursor-pointer group flex items-center justify-between ${selectedProduct?.id === item.id ? 'bg-blue-50/30 border-l-4 border-l-[#10367D]' : ''}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-[#10367D] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <FaBox className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-[#1E293B]">{item.name}</h4>
                                                <div className="flex items-center gap-2 mt-1 italic">
                                                    <FaIndustry className="w-2.5 h-2.5 text-slate-400" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.manufacturer?.companyName || 'Unknown Corp'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                                {new Date(item.updatedAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-[8px] font-black uppercase px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100">Pending Review</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="p-10 bg-blue-50/50 border border-[#10367D]/10 rounded-[3rem] flex items-center gap-8">
                        <div className="w-16 h-16 rounded-[1.8rem] bg-white text-[#10367D] border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                            <FaShieldAlt className="w-8 h-8" />
                        </div>
                        <p className="text-[10px] font-bold text-[#1E293B] uppercase tracking-widest leading-relaxed">
                            Audit Protocol: Verify Tax slabs, ISO certifications, and technical safety specs. Verified items become visible to the **Dealer Distribution Network** immediately.
                        </p>
                    </div>
                </div>

                {/* Detail/Verification View */}
                <div className="xl:col-span-5 relative">
                    <AnimatePresence mode="wait">
                        {selectedProduct ? (
                            <motion.div
                                key={selectedProduct.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="h-full bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col"
                            >
                                <div className="p-10 bg-[#1E293B] text-white">
                                    <h3 className="text-2xl font-black tracking-tight">{selectedProduct.name}</h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2 italic">Product Verification Sheet • {selectedProduct.id.slice(0, 8)}</p>
                                </div>

                                <div className="flex-1 p-10 space-y-10 overflow-y-auto custom-scrollbar">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Proposed Price</p>
                                            <p className="text-lg font-black text-[#1E293B]">₹{selectedProduct.basePrice}</p>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Category</p>
                                            <p className="text-lg font-black text-[#1E293B]">{selectedProduct.category}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <FaInfoCircle className="text-[#10367D]" /> Description
                                        </h4>
                                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 text-sm font-bold text-[#1E293B] italic leading-relaxed">
                                            {selectedProduct.description}
                                        </div>
                                    </div>

                                    {auditStatus && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-10 rounded-[2.5rem] text-center ${auditStatus === 'APPROVED' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}
                                        >
                                            <FaGavel className="w-8 h-8 mx-auto mb-4" />
                                            <p className="text-lg font-black uppercase tracking-widest italic">{auditStatus} Protocol Initiated</p>
                                        </motion.div>
                                    )}

                                    {showRejectModal && (
                                        <div className="space-y-4 bg-rose-50 p-6 rounded-3xl border border-rose-100">
                                            <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest">Reason for Rejection</h4>
                                            <textarea
                                                className="w-full h-24 rounded-xl border border-rose-200 p-3 text-xs font-bold text-rose-800"
                                                placeholder="Enter conformance violation details..."
                                                value={rejectionReason}
                                                onChange={e => setRejectionReason(e.target.value)}
                                            />
                                            <button
                                                onClick={() => handleAudit('REJECTED')}
                                                className="w-full py-3 bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest"
                                            >
                                                Confirm Rejection
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="p-10 border-t border-slate-50 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleAudit('APPROVED')}
                                            disabled={!!auditStatus}
                                            className="flex-1 py-5 bg-[#10367D] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            <FaCheckCircle className="w-3 h-3" />
                                            Approve Asset
                                        </button>
                                        <button
                                            onClick={() => handleAudit('REJECTED')}
                                            disabled={!!auditStatus}
                                            className="flex-1 py-5 bg-white border border-rose-100 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            <FaTimesCircle className="w-3 h-3" />
                                            Reject with Reason
                                        </button>
                                    </div>
                                    <p className="text-[8px] font-black text-slate-400 text-center uppercase tracking-widest">Decision triggers immediate automated email notification to manufacturer.</p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full bg-slate-50/30 rounded-[3.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-12">
                                <FaExclamationCircle className="w-16 h-16 text-slate-200 mb-6" />
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Select Entity for Audit</h3>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2 max-w-[200px]">Commence governance review by choosing a pending submission.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

