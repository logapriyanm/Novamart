'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaExclamationTriangle,
    FaBell,
    FaLock,
    FaCheckCircle,
    FaUsers,
    FaCube,
    FaGavel
} from 'react-icons/fa';
import { HiOutlineRefresh } from 'react-icons/hi';
import Link from 'next/link';

import StatusCard from '@/client/components/ui/StatusCard';
import ActivityFeedItem from '@/client/components/features/admin/ActivityFeedItem';
import QuickActionButton from '@/client/components/ui/QuickActionButton';
import SystemNotice from '@/client/components/features/admin/SystemNotice';
import TrafficOrigin from '@/client/components/features/admin/TrafficOrigin';
import { adminService } from '@/lib/api/services/admin.service';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setIsLoading(true);
        try {
            const [statsData, logsData] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getAuditLogs()
            ]);
            setStats(statsData);
            setActivities(logsData || []);
        } catch (error) {
            console.error('Failed to fetch admin dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
        <div className="max-w-[1600px] mx-auto space-y-10 animate-fade-in">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">System Health Dashboard</h1>
                    <p className="text-sm font-bold text-foreground/40 mt-1">Real-time overview of platform status and critical administrative actions.</p>
                </div>
                <button onClick={fetchAdminData} className="p-3 bg-surface border border-foreground/5 rounded-2xl hover:bg-foreground/5 transition-all">
                    <HiOutlineRefresh className="w-5 h-5 text-foreground/40" />
                </button>
            </div>

            {/* Status Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard
                    title="GMV (Lifetime)"
                    value={`₹${((stats?.gmv || 0) / 100000).toFixed(1)}L`}
                    subtitle="Aggregated Volume"
                    icon={FaCheckCircle}
                    theme="operational"
                />
                <StatusCard
                    title="Pending Verifications"
                    value={stats?.pendingApprovals?.toString() || '0'}
                    subtitle="Manufacturers/Dealers"
                    icon={FaBell}
                    theme="attention"
                />
                <StatusCard
                    title="Escrow Holds"
                    value={stats?.escrow?.reduce((acc: any, curr: any) => acc + curr._count, 0)?.toString() || '0'}
                    subtitle={`Total: ₹${(stats?.escrow?.reduce((acc: any, curr: any) => acc + (curr._sum.amount || 0), 0) / 100000).toFixed(1)}L`}
                    icon={FaLock}
                    theme="pending"
                />
                <StatusCard
                    title="Active Disputes"
                    value={stats?.activeDisputes?.toString() || '0'}
                    subtitle="Requires Resolution"
                    icon={FaExclamationTriangle}
                    theme="critical"
                />
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left: Live Activity Feed */}
                <div className="xl:col-span-8 bg-surface p-8 rounded-[2rem] border border-foreground/5 shadow-sm flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black text-foreground tracking-tight">System Audit Logs</h3>
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        </div>
                        <Link href="/admin/audit" className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {activities.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20 italic">No recent activity detected</p>
                            </div>
                        ) : (
                            activities.slice(0, 10).map((log, idx) => (
                                <ActivityFeedItem
                                    key={log.id}
                                    type={log.action.includes('REJECT') || log.action.includes('SUSPEND') ? 'violation' : 'success'}
                                    title={log.action.replace(/_/g, ' ')}
                                    description={<>{log.actorRole} <span className="font-black text-primary">{log.entityId}</span> processed {log.action.toLowerCase()}.</>}
                                    time={new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    actionLabel="Log"
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Quick Actions & Notices */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-surface p-8 rounded-[2rem] border border-foreground/5 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-6">Governance Quick Actions</h3>
                        <QuickActionButton
                            label="Review Dealers"
                            icon={FaUsers}
                            variant="primary"
                        />
                        <QuickActionButton
                            label="Review Products"
                            icon={FaCube}
                            variant="dark"
                        />
                        <QuickActionButton
                            label="Review Disputes"
                            icon={FaGavel}
                            variant="outline"
                        />
                    </div>

                    <SystemNotice />

                    <TrafficOrigin />
                </div>
            </div>
        </div>
    );
}
