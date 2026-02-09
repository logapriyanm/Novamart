'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaArrowLeft,
    FaShoppingCart,
    FaUserCircle,
    FaMapMarkerAlt,
    FaTruck,
    FaCheckCircle,
    FaExclamationCircle,
    FaRegClock,
    FaBoxOpen,
    FaFileInvoice,
    FaEllipsisV,
    FaArrowRight,
    FaLock
} from 'react-icons/fa';
import Link from 'next/link';
import { useSnackbar } from '../../../../client/context/SnackbarContext';

import { apiClient } from '../../../../lib/api/client';

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
                // Refresh local state
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
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col gap-1 border-b border-foreground/5 pb-8">
                <Link href="/dealer" className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:translate-x-[-4px] transition-transform mb-4">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Command
                </Link>
                <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
                <p className="text-sm text-muted-foreground font-medium">Fulfill customer orders and track logistics.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[calc(100vh-250px)]">
                {/* List View */}
                <div className="xl:col-span-7 bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <h2 className="text-xs font-bold text-[#1E293B] uppercase tracking-widest">Incoming Stream</h2>
                        <div className="flex items-center gap-2">
                            {['All', 'Pending', 'Shipped'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-black text-white' : 'bg-white border border-slate-100 text-slate-400'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`p-6 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group ${selectedOrder?.id === order.id ? 'bg-blue-50/30 border-l-4 border-l-black' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:scale-105 transition-all">
                                        <FaBoxOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-bold text-[#1E293B]">{order.displayId}</h4>
                                            <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded ${order.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>{order.status}</span>
                                        </div>
                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">{order.customer}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-[#1E293B]">{order.totalFormatted}</p>
                                    <p className="text-[9px] font-medium text-slate-400 mt-0.5">{order.date}</p>
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
                                className="h-full bg-white rounded-[20px] border border-slate-100 shadow-xl flex flex-col overflow-hidden"
                            >
                                <div className="p-8 bg-[#1E293B] text-white">
                                    <h3 className="text-xl font-bold tracking-tight">{selectedOrder.displayId}</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 font-medium">Customer Transaction</p>

                                    <div className="flex items-center gap-4 mt-8">
                                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white border-2 border-white/10 shadow-lg">
                                            <FaUserCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{selectedOrder.customer}</p>
                                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Client Portal Active</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 p-8 space-y-8 overflow-y-auto">
                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                                            <span>Shipping Destination</span>
                                            <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border border-emerald-100">
                                                Escrow Secured
                                            </span>
                                        </h4>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs font-medium text-slate-600 leading-relaxed">
                                            {selectedOrder.address}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                                            <span>Subtotal</span>
                                            <span className="text-black">{selectedOrder.totalFormatted}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-bold text-rose-500 uppercase">
                                            <span>Fee (5%)</span>
                                            <span>- ₹{(selectedOrder.total * 0.05).toLocaleString()}</span>
                                        </div>
                                        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Payout</span>
                                            <span className="text-lg font-bold text-black">₹{(selectedOrder.total * 0.95).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Timeline</h4>
                                        <div className="space-y-4">
                                            {[
                                                { t: 'Payment in Escrow', d: 'Validated', icon: FaCheckCircle, c: 'text-emerald-500' },
                                                { t: 'Pending Dispatch', d: 'Ready for fulfillment', icon: FaRegClock, c: 'text-amber-500' },
                                            ].map((log, i) => (
                                                <div key={i} className="flex gap-3">
                                                    <log.icon className={`w-3 h-3 mt-0.5 ${log.c}`} />
                                                    <div>
                                                        <p className="text-[10px] font-bold text-black uppercase">{log.t}</p>
                                                        <p className="text-[9px] font-medium text-slate-400">{log.d}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 border-t border-slate-50 space-y-3">
                                    <button
                                        onClick={handleDispatch}
                                        disabled={selectedOrder.rawStatus !== 'PAID'}
                                        className={`w-full py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${selectedOrder.rawStatus === 'PAID'
                                            ? 'bg-black text-white hover:scale-[1.02]'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <FaTruck className="w-3 h-3" />
                                        {selectedOrder.rawStatus === 'PAID' ? 'Initialize Dispatch' : 'Dispatch Active'}
                                    </button>
                                    <button
                                        onClick={handleInvoice}
                                        className="w-full py-3 bg-white border border-slate-100 text-[9px] font-bold text-slate-400 rounded-lg uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaFileInvoice className="w-3 h-3" />
                                        Tax Invoice
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full bg-slate-50/50 rounded-[20px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select an Order</h3>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

