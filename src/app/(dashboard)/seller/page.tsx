'use client';

import React, { useState, useEffect } from 'react';
import {
    FaBox, FaShoppingCart, FaWallet, FaHandshake,
    FaArrowUp, FaChartBar, FaStore, FaClock
} from 'react-icons/fa';
import { HiOutlineRefresh } from 'react-icons/hi';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { useAuth } from '@/client/hooks/useAuth';
import Loader from '@/client/components/ui/Loader';
import DashboardSkeleton from '@/client/components/ui/DashboardSkeleton';
import SellerAnalyticsDashboard from '@/client/components/features/dashboard/seller/SellerAnalyticsDashboard';
import { apiClient } from '@/lib/api/client';

export default function SellerDashboard() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Use apiClient for automatic token handling and base URL
                const data = await apiClient.get<any>('/seller/analytics');
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12 font-sans text-slate-800">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/60 font-sans">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Market <span className="text-primary">Portal</span></h1>
                    <p className="text-sm font-medium text-slate-400 mt-2">Sales Overview & Network Management</p>
                </div>
            </div>

            {/* Core KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={FaWallet}
                    label="Total Revenue"
                    value={`₹${(stats?.finance?.totalRevenue || 0).toLocaleString()}`}
                    trend={`₹${(stats?.finance?.todaySales || 0).toLocaleString()} Today`}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
                <StatsCard
                    icon={FaShoppingCart}
                    label="Active Orders"
                    value={stats?.orders?.active || 0}
                    trend={`${stats?.orders?.pending || 0} Pending`}
                    color="text-primary"
                    bgColor="bg-primary/5"
                />
                <StatsCard
                    icon={FaHandshake}
                    label="Negotiations"
                    value={stats?.negotiations?.active || 0}
                    trend={`${stats?.network?.pendingRequests || 0} Requests`}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
                <StatsCard
                    icon={FaStore}
                    label="Inventory Value"
                    value={`₹${(stats?.inventory?.value || 0).toLocaleString()}`}
                    trend={`${stats?.inventory?.totalProducts || 0} Products`}
                    color="text-slate-600"
                    bgColor="bg-slate-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Sales Chart */}
                <div className="lg:col-span-2">
                    <SellerAnalyticsDashboard />
                </div>

                {/* Recent Activity / Status */}
                <div className="space-y-6">
                    <div className="card-enterprise p-8 bg-white">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-bold text-slate-500">Network Status</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[10px] border border-slate-100">
                                <span className="text-sm font-medium text-slate-600">Active Manufacturers</span>
                                <span className="text-lg font-bold text-slate-900">{stats?.network?.activeManufacturers || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[10px] border border-slate-100">
                                <span className="text-sm font-medium text-slate-600">Escrow Held</span>
                                <span className="text-lg font-bold text-slate-900">₹{(stats?.finance?.escrowHeld || 0).toLocaleString()}</span>
                            </div>
                        </div>
                        <Link href="/seller/manufacturers" className="block w-full mt-8 py-3 bg-slate-50 text-slate-600 text-center text-sm font-bold rounded-[10px] hover:bg-slate-100 transition-all">
                            Find Manufacturers
                        </Link>
                    </div>

                    <div className="bg-slate-900 rounded-[10px] p-8 text-white relative overflow-hidden shadow-xl group">
                        <div className="relative z-10">
                            <p className="text-sm font-bold text-slate-400 mb-2 opacity-80">Membership Cluster</p>
                            <h3 className="text-xl font-bold mb-1 tracking-tight">Platinum Seller</h3>
                            <p className="text-sm font-medium text-slate-400/60 mb-8">Validated thru Dec 2026</p>
                            <button className="px-6 py-2.5 bg-white text-slate-900 text-sm font-bold rounded-[10px] hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm">
                                Upgrade Plan
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -ml-12 -mb-12"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, trend, color, bgColor }: any) {
    return (
        <div className="card-enterprise p-6 bg-white flex flex-col justify-between group h-full">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400 mb-1.5">{label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
                </div>
                <div className={`w-12 h-12 ${bgColor} ${color} rounded-[10px] flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ring-1 ring-slate-100`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
                <span className={`text-xs font-bold ${color} bg-white px-2 py-1 rounded-[10px] border border-slate-100 shadow-sm`}>
                    {trend}
                </span>
                <span className="text-xs font-bold text-slate-400">vs week 4</span>
            </div>
        </div>
    );
}
