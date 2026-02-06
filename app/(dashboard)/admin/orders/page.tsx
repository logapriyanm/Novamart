'use client';

import React from 'react';
import {
    FaSearch as Search,
    FaFilter as Filter,
    FaDownload as Download,
    FaShoppingCart as ShoppingCart,
    FaExternalLinkAlt as ExternalLink,
    FaEllipsisV as MoreVertical,
    FaClock as Clock,
    FaCheckCircle as CheckCircle2,
    FaTimesCircle as XCircle
} from 'react-icons/fa';
import { StatusBadge } from '../../../../src/components/ui/AdminUI';

const orders = [
    { id: 'ORD-99021', date: '2024-03-15', entity: 'Global Manufacturing Inc.', amount: '$12,400.00', status: 'COMPLETED', items: 12 },
    { id: 'ORD-99022', date: '2024-03-15', entity: 'Regional Tech Spares', amount: '$4,200.00', status: 'PENDING', items: 5 },
    { id: 'ORD-99023', date: '2024-03-14', entity: 'Apex Logistics Ltd.', amount: '$8,900.00', status: 'IN_TRANSIT', items: 8 },
    { id: 'ORD-99024', date: '2024-03-14', entity: 'Future Systems', amount: '$2,100.00', status: 'CANCELLED', items: 2 },
];

const OrdersPage = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white">Platform Orders</h1>
                    <p className="text-slate-400 text-sm">Monitor all b2b2c transactions and fulfillment status across the platform.</p>
                </div>
                <div className="flex gap-3">
                    <button className="glass flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <button className="bg-white/5 border border-white/10 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 rounded-xl transition-all">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Pending</span>
                        <span className="text-2xl font-bold text-slate-100">124</span>
                    </div>
                </div>
                <div className="glass p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Fulfilled</span>
                        <span className="text-2xl font-bold text-slate-100">2,840</span>
                    </div>
                </div>
                <div className="glass p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Disputed</span>
                        <span className="text-2xl font-bold text-slate-100">18</span>
                    </div>
                </div>
            </div>

            <div className="glass overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by order ID, entity, or amount..."
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all text-slate-300"
                        />
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Entity</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4">
                                    <span className="text-sm font-mono text-indigo-400">{order.id}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-slate-300">{order.date}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-semibold text-white">{order.entity}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-slate-200">{order.amount}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersPage;
