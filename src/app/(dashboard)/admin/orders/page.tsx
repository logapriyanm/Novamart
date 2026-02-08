'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaShoppingCart,
    FaTruck,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSearch,
    FaArrowLeft,
    FaBoxOpen,
    FaRegClock,
    FaEye,
    FaChevronDown,
    FaShippingFast,
    FaBan
} from 'react-icons/fa';
import Link from 'next/link';

import { apiClient } from '../../../../lib/api/client';
import { useSnackbar } from '../../../../client/context/SnackbarContext';

export default function OrderOversightPanel() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await apiClient.get<any[]>('/orders');
            setOrders(data || []);
        } catch (error) {
            console.error('Admin order fetch error:', error);
            showSnackbar('Failed to load global order stream.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, action: 'SHIP' | 'CANCEL') => {
        try {
            await apiClient.put(`/admin/orders/${orderId}/status`, {
                action,
                trackingNumber: action === 'SHIP' ? 'MANUAL-SYS-' + Date.now() : undefined,
                carrier: action === 'SHIP' ? 'NovaLogistics' : undefined,
                reason: action === 'CANCEL' ? 'Admin Override' : undefined
            });
            showSnackbar(`Order ${action === 'SHIP' ? 'Shipped' : 'Cancelled'} Successfully`, 'success');
            fetchOrders();
        } catch (error) {
            showSnackbar('Status Update Failed', 'error');
        }
    };

    const stats = [
        { label: 'Live Orders', value: orders.filter(o => o.status !== 'CANCELLED' && o.status !== 'DELIVERED').length.toString(), icon: FaBoxOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'In Transit', value: orders.filter(o => o.status === 'SHIPPED').length.toString(), icon: FaTruck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Pending Audit', value: orders.filter(o => o.status === 'CREATED').length.toString(), icon: FaRegClock, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Halted/Risk', value: orders.filter(o => o.status === 'CANCELLED').length.toString(), icon: FaExclamationTriangle, color: 'text-rose-500', bg: 'bg-rose-50' },
    ];

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.dealer?.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Global Supply Chain...</div>;

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
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Supply Chain <span className="text-[#10367D]">Oversight</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Ecosystem-Wide Order Monitoring & Audit</p>
                    </div>
                </div>
            </div>

            {/* Global Order Health */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-[#1E293B]">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Ledger */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 lg:p-10 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Global Transaction Stream</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Order Distribution Data</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-64">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                            <input
                                type="text"
                                placeholder="Search Orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none"
                            />
                        </div>
                        <button className="px-5 py-2 bg-[#10367D]/5 text-[#10367D] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#10367D] hover:text-white transition-all">Filter</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-white">
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Protocol</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Buyer/Entity</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dealer/Seller</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Protocol Status</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Value Index</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-[#1E293B]">ORD-{order.id.slice(0, 6).toUpperCase()}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-sm font-bold text-[#1E293B]">
                                        {order.customer?.name || 'Guest'}
                                    </td>
                                    <td className="px-10 py-6 text-sm font-bold text-blue-600 italic">
                                        {order.dealer?.businessName || 'Verified Seller'}
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${order.status === 'DELIVERED' || order.status === 'SHIPPED' ? 'bg-emerald-100 text-emerald-700' :
                                            order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <p className="text-sm font-black text-[#1E293B]">₹{Number(order.totalAmount).toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{Number(order.totalAmount) > 50000 ? 'High Value' : 'Standard'}</p>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {order.status === 'PAID' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order.id, 'SHIP')}
                                                    className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
                                                    title="Mark Shipped"
                                                >
                                                    <FaShippingFast className="w-4 h-4" />
                                                </button>
                                            )}
                                            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order.id, 'CANCEL')}
                                                    className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                                                    title="Cancel Order"
                                                >
                                                    <FaBan className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button className="w-10 h-10 rounded-xl bg-[#10367D]/5 text-[#10367D] flex items-center justify-center hover:bg-[#10367D] hover:text-white transition-all">
                                                <FaEye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                        <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-[0.2em] text-xs">No matching transactions found.</div>
                    )}
                </div>

                <div className="p-10 border-t border-slate-50 bg-[#10367D]/5 flex justify-center">
                    <p className="text-[10px] font-black text-[#10367D] uppercase tracking-[0.2em] flex items-center gap-3">
                        <FaCheckCircle className="w-3 h-3" />
                        Supply Chain Data Persisted • Full Logistic Transparency Active
                    </p>
                </div>
            </div>
        </div>
    );
}

