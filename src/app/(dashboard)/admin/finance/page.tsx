'use client';

import React, { useState, useEffect } from 'react';
import {
    FaWallet,
    FaArrowLeft,
    FaExchangeAlt,
    FaLock,
    FaUnlockAlt,
    FaHandHoldingUsd,
    FaHistory
} from 'react-icons/fa';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { useSnackbar } from '@/client/context/SnackbarContext';

export default function FinanceDashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        // Fetch orders and filter for PAID status locally for now, 
        // ideally backend should have /admin/escrow endpoint
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await apiClient.get<any[]>('/orders');
            // Filter only PAID (Escrow Held) orders
            setOrders(data.filter((o: any) => o.status === 'PAID') || []);
        } catch (error) {
            console.error('Fetch finance error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRelease = async (orderId: string) => {
        try {
            await apiClient.put(`/admin/escrow/settle/${orderId}`, {});
            showSnackbar('Funds Released to Dealer', 'success');
            fetchOrders();
        } catch (error) {
            showSnackbar('Settlement Failed', 'error');
        }
    };

    const handleRefund = async (orderId: string) => {
        try {
            await apiClient.post(`/admin/escrow/refund/${orderId}`, { amount: 0, isPartial: false });
            showSnackbar('Full Refund Initiated', 'success');
            fetchOrders();
        } catch (error) {
            showSnackbar('Refund Failed', 'error');
        }
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
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Financial <span className="text-[#10367D]">Governance</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Escrow Vault & Settlement Core</p>
                    </div>
                </div>
            </div>

            {/* Escrow Vault */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-50 bg-[#10367D] text-white flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                            <FaLock className="text-emerald-400" />
                            Active Escrow Holds
                        </h2>
                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mt-1">
                            Funds held securely until delivery confirmation
                        </p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                        <p className="text-[9px] font-black uppercase text-blue-200">Total Held Value</p>
                        <p className="text-2xl font-black">₹{orders.reduce((acc, o) => acc + Number(o.totalAmount), 0).toLocaleString()}</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Beneficiary (Dealer)</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Settlement Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan={4} className="p-10 text-center text-xs font-bold text-slate-400 uppercase">Loading Vault...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={4} className="p-10 text-center text-xs font-bold text-slate-400 uppercase">No Active Holds. All funds settled.</td></tr>
                            ) : orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-10 py-6 font-bold text-[#1E293B]">#{order.id.slice(0, 8)}</td>
                                    <td className="px-10 py-6 font-black text-[#1E293B]">₹{Number(order.totalAmount).toLocaleString()}</td>
                                    <td className="px-10 py-6 text-sm text-slate-600">{order.dealer?.businessName}</td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleRefund(order.id)}
                                                className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                                            >
                                                <FaHistory className="inline mr-1" /> Refund
                                            </button>
                                            <button
                                                onClick={() => handleRelease(order.id)}
                                                className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                                            >
                                                <FaUnlockAlt className="inline mr-1" /> Release
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
