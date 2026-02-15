'use client';

import React, { useEffect, useState } from 'react';
import {
    FaUsers,
    FaCube,
    FaGavel,
    FaShieldAlt,
    FaChartBar,
    FaArrowUp,
    FaCheckCircle
} from 'react-icons/fa';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { adminService } from '@/lib/api/services/admin.service';
import DashboardSkeleton from '@/client/components/ui/DashboardSkeleton';
import AdminAnalyticsDashboard from '@/client/components/features/dashboard/admin/AdminAnalyticsDashboard';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setIsLoading(true);
        try {
            const [statsData, analyticsData] = await Promise.all([
                adminService.getDashboardStats(),
                apiClient.get<any>('/analytics/admin/overview')
            ]);
            setStats(statsData);
            setAnalytics(analyticsData);
        } catch (error) {
            console.error('Failed to fetch admin dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    const { macroStats } = analytics || {};

    return (
        <div className="space-y-8 animate-fade-in pb-12 font-sans text-slate-800">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight uppercase italic">Mission <span className="text-[#067FF9]">Control</span></h1>
                <p className="text-slate-400 font-medium text-sm mt-1">Platform Overview & System Health</p>
            </div>

            {/* Focused KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/admin/verification">
                    <StatsCard
                        icon={FaUsers}
                        label="Pending Users"
                        value={stats?.pendingUserApprovals?.toString() || '0'}
                        trend="Needs Action"
                        color="text-amber-600"
                        bgColor="bg-amber-50/50"
                    />
                </Link>
                <StatsCard
                    icon={FaCube}
                    label="Product Queue"
                    value={stats?.pendingProductApprovals?.toString() || '0'}
                    trend="In Review"
                    color="text-blue-600"
                    bgColor="bg-blue-50/50"
                />
                <StatsCard
                    icon={FaGavel}
                    label="Active Disputes"
                    value={stats?.activeDisputes?.toString() || '0'}
                    trend="Action Required"
                    color="text-rose-600"
                    bgColor="bg-rose-50/50"
                />
                <StatsCard
                    icon={FaShieldAlt}
                    label="System Status"
                    value="Stable"
                    trend="100% Uptime"
                    color="text-emerald-600"
                    bgColor="bg-emerald-50/50"
                />
            </div>

            {/* Analytics Overview (Merged from /admin/analytics) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total GMV', value: `₹${macroStats?.quarterlyGMV?.toLocaleString() || '0'}`, change: 'Real-time', isUp: true },
                    { label: 'Active Merchants', value: macroStats?.merchantCount || '0', change: 'Verified Accounts', isUp: true },
                    { label: 'Dispute Ratio', value: macroStats?.disputeRatio || '0%', change: 'Platform Health', isUp: false },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-sm font-medium text-slate-500 mb-4">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                                {stat.isUp ? <FaArrowUp /> : <FaCheckCircle />}
                                {stat.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Main Content Sections */}
                <div className="space-y-8">
                    {/* Live Traffic / Usage Chart */}
                    <AdminAnalyticsDashboard />
                </div>

            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, trend, color, bgColor }: any) {
    return (
        <div className="card-enterprise p-6 bg-white flex flex-col justify-between group h-full border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-bold text-slate-400 mb-1.5">{label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
                </div>
                <div className={`w-12 h-12 ${bgColor} ${color} rounded-[10px] flex items-center justify-center transition-all group-hover:scale-110 shadow-sm`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
                <span className={`text-sm font-bold ${color} bg-white px-2 py-1 rounded-[10px] border border-slate-100 shadow-sm`}>
                    {trend}
                </span>
            </div>
        </div>
    );
}
