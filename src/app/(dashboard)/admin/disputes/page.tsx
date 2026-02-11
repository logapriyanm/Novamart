'use client';

import React, { useState, useEffect } from 'react';
import {
    FaGavel,
    FaArrowLeft,
    FaInfoCircle,
    FaCheckCircle,
    FaExclamationCircle,
    FaSearch,
    FaTimesCircle
} from 'react-icons/fa';
import Link from 'next/link';
import { adminService } from '@/lib/api/services/admin.service';
import { toast } from 'sonner';

export default function DisputeCenter() {
    const [disputes, setDisputes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDisputes();
    }, []);

    const fetchDisputes = async () => {
        try {
            // Fetch all orders and filter for those with dispute/return status
            // Assuming 'DISPUTED' or 'RETURN_REQUESTED' is the status
            const allOrders = await adminService.getAllOrders();
            const disputedOrders = allOrders.filter(o =>
                o.status === 'DISPUTED' ||
                o.status === 'RETURN_REQUESTED' ||
                o.returnStatus === 'PENDING'
            );
            setDisputes(disputedOrders);
        } catch (error) {
            console.error('Failed to fetch disputes', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (orderId: string, resolution: 'REFUND' | 'REJECT') => {
        try {
            // Using updateOrderStatus or a specific dispute resolution endpoint
            // For now, we'll use updateOrderStatus to simulate resolution
            const action = resolution === 'REFUND' ? 'APPROVE_RETURN' : 'REJECT_RETURN';
            await adminService.updateOrderStatus(orderId, action, {});
            toast.success(`Dispute Resolved: ${resolution}`);
            setDisputes(prev => prev.filter(d => d.id !== orderId));
        } catch (error) {
            toast.error('Failed to resolve dispute');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Mission Control
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Dispute <span className="text-[#10367D]">Resolution</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Arbitration & Conflict Governance</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                </div>
            ) : disputes.length === 0 ? (
                <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm p-20 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-[10px] flex items-center justify-center text-slate-300 mb-6">
                        <FaCheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-black text-[#1E293B] uppercase tracking-widest">No Active Conflicts</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-md">
                        The NovaMart ecosystem is currently operating in harmony. All transactions are proceeding according to protocol.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <h2 className="text-xs font-bold text-[#1E293B] uppercase tracking-widest">Active Disputes ({disputes.length})</h2>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {disputes.map((dispute) => (
                            <div key={dispute.id} className="p-6 hover:bg-slate-50 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[10px] bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                        <FaGavel className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#1E293B]">Order #{dispute.id.slice(0, 8)}</h4>
                                        <p className="text-xs text-slate-500 mt-1 max-w-md line-clamp-1">{dispute.returnReason || 'No reason provided'}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase">{dispute.dealer?.businessName}</span>
                                            <span className="text-[10px] font-bold text-slate-300">•</span>
                                            <span className="text-[10px] font-bold text-slate-400">₹{dispute.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleResolve(dispute.id, 'REJECT')}
                                        className="px-4 py-2 border border-slate-200 text-slate-600 rounded-[10px] text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleResolve(dispute.id, 'REFUND')}
                                        className="px-4 py-2 bg-black text-white rounded-[10px] text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-blue-500/10"
                                    >
                                        Approve Refund
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
