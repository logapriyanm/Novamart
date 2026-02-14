'use client';

import React, { useState, useEffect } from 'react';
import {
    FaBox, FaUsers, FaChartLine, FaClipboardList,
    FaArrowUp, FaShieldAlt, FaWarehouse, FaHandshake
} from 'react-icons/fa';
import { HiOutlineRefresh } from 'react-icons/hi';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { manufacturerService } from '@/lib/api/services/manufacturer.service';


import EmptyState from '@/client/components/ui/EmptyState';
import Loader from '@/client/components/ui/Loader';
import DashboardSkeleton from '@/client/components/ui/DashboardSkeleton';
import ManufacturerAnalyticsDashboard from '@/client/components/features/dashboard/manufacturer/ManufacturerAnalyticsDashboard';


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
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12 font-sans text-slate-800">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/60">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Production <span className="text-primary">Monitor</span></h1>
                    <p className="text-sm font-medium text-slate-400 mt-2">Global Operations & Manufacturer Analytics</p>
                </div>
            </div>

            {/* Core KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={FaChartLine}
                    label="Revenue"
                    value={`₹${((stats?.sales?.totalRevenue || 0) / 100000).toFixed(1)}L`}
                    trend="+12%"
                    color="text-emerald-600"
                    bgColor="bg-emerald-50/50"
                />
                <StatsCard
                    icon={FaBox}
                    label="Active Products"
                    value={stats?.productsCount?.toString() || '0'}
                    trend="Stable"
                    color="text-blue-600"
                    bgColor="bg-blue-50/50"
                />
                <StatsCard
                    icon={FaUsers}
                    label="Seller Network"
                    value={profile?.dealersApproved?.length?.toString() || '0'}
                    trend="Growing"
                    color="text-primary"
                    bgColor="bg-primary/10"
                />
                <StatsCard
                    icon={FaClipboardList}
                    label="Pending Requests"
                    value={stats?.pendingDealerRequests?.toString() || '0'}
                    trend={stats?.pendingDealerRequests > 0 ? "Action Required" : "All Clear"}
                    color="text-amber-600"
                    bgColor="bg-amber-50/50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Operations & Chart */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Revenue Chart */}
                    <div className="bg-white p-8 rounded-[10px] border border-slate-100 shadow-sm">
                        <ManufacturerAnalyticsDashboard />
                    </div>

                    {/* Inventory Health */}
                    <div className="bg-white p-8 rounded-[10px] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-sm font-bold text-slate-500 mb-1">Inventory Health</h3>
                                <p className="text-lg font-bold text-slate-900">Stock Readiness</p>
                            </div>
                            <Link href="/manufacturer/inventory" className="text-sm font-bold text-primary hover:translate-x-0.5 transition-transform">View All Assets</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-amber-50/20 rounded-[10px] border border-amber-100/50 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white text-amber-500 rounded-[10px] flex items-center justify-center shadow-sm border border-amber-50 group-hover:scale-105 transition-transform">
                                        <FaWarehouse className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-amber-600">Critical Stock</p>
                                        <p className="text-xl font-bold text-slate-900">3 Items</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-amber-600 bg-white border border-amber-100 px-2.5 py-1 rounded-[10px] shadow-sm">Restock</span>
                            </div>
                            <div className="p-6 bg-primary/5 rounded-[10px] border border-primary/10 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white text-primary rounded-[10px] flex items-center justify-center shadow-sm border border-primary/5 group-hover:scale-105 transition-transform">
                                        <FaBox className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-primary">Global Capacity</p>
                                        <p className="text-xl font-bold text-slate-900">1,240 Units</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-primary bg-white border border-primary/10 px-2.5 py-1 rounded-[10px] shadow-sm">Stable</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Status Column */}
                <div className="space-y-8">
                    {/* Seller Requests */}
                    <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-slate-800">Seller Requests</h3>
                        </div>

                        {!stats?.pendingDealerRequests || stats.pendingDealerRequests === 0 ? (
                            <EmptyState
                                icon={FaUsers}
                                title="No New Requests"
                                description="Your seller network is up to date."
                                actionLabel="Grow Network"
                                actionPath="/manufacturer/dealers"
                            />
                        ) : (
                            <div className="text-center py-8 bg-slate-50 rounded-[10px] border border-dashed border-slate-200">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-slate-400">
                                    <FaHandshake className="w-5 h-5" />
                                </div>
                                <p className="text-sm font-medium text-slate-600 mb-4">
                                    You have <span className="font-bold text-slate-900">{stats.pendingDealerRequests}</span> pending approval.
                                </p>
                                <Link href="/manufacturer/dealers/requests" className="inline-block px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-[10px] hover:bg-slate-800 transition-colors">
                                    Review Requests
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Compliance Status */}
                    <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm p-8">
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-slate-800">Compliance</h3>
                        </div>

                        <div className={`p-5 rounded-[10px] border flex items-center gap-4 ${isVerified ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                <FaShieldAlt className="w-5 h-5" />
                            </div>
                            <div>
                                <p className={`text-sm font-bold ${isVerified ? 'text-emerald-800' : 'text-amber-800'}`}>
                                    {isVerified ? 'Verified Manufacturer' : 'Verification Pending'}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {isVerified ? 'Your account is fully operational.' : 'Please submit required documents.'}
                                </p>
                            </div>
                        </div>

                        <Link href="/manufacturer/profile" className="mt-4 block w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-900 py-2">
                            View Compliance Details &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, trend, color, bgColor }: any) {
    return (
        <div className="p-6 bg-white border border-slate-100 rounded-[10px] shadow-sm flex flex-col justify-between group h-full">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400 mb-1.5">{label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
                </div>
                <div className={`w-12 h-12 ${bgColor} ${color} rounded-[10px] flex items-center justify-center transition-all group-hover:scale-110 shadow-sm`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
                <span className={`text-xs font-bold ${color} bg-white px-2 py-1 rounded-[10px] border border-slate-100 shadow-sm`}>
                    {trend}
                </span>
                <span className="text-xs font-bold text-slate-400">vs last cycle</span>
            </div>
        </div>
    );
}
