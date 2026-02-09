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
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { adminService } from '@/lib/api/services/admin.service';
import EmptyState from '@/client/components/ui/EmptyState';

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
            <div className="min-h-[600px] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-slate-800"
                >
                    <HiOutlineRefresh className="w-8 h-8 opacity-50" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12 font-sans text-slate-800">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Control</h1>
                    <p className="text-sm font-medium text-slate-400 mt-2">Platform Governance & Health Monitor</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/verification" className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-xs font-semibold tracking-wide shadow-lg shadow-slate-200">
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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Live Traffic / Usage Chart */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-bold text-slate-800">Platform Activity</h3>
                        <span className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live
                        </span>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#1e293b', fontSize: '12px', fontWeight: 600 }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#0f172a" strokeWidth={2} dot={{ r: 4, fill: '#0f172a', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Audit Logs */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-slate-800">Recent Audit Logs</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[400px]">
                        {activities.length === 0 ? (
                            <EmptyState
                                icon={FaShieldAlt}
                                title="No Recent Activity"
                                description="The audit log is clear."
                            />
                        ) : (
                            activities.slice(0, 6).map((log, index) => (
                                <div key={log.id || index} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${log.action.includes('REJECT') || log.action.includes('SUSPEND') ? 'bg-rose-500' : 'bg-emerald-500'
                                        }`} />
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">{log.action.replace(/_/g, ' ')}</p>
                                        <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                                            {log.actorRole} &bull; {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <Link href="/admin/audit" className="mt-6 text-center text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                        View Full Audit Trail &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, trend, color, bgColor }: any) {
    return (
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">{label}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                </div>
                <div className={`w-10 h-10 ${bgColor} ${color} rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <span className={`text-xs font-medium ${color} bg-white px-1.5 py-0.5 rounded border border-slate-100`}>
                    {trend}
                </span>
            </div>
        </div>
    );
}
