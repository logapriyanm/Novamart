'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaArrowLeft,
    FaBoxOpen,
    FaUserCircle,
    FaCheckCircle,
    FaRegClock,
    FaTruck,
    FaFileInvoice,
    FaTimesCircle
} from 'react-icons/fa';
import Link from 'next/link';
import { useSnackbar } from '@/client/context/SnackbarContext';
import { apiClient } from '@/lib/api/client';

export default function DealerOrderManagement() {
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [filter, setFilter] = useState('All');
    const { showSnackbar } = useSnackbar();

    React.useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await apiClient.get<any[]>('/orders');
            const ordersList = data || [];

            const mappedOrders = ordersList.map((order: any) => ({
                id: order.id,
                displayId: order.id.slice(0, 8).toUpperCase(),
                customer: order.customer?.name || 'Guest User',
                total: Number(order.totalAmount),
                totalFormatted: `₹${Number(order.totalAmount).toLocaleString()}`,
                date: new Date(order.createdAt).toLocaleString(),
                status: order.status === 'CREATED' ? 'Pending' :
                    order.status === 'PAID' ? 'Pending' :
                        order.status.charAt(0) + order.status.slice(1).toLowerCase(),
                address: order.shippingAddress || 'No address provided',
                rawStatus: order.status
            }));
            setOrders(mappedOrders);
        } catch (error) {
            console.error('Failed to fetch dealer orders:', error);
            showSnackbar('Failed to load orders', 'error');
        }
    };

    const filteredOrders = orders.filter(o =>
        filter === 'All' ? true : o.status === filter
    );

    const handleDispatch = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedOrder) return;

        try {
            const res = await apiClient.patch<{ success: boolean }>(`/orders/${selectedOrder.id}/status`, {
                status: 'SHIPPED'
            });

            if (res.success) {
                showSnackbar(`Order ${selectedOrder.displayId} dispatched successfully`, 'success');
                setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: 'Shipped', rawStatus: 'SHIPPED' } : o));
                setSelectedOrder(prev => ({ ...prev, status: 'Shipped', rawStatus: 'SHIPPED' }));
            } else {
                showSnackbar('Failed to update order status', 'error');
            }
        } catch (error) {
            console.error('Dispatch error:', error);
            showSnackbar('Error processing dispatch', 'error');
        }
    };

    const handleInvoice = () => {
        showSnackbar('Downloading Tax Invoice... (Mock Action)', 'info');
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12 font-sans text-slate-800 bg-slate-50/50 min-h-screen p-6">
            {/* Header */}
            <div className="flex flex-col gap-1 border-b border-slate-200 pb-6">
                <Link href="/dealer" className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mb-2">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Command
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
                <p className="text-sm text-slate-500 font-medium">Fulfill customer orders and track logistics.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
                {/* List View */}
                <div className="xl:col-span-7 bg-white rounded-[10px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Incoming Stream</h2>
                        <div className="flex items-center gap-2">
                            {['All', 'Pending', 'Shipped'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wide transition-all ${filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                        {filteredOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <FaBoxOpen className="w-10 h-10 mb-3 opacity-20" />
                                <p className="text-sm font-medium">No orders found</p>
                            </div>
                        ) : filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`p-5 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group ${selectedOrder?.id === order.id ? 'bg-indigo-50/10 border-l-4 border-l-indigo-600' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-all">
                                        <FaBoxOpen className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-slate-900">{order.displayId}</h4>
                                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-[4px] ${order.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>{order.status}</span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 mt-0.5">{order.customer}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-900">{order.totalFormatted}</p>
                                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">{order.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail View */}
                <div className="xl:col-span-5 relative">
                    <AnimatePresence mode="wait">
                        {selectedOrder ? (
                            <motion.div
                                key={selectedOrder.id}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="h-full bg-white rounded-[10px] border border-slate-200 shadow-sm flex flex-col overflow-hidden"
                            >
                                <div className="p-6 bg-slate-900 text-white relative">
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="absolute top-4 right-4 text-white/50 hover:text-white xl:hidden"
                                    >
                                        <FaTimesCircle className="w-5 h-5" />
                                    </button>
                                    <h3 className="text-xl font-bold tracking-tight">{selectedOrder.displayId}</h3>
                                    <p className="text-xs text-slate-400 font-medium mt-1">Customer Transaction</p>

                                    <div className="flex items-center gap-3 mt-6 p-3 bg-white/5 rounded-[8px] border border-white/10">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white shrink-0">
                                            <FaUserCircle className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold truncate">{selectedOrder.customer}</p>
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Verified Client</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                                            <span>Shipping Destination</span>
                                        </h4>
                                        <div className="bg-slate-50 p-4 rounded-[8px] border border-slate-200 text-xs font-medium text-slate-700 leading-relaxed">
                                            {selectedOrder.address}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white border border-slate-200 rounded-[8px] space-y-3 shadow-sm">
                                        <div className="flex justify-between items-center text-xs text-slate-500">
                                            <span>Subtotal</span>
                                            <span className="font-semibold text-slate-900">{selectedOrder.totalFormatted}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-rose-500">
                                            <span>Fee (5%)</span>
                                            <span>- ₹{(selectedOrder.total * 0.05).toLocaleString()}</span>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-700">Payout</span>
                                            <span className="text-base font-bold text-slate-900">₹{(selectedOrder.total * 0.95).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Timeline</h4>
                                        <div className="space-y-3">
                                            {[
                                                { t: 'Payment in Escrow', d: 'Validated', icon: FaCheckCircle, c: 'text-emerald-500', bg: 'bg-emerald-50' },
                                                { t: 'Pending Dispatch', d: 'Ready for fulfillment', icon: FaRegClock, c: 'text-amber-500', bg: 'bg-amber-50' },
                                            ].map((log, i) => (
                                                <div key={i} className="flex gap-3 items-start">
                                                    <div className={`mt-0.5 w-5 h-5 rounded-full ${log.bg} flex items-center justify-center shrink-0`}>
                                                        <log.icon className={`w-3 h-3 ${log.c}`} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-900">{log.t}</p>
                                                        <p className="text-[10px] text-slate-500">{log.d}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 border-t border-slate-100 space-y-3 bg-slate-50/50">
                                    <button
                                        onClick={handleDispatch}
                                        disabled={selectedOrder.rawStatus !== 'PAID'}
                                        className={`w-full py-3 rounded-[8px] font-bold text-xs uppercase tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 ${selectedOrder.rawStatus === 'PAID'
                                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <FaTruck className="w-3 h-3" />
                                        {selectedOrder.rawStatus === 'PAID' ? 'Initialize Dispatch' : 'Dispatch Active'}
                                    </button>
                                    <button
                                        onClick={handleInvoice}
                                        className="w-full py-3 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-[8px] uppercase tracking-wide hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaFileInvoice className="w-3 h-3" />
                                        Tax Invoice
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full bg-white rounded-[10px] border border-slate-200 flex flex-col items-center justify-center text-center p-12 shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-[10px] flex items-center justify-center text-slate-300 mb-4">
                                    <FaBoxOpen className="w-8 h-8 opacity-50" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Select order</h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-[200px]">View details to process fulfillment.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
