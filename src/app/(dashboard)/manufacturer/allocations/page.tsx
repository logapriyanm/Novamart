'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBox,
    FaPlus,
    FaSearch,
    FaFilter,
    FaUserTie,
    FaCalendarAlt,
    FaDollarSign,
    FaListOl,
    FaPercentage,
    FaTimes,
    FaCheck,
    FaTrash,
    FaEdit,
    FaCrown
} from 'react-icons/fa';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';

export default function StockAllocationManager() {
    // const { showSnackbar } = useSnackbar();
    const [allocations, setAllocations] = useState<any[]>([]);
    const [dealers, setDealers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        productId: '',
        dealerId: '',
        region: 'Pan-India',
        quantity: '0',
        dealerBasePrice: '',
        dealerMoq: '1',
        maxMargin: '20'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [allocData, dealerData, prodData] = await Promise.all([
                apiClient.get<any>('/manufacturer/allocations'),
                apiClient.get<any>('/manufacturer/network'),
                apiClient.get<any>('/manufacturer/products')
            ]);

            setAllocations(allocData || []);
            setDealers(dealerData || []);
            setProducts((prodData || []).filter((p: any) => p.status === 'APPROVED'));
        } catch (error: any) {
            console.error('Error fetching data:', error);
            toast.error(error.message || 'Failed to load allocation data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAllocate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await apiClient.post('/manufacturer/inventory/allocate', {
                ...formData,
                quantity: parseInt(formData.quantity),
                dealerMoq: parseInt(formData.dealerMoq),
                dealerBasePrice: parseFloat(formData.dealerBasePrice),
                maxMargin: parseFloat(formData.maxMargin)
            });

            toast.success('Stock allocated successfully');
            setShowModal(false);
            fetchData();
            setFormData({
                productId: '',
                dealerId: '',
                region: 'Pan-India',
                quantity: '0',
                dealerBasePrice: '',
                dealerMoq: '1',
                maxMargin: '20'
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to allocate stock');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRevoke = async (id: string) => {
        if (!confirm('Are you sure you want to revoke this allocation?')) return;
        try {
            await apiClient.delete(`/manufacturer/allocations/${id}`);
            toast.success('Allocation revoked');
            fetchData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to revoke allocation');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">Stock <span className="text-[#10367D]">Allocations</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Dealer Network Fulfillment & Inventory Distribution</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-10 py-5 bg-[#10367D] text-white rounded-[10px] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center gap-3"
                >
                    <FaPlus className="w-3 h-3" />
                    New Allocation
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { l: 'Total Allocations', v: allocations.length, c: 'text-[#10367D]', b: 'bg-blue-50' },
                    { l: 'Active Dealers', v: dealers.length, c: 'text-emerald-600', b: 'bg-emerald-50' },
                    { l: 'Allocated Volume', v: allocations.reduce((acc, curr) => acc + (curr.allocatedStock || 0), 0), c: 'text-amber-600', b: 'bg-amber-50' },
                ].map((s, i) => (
                    <div key={i} className={`p-8 rounded-[10px] border border-slate-100 shadow-sm ${s.b}`}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.l}</p>
                        <p className={`text-3xl font-black ${s.c}`}>{s.v}</p>
                    </div>
                ))}
            </div>

            {/* List Table */}
            <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1 max-w-md">
                        <div className="relative w-full">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                            <input type="text" placeholder="Search Allocations..." className="w-full bg-white border border-slate-100 rounded-[10px] py-3 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-[#10367D]/30" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/20 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                <th className="px-10 py-6 font-black">Dealer & Region</th>
                                <th className="px-10 py-6 font-black">Product</th>
                                <th className="px-10 py-6 font-black">Allocation Details</th>
                                <th className="px-10 py-6 font-black">Pricing Terms</th>
                                <th className="px-10 py-6 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-10 py-8 bg-slate-50/50 h-24"></td>
                                    </tr>
                                ))
                            ) : allocations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center text-slate-400 font-black uppercase tracking-widest text-[10px]">No active allocations found</td>
                                </tr>
                            ) : allocations.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-[10px] bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm group-hover:scale-110 transition-transform">
                                                    <FaUserTie className="w-5 h-5" />
                                                </div>
                                                {item.dealer?.subscriptions?.[0]?.plan?.priorityAllocation && (
                                                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                                                        <FaCrown className="text-white w-2.5 h-2.5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-black text-[#1E293B] italic">{item.dealer?.businessName}</h4>
                                                    {item.dealer?.subscriptions?.[0]?.plan?.name === 'ENTERPRISE' && (
                                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-tighter rounded-md border border-amber-200">Elite</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{item.region}</p>
                                                    {item.dealer?.subscriptions?.[0]?.plan?.priorityAllocation && (
                                                        <>
                                                            <span className="text-slate-200">•</span>
                                                            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1 italic">
                                                                Priority Partner
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-10 h-10 rounded-[10px] bg-[#10367D]/5 text-[#10367D] flex items-center justify-center border border-[#10367D]/10">
                                                <FaBox className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-[#1E293B]">{item.product?.name}</h4>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Base: ₹{Number(item.product?.basePrice).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-[#1E293B] italic">{item.allocatedStock} <span className="text-slate-300 text-[9px] uppercase font-bold">Units Allocated</span></p>
                                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">MOQ: {item.dealerMoq || 1} Units</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-[#10367D]">₹{Number(item.dealerBasePrice).toLocaleString()} <span className="text-[9px] text-slate-300 uppercase">Wholesale</span></p>
                                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Max Margin: {Number(item.maxMargin)}%</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleRevoke(item.id)}
                                                className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Allocation Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-[#1E293B]/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[10px] w-full max-w-2xl relative shadow-2xl p-10 overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight italic text-[#10367D]">Strategic <span className="text-[#1E293B]">Allocation</span></h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Configure Dealer Supply Terms</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-[10px] bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#10367D] transition-colors">
                                    <FaTimes />
                                </button>
                            </div>

                            <form onSubmit={handleAllocate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Dealer</label>
                                        <div className="relative">
                                            <FaUserTie className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                                            <select
                                                required
                                                value={formData.dealerId}
                                                onChange={(e) => setFormData({ ...formData, dealerId: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-[10px] py-4 pl-14 pr-6 text-xs font-black uppercase appearance-none focus:outline-none focus:border-[#10367D]/30"
                                            >
                                                <option value="">Select Target Dealer</option>
                                                {dealers.map(d => (
                                                    <option key={d.id} value={d.id}>{d.businessName}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Product</label>
                                        <div className="relative">
                                            <FaBox className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                                            <select
                                                required
                                                value={formData.productId}
                                                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-[10px] py-4 pl-14 pr-6 text-xs font-black uppercase appearance-none focus:outline-none focus:border-[#10367D]/30"
                                            >
                                                <option value="">Select Master SKU</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Allocation Qty</label>
                                        <div className="relative">
                                            <FaListOl className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                                            <input
                                                required
                                                type="number"
                                                value={formData.quantity}
                                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-[10px] py-4 pl-14 pr-6 text-xs font-black uppercase focus:outline-none focus:border-[#10367D]/30"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Wholesale Price (₹)</label>
                                        <div className="relative">
                                            <FaDollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                                            <input
                                                required
                                                type="number"
                                                value={formData.dealerBasePrice}
                                                onChange={(e) => setFormData({ ...formData, dealerBasePrice: e.target.value })}
                                                placeholder="Unit Price"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-[10px] py-4 pl-14 pr-6 text-xs font-black uppercase focus:outline-none focus:border-[#10367D]/30"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Region</label>
                                        <input
                                            type="text"
                                            value={formData.region}
                                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[10px] py-4 px-6 text-xs font-black uppercase focus:outline-none focus:border-[#10367D]/30"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dealer MOQ (Units)</label>
                                        <input
                                            type="number"
                                            value={formData.dealerMoq}
                                            onChange={(e) => setFormData({ ...formData, dealerMoq: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[10px] py-4 px-6 text-xs font-black uppercase focus:outline-none focus:border-[#10367D]/30"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Margin (%)</label>
                                        <div className="relative">
                                            <FaPercentage className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                                            <input
                                                type="number"
                                                value={formData.maxMargin}
                                                onChange={(e) => setFormData({ ...formData, maxMargin: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-[10px] py-4 pl-14 pr-6 text-xs font-black uppercase focus:outline-none focus:border-[#10367D]/30"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full py-6 bg-[#10367D] text-white rounded-[10px] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-[#10367D]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Configuring Asset...' : 'Deploy Allocation to Network'}
                                    <FaCheck className="w-3 h-3" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
