'use client';

import React, { useState, useEffect } from 'react';
import {
    FaBox, FaUsers, FaChartLine, FaClipboardList,
    FaCalendarAlt, FaPlus, FaGlobeAmericas, FaCheckCircle,
    FaArrowUp, FaEllipsisH, FaShieldAlt, FaMoneyBillWave,
    FaCreditCard
} from 'react-icons/fa';
import { HiOutlineRefresh } from 'react-icons/hi';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { manufacturerService } from '@/lib/api/services/manufacturer.service';

import EmptyState from '@/client/components/ui/EmptyState';

export default function ManufacturerDashboard() {
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [profileData, statsData] = await Promise.all([
                manufacturerService.getProfile(),
                manufacturerService.getStats()
            ]);
            setProfile(profileData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to fetch manufacturer dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isVerified = profile?.isVerified;

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-primary"
                >
                    <HiOutlineRefresh className="w-12 h-12" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-foreground/5 pb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#1E293B]">Manufacturer Overview</h1>
                    <p className="text-sm font-medium text-slate-400 mt-1">Real-time pulse of your production and distribution.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/manufacturer/products/add" className="px-8 py-3 bg-black text-white rounded-[12px] hover:bg-black/90 transition-all shadow-xl shadow-black/10 text-xs font-black uppercase tracking-widest">
                        Add New SKU
                    </Link>
                </div>
            </div>

            {/* Core KPIs - Limited to 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={FaChartLine}
                    label="Volume"
                    value={`₹${((stats?.sales?.totalRevenue || 0) / 100000).toFixed(1)}L`}
                    trend="Revenue"
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
                <StatsCard
                    icon={FaBox}
                    label="Products"
                    value={stats?.productsCount?.toString() || '0'}
                    trend="Active"
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <StatsCard
                    icon={FaUsers}
                    label="Dealers"
                    value={profile?.dealersApproved?.length?.toString() || '0'}
                    trend="Network"
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                />
                <StatsCard
                    icon={FaClipboardList}
                    label="Requests"
                    value={stats?.pendingDealerRequests?.toString() || '0'}
                    trend="Pending"
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Operations */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Inventory Health */}
                    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Inventory Health</h3>
                            <Link href="/manufacturer/inventory" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-black transition-colors">View Detailed Analytics</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 bg-slate-50 rounded-[15px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                                        <FaBox className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Low Stock</p>
                                        <p className="text-sm font-black text-slate-800">Critical Units</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-amber-600">3</span>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-[15px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                        <FaGlobeAmericas className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Regions</p>
                                        <p className="text-sm font-black text-slate-800">Active Supply</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-blue-600">12</span>
                            </div>
                        </div>
                    </div>

                    {/* Dealer Requests with Empty State */}
                    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Dealer Engagement</h3>
                        </div>

                        {!stats?.pendingDealerRequests || stats.pendingDealerRequests === 0 ? (
                            <EmptyState
                                icon={FaUsers}
                                title="No Pending Requests"
                                description="Your network is currently stable. Grow your reach by inviting new partners."
                                actionLabel="Grow Network"
                                actionPath="/manufacturer/dealers/approved"
                            />
                        ) : (
                            <div className="text-center py-6">
                                <Link href="/manufacturer/dealers/requests" className="text-sm font-bold text-primary hover:underline">
                                    You have {stats.pendingDealerRequests} new requests to review.
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Column */}
                <div className="space-y-8">
                    {/* Compliance Status */}
                    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-8">
                        <div className="mb-8">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Trust</h3>
                            <h4 className="text-lg font-black text-slate-800 tracking-tight italic uppercase">Compliance</h4>
                        </div>

                        <div className="space-y-4">
                            <div className={`${isVerified ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'} rounded-[15px] p-5 border flex items-center justify-between`}>
                                <div className="flex items-center gap-4">
                                    <FaShieldAlt className={`w-5 h-5 ${isVerified ? 'text-emerald-500' : 'text-amber-500'}`} />
                                    <span className={`text-[10px] font-black ${isVerified ? 'text-emerald-800' : 'text-amber-800'} uppercase tracking-widest`}>
                                        {isVerified ? 'Identity Verified' : 'Under Review'}
                                    </span>
                                </div>
                                {isVerified && <FaCheckCircle className="w-4 h-4 text-emerald-500" />}
                            </div>

                            <div className="bg-slate-50 rounded-[15px] p-5 border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <FaClipboardList className="w-5 h-5 text-slate-300" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tax Documents</span>
                                </div>
                                <FaCheckCircle className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>

                        <Link href="/manufacturer/profile" className="w-full block text-center mt-8 py-4 border-2 border-slate-100 rounded-[15px] text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-200 transition-all">
                            Manage Credentials
                        </Link>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-black rounded-[20px] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">Partnerships</p>
                            <h4 className="text-xl font-black italic tracking-tight mb-6">Scale Network</h4>
                            <button className="w-full py-4 bg-white text-black rounded-[12px] text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] transition-all active:scale-[0.98]">
                                Get Invite Link
                            </button>
                        </div>
                        <FaArrowUp className="absolute -top-4 -right-4 w-32 h-32 text-white/5 rotate-45" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, trend, color, bgColor }: any) {
    return (
        <div className="bg-white rounded-[10px] p-7 border border-foreground/10 shadow-sm transition-all group overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 ${bgColor} ${color} rounded-[10px] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{trend}</span>
                </div>
            </div>
            <div>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-1">{label}</p>
                <h3 className="text-2xl font-black text-black italic tracking-tight uppercase">{value}</h3>
            </div>
        </div>
    );
}
