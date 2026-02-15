'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUsers,
    FaStore,
    FaArrowLeft,
    FaChartLine,
    FaBoxOpen,
    FaChevronRight,
    FaStar,
    FaShieldAlt,
    FaHistory,
    FaSearch,
    FaCheckCircle,
    FaGlobe,
    FaUserCheck,
    FaClock,
    FaMapMarkerAlt
} from 'react-icons/fa';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import Loader from '@/client/components/ui/Loader';

export default function SellerRelationshipPortal() {
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Requests State
    const [activeTab, setActiveTab] = useState<'network' | 'requests'>('network');
    const [requests, setRequests] = useState<any[]>([]);
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestFilter, setRequestFilter] = useState('PENDING'); // PENDING, APPROVED, REJECTED

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (activeTab === 'requests') {
            fetchRequests();
        }
    }, [activeTab, requestFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await apiClient.get<any[]>('/manufacturer/network');
            const mapped = (data || [])
                .filter(d => d && d.businessName)
                .map(d => ({
                    id: d.id || d._id,
                    name: d.businessName,
                    location: `${d.city || 'Unknown'}, ${d.state || ''}`,
                    rating: d.averageRating || 5.0,
                    status: d.isVerified ? 'Active' : 'Pending',
                    ...d
                }));
            setSellers(mapped);
        } catch (error) {
            console.error('Failed to fetch sellers', error);
            toast.error('Failed to fetch active partners');
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        setRequestLoading(true);
        try {
            const response = await apiClient.get<any>(`/manufacturer/sellers/requests?status=${requestFilter}`);
            setRequests(Array.isArray(response) ? response : []);
        } catch (error: any) {
            // toast.error(error.message || 'Failed to fetch requests');
            console.error('Fetch requests error', error);
        } finally {
            setRequestLoading(false);
        }
    };

    const handleRequestAction = async (sellerId: string, status: 'APPROVED' | 'REJECTED') => {
        let reason = '';
        if (status === 'REJECTED') {
            const promptVal = prompt('Reason for rejection:');
            if (promptVal === null) return;
            reason = promptVal;
        }

        try {
            await apiClient.post('/manufacturer/network/handle', { sellerId, status, reason });
            toast.success(`Seller ${status.toLowerCase()} successfully`);
            fetchRequests();
            if (status === 'APPROVED') fetchData();
        } catch (error: any) {
            toast.error(error.message || `Failed to ${status.toLowerCase()} seller`);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-slate-900">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/manufacturer" className="flex items-center gap-2 text-sm font-black text-[#067FF9] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Seller <span className="text-[#067FF9]">Network</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">Manage Authorized Partners & Access Requests</p>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-[10px]">
                        <button
                            onClick={() => setActiveTab('network')}
                            className={`px-6 py-2.5 rounded-[8px] text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'network' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Active Partners
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`px-6 py-2.5 rounded-[8px] text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'requests' ? 'bg-white text-[#067FF9] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Access Requests
                        </button>
                    </div>
                </div>
            </div>

            {/* Network Analytics (Visible only on Active Network tab) */}
            {activeTab === 'network' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-slate-900 rounded-[10px] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
                        <div className="relative z-10">
                            <FaStore className="w-8 h-8 text-slate-400 mb-6" />
                            <p className="text-4xl font-black">{sellers.length}</p>
                            <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Active Partners</p>
                        </div>
                    </div>
                    <div className="bg-emerald-50 rounded-[10px] p-10 text-emerald-900 border border-emerald-100">
                        <FaUserCheck className="w-8 h-8 text-emerald-400 mb-6" />
                        <p className="text-4xl font-black">{sellers.filter((d: any) => d.isVerified).length}</p>
                        <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">Verified Sellers</p>
                    </div>
                    <div className="bg-blue-50 rounded-[10px] p-10 text-blue-900 border border-blue-100">
                        <FaGlobe className="w-8 h-8 text-blue-400 mb-6" />
                        <p className="text-4xl font-black">{new Set(sellers.map((d: any) => d.state)).size}</p>
                        <p className="text-sm font-black text-blue-600 uppercase tracking-widest">Regions Covered</p>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">

                {activeTab === 'network' ? (
                    <>
                        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="relative w-full max-w-md">
                                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                                <input type="text" placeholder="Search partners..." className="w-full bg-white border border-slate-100 rounded-[10px] py-3 pl-14 pr-6 text-xs font-bold focus:outline-none focus:border-[#067FF9]/30" />
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                <span>Total Active Network: {sellers.length}</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/20 border-b border-slate-50 text-sm font-bold text-slate-400 uppercase tracking-wide">
                                        <th className="px-10 py-5">Partner Identity</th>
                                        <th className="px-10 py-5">Location</th>
                                        <th className="px-10 py-5 text-center">Status</th>
                                        <th className="px-10 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr><td colSpan={4} className="py-20 text-center"><Loader /></td></tr>
                                    ) : sellers.length === 0 ? (
                                        <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold">No active partners found.</td></tr>
                                    ) : sellers.map((seller: any) => (
                                        <tr key={seller.id} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black">
                                                        {seller.businessName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900">{seller.businessName}</p>
                                                        <p className="text-xs font-medium text-slate-400">{seller.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                                                    <FaGlobe className="text-slate-300" />
                                                    {seller.city}, {seller.state}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                                                    <FaCheckCircle className="w-2.5 h-2.5" /> Active
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <Link href={`/manufacturer/messages?id=${seller.userId}`} className="text-[#067FF9] font-bold text-xs hover:underline">
                                                    Message
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    // PENDING REQUESTS TAB
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            {['PENDING', 'APPROVED', 'REJECTED'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setRequestFilter(filter)}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${requestFilter === filter ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {requestLoading ? (
                            <div className="flex justify-center py-20"><Loader /></div>
                        ) : requests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400 border border-dashed border-slate-100 rounded-[10px]">
                                <FaUserCheck className="w-8 h-8 mb-3 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest">No {requestFilter.toLowerCase()} requests</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {requests.map((req) => {
                                    const seller = req.seller || req.dealer;
                                    if (!seller) return null;
                                    return (
                                        <div key={req._id || req.id} className="bg-white border border-slate-100 rounded-[10px] p-6 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-[10px] bg-[#067FF9]/5 flex items-center justify-center text-[#067FF9] font-black text-lg">
                                                        {seller.businessName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-slate-900">{seller.businessName}</h4>
                                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-bold text-slate-500">
                                                            <span className="flex items-center gap-1.5"><FaMapMarkerAlt /> {seller.city}, {seller.state}</span>
                                                            <span className="flex items-center gap-1.5"><FaClock /> {new Date(req.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="mt-4 text-sm font-medium text-slate-600 italic border-l-2 border-slate-100 pl-4">
                                                            "{req.message || 'Requesting partnership access.'}"
                                                        </p>
                                                    </div>
                                                </div>

                                                {req.status === 'PENDING' && (
                                                    <div className="flex flex-col justify-center gap-3 min-w-[150px]">
                                                        <button
                                                            onClick={() => handleRequestAction(seller._id || seller.id, 'APPROVED')}
                                                            className="px-4 py-2 bg-[#067FF9] text-white rounded-[8px] text-xs font-black uppercase tracking-wider hover:bg-[#067FF9]/90 shadow-lg shadow-blue-200 transition-all"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleRequestAction(seller._id || seller.id, 'REJECTED')}
                                                            className="px-4 py-2 border border-slate-200 text-slate-500 rounded-[8px] text-xs font-black uppercase tracking-wider hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {req.status !== 'PENDING' && (
                                                    <div className="flex items-center justify-center min-w-[150px]">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                            {req.status}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
