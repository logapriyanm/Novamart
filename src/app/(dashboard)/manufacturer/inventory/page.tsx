'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaBox,
    FaPlus,
    FaSearch,
    FaFilter,
    FaShieldAlt,
    FaHistory,
    FaSpinner
} from 'react-icons/fa';
import Link from 'next/link';
import { manufacturerService } from '@/lib/api/services/manufacturer.service';
import { toast } from 'sonner';
import Loader from '@/client/components/ui/Loader';

export default function ManufacturerInventory() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await manufacturerService.getProducts();
                setProducts(data || []);
            } catch (error: any) {
                toast.error(error.message || 'Failed to fetch inventory');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">Bulk <span className="text-[#10367D]">Portfolio</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Production Planning & Governance Queue</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { l: 'Total SKUs', v: products.length, c: 'text-[#10367D]', b: 'bg-blue-50' },
                    { l: 'Approved Distribution', v: products.filter(p => p.status === 'APPROVED').length, c: 'text-emerald-600', b: 'bg-emerald-50' },
                    { l: 'In Governor Review', v: products.filter(p => p.status === 'PENDING').length, c: 'text-amber-600', b: 'bg-amber-50' },
                    { l: 'Draft Designs', v: products.filter(p => p.status === 'DRAFT').length, c: 'text-slate-400', b: 'bg-slate-50' },
                ].map((s, i) => (
                    <div key={i} className={`p-8 rounded-[10px] border border-slate-100 shadow-sm ${s.b}`}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.l}</p>
                        <p className={`text-3xl font-black ${s.c}`}>{isLoading ? '...' : s.v}</p>
                    </div>
                ))}
            </div>

            {/* Catalog Table */}
            <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1 max-w-md">
                        <div className="relative w-full">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                            <input type="text" placeholder="Search Master Catalog..." className="w-full bg-white border border-slate-100 rounded-[10px] py-3 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-[#10367D]/30" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-4 bg-white border border-slate-100 text-slate-400 rounded-[10px] hover:text-[#10367D] transition-colors shadow-sm">
                            <FaFilter className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/20 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                <th className="px-10 py-6 font-black">Asset Identity</th>
                                <th className="px-10 py-6 font-black">Governance Status</th>
                                <th className="px-10 py-6 font-black">Wholesale Base</th>
                                <th className="px-10 py-6 font-black">Supply Stock</th>
                                <th className="px-10 py-6 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex justify-center">
                                            <Loader size="lg" variant="primary" />
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                                        No assets discovered in master catalog
                                    </td>
                                </tr>
                            ) : products.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-[10px] bg-[#10367D]/5 text-[#10367D] flex items-center justify-center border border-[#10367D]/10 shadow-sm group-hover:scale-110 transition-transform">
                                                <FaBox className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-[#1E293B] italic">{item.name}</h4>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mt-1">{item.modelNo || item.id} • {item.category?.name || 'Uncategorized'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2 h-2 rounded-full ${item.status === 'APPROVED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                item.status === 'PENDING' ? 'bg-amber-500 animate-pulse' :
                                                    'bg-slate-300'
                                                }`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'APPROVED' ? 'text-emerald-600' :
                                                item.status === 'PENDING' ? 'text-amber-600' :
                                                    'text-slate-400'
                                                }`}>{item.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-sm font-black text-[#1E293B]">₹{Number(item.basePrice).toLocaleString()}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-sm font-black text-[#1E293B] italic">{item.stock || 0} <span className="text-slate-300 text-[10px] uppercase font-bold ml-1">Units</span></span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        {item.status === 'DRAFT' ? (
                                            <button className="px-6 py-2 bg-[#10367D] text-[#10367D] text-[10px] font-black uppercase tracking-widest rounded-[10px] shadow-lg shadow-[#10367D]/20 hover:scale-105 transition-all">
                                                Submit Audit
                                            </button>
                                        ) : (
                                            <Link href={`/manufacturer/products/${item.id}`} className="inline-block px-6 py-2 bg-white border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:bg-slate-50 transition-all">
                                                View Specs
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Compliance Note */}
            <div className="p-10 bg-[#1E293B] rounded-[10px] border border-[#10367D]/20 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent pointer-events-none" />
                <div className="w-16 h-16 rounded-[10px] bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <FaShieldAlt className="w-8 h-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-lg font-black tracking-tight text-white">Immutable Governance Bridge</h4>
                    <p className="text-sm font-bold text-slate-500 mt-1 max-w-2xl leading-relaxed uppercase">
                        Approved products are strictly locked. Technical spec changes require a full <span className="text-white">Batch Reset</span> or Admin correction request.
                    </p>
                </div>
                <FaHistory className="text-white/5 w-24 h-24 absolute -right-4 -bottom-4 group-hover:rotate-12 transition-transform duration-700" />
            </div>
        </div>
    );
}
