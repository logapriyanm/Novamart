'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaUsers,
    FaCube,
    FaGavel,
    FaShieldAlt,

} from 'react-icons/fa';
import { HiOutlineRefresh } from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


import { adminService } from '@/lib/api/services/admin.service';

import Loader from '@/client/components/ui/Loader';
import DashboardSkeleton from '@/client/components/ui/DashboardSkeleton';
import AdminAnalyticsDashboard from '@/client/components/features/dashboard/admin/AdminAnalyticsDashboard';

const mockActivityData = [
    { time: '00:00', users: 120 },
    { time: '04:00', users: 80 },
    { time: '08:00', users: 250 },
    { time: '12:00', users: 400 },
    { time: '16:00', users: 350 },
    { time: '20:00', users: 200 },
    { time: '24:00', users: 150 },
];

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setIsLoading(true);
        try {
            const statsData = await adminService.getDashboardStats();
            setStats(statsData);
        } catch (error) {
            console.error('Failed to fetch admin dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12 font-sans text-slate-800">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/60 font-sans">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">System <span className="text-primary">Governance</span></h1>
                    <p className="text-sm font-bold text-slate-400 mt-2">Central Authority & Health Monitor</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/verification" className="btn-primary">
                        Review Verification Queue
                    </Link>
                </div>
            </div>

            {/* Focused KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={FaUsers}
                    label="Pending Users"
                    value={stats?.pendingUserApprovals?.toString() || '0'}
                    trend="Needs Action"
                    color="text-amber-600"
                    bgColor="bg-amber-50/50"
                />
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
                    trend="Critical"
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

            {/* Main Content Sections */}
            <div className="w-full">
                {/* Live Traffic / Usage Chart */}
                <AdminAnalyticsDashboard />
            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, trend, color, bgColor }: any) {
    return (
        <div className="card-enterprise p-6 bg-white flex flex-col justify-between group h-full">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-bold text-slate-400 mb-1.5">{label}</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
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
