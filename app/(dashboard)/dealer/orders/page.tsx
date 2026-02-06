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

const customerOrders = [
    { id: 'ORD-RT-99801', customer: 'Viren Malhotra', total: '₹42,200', date: 'Feb 06, 2026 14:22', status: 'Pending', item: 'Ultra-Quiet AC 2.0', address: 'B-402, High-Point Apts, Powai, Mumbai' },
    { id: 'ORD-RT-99800', customer: 'Sneha Reddy', total: '₹8,400', date: 'Feb 06, 2026 11:10', status: 'Shipped', item: 'Pro-Mix Grinder', address: 'Plot 4, Jubilee Hills, Hyderabad' },
    { id: 'ORD-RT-99799', customer: 'Amit Taneja', total: '₹22,200', date: 'Feb 05, 2026 19:45', status: 'Delivered', item: 'EcoCool Fridge', address: 'Sector 44, Gurgaon, NL' },
];

export default function DealerOrderManagement() {
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/dealer" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Command Center
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Retail <span className="text-[#10367D]">Pipeline</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Global Customer Fulfillment & Service Lifecycle</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[calc(100vh-250px)]">
                {/* List View */}
                <div className="xl:col-span-7 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="p-2 bg-blue-50 text-[#10367D] rounded-lg border border-blue-100">
                                <FaShoppingCart className="w-4 h-4" />
                            </span>
                            <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest italic">Live Incoming Orders</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            {['All', 'Pending', 'Shipped'].map(f => (
                                <button key={f} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${f === 'Pending' ? 'bg-[#10367D] text-white' : 'bg-white border border-slate-100 text-slate-400'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
                        {customerOrders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`p-8 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group ${selectedOrder?.id === order.id ? 'bg-blue-50/30 border-l-4 border-l-[#10367D]' : ''}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:bg-[#10367D] group-hover:text-white transition-all shadow-sm">
                                        <FaBoxOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-sm font-black text-[#1E293B] italic">{order.id}</h4>
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${order.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                                                order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                                                    'bg-emerald-50 text-emerald-600'
                                                }`}>{order.status}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{order.customer} • {order.item}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-[#1E293B]">{order.total}</p>
                                    <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">{order.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail/Fulfillment View */}
                <div className="xl:col-span-5 relative">
                    <AnimatePresence mode="wait">
                        {selectedOrder ? (
                            <motion.div
                                key={selectedOrder.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="h-full bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden"
                            >
                                <div className="p-10 border-b border-slate-50 bg-[#1E293B] text-white">
                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight">{selectedOrder.id}</h3>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Client Transaction Master</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            <FaEllipsisV className="w-4 h-4 text-slate-500" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white border-2 border-white/10 shadow-lg">
                                            <FaUserCircle className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black uppercase italic">{selectedOrder.customer}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">+91 98XXX XXXXX</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 p-10 space-y-10 overflow-y-auto custom-scrollbar">
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                            <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-[#10367D]" /> Fulfillment Address</span>
                                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[8px] italic flex items-center gap-1 border border-emerald-100">
                                                <FaLock className="w-2 h-2" /> Escrow Secured
                                            </span>
                                        </h4>
                                        <p className="text-xs font-black text-[#1E293B] leading-relaxed uppercase bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            {selectedOrder.address}
                                        </p>
                                    </div>

                                    <div className="p-8 bg-[#10367D]/5 border border-[#10367D]/10 rounded-[2rem] space-y-6">
                                        <h4 className="text-[10px] font-black text-[#10367D] uppercase tracking-[0.2em] italic">Settlement Forecast (Zone 3)</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                                <span>Customer Gross</span>
                                                <span className="text-[#1E293B]">{selectedOrder.total}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-black uppercase text-rose-500">
                                                <span>Platform Commission (5%)</span>
                                                <span>- ₹{(parseInt(selectedOrder.total.replace('₹', '').replace(',', '')) * 0.05).toLocaleString()}</span>
                                            </div>
                                            <div className="pt-4 border-t border-[#10367D]/10 flex justify-between items-center">
                                                <p className="text-[10px] font-black text-slate-500 uppercase">Payout Estimate</p>
                                                <p className="text-xl font-black text-[#1E293B]">₹{(parseInt(selectedOrder.total.replace('₹', '').replace(',', '')) * 0.95).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Lifecycle Log</h4>
                                        <div className="space-y-6">
                                            {[
                                                { t: 'Payment Transferred to Escrow', d: 'Feb 06, 14:23', icon: FaCheckCircle, c: 'text-emerald-500' },
                                                { t: 'Order Validated', d: 'Feb 06, 14:25', icon: FaCheckCircle, c: 'text-emerald-500' },
                                                { t: 'Pending Dispatch', d: 'Await Dealer Action', icon: FaRegClock, c: 'text-amber-500' },
                                            ].map((log, i) => (
                                                <div key={i} className="flex gap-4">
                                                    <log.icon className={`w-4 h-4 mt-0.5 ${log.c}`} />
                                                    <div>
                                                        <p className="text-[10px] font-black text-[#1E293B] uppercase">{log.t}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{log.d}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 border-t border-slate-50 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <button className="flex-1 py-5 bg-[#10367D] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center justify-center gap-3">
                                            <FaTruck className="w-3 h-3" />
                                            Initialize Dispatch
                                        </button>
                                        <button className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:text-rose-500 transition-all border border-slate-100">
                                            <FaExclamationCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button className="w-full py-4 bg-white border border-slate-100 text-[9px] font-black text-slate-400 rounded-xl uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                                        <FaFileInvoice className="w-3 h-3" />
                                        Generate Retail Invoice
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12">
                                <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-slate-200 mb-6 shadow-sm">
                                    <FaArrowRight className="w-8 h-8 -rotate-45" />
                                </div>
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Select an Active Order</h3>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2 max-w-[200px]">Choose from the left stream to commence fulfillment protocol.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

