'use client';

import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { apiClient } from '@/lib/api/client';
import ChartCard from '@/client/components/ui/charts/ChartCard';
import Loader from '@/client/components/ui/Loader';
import { toast } from 'sonner';

const COLORS = ['#067FF9', '#3b82f6', '#60a5fa', '#93c5fd'];

export default function AdminAnalyticsDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('30d');

    useEffect(() => {
        fetchData();
    }, [range]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/analytics/admin/overview?range=${range}`);
            setData(res);
        } catch (error) {
            console.error('Analytics Error:', error);
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !data) return <div className="h-96 flex items-center justify-center"><Loader /></div>;
    if (!data) return null;

    return (
        <div className="space-y-8">
            {/* Top Row: Revenue & GMV */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard
                    title="Revenue Overview"
                    subtitle="Total Platform Revenue"
                    currentRange={range}
                    onRangeChange={setRange}
                    onExport={() => toast.info('Exporting...')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.revenueChart}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="revenue" stroke="#067FF9" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    title="GMV vs Commission"
                    subtitle="Gross Merchandise Value vs Net Commission"
                    currentRange={range}
                    onRangeChange={setRange}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.revenueChart}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="gmv" stackId="1" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.5} />
                            <Area type="monotone" dataKey="commission" stackId="1" stroke="#067FF9" fill="#067FF9" />
                            <Legend iconType="circle" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Bottom Row: User Growth & Order Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ChartCard title="User Growth" subtitle="New Registrations by Role">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.userGrowthChart}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                                <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px' }} />
                                <Legend />
                                <Bar dataKey="customers" stackId="a" fill="#067FF9" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="sellers" stackId="a" fill="#94a3b8" />
                                <Bar dataKey="manufacturers" stackId="a" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                <ChartCard title="Order Status" subtitle="Distribution of Order States">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.orderStatusChart}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.orderStatusChart?.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
}
