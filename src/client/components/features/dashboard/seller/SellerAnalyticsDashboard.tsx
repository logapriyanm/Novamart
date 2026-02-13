'use client';

import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { apiClient } from '@/lib/api/client';
import ChartCard from '@/client/components/ui/charts/ChartCard';
import Loader from '@/client/components/ui/Loader';
import { toast } from 'sonner';

export default function SellerAnalyticsDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('30d');

    useEffect(() => {
        fetchData();
    }, [range]);

    const fetchData = async () => {
        try {
            const res = await apiClient.get(`/analytics/seller/overview?range=${range}`);
            setData(res);
            setLoading(false);
        } catch (error) {
            console.error('Analytics Error:', error);
            toast.error('Failed to load analytics');
            setLoading(false);
        }
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader /></div>;
    if (!data) return null;

    return (
        <div className="space-y-8">
            {/* Daily Sales */}
            <ChartCard title="Daily Sales" currentRange={range} onRangeChange={setRange}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.salesChart}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2772A0" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#2772A0" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="sales" stroke="#2772A0" fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Volume */}
                <ChartCard title="Order Volume">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.salesChart}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="orders" fill="#2772A0" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Placeholder for Funnel/Margin since backend data is mocked/pending */}
                <ChartCard title="Conversion Funnel (Beta)" isEmpty={true}>
                    <div className="hidden" />
                </ChartCard>
            </div>
        </div>
    );
}
