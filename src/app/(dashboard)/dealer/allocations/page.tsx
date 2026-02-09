'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBox,
    FaPlus,
    FaArrowRight,
    FaSearch,
    FaFilter,
    FaIndustry,
    FaStore,
    FaDollarSign,
    FaBoxOpen,
    FaPercentage,
    FaTimes,
    FaCheck,
    FaExclamationTriangle,
    FaRocket
} from 'react-icons/fa';
import { useSnackbar } from '@/client/context/SnackbarContext';

export default function DealerAllocationView() {
    const { showSnackbar } = useSnackbar();
    const [allocations, setAllocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showListingModal, setShowListingModal] = useState(false);
    const [selAlloc, setSelAlloc] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        quantity: '',
        retailPrice: ''
    });

    useEffect(() => {
        fetchAllocations();
    }, []);

    const fetchAllocations = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/dealer/allocations');
            const data = await res.json();
            if (data.success) setAllocations(data.data);
        } catch (error) {
            showSnackbar('Failed to load allocations', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSourceAndList = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/dealer/source', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: selAlloc.productId,
                    region: selAlloc.region,
                    quantity: formData.quantity,
                    initialPrice: formData.retailPrice
                })
            });

            const data = await res.json();
            if (data.success) {
                showSnackbar('Product sourced and listed successfully!', 'success');
                setShowListingModal(false);
                fetchAllocations();
            } else {
                showSnackbar(data.error || 'Failed to list product', 'error');
            }
        } catch (error) {
            showSnackbar('Network error', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">Allocated <span className="text-[#10367D]">Supply</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Sourced Assets & Manufacturer Allocations</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <FaCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Slots</p>
                            <p className="text-lg font-black text-emerald-600 italic">{allocations.filter(a => !a.isListed).length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-80 bg-slate-100 rounded-[3rem] animate-pulse"></div>
                    ))
                ) : allocations.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <FaBoxOpen className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                        <h3 className="text-xl font-black italic text-slate-400 uppercase tracking-widest">No allocations found</h3>
                        <p className="text-sm font-bold text-slate-300 mt-2 uppercase tracking-tight">Partner with manufacturers to receive stock allocations</p>
                    </div>
                ) : allocations.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -8 }}
                        className={`bg-white rounded-[3rem] border ${item.isListed ? 'border-emerald-100 shadow-emerald-100/50' : 'border-slate-100'} shadow-xl overflow-hidden group relative transition-all`}
                    >
                        {item.isListed && (
                            <div className="absolute top-6 right-6 px-4 py-2 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 z-10 flex items-center gap-2">
                                <FaRocket className="w-2.5 h-2.5 animate-pulse" />
                                Active Listing
                            </div>
                        )}

                        <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden">
                            {item.product?.images?.[0] ? (
                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-200">
                                    <FaBox className="w-16 h-16" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <p className="text-[9px] font-black text-white/70 uppercase tracking-[0.15em] mb-1">Manufacturer</p>
                                <h4 className="text-white text-lg font-black italic truncate">{item.product?.manufacturer?.companyName}</h4>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <h4 className="text-xl font-black italic text-[#1E293B] group-hover:text-[#10367D] transition-colors">{item.product?.name}</h4>
                                <div className="flex items-center gap-2 mt-2">
                                    <FaIndustry className="text-slate-300 w-2.5 h-2.5" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.region} Distribution</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Cap</p>
                                    <p className="text-lg font-black text-[#10367D] italic">{item.allocatedStock} <span className="text-[10px] font-bold text-slate-300 uppercase ml-1">Units</span></p>
                                </div>
                                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Wholesale</p>
                                    <p className="text-lg font-black text-blue-600 italic">₹{Number(item.dealerBasePrice).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                    <span className="text-slate-400 uppercase">Min Order Qty</span>
                                    <span className="text-amber-600 font-black">{item.dealerMoq || 1} Units</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                    <span className="text-slate-400 uppercase text-xs">Margin Cap</span>
                                    <span className="text-blue-500 font-black text-xs">{Number(item.maxMargin)}%</span>
                                </div>
                            </div>

                            {item.isListed ? (
                                <button className="w-full py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                                    Manage Marketplace Listing
                                    <FaArrowRight className="w-3 h-3" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setSelAlloc(item);
                                        setFormData({ ...formData, retailPrice: Number(item.dealerBasePrice).toString() });
                                        setShowListingModal(true);
                                    }}
                                    className="w-full py-4 bg-[#10367D] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#10367D]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    Activate & List Product
                                    <FaPlus className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Listing Modal */}
            <AnimatePresence>
                {showListingModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowListingModal(false)}
                            className="absolute inset-0 bg-[#1E293B]/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3.5rem] w-full max-w-lg relative shadow-2xl p-10 overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight italic text-[#10367D]">Market <span className="text-[#1E293B]">Activation</span></h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Sourcing Asset & Setting Retail Value</p>
                                </div>
                                <button onClick={() => setShowListingModal(false)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#10367D] transition-colors">
                                    <FaTimes />
                                </button>
                            </div>

                            <form onSubmit={handleSourceAndList} className="space-y-8">
                                <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem] flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-xl overflow-hidden shrink-0">
                                        <img src={selAlloc?.product?.images?.[0]} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black italic text-[#1E293B]">{selAlloc?.product?.name}</h4>
                                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Wholesale Basis: ₹{Number(selAlloc?.dealerBasePrice).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between ml-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sourcing Quantity</label>
                                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-tighter italic">Cap: {selAlloc?.allocatedStock} Units</span>
                                        </div>
                                        <div className="relative">
                                            <FaBoxOpen className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                                            <input
                                                required
                                                type="number"
                                                min={selAlloc?.dealerMoq || 1}
                                                max={selAlloc?.allocatedStock}
                                                placeholder={`Min: ${selAlloc?.dealerMoq || 1} Units`}
                                                value={formData.quantity}
                                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-xs font-black uppercase focus:outline-none focus:border-[#10367D]/30"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between ml-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Retail Price (₹)</label>
                                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter italic">Max Margin: {Number(selAlloc?.maxMargin)}%</span>
                                        </div>
                                        <div className="relative">
                                            <FaDollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                                            <input
                                                required
                                                type="number"
                                                value={formData.retailPrice}
                                                onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-xs font-black uppercase focus:outline-none focus:border-[#10367D]/30"
                                            />
                                        </div>
                                        {formData.retailPrice && selAlloc && (
                                            <div className="flex items-center justify-between px-2 pt-2">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Projected Margin</p>
                                                <p className={`text-[11px] font-black ${((Number(formData.retailPrice) / Number(selAlloc.dealerBasePrice)) - 1) * 100 > Number(selAlloc.maxMargin)
                                                    ? 'text-rose-500' : 'text-emerald-600'
                                                    }`}>
                                                    {(((Number(formData.retailPrice) / Number(selAlloc.dealerBasePrice)) - 1) * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {((Number(formData.retailPrice) / Number(selAlloc?.dealerBasePrice)) - 1) * 100 > Number(selAlloc?.maxMargin) && (
                                    <div className="p-4 bg-rose-50 rounded-2xl flex items-center gap-4 text-rose-600">
                                        <FaExclamationTriangle className="shrink-0 w-4 h-4" />
                                        <p className="text-[10px] font-black uppercase leading-tight tracking-widest">
                                            Retail price exceeds manufacturer's margin limit. Please adjust value.
                                        </p>
                                    </div>
                                )}

                                <button
                                    disabled={isSubmitting || ((Number(formData.retailPrice) / Number(selAlloc?.dealerBasePrice)) - 1) * 100 > Number(selAlloc?.maxMargin)}
                                    type="submit"
                                    className="w-full py-6 bg-[#10367D] text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-[#10367D]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:grayscale"
                                >
                                    {isSubmitting ? 'Syncing with Marketplace...' : 'Authorize Listing & Acquire Stock'}
                                    <FaRocket className="w-3 h-3" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
