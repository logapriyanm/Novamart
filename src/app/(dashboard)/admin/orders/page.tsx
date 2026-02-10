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
    FaShippingFast,
    FaBan
} from 'react-icons/fa';
import Link from 'next/link';

import { adminService } from '@/lib/api/services/admin.service';
import { toast } from 'sonner';

export default function OrderOversightPanel() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await adminService.getAllOrders();
            setOrders(data || []);
        } catch (error) {
            console.error('Admin order fetch error:', error);
            toast.error('Failed to load global order stream.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, action: 'SHIP' | 'CANCEL') => {
        try {
            await adminService.updateOrderStatus(orderId, action, {
                trackingNumber: action === 'SHIP' ? 'MANUAL-SYS-' + Date.now() : undefined,
                carrier: action === 'SHIP' ? 'NovaLogistics' : undefined,
                reason: action === 'CANCEL' ? 'Admin Override' : undefined
            });
            toast.success(`Order ${action === 'SHIP' ? 'Shipped' : 'Cancelled'} Successfully`);
            fetchOrders();
        } catch (error) {
            toast.error('Status Update Failed');
        }
    };

    const stats = [
        { label: 'Live Orders', value: orders.filter(o => o.status !== 'CANCELLED' && o.status !== 'DELIVERED').length.toString(), icon: FaBoxOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'In Transit', value: orders.filter(o => o.status === 'SHIPPED').length.toString(), icon: FaTruck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Pending Audit', value: orders.filter(o => o.status === 'CREATED').length.toString(), icon: FaRegClock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Halted/Risk', value: orders.filter(o => o.status === 'CANCELLED').length.toString(), icon: FaExclamationTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.dealer?.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-[600px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <FaBoxOpen className="w-8 h-8 text-slate-300 animate-bounce" />
                <p className="text-sm font-semibold text-slate-400 animate-pulse">Loading Supply Chain...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12 font-sans text-slate-800 bg-slate-50/50 min-h-screen p-6">
            {/* Header */}
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
                <Link href="/admin" className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mb-2">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Mission Control
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Supply Chain Oversight</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">Ecosystem-Wide Order Monitoring & Audit</p>
                    </div>
                </div>
            </div>

            {/* Global Order Health */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                        </div>
                        <div className={`w-10 h-10 rounded-[8px] ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Ledger */}
            <div className="bg-white rounded-[10px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Global Transaction Stream</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Real-time Order Distribution Data</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-64">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                            <input
                                type="text"
                                placeholder="Search Orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-[8px] py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                        <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-[8px] hover:bg-slate-800 transition-all shadow-sm">Filter</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/30">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Order Protocol</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Buyer/Entity</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Dealer/Seller</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide text-center">Value Index</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-400 text-sm font-medium">No orders found matching your search.</td>
                                </tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">ORD-{order.id.slice(0, 8).toUpperCase()}</span>
                                            <span className="text-xs text-slate-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                        {order.customer?.name || 'Guest'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-indigo-600">
                                        {order.dealer?.businessName || 'Verified Seller'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-bold uppercase tracking-wide ${order.status === 'DELIVERED' || order.status === 'SHIPPED' ? 'bg-emerald-50 text-emerald-700' :
                                            order.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700' :
                                                'bg-blue-50 text-blue-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <p className="text-sm font-bold text-slate-900">₹{Number(order.totalAmount).toLocaleString()}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{Number(order.totalAmount) > 50000 ? 'High Value' : 'Standard'}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {order.status === 'PAID' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order.id, 'SHIP')}
                                                    className="w-8 h-8 rounded-[6px] bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                    title="Mark Shipped"
                                                >
                                                    <FaShippingFast className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order.id, 'CANCEL')}
                                                    className="w-8 h-8 rounded-[6px] bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                    title="Cancel Order"
                                                >
                                                    <FaBan className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            <button className="w-8 h-8 rounded-[6px] bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                                <FaEye className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <FaCheckCircle className="w-3 h-3 text-emerald-500" />
                        Supply Chain Data Persisted • Full Logistic Transparency Active
                    </p>
                </div>
            </div>
        </div>
    );
}
