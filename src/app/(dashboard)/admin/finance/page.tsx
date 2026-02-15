'use client';

import React, { useState, useEffect } from 'react';
import {
    FaWallet,
    FaArrowLeft,
    FaExchangeAlt,
    FaLock,
    FaUnlockAlt,
    FaHandHoldingUsd,
    FaHistory,
    FaExclamationTriangle
} from 'react-icons/fa';
import Link from 'next/link';
import { adminService } from '@/lib/api/services/admin.service';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

export default function FinanceDashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, HELD, RELEASED, REFUNDED

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllOrders();
            // In Phase 5/7 we will move this filtering to backend
            setOrders(data || []);
        } catch (error) {
            console.error('Fetch finance error:', error);
            toast.error('Failed to load financial data');
        } finally {
            setLoading(false);
        }
    };

    const handleRelease = async (orderId: string) => {
        if (!confirm('Are you sure you want to release funds to the seller? This action cannot be undone.')) return;
        try {
            await apiClient.put(`/admin/escrow/settle/${orderId}`, {});
            toast.success('Funds Released to Dealer');
            fetchOrders();
        } catch (error) {
            toast.error('Settlement Failed');
        }
    };

    const handleRefund = async (orderId: string) => {
        if (!confirm('Are you sure you want to refund this order? This action cannot be undone.')) return;
        try {
            await apiClient.post(`/admin/escrow/refund/${orderId}`, { amount: 0, isPartial: false });
            toast.success('Full Refund Initiated');
            fetchOrders();
        } catch (error) {
            toast.error('Refund Failed');
        }
    };

    const deriveEscrowStatus = (status: string) => {
        if (['PAID', 'SHIPPED', 'DELIVERED'].includes(status)) return 'HELD';
        if (['DISPUTED', 'RETURN_REQUESTED'].includes(status)) return 'DISPUTED';
        if (['COMPLETED'].includes(status)) return 'RELEASED';
        if (['CANCELLED', 'REFUNDED'].includes(status)) return 'REFUNDED';
        return 'UNKNOWN';
    };

    const filteredOrders = orders.filter(o => {
        const escrowStatus = deriveEscrowStatus(o.status);
        if (filter === 'ALL') return ['HELD', 'DISPUTED', 'RELEASED', 'REFUNDED'].includes(escrowStatus);
        return escrowStatus === filter;
    });

    const totalHeld = orders
        .filter(o => ['PAID', 'SHIPPED', 'DELIVERED', 'DISPUTED'].includes(o.status))
        .reduce((acc, o) => acc + Number(o.totalAmount), 0);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="flex items-center gap-2 text-sm font-bold text-[#067FF9] hover:translate-x-[-4px] transition-transform w-fit">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Dashboard
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight uppercase italic">Finance & <span className="text-[#067FF9]">Escrow</span></h1>
                    <p className="text-slate-400 font-medium text-sm mt-1">Settlement Authority & Fund Management</p>
                </div>
            </div>

            {/* Escrow Vault */}
            <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-[#067FF9] text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-sm font-black flex items-center gap-3">
                            <FaLock className="text-emerald-400" />
                            Escrow Reserve
                        </h2>
                        <p className="text-sm font-bold text-blue-200 mt-1">
                            Funds held securely until delivery checks pass.
                        </p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-[10px] backdrop-blur-sm border border-white/10">
                        <p className="text-sm font-black text-blue-200 uppercase tracking-wider">Total Active Hold</p>
                        <p className="text-3xl font-black">₹{totalHeld.toLocaleString()}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-2 overflow-x-auto">
                    {['ALL', 'HELD', 'RELEASED', 'REFUNDED', 'DISPUTED'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-[#067FF9] text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                        >
                            {f === 'ALL' ? 'All Transactions' : f}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Order Reference</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Beneficiary</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan={5} className="p-10 text-center text-sm font-bold text-slate-400">Loading Financial Data...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan={5} className="p-10 text-center text-sm font-bold text-slate-400">No records found for filter: {filter}</td></tr>
                            ) : filteredOrders.map((order) => {
                                const escrowStatus = deriveEscrowStatus(order.status);
                                return (
                                    <tr key={order.id || order._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-[#1E293B]">#{(order.id || order._id).slice(-8).toUpperCase()}</p>
                                            <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4 font-black text-[#1E293B]">₹{Number(order.totalAmount).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-md border ${escrowStatus === 'HELD' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    escrowStatus === 'RELEASED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        escrowStatus === 'DISPUTED' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                            'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}>
                                                {escrowStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                                            {order.sellerId?.businessName || order.dealer?.businessName || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {escrowStatus === 'HELD' || escrowStatus === 'DISPUTED' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleRefund(order.id || order._id)}
                                                            className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-md text-xs font-bold hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                                                            title="Refund to Customer"
                                                        >
                                                            Refund
                                                        </button>
                                                        <button
                                                            onClick={() => handleRelease(order.id || order._id)}
                                                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all border border-emerald-100"
                                                            title="Release to Seller"
                                                        >
                                                            Release
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-xs font-medium text-slate-400">Settled</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
