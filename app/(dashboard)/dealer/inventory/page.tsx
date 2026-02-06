'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaBox,
    FaArrowLeft,
    FaTag,
    FaHistory,
    FaShieldAlt,
    FaExclamationTriangle,
    FaArrowRight,
    FaRegClock,
    FaLayerGroup
} from 'react-icons/fa';
import Link from 'next/link';

const dealerInventory = [
    { id: 'INV-DL-101', name: 'Ultra-Quiet AC 2.0', stock: 12, retailStatus: 'Listed', price: '₹39,999', source: 'Mega-Mart Manufacturing' },
    { id: 'INV-DL-102', name: 'EcoCool Refrigerator', stock: 5, retailStatus: 'Draft', price: '-', source: 'Cool-Life Pro' },
    { id: 'INV-DL-103', name: 'Smart Fan X', stock: 45, retailStatus: 'Out of Stock', price: '₹4,200', source: 'Mega-Mart Manufacturing' },
];

export default function DealerInventoryManagement() {
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
                        <h1 className="text-3xl font-black tracking-tight">Owned <span className="text-[#10367D]">Inventory</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Retail Stock Ledger & Listing Control</p>
                    </div>
                </div>
            </div>

            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#10367D] flex items-center justify-center border border-blue-100 shadow-sm">
                        <FaLayerGroup className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total SKU Count</p>
                        <p className="text-2xl font-black italic">62 <span className="text-slate-300 font-light text-sm italic">Items</span></p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-sm">
                        <FaTag className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Retail Ads</p>
                        <p className="text-2xl font-black italic">18 <span className="text-slate-300 font-light text-sm italic">Live</span></p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100 shadow-sm">
                        <FaRegClock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Dispatch</p>
                        <p className="text-2xl font-black italic">04 <span className="text-slate-300 font-light text-sm italic">Batches</span></p>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Master Stock Ledger</h2>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Sourced from Verified Manufacturers</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="px-10 py-6 font-black">Stock Entity</th>
                                <th className="px-10 py-6 font-black">Supply Source</th>
                                <th className="px-10 py-6 font-black">Units Owned</th>
                                <th className="px-10 py-6 font-black">Retail Price</th>
                                <th className="px-10 py-6 font-black text-right">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {dealerInventory.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 text-[#10367D] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <FaBox className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-[#1E293B]">{item.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.id}</span>
                                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${item.retailStatus === 'Listed' ? 'bg-emerald-50 text-emerald-600' :
                                                            item.retailStatus === 'Out of Stock' ? 'bg-rose-50 text-rose-600' :
                                                                'bg-amber-50 text-amber-600'
                                                        }`}>{item.retailStatus}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <FaShieldAlt className="w-3 h-3 text-[#10367D]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{item.source}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-sm font-black text-[#1E293B] italic">{item.stock} <span className="text-slate-300 text-[10px] uppercase font-bold ml-1">Units</span></span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-sm font-black text-[#10367D]">{item.price}</span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <Link href={`/dealer/inventory/list/${item.id}`} className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:bg-[#10367D] hover:text-white transition-all shadow-sm">
                                            {item.retailStatus === 'Listed' ? 'Edit Listing' : 'Manage Retail'}
                                            <FaArrowRight className="w-2 h-2" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Warning: Stock Accuracy */}
            <div className="flex flex-col md:flex-row items-center gap-8 p-10 bg-amber-50 border border-amber-100 rounded-[3rem] shadow-sm">
                <div className="w-16 h-16 rounded-[1.8rem] bg-white border border-amber-100 flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
                    <FaExclamationTriangle className="w-8 h-8" />
                </div>
                <div>
                    <h4 className="text-lg font-black tracking-tight text-[#1E293B]">Inventory Accuracy Protocol</h4>
                    <p className="text-[10px] font-bold text-amber-600/70 uppercase tracking-[0.15em] mt-1 leading-relaxed">
                        Dealers are strictly accountable for stock accuracy. False listings or fulfillment failures trigger automatic Governance audits and negatively impact Batch Trust ratings.
                    </p>
                </div>
            </div>
        </div>
    );
}

