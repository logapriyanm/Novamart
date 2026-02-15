'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBox,
    FaCheckCircle,
    FaTimesCircle,
    FaIndustry,
    FaFileInvoiceDollar,
    FaTruck,
    FaInfoCircle,
    FaArrowRight,
    FaSearch,
    FaRegClock
} from 'react-icons/fa';
import Link from 'next/link';
import { manufacturerService } from '@/lib/api/services/manufacturer.service';
import Loader from '@/client/components/ui/Loader';
import { toast } from 'sonner';

export default function ManufacturerOrderControl() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await manufacturerService.getOrders();
            setOrders(data || []);
        } catch (error) {
            console.error('Failed to fetch manufacturer orders:', error);
            toast.error('Failed to load distribution ledger.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmReceipt = async (orderId: string) => {
        if (!confirm('Confirm payment receipt for this order? This will mark the order as PAID.')) return;

        try {
            await manufacturerService.confirmOrderPayment(orderId);
            toast.success('Payment confirmed successfully');
            fetchOrders();
            setSelectedOrder(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to confirm payment');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6 animate-fade-in pb-12 font-sans text-slate-800 bg-slate-50/50 min-h-screen p-6">
            {/* Header */}
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold italic uppercase tracking-tight text-slate-900">Orders</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">Manage Distribution & Requests</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:h-[calc(100vh-200px)]">
                {/* Order Stream */}
                <div className="xl:col-span-7 bg-white rounded-[10px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-white text-primary rounded-[10px] shadow-sm border border-slate-200">
                                <FaIndustry className="w-4 h-4" />
                            </span>
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Distribution Ledger</h2>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                        {orders.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-sm font-medium text-slate-400">No active distribution orders found.</p>
                            </div>
                        ) : orders.map((order) => (
                            <div
                                key={order._id || order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`p-6 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group ${selectedOrder?._id === order._id ? 'bg-primary/5' : ''}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-[10px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                        <FaBox className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-base font-bold text-slate-900">ORD-{(order._id || order.id).slice(-8).toUpperCase()}</h4>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-[6px] uppercase tracking-wide ${order.status === 'PAYMENT_PENDING' ? 'bg-amber-50 text-amber-700' :
                                                order.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                }`}>{order.status}</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-500 mt-1">
                                            {order.seller?.businessName || 'Seller'} • {order.items?.length || 0} Items
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-bold text-slate-900">₹{Number(order.totalAmount).toLocaleString()}</p>
                                    <p className="text-sm font-medium text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Verification Control */}
                <div className={`xl:col-span-5 xl:relative transition-all ${selectedOrder ? 'fixed inset-0 z-50 bg-white xl:bg-transparent xl:z-auto' : 'hidden xl:block'}`}>
                    <AnimatePresence mode="wait">
                        {selectedOrder ? (
                            <motion.div
                                key={selectedOrder._id || selectedOrder.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="h-full bg-white xl:rounded-[10px] xl:border border-slate-200 shadow-sm flex flex-col overflow-hidden"
                            >
                                <div className="p-8 border-b border-slate-200 bg-slate-900 text-white space-y-6 relative">
                                    {/* Mobile Back Button */}
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="absolute top-6 right-6 p-2 bg-white/10 rounded-[10px] text-white xl:hidden hover:bg-white/20"
                                    >
                                        <FaTimesCircle className="w-5 h-5" />
                                    </button>

                                    <div>
                                        <p className="text-xs font-bold text-primary/50 uppercase tracking-wilder mb-1">Finance Audit Mode</p>
                                        <h3 className="text-2xl font-bold tracking-tight">{(selectedOrder._id || selectedOrder.id).slice(-8).toUpperCase()}</h3>
                                    </div>
                                    <div className="p-4 bg-white/10 border border-white/10 rounded-[10px] flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FaFileInvoiceDollar className="text-primary/50 w-5 h-5" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">Gross Wholesale Value</p>
                                                <p className="text-lg font-bold text-white">₹{Number(selectedOrder.totalAmount).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-[10px] bg-white/10 flex items-center justify-center">
                                            <FaInfoCircle className="text-slate-300 w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar bg-white">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <FaFileInvoiceDollar className="text-primary" /> B2B Payment Status
                                        </h4>
                                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-[10px] flex flex-col items-center justify-center text-center space-y-3">
                                            <div className={`w-12 h-12 bg-white rounded-[10px] flex items-center justify-center shadow-sm border border-slate-100 ${selectedOrder.status === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                <FaCheckCircle className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{selectedOrder.status === 'PAID' ? 'Payment Confirmed' : 'Payment Pending'}</p>
                                                <p className="text-sm text-slate-500 mt-0.5">Updated {new Date(selectedOrder.updatedAt).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-[10px] flex items-start gap-4">
                                        <FaRegClock className="text-primary w-5 h-5 mt-0.5" />
                                        <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                            Verify against bank statement before confirming. Once confirmed, stock is <span className="text-primary font-bold">legally transferred</span> to seller.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-slate-100 flex items-center gap-4 bg-slate-50/50">
                                    <button
                                        onClick={() => handleConfirmReceipt(selectedOrder._id || selectedOrder.id)}
                                        disabled={selectedOrder.status === 'PAID'}
                                        className={`flex-1 py-3 bg-primary text-white rounded-[10px] font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-3 ${selectedOrder.status === 'PAID' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <FaCheckCircle className="w-4 h-4" />
                                        {selectedOrder.status === 'PAID' ? 'Receipt Confirmed' : 'Confirm Receipt'}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full bg-white rounded-[10px] border border-slate-200 flex flex-col items-center justify-center text-center p-12 shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-[10px] flex items-center justify-center text-slate-300 mb-6">
                                    <FaArrowRight className="w-8 h-8 -rotate-45" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">Select Order</h3>
                                <p className="text-sm font-medium text-slate-500 mt-2 max-w-[200px]">Validate payment proofs and initialize distribution.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
