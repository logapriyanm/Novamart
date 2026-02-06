'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaIndustry,
    FaBox,
    FaSearch,
    FaFilter,
    FaArrowLeft,
    FaArrowRight,
    FaIdCard,
    FaTag,
    FaExclamationCircle,
    FaShoppingCart,
    FaCheckCircle,
    FaInfoCircle,
    FaShieldAlt
} from 'react-icons/fa';
import Link from 'next/link';

const manufacturerProducts = [
    { id: 'MP-881', name: 'Ultra-Quiet AC 2.0', manufacturer: 'Mega-Mart Manufacturing', price: '₹34,500', moq: 10, category: 'Appliances', status: 'VERIFIED', specs: '5-Star, Inverter, Copper' },
    { id: 'MP-882', name: 'EcoCool Refrigerator', manufacturer: 'Cool-Life Pro', price: '₹22,200', moq: 5, category: 'Appliances', status: 'VERIFIED', specs: 'Double door, 350L' },
    { id: 'MP-883', name: 'Pro-Mix Grinder', manufacturer: 'Industrial Kitchen Tech', price: '₹8,400', moq: 20, category: 'Kitchen', status: 'VERIFIED', specs: '750W, 3 Jars' },
];

export default function DealerSourcingPortal() {
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
                        <h1 className="text-3xl font-black tracking-tight italic">Verified <span className="text-[#10367D]">Supply Catalog</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Authorized Manufacturer Network (Bulk Distribution Only)</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                    <input type="text" placeholder="Search Managed Supply..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-[#10367D]/30" />
                </div>
                <div className="flex items-center gap-4">
                    <select className="bg-slate-50 border border-slate-100 rounded-2xl py-4 px-8 text-xs font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer">
                        <option>All Governance Tiers</option>
                        <option>Appliances</option>
                        <option>Kitchen Tech</option>
                    </select>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {manufacturerProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-[#10367D]/5 transition-all group">
                        <div className="p-10 bg-slate-50 group-hover:bg-[#10367D]/5 transition-colors text-center relative">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#10367D] mx-auto shadow-sm group-hover:scale-110 transition-transform">
                                <FaBox className="w-10 h-10" />
                            </div>
                            <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-3 py-1 rounded-full">{product.id}</span>
                                <span className="text-[7px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                                    <FaCheckCircle className="w-2 h-2" /> Verified
                                </span>
                            </div>
                        </div>

                        <div className="p-10 space-y-6">
                            <div>
                                <h3 className="text-lg font-black tracking-tight">{product.name}</h3>
                                <div className="flex items-center gap-2 mt-2 opacity-60">
                                    <FaIndustry className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{product.manufacturer}</span>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-2xl space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">Wholesale Protocol</span>
                                    <span className="text-[#1E293B]">{product.price}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">Minimum Order</span>
                                    <span className="text-[#10367D]">{product.moq} Units</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Link href={`/dealer/source/order/${product.id}`} className="flex-1 py-4 bg-[#10367D] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all text-center flex items-center justify-center gap-2">
                                    <FaShoppingCart className="w-3 h-3" />
                                    Request Bulk Supply
                                </Link>
                                <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-[#1E293B] transition-all">
                                    <FaInfoCircle className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Governance Note */}
            <div className="mt-12 p-10 bg-[#1E293B] rounded-[3.5rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl overflow-hidden relative border border-[#10367D]/20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent pointer-events-none" />
                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <FaShieldAlt className="w-8 h-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-lg font-black tracking-tight italic">Distribution Authority Protocol</h4>
                    <p className="text-[10px] font-bold text-slate-500 mt-1 max-w-2xl leading-relaxed uppercase">
                        Bulk purchases move assets from Manufacturer Escrow to your <span className="text-indigo-400 font-black">Owned Inventory Ledger</span>. Once purchased, you assume fulfillment liability and protocol compliance.
                    </p>
                </div>
            </div>
        </div>
    );
}

