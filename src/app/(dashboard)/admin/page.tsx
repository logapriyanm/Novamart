'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaUsers,
    FaCube,
    FaGavel,
    FaShieldAlt
} from 'react-icons/fa';
import { HiOutlineRefresh } from 'react-icons/hi';
import Link from 'next/link';

import StatusCard from '@/client/components/ui/StatusCard';
import ActivityFeedItem from '@/client/components/features/admin/ActivityFeedItem';
import QuickActionButton from '@/client/components/ui/QuickActionButton';
import SystemNotice from '@/client/components/features/admin/SystemNotice';
import TrafficOrigin from '@/client/components/features/admin/TrafficOrigin';
import { useRouter } from 'next/navigation';
import { adminService } from '@/lib/api/services/admin.service';

import EmptyState from '@/client/components/ui/EmptyState';

export default function AdminDashboard() {
    const router = useRouter();
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
        <div className="space-y-10 animate-fade-in pb-12 text-[#1E293B]">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-foreground/5 pb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Admin Oversight</h1>
                    <p className="text-sm text-slate-400 mt-1 font-medium">Platform governance and operational integrity.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/verification" className="px-8 py-3 bg-black text-white rounded-[12px] hover:bg-black/90 transition-all shadow-xl shadow-black/10 text-xs font-black uppercase tracking-widest">
                        Inbound Review
                    </Link>
                </div>
            </div>

            {/* Focused KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard
                    title="User Verification"
                    value={stats?.pendingUserApprovals?.toString() || '0'}
                    subtitle="Awaiting Audit"
                    icon={FaUsers}
                    theme="attention"
                />
                <StatusCard
                    title="New Products"
                    value={stats?.pendingProductApprovals?.toString() || '0'}
                    subtitle="Listing Queue"
                    icon={FaCube}
                    theme="pending"
                />
                <StatusCard
                    title="Open Disputes"
                    value={stats?.activeDisputes?.toString() || '0'}
                    subtitle="High Priority"
                    icon={FaGavel}
                    theme="critical"
                />
                <StatusCard
                    title="System Health"
                    value="Stable"
                    subtitle="All Guardrails Active"
                    icon={FaShieldAlt}
                    theme="operational"
                />
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8 bg-white p-8 rounded-[20px] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Platform Activity</h3>
                        <Link href="/admin/audit" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-black transition-colors">Full Historical Log</Link>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {activities.length === 0 ? (
                            <EmptyState
                                icon={FaShieldAlt}
                                title="Audit Log Empty"
                                description="No system activities recorded in the last 24 hours."
                            />
                        ) : (
                            activities.slice(0, 5).map((log) => (
                                <ActivityFeedItem
                                    key={log.id}
                                    type={log.action.includes('REJECT') || log.action.includes('SUSPEND') ? 'violation' : 'success'}
                                    title={log.action.replace(/_/g, ' ')}
                                    description={<span className="text-slate-500 font-medium">{log.actorRole} processed {log.action.toLowerCase()}.</span>}
                                    time={new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    actionLabel="Inspect"
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Quick Actions & Notices */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-white p-8 rounded-[20px] border border-slate-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Quick Navigation</h3>
                        <div className="space-y-3">
                            <QuickActionButton
                                label="Dealer Pipeline"
                                icon={FaUsers}
                                variant="primary"
                                onClick={() => router.push('/admin/dealers')}
                            />
                            <QuickActionButton
                                label="Product Catalog"
                                icon={FaCube}
                                variant="dark"
                                onClick={() => router.push('/admin/products')}
                            />
                            <QuickActionButton
                                label="Resolution Center"
                                icon={FaGavel}
                                variant="outline"
                                onClick={() => router.push('/admin/disputes')}
                            />
                        </div>
                    </div>

                    <div className="transform hover:scale-[1.02] transition-transform">
                        <SystemNotice />
                    </div>
                </div>
            </div>
        </div>
    );
}
