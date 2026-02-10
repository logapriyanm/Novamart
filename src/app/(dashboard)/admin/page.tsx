'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaUsers,
    FaCube,
    FaGavel,
    FaShieldAlt,
    FaArrowRight as ArrowRight
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/60 font-sans">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">System <span className="text-primary">Governance</span></h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Central Authority & Health Monitor</p>
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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Live Traffic / Usage Chart */}
                <div className="xl:col-span-2 card-enterprise p-8 bg-white">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Platform Activity</h3>
                            <p className="text-lg font-bold text-slate-900 mt-1">Real-time Usage Dynamics</p>
                        </div>
                        <span className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full ring-1 ring-emerald-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> SYSTEM LIVE
                        </span>
                    </div>
                    <div className="h-[320px] w-full relative overflow-hidden">
                        {!isLoading && (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mockActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#1e293b', fontSize: '11px', fontWeight: 800 }}
                                    />
                                    <Line type="monotone" dataKey="users" stroke="#10367D" strokeWidth={3} dot={{ r: 4, fill: '#10367D', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#10367D' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Recent Audit Logs */}
                <div className="card-enterprise p-8 bg-white flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Security Audit</h3>
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
                                <div key={log.id || index} className="flex gap-4 p-4 rounded-[10px] hover:bg-slate-50 transition-all group table-row-enterprise border border-slate-100/50">
                                    <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${log.action.includes('REJECT') || log.action.includes('SUSPEND') ? 'bg-rose-500' : 'bg-emerald-500'
                                        }`} />
                                    <div>
                                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{log.action.replace(/_/g, ' ')}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{log.actorRole}</span>
                                            <span className="text-[9px] font-medium text-slate-300">•</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <Link href="/admin/audit" className="mt-8 text-center text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:translate-x-1 transition-transform inline-flex items-center justify-center gap-2">
                        View Full Audit Trail <ArrowRight className="w-3 h-3" />
                    </Link>
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
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
                </div>
                <div className={`w-12 h-12 ${bgColor} ${color} rounded-[10px] flex items-center justify-center transition-all group-hover:scale-110 shadow-sm`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
                <span className={`text-[9px] font-black uppercase tracking-widest ${color} bg-white px-2 py-1 rounded-[6px] border border-slate-100 shadow-sm`}>
                    {trend}
                </span>
            </div>
        </div>
    );
}
