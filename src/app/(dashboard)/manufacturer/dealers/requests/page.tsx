'use client';

import React, { useState, useEffect } from 'react';
import {
    FaUserCheck, FaStore, FaClock, FaMapMarkerAlt,
    FaCheck, FaTimes, FaFileExport, FaFilter,
    FaChevronLeft, FaChevronRight, FaExternalLinkAlt,
    FaSpinner
} from 'react-icons/fa';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

export default function DealerRequests() {
    const [activeTab, setActiveTab] = useState('PENDING');
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchRequests();
    }, [activeTab]);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<any>(`/manufacturer/dealers/requests?status=${activeTab}`);
            console.log('Fetched Requests:', response);
            setRequests(response || []);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch requests');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (dealerId: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            await apiClient.post('/manufacturer/dealers/handle', { dealerId, status });
            toast.success(`Dealer ${status.toLowerCase()} successfully`);
            fetchRequests();
        } catch (error: any) {
            toast.error(error.message || `Failed to ${status.toLowerCase()} dealer`);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-[#1E293B]">Dealer Access Requests</h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Review and manage retail partnership applications from the NovaMart network.</p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-slate-200 w-full md:w-auto">
                    {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-colors ${activeTab === tab ? 'text-[#0F6CBD]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab.charAt(0) + tab.slice(1).toLowerCase()}
                            {activeTab === tab && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F6CBD]" />}
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <FaFilter className="w-3 h-3" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <FaFileExport className="w-3 h-3" />
                        Export
                    </button>
                </div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                        <FaSpinner className="w-8 h-8 text-[#0F6CBD] animate-spin mb-4" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Synchronizing Request Pipeline...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                        <FaUserCheck className="w-12 h-12 text-slate-100 mb-4" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No {activeTab.toLowerCase()} requests found</p>
                    </div>
                ) : (
                    requests.map((request) => {
                        const dealer = request.dealer;
                        return (
                            <motion.div
                                key={request.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 flex flex-col md:flex-row gap-8"
                            >
                                {/* Dealer Info */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-[#0F6CBD]/5 flex items-center justify-center text-[#0F6CBD] shadow-sm font-black text-xl">
                                            {dealer.businessName?.charAt(0) || 'D'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-lg font-black text-[#1E293B]">{dealer.businessName}</h3>
                                                {dealer.isVerified && (
                                                    <span className="bg-blue-50 text-[#0F6CBD] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-100">
                                                        <FaCheck className="w-2 h-2" /> NovaMart Verified
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 mt-2 text-xs font-bold text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <FaMapMarkerAlt className="w-3 h-3 text-slate-400" />
                                                    {dealer.city}, {dealer.state}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <FaStore className="w-3 h-3 text-slate-400" />
                                                    {dealer.businessType || 'Retailer'}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <FaClock className="w-3 h-3 text-slate-400" />
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <Link href={`/manufacturer/dealers/profile/${dealer.id}`} className="text-[10px] font-black uppercase tracking-widest text-[#0F6CBD] hover:underline flex items-center gap-1">
                                            View Dealer Profile <FaExternalLinkAlt className="w-2 h-2" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="flex-1 border-l border-slate-100 pl-8 md:pl-8">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Request Memo</p>
                                    <p className="text-xs font-bold text-slate-600 italic">
                                        {request.message || "Establishing a regional partnership for supply chain fulfillment."}
                                    </p>
                                    <div className="mt-4 flex flex-col gap-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact Info</p>
                                        <p className="text-[10px] font-bold text-slate-500">{dealer.user?.email || 'No Email'}</p>
                                        <p className="text-[10px] font-bold text-slate-500">{dealer.user?.phone || 'No Phone'}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                {request.status === 'PENDING' && (
                                    <div className="flex flex-col justify-between items-end border-l border-slate-100 pl-8 md:pl-8 min-w-[200px]">
                                        <div></div>
                                        <div className="flex items-center gap-3 w-full">
                                            <button
                                                onClick={() => handleAction(dealer.id, 'REJECTED')}
                                                className="flex-1 py-3 px-4 border border-rose-100 text-rose-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-50 transition-all"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleAction(dealer.id, 'APPROVED')}
                                                className="flex-1 py-3 px-4 bg-[#0F6CBD] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0F6CBD]/90 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                                            >
                                                Approve <FaCheck className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {!isLoading && requests.length > 0 && (
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-8">
                    <p>Showing {requests.length} records</p>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-50">
                            <FaChevronLeft className="w-3 h-3" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-all">
                            <FaChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
