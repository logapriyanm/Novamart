'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaWallet,
    FaArrowUp,
    FaHistory,
    FaMoneyBillWave,
    FaUniversity,
    FaExclamationCircle,
    FaCheckCircle,
    FaCalendarAlt
} from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import Loader from '@/client/components/ui/Loader';

// Helper for currency formatting
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

export default function PaymentsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [payoutStatus, setPayoutStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');

    useEffect(() => {
        fetchFinancials();
    }, []);

    const fetchFinancials = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<any>('/seller/analytics');
            if (res.data?.success) {
                setStats(res.data.data.finance);
            }
        } catch (error) {
            console.error('Failed to load financials:', error);
            toast.error('Failed to load financial data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestPayout = async () => {
        setPayoutStatus('PROCESSING');
        // Mock payout request for now as per controller behavior
        setTimeout(() => {
            setPayoutStatus('SUCCESS');
            toast.success('Payout request submitted successfully');
            setTimeout(() => setPayoutStatus('IDLE'), 3000);
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader size="xl" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-8 animate-fade-in text-slate-900">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">Payments & <span className="text-[#067FF9]">Earnings</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">
                        Manage your wallet, payouts and transaction history
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchFinancials}
                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        title="Refresh Data"
                    >
                        <FaHistory className="w-4 h-4" />
                    </button>
                    <div className="px-4 py-2 bg-slate-100 rounded-[10px] border border-slate-200">
                        <span className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                            <FaUniversity className="w-3 h-3" /> Default Bank: HDFC **** 4582
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Revenue */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-[10px] shadow-lg shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FaWallet className="w-24 h-24 text-[#067FF9]" />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Total Revenue</p>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(stats?.totalRevenue || 0)}</h2>
                    <div className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-[4px]">
                        <FaArrowUp className="w-2.5 h-2.5" />
                        <span>+12.5% this month</span>
                    </div>
                </motion.div>

                {/* Monthly Revenue */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-[10px] shadow-lg shadow-slate-200/50 border border-slate-100"
                >
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">This Month</p>
                    <h2 className="text-3xl font-black text-[#067FF9] tracking-tight">{formatCurrency(stats?.monthlyRevenue || 0)}</h2>
                    <p className="text-xs text-slate-400 mt-2 font-medium">Pending settlement: {formatCurrency((stats?.monthlyRevenue || 0) * 0.15)}</p>
                </motion.div>

                {/* Escrow / Pending */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#067FF9] p-6 rounded-[10px] shadow-xl shadow-blue-900/20 text-white relative overflow-hidden"
                >
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <p className="text-sm font-black text-white/60 uppercase tracking-widest mb-2">Escrow Holding</p>
                    <h2 className="text-3xl font-black text-white tracking-tight">{formatCurrency(stats?.escrowHeld || 0)}</h2>

                    <button
                        onClick={handleRequestPayout}
                        disabled={!stats?.escrowHeld || stats.escrowHeld <= 0 || payoutStatus !== 'IDLE'}
                        className="mt-6 w-full py-3 bg-white text-[#067FF9] rounded-[8px] font-black text-xs uppercase tracking-wider hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {payoutStatus === 'PROCESSING' ? (
                            <Loader size="sm" className="border-slate-900/20 border-t-[#067FF9]" />
                        ) : payoutStatus === 'SUCCESS' ? (
                            <>
                                <FaCheckCircle /> Request Sent
                            </>
                        ) : (
                            <>
                                Request Payout <FaArrowUp className="rotate-45" />
                            </>
                        )}
                    </button>
                </motion.div>
            </div>

            {/* Recent Transactions Mock */}
            <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-lg">Recent Transactions</h3>
                    <button className="text-xs font-bold text-[#067FF9] uppercase tracking-wide hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-sm uppercase font-black text-slate-400 tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-600">
                            {/* Mock Data since no direct Transaction API exists yet */}
                            {[1, 2, 3].map((_, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-400">#TXN-782{i}9</td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <FaCalendarAlt className="text-slate-300 w-3 h-3" />
                                        Oct {24 - i}, 2024
                                    </td>
                                    <td className="px-6 py-4">Order Settlement</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-[4px] bg-emerald-50 text-emerald-600 text-sm font-bold border border-emerald-100 uppercase">
                                            Completed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                                        + {formatCurrency(12500 - (i * 1500))}
                                    </td>
                                </tr>
                            ))}
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-slate-400">#PAY-99210</td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <FaCalendarAlt className="text-slate-300 w-3 h-3" />
                                    Oct 20, 2024
                                </td>
                                <td className="px-6 py-4">Weekly Payout</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-[4px] bg-blue-50 text-blue-600 text-sm font-bold border border-blue-100 uppercase">
                                        Processed
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-800">
                                    - {formatCurrency(45000)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
