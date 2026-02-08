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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic text-[#1E293B]">Dashboard <span className="text-primary">Overview</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Real-time performance and supply chain monitoring.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={fetchDashboardData} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <HiOutlineRefresh className="w-3 h-3" />
                        Sync Data
                    </button>
                    <Link href="/manufacturer/products" className="flex items-center gap-2 px-6 py-3 bg-[#0F6CBD] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0F6CBD]/90 transition-all shadow-lg shadow-blue-500/20">
                        <FaPlus className="w-3 h-3" />
                        New Product
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={FaChartLine}
                    label="Total Revenue"
                    value={`₹${((stats?.sales?.totalRevenue || 0) / 100000).toFixed(1)}L`}
                    trend="+12.4%"
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <StatsCard
                    icon={FaBox}
                    label="Active Orders"
                    value={stats?.sales?.totalOrders?.toString() || '0'}
                    trend="In Pipeline"
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
                <StatsCard
                    icon={FaCreditCard}
                    label="Pending Settlements"
                    value={`₹${((stats?.credit?.pendingSettlement || 0) / 100000).toFixed(1)}L`}
                    trend={`${stats?.credit?.activeHoldRecords || 0} Records`}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
                <StatsCard
                    icon={FaUsers}
                    label="Dealer Network"
                    value={profile?.dealersApproved?.length?.toString() || '0'}
                    trend="Approved Units"
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Performance (Placeholder for now, could be top products) */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black tracking-tight text-[#1E293B]">Top Product <span className="text-primary">Performance</span></h3>
                        <Link href="/manufacturer/products" className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline">View All</Link>
                    </div>

                    <div className="space-y-6">
                        {stats?.sales?.topProducts?.length > 0 ? (
                            stats.sales.topProducts.map(([productId, count]: any) => (
                                <div key={productId} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                            <FaBox />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-[#1E293B]">Product ID: {productId}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{count} Units Sold</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: '70%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs italic">
                                No sales data recorded yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column Stack */}
                <div className="space-y-8">
                    {/* Compliance Status */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                        <div className="mb-6">
                            <h3 className="text-lg font-black tracking-tight text-[#1E293B]">Compliance <span className="text-primary">Pulse</span></h3>
                        </div>

                        <div className="space-y-4">
                            <div className={`${isVerified ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'} rounded-2xl p-6 border flex items-center justify-between transition-all`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${isVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'} rounded-xl flex items-center justify-center`}>
                                        <FaShieldAlt className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className={`text-xs font-black ${isVerified ? 'text-emerald-800' : 'text-amber-800'} uppercase tracking-tight`}>
                                            {isVerified ? 'Entity Verified' : 'Verification Pending'}
                                        </p>
                                        <p className={`text-[9px] font-bold ${isVerified ? 'text-emerald-600/70' : 'text-amber-600/70'} uppercase tracking-widest mt-0.5`}>
                                            {isVerified ? 'Global Trust Protocol Active' : 'Manual Audit Required'}
                                        </p>
                                    </div>
                                </div>
                                {isVerified ? <FaCheckCircle className="w-5 h-5 text-emerald-500" /> : <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                                        <FaClipboardList className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-600 uppercase tracking-tight">Registration Status</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">GST Profile Validated</p>
                                    </div>
                                </div>
                                <FaCheckCircle className="w-5 h-5 text-emerald-500" />
                            </div>
                        </div>

                        <button className="w-full mt-6 py-4 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-slate-50 transition-all">
                            Review Documents
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, trend, color, bgColor }: any) {
    return (
        <div className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 ${bgColor} ${color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{trend}</span>
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
                <h3 className="text-2xl font-black text-[#1E293B] italic tracking-tight">{value}</h3>
            </div>
        </div>
    );
}
