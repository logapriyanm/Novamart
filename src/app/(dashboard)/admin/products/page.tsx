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
import { adminService } from '@/lib/api/services/admin.service';
import Loader from '@/client/components/ui/Loader';
import { toast } from 'sonner';

export default function AdminProductManagement() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [auditStatus, setAuditStatus] = useState<null | 'APPROVED' | 'REJECTED'>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    // const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            const data = await adminService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (status: string, isApproved: boolean = true) => {
        if (!selectedProduct) return;

        if (status === 'REJECTED' && !rejectionReason && !showRejectModal) {
            setShowRejectModal(true);
            return;
        }

        try {
            await adminService.approveProduct(selectedProduct.id || selectedProduct._id, isApproved, rejectionReason || undefined, status);

            setAuditStatus(status as any);
            setTimeout(() => {
                setProducts(prev => prev.map(p => (p.id === selectedProduct.id || p._id === selectedProduct._id) ? { ...p, status } : p));
                setSelectedProduct(prev => ({ ...prev, status }));
                setAuditStatus(null);
                setShowRejectModal(false);
                setRejectionReason('');
            }, 1000);
            toast.success(`Product status updated to ${status}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col gap-1 border-b border-foreground/5 pb-8">
                <Link href="/admin" className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:translate-x-[-4px] transition-transform mb-4">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Console
                </Link>
                <h1 className="text-2xl font-bold text-[#1E293B]">Product Management</h1>
                <p className="text-sm text-slate-400 font-medium">Manage visibility and audit catalog submissions.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* List View */}
                <div className="xl:col-span-7 space-y-6">
                    <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                            <h2 className="text-xs font-bold text-[#1E293B] uppercase tracking-widest">Master Catalog</h2>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                                <input type="text" placeholder="Filter..." className="bg-white border border-slate-100 rounded-[10px] py-1.5 pl-9 pr-4 text-[10px] font-medium focus:outline-none focus:border-primary/30" />
                            </div>
                        </div>
                        <div className="divide-y divide-slate-50 min-h-[400px]">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full py-20">
                                    <Loader size="md" variant="primary" />
                                </div>
                            ) : products.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-slate-400 text-xs font-bold py-20 uppercase tracking-widest">No Products</div>
                            ) : (
                                products.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedProduct(item)}
                                        className={`p-6 hover:bg-slate-50 transition-all cursor-pointer group flex items-center justify-between ${selectedProduct?.id === item.id ? 'bg-blue-50/30 border-l-4 border-l-primary' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-[10px] bg-white border border-slate-100 text-primary flex items-center justify-center shadow-sm">
                                                <FaBox className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-[#1E293B]">{item.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.manufacturerId?.companyName || item.manufacturer?.companyName || 'Unknown Corp'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                                {new Date(item.updatedAt).toLocaleDateString()}
                                            </span>
                                            <span className={`text-[8px] font-bold uppercase px-3 py-1 rounded-[10px] border ${item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                item.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    item.status === 'DISABLED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                        'bg-slate-50 text-slate-600 border-slate-100'
                                                }`}>
                                                {item.status || 'Draft'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Detail/Verification View */}
                <div className="xl:col-span-5 relative">
                    <AnimatePresence mode="wait">
                        {selectedProduct ? (
                            <motion.div
                                key={selectedProduct.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="h-full bg-white rounded-[10px] border border-slate-100 shadow-xl overflow-hidden flex flex-col"
                            >
                                <div className="p-8 bg-black text-white">
                                    <h3 className="text-xl font-bold tracking-tight">{selectedProduct.name}</h3>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Management Record • {(selectedProduct.id || selectedProduct._id)?.slice(0, 8)}</p>
                                </div>

                                <div className="flex-1 p-8 space-y-8 overflow-y-auto">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-[10px] border border-slate-100">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Base Price</p>
                                            <p className="text-base font-bold text-[#1E293B]">₹{selectedProduct.basePrice}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-[10px] border border-slate-100">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Category</p>
                                            <p className="text-base font-bold text-[#1E293B]">{selectedProduct.category}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Specification</h4>
                                        <div className="bg-slate-50 p-6 rounded-[10px] border border-slate-100 text-xs font-medium text-slate-600 leading-relaxed">
                                            {selectedProduct.description}
                                        </div>
                                    </div>

                                    {auditStatus && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-6 rounded-[10px] text-center ${auditStatus === 'APPROVED' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}
                                        >
                                            <p className="text-sm font-bold uppercase tracking-widest">{auditStatus} Processed</p>
                                        </motion.div>
                                    )}

                                    {showRejectModal && (
                                        <div className="space-y-3 bg-rose-50 p-5 rounded-[10px] border border-rose-100">
                                            <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Rejection Reason</h4>
                                            <textarea
                                                className="w-full h-20 rounded-[10px] border border-rose-200 p-2 text-xs font-medium"
                                                placeholder="Compliance violation details..."
                                                value={rejectionReason}
                                                onChange={e => setRejectionReason(e.target.value)}
                                            />
                                            <button
                                                onClick={() => handleStatusUpdate('REJECTED', false)}
                                                className="w-full py-2.5 bg-rose-500 text-white rounded-[10px] text-xs font-bold uppercase tracking-widest"
                                            >
                                                Confirm Rejection
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 border-t border-slate-50 space-y-3">
                                    <div className="flex flex-col gap-3">
                                        {selectedProduct.status === 'PENDING' ? (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleStatusUpdate('APPROVED', true)}
                                                    disabled={!!auditStatus}
                                                    className="flex-1 py-4 bg-emerald-600 text-white rounded-[10px] font-bold text-[10px] uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                                                >
                                                    Unblock / Approve
                                                </button>
                                                <button
                                                    onClick={() => setShowRejectModal(true)}
                                                    disabled={!!auditStatus}
                                                    className="flex-1 py-4 bg-white border border-rose-100 text-rose-500 rounded-[10px] font-bold text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all disabled:opacity-50"
                                                >
                                                    Block Asset
                                                </button>
                                            </div>
                                        ) : selectedProduct.status === 'APPROVED' ? (
                                            <button
                                                onClick={() => handleStatusUpdate('DISABLED', false)}
                                                disabled={!!auditStatus}
                                                className="w-full py-4 bg-rose-600 text-white rounded-[10px] font-bold text-[10px] uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                                            >
                                                Block from Website
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusUpdate('APPROVED', true)}
                                                disabled={!!auditStatus}
                                                className="w-full py-4 bg-emerald-600 text-white rounded-[10px] font-bold text-[10px] uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                                            >
                                                Unblock / Approve
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[8px] font-medium text-slate-400 text-center uppercase tracking-widest">Updates are reflected on the platform in real-time.</p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full bg-slate-50/50 rounded-[10px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12">
                                <FaExclamationCircle className="w-12 h-12 text-slate-200 mb-4" />
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Item to Audit</h3>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

