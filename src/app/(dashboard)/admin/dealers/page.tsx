'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaStore,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationCircle,
    FaEye,
    FaSearch,
    FaArrowLeft,
    FaArrowRight,
    FaIdCard,
    FaShieldAlt,
    FaClock,
    FaIndustry,
    FaLink,
    FaUnlink
} from 'react-icons/fa';
import Link from 'next/link';
import { adminService } from '@/lib/api/services/admin.service';
import { toast } from 'sonner';
import Loader from '@/client/components/ui/Loader';

export default function DealerApprovalPanel() {
    const [dealers, setDealers] = useState<any[]>([]);
    const [manufacturers, setManufacturers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'SUSPENDED'>('ALL');
    // const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchDealers();
        fetchManufacturers();
    }, []);

    const fetchDealers = async () => {
        setIsLoading(true);
        try {
            const result = await adminService.getDealers();
            setDealers(result || []);
        } catch (error) {
            console.error('Failed to fetch dealers', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchManufacturers = async () => {
        try {
            const result = await adminService.getManufacturers();
            setManufacturers(result || []);
        } catch (error) {
            console.error('Failed to fetch manufacturers', error);
        }
    };

    const handleAction = async (dealerId: string, verify: boolean) => {
        setIsVerifying(true);
        try {
            await adminService.verifyDealer(dealerId, verify);
            setDealers(prev => prev.map(d => (d._id === dealerId || d.id === dealerId) ? { ...d, isVerified: verify } : d));
            if ((selectedRequest?._id === dealerId || selectedRequest?.id === dealerId)) {
                setSelectedRequest({ ...selectedRequest, isVerified: verify });
            }
            toast.success(`Dealer ${verify ? 'Verified' : 'Verification Revoked'}`);
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
            setDealers(prev => prev.map(d => d.userId === userId ? { ...d, user: { ...d.user, status } } : d));
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

    const handleLinkManufacturer = async (manufacturerId: string) => {
        if (!selectedRequest) return;
        setIsVerifying(true);
        try {
            await adminService.updateDealerManufacturers(selectedRequest._id || selectedRequest.id, manufacturerId);
            const updatedDealer = { ...selectedRequest, approvedBy: manufacturers.find(m => (m._id === manufacturerId || m.id === manufacturerId)) };
            setDealers(prev => prev.map(d => (d._id === (selectedRequest._id || selectedRequest.id) || d.id === (selectedRequest._id || selectedRequest.id)) ? updatedDealer : d));
            setSelectedRequest(updatedDealer);
            toast.success('Manufacturer linked successfully');
        } catch (error) {
            toast.error('Linking failed');
        } finally {
            setIsVerifying(false);
        }
    };

    const stats = {
        total: dealers.length,
        verified: dealers.filter(d => d.isVerified).length,
        pending: dealers.filter(d => !d.isVerified).length,
        suspended: dealers.filter(d => d.user?.status === 'SUSPENDED').length
    };

    const filteredDealers = dealers.filter(d => {
        const matchesSearch = d.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.gstNumber?.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterTab === 'ALL') return matchesSearch;
        if (filterTab === 'VERIFIED') return matchesSearch && d.isVerified;
        if (filterTab === 'PENDING') return matchesSearch && !d.isVerified;
        if (filterTab === 'SUSPENDED') return matchesSearch && d.user?.status === 'SUSPENDED';
        return matchesSearch;
    });

    return (
        <div className="min-h-screen  pb-20 overflow-x-hidden">
            {/* Top Navigation Row */}
            <div className="max-w-[1600px] mx-auto px-6 py-6">
                <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#10367D] transition-colors group">
                    <FaArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Back to Mission Control
                </Link>
            </div>

            {/* Hero Stats Section */}
            <div className="max-w-[1600px] mx-auto px-6 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 bg-blue-50 rounded-[10px] flex items-center justify-center text-blue-600">
                            <FaStore className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400">Retail Outlets</p>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight">{stats.total}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <FaShieldAlt className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400">Verified Dealers</p>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight">{stats.verified}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <FaClock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400">Enrollment Queue</p>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight">{stats.pending}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                            <FaExclamationCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400">Flagged Access</p>
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
                        <div className="flex bg-slate-50 p-1.5 rounded-[10px] gap-1 overflow-x-auto">
                            {['ALL', 'PENDING', 'VERIFIED', 'SUSPENDED'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilterTab(tab as any)}
                                    className={`px-6 py-2 rounded-[10px] text-sm font-bold transition-all whitespace-nowrap ${filterTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                            <input
                                type="text"
                                placeholder="Search by GST or Business..."
                                className="w-full bg-slate-50 border-none rounded-[10px] py-2.5 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
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
                        ) : filteredDealers.length === 0 ? (
                            <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100 shadow-sm">
                                <FaStore className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                <p className="text-sm font-bold text-slate-300 uppercase tracking-[0.2em]">No Outlets Found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {filteredDealers.map((dlr) => (
                                    <motion.div
                                        layout
                                        key={dlr._id || dlr.id}
                                        onClick={() => setSelectedRequest(dlr)}
                                        className={`group relative bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer ${(selectedRequest?._id === dlr._id || selectedRequest?.id === dlr.id) ? 'ring-2 ring-blue-500 bg-blue-50/20' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-16 h-16 rounded-[10px] flex items-center justify-center transition-all group-hover:scale-110 ${dlr.user?.status === 'SUSPENDED' ? 'bg-rose-50 text-rose-600' : dlr.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                                    <FaStore className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-slate-900 leading-tight mb-1">{dlr.businessName || 'Unnamed Entity'}</h4>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-[10px] border border-blue-100">GST: {dlr.gstNumber || 'N/A'}</span>
                                                        {dlr.isVerified && (
                                                            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-[10px] border border-emerald-100 flex items-center gap-1.5">
                                                                <FaShieldAlt className="w-3 h-3" /> Verified
                                                            </span>
                                                        )}
                                                        {dlr.user?.status === 'SUSPENDED' && (
                                                            <span className="text-sm font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 flex items-center gap-1.5">
                                                                <FaExclamationCircle className="w-3 h-3" /> Suspended
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="hidden md:block text-right">
                                                    <p className="text-sm font-bold text-slate-400 mb-0.5">Location</p>
                                                    <p className="text-sm font-bold text-slate-600 truncate max-w-[120px]">{dlr.city || 'Unknown'}</p>
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
                                        <h3 className="text-2xl font-black tracking-tight italic">Retail <span className="text-blue-400">Governance</span></h3>
                                        <p className="text-sm font-bold text-slate-500 mt-1">High-Trust Enrollment Protocol</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="px-3 py-1 bg-white/5 rounded-[10px] border border-white/10">
                                            <span className="text-sm font-bold text-slate-400">ID: {(selectedRequest._id || selectedRequest.id || '').slice(0, 8)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 relative">
                                    {/* Core Operations Card */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaMapMarkerAlt className="w-3 h-3 text-blue-400" />
                                            <p className="text-sm font-bold text-slate-400">Operational Base</p>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-[10px] border border-white/10 backdrop-blur-md space-y-6">
                                            <div>
                                                <p className="text-sm font-bold text-slate-500 mb-1.5">Business Address</p>
                                                <p className="text-sm font-bold leading-relaxed pr-8">{selectedRequest.businessAddress || 'N/A'}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-500 mb-1.5">City/Region</p>
                                                    <p className="text-sm font-bold text-white">{selectedRequest.city || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-500 mb-1.5">GST Token</p>
                                                    <p className="text-sm font-bold text-white">{selectedRequest.gstNumber || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Certified Partners Selection */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaIndustry className="w-3 h-3 text-emerald-400" />
                                            <p className="text-sm font-bold text-slate-400">Certified Manufacturer Network</p>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                                            <p className="text-sm font-bold text-slate-500 mb-3">Linked Partner</p>
                                            <div className="relative">
                                                <select
                                                    className="w-full bg-slate-800 border-none rounded-[10px] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                                                    value={selectedRequest.approvedBy?._id || selectedRequest.approvedBy?.id || ''}
                                                    onChange={(e) => handleLinkManufacturer(e.target.value)}
                                                >
                                                    <option value="" disabled className="text-slate-500 italic font-bold">Unmapped - Select Provider</option>
                                                    {manufacturers.map(m => (
                                                        <option key={m._id || m.id} value={m._id || m.id} className="font-bold py-2">{m.companyName}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <FaLink className="w-3 h-3 text-blue-400" />
                                                </div>
                                            </div>
                                            {selectedRequest.approvedBy && (
                                                <div className="mt-4 flex items-center gap-3 p-3 bg-blue-500/10 rounded-[10px] border border-blue-500/20">
                                                    <div className="w-8 h-8 rounded-[10px] bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                        <FaShieldAlt className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-blue-400">Authenticated Source</p>
                                                        <p className="text-sm font-bold text-white">{selectedRequest.approvedBy.companyName}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Command Center */}
                                    <div className="pt-8 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {selectedRequest.isVerified ? (
                                                <button
                                                    onClick={() => handleAction(selectedRequest._id || selectedRequest.id, false)}
                                                    disabled={isVerifying}
                                                    className="group/btn relative py-5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[10px] font-black text-sm transition-all hover:bg-rose-500/20 active:scale-95 disabled:opacity-50"
                                                >
                                                    {isVerifying ? 'Processing...' : 'Revoke Status'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleAction(selectedRequest._id || selectedRequest.id, true)}
                                                    disabled={isVerifying}
                                                    className="group/btn relative py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[10px] font-black text-sm shadow-2xl shadow-blue-600/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 overflow-hidden"
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
                                                    className="py-5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-[2rem] font-black text-sm transition-all hover:bg-emerald-500/20 active:scale-95 disabled:opacity-50"
                                                >
                                                    Restore Account
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleUserStatus(selectedRequest.userId, 'SUSPENDED')}
                                                    disabled={isVerifying}
                                                    className="py-5 bg-white/5 hover:bg-white/[0.08] text-white/60 border border-white/10 rounded-[2rem] font-black text-sm transition-all hover:text-white active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                                >
                                                    <FaTimesCircle className="w-4 h-4" />
                                                    Kill Switch
                                                </button>
                                            )}
                                        </div>

                                        <p className="text-sm font-bold text-slate-500 text-center italic leading-relaxed px-10">
                                            Authorized outlets receive immediate <span className="text-white">Listing Priority</span>. The kill switch freezes all open payouts.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[700px] border-2 border-dashed border-slate-200 rounded-[10px] flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-white">
                                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6 shadow-sm">
                                    <FaStore className="w-10 h-10 text-slate-200" />
                                </div>
                                <h4 className="text-sm font-black text-slate-900 mb-3">Target Not Scoped</h4>
                                <p className="text-sm font-bold leading-relaxed max-w-[240px] text-slate-400">Select a retail outlet from the network ledger to initiate the enrollment audit.</p>
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
                            <p className="text-sm font-bold text-slate-900">Syncing Network State...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
