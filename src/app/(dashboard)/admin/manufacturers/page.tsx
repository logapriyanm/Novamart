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
    FaArrowRight,
    FaShieldAlt,
    FaBuilding,
    FaFileSignature,
    FaGlobe,
    FaClock,
    FaFilter
} from 'react-icons/fa';
import Link from 'next/link';
import { adminService } from '@/lib/api/services/admin.service';
import { toast } from 'sonner';
import Loader from '@/client/components/ui/Loader';

export default function ManufacturerApprovalPanel() {
    const [manufacturers, setManufacturers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState<'ALL' | 'VERIFIED' | 'PENDING' | 'SUSPENDED'>('ALL');
    // const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchManufacturers();
    }, []);

    const fetchManufacturers = async () => {
        setIsLoading(true);
        try {
            const result = await adminService.getManufacturers();
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
            await adminService.verifyManufacturer(manufacturerId, verify);
            setManufacturers(prev => prev.map(m => (m._id === manufacturerId || m.id === manufacturerId) ? { ...m, isVerified: verify } : m));
            if ((selectedRequest?._id === manufacturerId || selectedRequest?.id === manufacturerId)) {
                setSelectedRequest({ ...selectedRequest, isVerified: verify });
            }
            toast.success(`Manufacturer ${verify ? 'Verified' : 'Verification Revoked'}`);
        } catch (error) {
            toast.error('Action failed');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleUserStatus = async (userId: string, status: string) => {
        setIsVerifying(true);
        try {
            await adminService.updateUserStatus(userId, status);
            setManufacturers(prev => prev.map(m => m.userId === userId ? { ...m, user: { ...m.user, status } } : m));
            if (selectedRequest?.userId === userId) {
                setSelectedRequest({ ...selectedRequest, user: { ...selectedRequest.user, status } });
            }
            toast.success(`User status updated to ${status}`);
        } catch (error) {
            toast.error('Status update failed');
        } finally {
            setIsVerifying(false);
        }
    };

    const stats = {
        total: manufacturers.length,
        verified: manufacturers.filter(m => m.isVerified).length,
        pending: manufacturers.filter(m => !m.isVerified).length,
        suspended: manufacturers.filter(m => m.user?.status === 'SUSPENDED').length
    };

    const filteredManufacturers = manufacturers.filter(m => {
        const matchesSearch = m.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.gstNumber?.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterTab === 'ALL') return matchesSearch;
        if (filterTab === 'VERIFIED') return matchesSearch && m.isVerified;
        if (filterTab === 'PENDING') return matchesSearch && !m.isVerified;
        if (filterTab === 'SUSPENDED') return matchesSearch && m.user?.status === 'SUSPENDED';
        return matchesSearch;
    });

    return (
        <div className="min-h-screen  pb-20 overflow-x-hidden">
            {/* Top Navigation Row */}
            <div className="max-w-[1600px] mx-auto px-6 py-6">
                <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-[#10367D] transition-colors group">
                    <FaArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Back to Mission Control
                </Link>
            </div>

            {/* Hero Stats Section */}
            <div className="max-w-[1600px] mx-auto px-6 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 bg-blue-50 rounded-[10px] flex items-center justify-center text-blue-600">
                            <FaIndustry className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Entities</p>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight">{stats.total}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <FaShieldAlt className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Partners</p>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight">{stats.verified}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <FaClock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Review</p>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight">{stats.pending}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                            <FaExclamationCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suspended Accounts</p>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight">{stats.suspended}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Left: Directory List */}
                <div className="xl:col-span-7 space-y-6">
                    {/* Filter & Search Bar */}
                    <div className="bg-white p-4 rounded-[10px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex bg-slate-50 p-1.5 rounded-[10px] gap-1">
                            {['ALL', 'PENDING', 'VERIFIED', 'SUSPENDED'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilterTab(tab as any)}
                                    className={`px-6 py-2 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all ${filterTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                            <input
                                type="text"
                                placeholder="Search by GST or Title..."
                                className="w-full bg-slate-50 border-none rounded-[10px] py-2.5 pl-10 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Registry Content */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="bg-white p-20 rounded-[10px] text-center border border-slate-100 shadow-sm flex justify-center">
                                <Loader size="lg" variant="primary" />
                            </div>
                        ) : filteredManufacturers.length === 0 ? (
                            <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100 shadow-sm">
                                <FaBuilding className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">No Matches Found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {filteredManufacturers.map((mfg) => (
                                    <motion.div
                                        layout
                                        key={mfg._id || mfg.id}
                                        onClick={() => setSelectedRequest(mfg)}
                                        className={`group relative bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer ${(selectedRequest?._id === mfg._id || selectedRequest?.id === mfg.id) ? 'ring-2 ring-blue-500 bg-blue-50/20' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-16 h-16 rounded-[10px] flex items-center justify-center transition-all group-hover:scale-110 ${mfg.user?.status === 'SUSPENDED' ? 'bg-rose-50 text-rose-600' : mfg.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                                    <FaIndustry className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-slate-900 leading-tight mb-1">{mfg.companyName}</h4>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-[10px] border border-blue-100">GST: {mfg.gstNumber}</span>
                                                        {mfg.isVerified && (
                                                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                                                                <FaShieldAlt className="w-3 h-3" /> Verified
                                                            </span>
                                                        )}
                                                        {mfg.user?.status === 'SUSPENDED' && (
                                                            <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 flex items-center gap-1.5">
                                                                <FaExclamationCircle className="w-3 h-3" /> Suspended
                                                            </span>
                                                        )}
                                                        {!mfg.isVerified && mfg.user?.status !== 'SUSPENDED' && (
                                                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 flex items-center gap-1.5">
                                                                <FaClock className="w-3 h-3" /> Pending Audit
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="hidden md:block text-right">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Registration</p>
                                                    <p className="text-[10px] font-black text-slate-600 truncate max-w-[120px]">{mfg.registrationNo}</p>
                                                </div>
                                                <button className="w-10 h-10 rounded-[10px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    <FaArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Detailed Audit Panel */}
                <div className="xl:col-span-5 relative">
                    <AnimatePresence mode="wait">
                        {selectedRequest ? (
                            <motion.div
                                key={selectedRequest._id || selectedRequest.id}
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="bg-[#171717] rounded-[10px] p-8 text-white shadow-2xl sticky top-8 overflow-hidden group"
                            >
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />

                                <div className="flex items-center justify-between mb-10 relative">
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight italic">Governance <span className="text-blue-400">Audit</span></h3>
                                        <p className="text-[12px] font-black  tracking-[0.2em] text-slate-500 mt-1">Industrial Entity Protocol</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="px-3 py-1 bg-white/5 rounded-[10px] border border-white/10">
                                            <span className="text-[8px] font-black  tracking-widest text-slate-400">ID: {(selectedRequest._id || selectedRequest.id || '').slice(0, 8)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 relative">
                                    {/* Core Operations Card */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaBuilding className="w-3 h-3 text-blue-400" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Base Operations</p>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-[10px] border border-white/10 backdrop-blur-md space-y-6">
                                            <div>
                                                <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Factory Installation</p>
                                                <p className="text-sm font-bold leading-relaxed pr-8">{selectedRequest.factoryAddress}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Reg. Hash</p>
                                                    <p className="text-[10px] font-black text-blue-400 tracking-widest">{selectedRequest.registrationNo}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tax Token</p>
                                                    <p className="text-[10px] font-black text-white tracking-widest">{selectedRequest.gstNumber}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compliance Documentation */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaFileSignature className="w-3 h-3 text-emerald-400" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compliance Assets</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {selectedRequest.certifications?.length > 0 ? (
                                                selectedRequest.certifications.map((doc: string) => (
                                                    <div key={doc} className="group/doc flex items-center justify-between p-4 bg-white/5 rounded-[10px] border border-white/10 hover:bg-white/[0.08] transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-[10px] bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                                <FaFileAlt className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-200">{doc}</p>
                                                                <p className="text-[8px] font-bold text-slate-500 mt-0.5 uppercase tracking-tighter">Verified Static Asset</p>
                                                            </div>
                                                        </div>
                                                        <FaCheckCircle className="w-3 h-3 text-emerald-500 shadow-xl shadow-emerald-500/20" />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-6 bg-white/5 rounded-[10px] border border-white/10 text-center">
                                                    <FaGlobe className="w-8 h-8 text-white/5 mx-auto mb-3" />
                                                    <p className="text-[10px] font-bold text-slate-500 italic uppercase tracking-widest">No certifications linked</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Command Center */}
                                    <div className="pt-2 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {selectedRequest.isVerified ? (
                                                <button
                                                    onClick={() => handleAction(selectedRequest._id || selectedRequest.id, false)}
                                                    disabled={isVerifying}
                                                    className="group/btn relative py-5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[10px] font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-rose-500/20 active:scale-95 disabled:opacity-50"
                                                >
                                                    {isVerifying ? 'Processing...' : 'Revoke Status'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleAction(selectedRequest._id || selectedRequest.id, true)}
                                                    disabled={isVerifying}
                                                    className="group/btn relative py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-[10px] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine" />
                                                    <div className="flex items-center justify-center gap-3">
                                                        <FaShieldAlt className="w-4 h-4" />
                                                        Authorize Access
                                                    </div>
                                                </button>
                                            )}

                                            {selectedRequest.user?.status === 'SUSPENDED' ? (
                                                <button
                                                    onClick={() => handleUserStatus(selectedRequest.userId, 'ACTIVE')}
                                                    disabled={isVerifying}
                                                    className="py-5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-emerald-500/20 active:scale-95 disabled:opacity-50"
                                                >
                                                    Restore Account
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleUserStatus(selectedRequest.userId, 'SUSPENDED')}
                                                    disabled={isVerifying}
                                                    className="py-0 bg-white/5 hover:bg-white/[0.08] text-white/60 border border-white/10 rounded-[10px] font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:text-white active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                                >
                                                    <FaTimesCircle className="w-4 h-4" />
                                                    Kill Switch
                                                </button>
                                            )}
                                        </div>

                                        <p className="text-[11px] font-bold text-slate-500 text-center   leading-relaxed px-10">
                                            Authorized entities receive immediate <span className="text-white">API access</span>. The kill switch freezes all open payouts.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[700px] border-2 border-dashed border-slate-200 rounded-[10px] flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-white">
                                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6 shadow-sm">
                                    <FaExclamationCircle className="w-10 h-10 text-slate-200" />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-3">Target Not Scoped</h4>
                                <p className="text-[10px] font-bold leading-relaxed max-w-[240px] text-slate-400 uppercase tracking-widest">Select an industrial entity from the active ledger to initiate the audit protocol.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Global Loader Backdrop */}
            <AnimatePresence>
                {isVerifying && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-sm flex items-center justify-center"
                    >
                        <div className="p-8 bg-white rounded-[10px] shadow-2xl border border-slate-100 flex flex-col items-center gap-4">
                            <Loader size="md" variant="primary" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Syncing Governance state...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
