'use client';

import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { apiClient } from '@/lib/api/client';
import ChartCard from '@/client/components/ui/charts/ChartCard';
import Loader from '@/client/components/ui/Loader';
import { toast } from 'sonner';

export default function ManufacturerAnalyticsDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('30d');

    useEffect(() => {
        fetchData();
    }, [range]);

    const fetchData = async () => {
        try {
            // setLoading(true); // silent update for range
            const res = await apiClient.get(`/analytics/manufacturer/overview?range=${range}`);
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
            {/* Revenue Trend */}
            <ChartCard title="Revenue Trend" currentRange={range} onRangeChange={setRange}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.revenueTrend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#2772A0" strokeWidth={3} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Products */}
                <ChartCard title="Top Products">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.topProducts} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: '#64748B' }} />
                            <Tooltip />
                            <Bar dataKey="sales" fill="#2772A0" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Allocation vs Sales */}
                <ChartCard title="Allocation Efficiency">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.allocation}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="allocated" fill="#cbd5e1" name="Allocated" />
                            <Bar dataKey="sold" fill="#2772A0" name="Sold" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
}
