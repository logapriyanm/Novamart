'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBox,
    FaPlus,
    FaSearch,
    FaUserTie,
    FaCalendarAlt,
    FaTimes,
    FaCheck,
    FaTrash,
    FaMapMarkerAlt,
    FaClock,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import Loader from '@/client/components/ui/Loader';

export default function StockAllocationManager() {
    const [allocations, setAllocations] = useState<any[]>([]);
    const [dealers, setDealers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        productId: '',
        sellerId: '',
        region: 'Pan-India',
        quantity: '0',
        sellerBasePrice: '',
        sellerMoq: '1',
        maxMargin: '20'
    });

    // Requests State
    const [activeTab, setActiveTab] = useState<'active' | 'requests'>('active');
    const [requests, setRequests] = useState<any[]>([]);
    const [requestLoading, setRequestLoading] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
        fetchRequests();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [allocData, dealerData, prodData] = await Promise.all([
                apiClient.get<any>('/manufacturer/allocations'),
                apiClient.get<any>('/manufacturer/network'),
                apiClient.get<any>('/manufacturer/products')
            ]);

            setAllocations(Array.isArray(allocData) ? allocData : []);
            setDealers(Array.isArray(dealerData) ? dealerData : []);
            setProducts((Array.isArray(prodData) ? prodData : []).filter((p: any) => p.status === 'APPROVED'));
        } catch (error: any) {
            console.error('Error fetching data:', error);
            toast.error(error.message || 'Failed to load allocation data');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRequests = async () => {
        setRequestLoading(true);
        try {
            const data = await apiClient.get<any>('/manufacturer/products/requests');
            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setRequestLoading(false);
        }
    };

    const handleAllocate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await apiClient.post('/manufacturer/inventory/allocate', {
                ...formData,
                quantity: parseInt(formData.quantity),
                sellerMoq: parseInt(formData.sellerMoq),
                sellerBasePrice: parseFloat(formData.sellerBasePrice),
                maxMargin: parseFloat(formData.maxMargin)
            });

            toast.success('Stock allocated successfully');
            setShowModal(false);
            fetchData();
            setFormData({
                productId: '',
                sellerId: '',
                region: 'Pan-India',
                quantity: '0',
                sellerBasePrice: '',
                sellerMoq: '1',
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

    const handleApproveRequest = async (inventoryId: string) => {
        setProcessingId(inventoryId);
        try {
            await apiClient.post('/manufacturer/products/requests/approve', { inventoryId });
            toast.success('Request approved — stock allocated to seller');
            setRequests(prev => prev.filter(req => req._id !== inventoryId));
            fetchData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to approve request');
        } finally {
            setProcessingId(null);
        }
    };

    const handleRejectRequest = async (inventoryId: string) => {
        const reason = prompt('Please enter a reason for rejection:');
        if (reason === null) return;

        setProcessingId(inventoryId);
        try {
            await apiClient.post('/manufacturer/products/requests/reject', { inventoryId, reason });
            toast.success('Request rejected');
            setRequests(prev => prev.filter(req => req._id !== inventoryId));
        } catch (error: any) {
            toast.error(error.message || 'Failed to reject request');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-slate-900">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-foreground/5 pb-8">
                <h1 className="text-2xl font-bold italic uppercase tracking-tight text-slate-900">Stock Allocations</h1>
                <div className="flex items-center gap-3">
                    {/* Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-[10px]">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`px-6 py-2 rounded-[8px] text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'active' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`px-6 py-2 rounded-[8px] text-sm font-bold transition-all whitespace-nowrap relative ${activeTab === 'requests' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Pending Requests
                            {requests.length > 0 && (
                                <span className="ml-2 px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-bold">{requests.length}</span>
                            )}
                        </button>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-2.5 bg-primary text-black rounded-[10px] text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-sm whitespace-nowrap flex items-center gap-2"
                    >
                        <FaPlus className="w-3 h-3" /> Allocate
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            {activeTab === 'active' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Total Allocations</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">{allocations.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm">
                        <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide">Active Partners</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">{dealers.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm">
                        <p className="text-sm font-bold text-amber-600 uppercase tracking-wide">Total Volume</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">
                            {allocations.reduce((acc, curr) => acc + (curr.allocatedStock || curr.allocatedQuantity || 0), 0)}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Pending Requests</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">{requests.length}</p>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                {activeTab === 'active' ? (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-wide">Partner</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-wide">Product</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-wide">Region</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-wide">Allocation</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-wide">Pricing</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-wide text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="py-12">
                                                <div className="flex justify-center"><Loader /></div>
                                            </td>
                                        </tr>
                                    ) : allocations.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-sm font-bold text-slate-300 uppercase tracking-wide">
                                                No active allocations
                                            </td>
                                        </tr>
                                    ) : allocations.map((item) => (
                                        <tr key={item.id || item._id} className="group hover:bg-slate-50 transition-all">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-[10px] bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200">
                                                        <FaUserTie className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900">{item.sellerId?.businessName || 'Unknown'}</h4>
                                                        <p className="text-xs font-medium text-slate-400 mt-0.5">{item.sellerId?.city || ''}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-[10px] bg-slate-50 border border-slate-100 flex items-center justify-center">
                                                        <MdOutlineProductionQuantityLimits className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900">{item.productId?.name || 'Unknown'}</h4>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-600">{item.region || 'Pan-India'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{item.allocatedStock || item.allocatedQuantity || 0} units</p>
                                                    <p className="text-xs font-medium text-slate-400">MOQ: {item.sellerMoq || 1}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">₹{Number(item.sellerBasePrice || item.negotiatedPrice || 0).toLocaleString()}</p>
                                                    <p className="text-xs font-medium text-slate-400">Max Margin: {Number(item.maxMargin || 0)}%</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleRevoke(item.id || item._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-500 transition-all"
                                                    title="Revoke Allocation"
                                                >
                                                    <FaTrash className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {isLoading ? (
                                <div className="flex justify-center py-12"><Loader /></div>
                            ) : allocations.length === 0 ? (
                                <div className="px-6 py-12 text-center text-sm font-bold text-slate-300 uppercase tracking-wide">
                                    No active allocations
                                </div>
                            ) : allocations.map((item) => (
                                <div key={item.id || item._id} className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">{item.seller?.businessName || 'Unknown'}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{item.product?.name || 'Unknown Product'}</p>
                                        </div>
                                        <span className="inline-flex px-2 py-0.5 rounded-[10px] text-xs font-bold uppercase bg-emerald-50 text-emerald-600">
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>{item.allocatedStock || item.allocatedQuantity || 0} units · {item.region}</span>
                                        <span className="font-bold text-slate-900">₹{Number(item.sellerBasePrice || item.negotiatedPrice || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleRevoke(item.id || item._id)}
                                            className="px-3 py-1.5 bg-rose-50 text-rose-500 rounded-[10px] text-sm font-bold hover:bg-rose-100 transition-all flex items-center gap-1.5"
                                        >
                                            <FaTrash className="w-3 h-3" /> Revoke
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <p className="text-sm font-bold text-slate-500">
                                Showing {allocations.length} allocations
                            </p>
                        </div>
                    </>
                ) : (
                    /* Pending Requests Tab */
                    <div>
                        {requestLoading ? (
                            <div className="flex justify-center py-20"><Loader /></div>
                        ) : requests.length === 0 ? (
                            <div className="py-20 text-center">
                                <FaCheck className="w-10 h-10 mx-auto mb-4 text-slate-200" />
                                <h3 className="text-lg font-bold text-slate-900">All Clear</h3>
                                <p className="text-sm text-slate-400 mt-1">No pending product requests from sellers.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {requests.map((req) => (
                                    <div key={req._id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-all">
                                        {/* Product Info */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-[10px] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {req.productId?.images?.[0] ? (
                                                    <img src={req.productId.images[0]} className="w-full h-full object-contain" alt="" />
                                                ) : (
                                                    <FaBox className="text-slate-300 w-5 h-5" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-slate-900 truncate">{req.productId?.name || 'Unknown Product'}</h4>
                                                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-medium text-slate-400">
                                                    <span className="flex items-center gap-1"><FaUserTie className="w-3 h-3" /> {req.sellerId?.businessName || 'Unknown'}</span>
                                                    <span className="flex items-center gap-1"><FaBox className="w-3 h-3" /> Qty: {req.requestedQuantity || 0}</span>
                                                    <span className="flex items-center gap-1"><FaMapMarkerAlt className="w-3 h-3" /> {req.region || 'N/A'}</span>
                                                    <span className="flex items-center gap-1"><FaCalendarAlt className="w-3 h-3" /> {new Date(req.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status + Actions */}
                                        <div className="flex items-center gap-2 w-full md:w-auto">
                                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold uppercase rounded-full border border-amber-100 flex items-center gap-1">
                                                <FaClock className="w-2.5 h-2.5" /> Pending
                                            </span>
                                            <button
                                                onClick={() => handleRejectRequest(req._id)}
                                                disabled={processingId === req._id}
                                                className="flex-1 md:flex-none px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-[10px] hover:bg-slate-50 hover:text-rose-600 transition-colors disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleApproveRequest(req._id)}
                                                disabled={processingId === req._id}
                                                className="flex-1 md:flex-none px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-[10px] hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {processingId === req._id ? (
                                                    <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                                                ) : (
                                                    <>Approve <FaCheck className="w-3 h-3" /></>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ==================== NEW ALLOCATION MODAL ==================== */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[10px] w-full max-w-2xl relative shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">New Stock Allocation</h2>
                                    <p className="text-sm text-slate-400 mt-0.5">Assign inventory to a partner seller</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-[10px] transition-colors">
                                    <FaTimes className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleAllocate} className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Partner</label>
                                        <select
                                            required
                                            value={formData.sellerId}
                                            onChange={(e) => setFormData({ ...formData, sellerId: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-[10px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm"
                                        >
                                            <option value="">Choose a partner...</option>
                                            {dealers.map(d => (
                                                <option key={d.id || d._id} value={d.id || d._id}>{d.businessName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Product</label>
                                        <select
                                            required
                                            value={formData.productId}
                                            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-[10px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm"
                                        >
                                            <option value="">Choose a product...</option>
                                            {products.map(p => (
                                                <option key={p.id || p._id} value={p.id || p._id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantity</label>
                                        <input
                                            required
                                            type="number"
                                            min="1"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-[10px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm"
                                            placeholder="Units to allocate"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Wholesale Price (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.sellerBasePrice}
                                            onChange={(e) => setFormData({ ...formData, sellerBasePrice: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-[10px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm"
                                            placeholder="Per unit price"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Region</label>
                                        <input
                                            type="text"
                                            value={formData.region}
                                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-[10px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm"
                                            placeholder="e.g. Mumbai, Pan-India"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Partner MOQ</label>
                                        <input
                                            type="number"
                                            value={formData.sellerMoq}
                                            onChange={(e) => setFormData({ ...formData, sellerMoq: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-[10px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm"
                                            placeholder="Min order quantity"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Margin (%)</label>
                                        <input
                                            type="number"
                                            value={formData.maxMargin}
                                            onChange={(e) => setFormData({ ...formData, maxMargin: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-[10px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm"
                                            placeholder="20"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full py-3 bg-black text-white rounded-[10px] font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mt-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                            Allocating...
                                        </>
                                    ) : (
                                        <>Confirm Allocation <FaCheck className="w-3 h-3" /></>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
