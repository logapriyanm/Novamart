'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaIndustry,
    FaFileAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationCircle,
    FaEye,
    FaSearch,
    FaArrowLeft,
    FaShieldAlt
} from 'react-icons/fa';
import Link from 'next/link';
import { apiClient } from '../../../../lib/api/client';
import { useSnackbar } from '../../../../client/context/SnackbarContext';

export default function ManufacturerApprovalPanel() {
    const [manufacturers, setManufacturers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchManufacturers();
    }, []);

    const fetchManufacturers = async () => {
        setIsLoading(true);
        try {
            const result = await apiClient.get<any>('/admin/manufacturers');
            setManufacturers(result || []);
        } catch (error) {
            console.error('Failed to fetch manufacturers', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (manufacturerId: string, verify: boolean) => {
        setIsVerifying(true);
        try {
            await apiClient.put(`/admin/manufacturers/${manufacturerId}/verify`, { isVerified: verify });
            setManufacturers(prev => prev.map(m => m.id === manufacturerId ? { ...m, isVerified: verify } : m));
            if (selectedRequest?.id === manufacturerId) {
                setSelectedRequest({ ...selectedRequest, isVerified: verify });
            }
            showSnackbar(`Manufacturer ${verify ? 'Verified' : 'Verification Revoked'}`, 'success');
        } catch (error) {
            showSnackbar('Action failed', 'error');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleUserStatus = async (userId: string, status: string) => {
        setIsVerifying(true);
        try {
            await apiClient.put(`/admin/users/${userId}/status`, { status, adminReason: 'Manual Admin Override' });
            setManufacturers(prev => prev.map(m => m.userId === userId ? { ...m, user: { ...m.user, status } } : m));
            if (selectedRequest?.userId === userId) {
                setSelectedRequest({ ...selectedRequest, user: { ...selectedRequest.user, status } });
            }
            showSnackbar(`User status updated to ${status}`, 'success');
        } catch (error) {
            showSnackbar('Status update failed', 'error');
        } finally {
            setIsVerifying(false);
        }
    };

    const filteredManufacturers = manufacturers.filter(m =>
        m.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.gstNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Mission Control
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight italic">Manufacturer <span className="text-[#10367D]">Verification</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Audit Protocol for Industrial Entities</p>
                    </div>
                    <div className="px-5 py-2.5 bg-[#10367D]/5 border border-[#10367D]/10 rounded-xl">
                        <span className="text-sm font-black text-[#10367D]">{manufacturers.length} Total Registered</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Pending Requests List */}
                <div className="xl:col-span-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Global Entity Registry</h2>
                        <div className="relative w-64">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                            <input
                                type="text"
                                placeholder="Search by GST or Title..."
                                className="w-full bg-white border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-bold focus:outline-none"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50 flex-1">
                        {isLoading ? (
                            <div className="p-20 text-center text-xs font-black text-slate-300 uppercase tracking-widest">Ingesting Entity Data...</div>
                        ) : filteredManufacturers.length === 0 ? (
                            <div className="p-20 text-center text-xs font-black text-slate-300 uppercase tracking-widest">No Manufacturers Found</div>
                        ) : (
                            filteredManufacturers.map((mfg) => (
                                <div
                                    key={mfg.id}
                                    onClick={() => setSelectedRequest(mfg)}
                                    className={`p-8 flex items-center justify-between hover:bg-[#10367D]/5 cursor-pointer transition-all ${selectedRequest?.id === mfg.id ? 'bg-[#10367D]/5 border-l-4 border-[#10367D]' : ''}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${mfg.user?.status === 'SUSPENDED' ? 'bg-rose-50 text-rose-600' : mfg.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                            <FaIndustry className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-black text-[#1E293B]">{mfg.companyName}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black text-[#10367D] uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-[#10367D]/10">GST: {mfg.gstNumber}</span>
                                                {mfg.isVerified && (
                                                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                                                        <FaShieldAlt className="w-2 h-2" /> Verified
                                                    </span>
                                                )}
                                                {mfg.user?.status === 'SUSPENDED' && (
                                                    <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded border border-rose-100 flex items-center gap-1">
                                                        <FaExclamationCircle className="w-2 h-2" /> Suspended
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <FaEye className="w-4 h-4 text-slate-300" />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Audit & Verification Panel */}
                <div className="xl:col-span-5 relative">
                    <AnimatePresence mode="wait">
                        {selectedRequest ? (
                            <motion.div
                                key={selectedRequest.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-[#1E293B] rounded-[3rem] p-10 text-white shadow-2xl sticky top-28"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-xl font-black tracking-tight">Governance Audit</h3>
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-[#10367D] px-3 py-1 rounded-full">Entity ID: {selectedRequest.id?.slice(0, 8)}</span>
                                </div>

                                <div className="space-y-8">
                                    {/* Company Details */}
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Operations</p>
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Factory Location</p>
                                                <p className="text-xs font-bold leading-relaxed">{selectedRequest.factoryAddress}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Registration Hash</p>
                                                <p className="text-xs font-bold font-mono text-[#10367D]">{selectedRequest.registrationNo}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Documents Section */}
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Assets</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {selectedRequest.certifications?.map((doc: string) => (
                                                <div key={doc} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                                                    <div className="flex items-center gap-3">
                                                        <FaFileAlt className="w-4 h-4 text-[#10367D]" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{doc}</span>
                                                    </div>
                                                    <FaCheckCircle className="w-3 h-3 text-emerald-500" />
                                                </div>
                                            )) || (
                                                    <p className="text-[10px] font-bold text-slate-500 italic">No static certifications uploaded.</p>
                                                )}
                                        </div>
                                    </div>

                                    {/* Action Area */}
                                    <div className="pt-8 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedRequest.isVerified ? (
                                                <button
                                                    onClick={() => handleAction(selectedRequest.id, false)}
                                                    disabled={isVerifying}
                                                    className="w-full py-4 bg-rose-600/20 text-rose-500 border border-rose-600/30 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    {isVerifying ? 'Updating...' : 'Revoke Verification'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleAction(selectedRequest.id, true)}
                                                    disabled={isVerifying}
                                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                                >
                                                    <FaShieldAlt className="w-4 h-4" />
                                                    Grant Verification
                                                </button>
                                            )}

                                            {selectedRequest.user?.status === 'SUSPENDED' ? (
                                                <button
                                                    onClick={() => handleUserStatus(selectedRequest.userId, 'ACTIVE')}
                                                    disabled={isVerifying}
                                                    className="w-full py-4 bg-emerald-600/20 text-emerald-500 border border-emerald-600/30 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    Reactivate Account
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleUserStatus(selectedRequest.userId, 'SUSPENDED')}
                                                    disabled={isVerifying}
                                                    className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                                >
                                                    <FaTimesCircle className="w-4 h-4" />
                                                    Suspend Entity
                                                </button>
                                            )}
                                        </div>

                                        <p className="text-[8px] font-black text-slate-500 text-center uppercase tracking-widest leading-relaxed px-4">
                                            Verification allows instant go-live. Suspension immediately hides all active listings and freezes payments.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[600px] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center text-slate-500">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                    <FaExclamationCircle className="w-10 h-10 text-white/10" />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-widest mb-2">Audit Selection Required</h4>
                                <p className="text-[10px] font-bold leading-relaxed max-w-[200px]">Select a manufacturer from the registry to initiate governance protocol.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

