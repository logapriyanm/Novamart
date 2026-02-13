'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus, FaDownload } from 'react-icons/fa';
import { useAuth } from '@/client/hooks/useAuth';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

export default function DashboardHeader() {
    const { user } = useAuth();
    const router = useRouter();
    const joinedDate = new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const [activeCount, setActiveCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchActiveCount = async () => {
            try {
                const orders = await apiClient.get<any[]>('/orders/my');
                if (orders) {
                    const count = orders.filter((o: any) => !['DELIVERED', 'CANCELLED', 'RETURNED'].includes(o.status)).length;
                    setActiveCount(count);
                } else {
                    setActiveCount(0);
                }
            } catch (err) {
                console.error(err);
                setActiveCount(0);
            }
        };
        fetchActiveCount();
    }, []);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[10px] shadow-sm border border-slate-100">
            <div>
                <h1 className="text-3xl font-bold text-[#1E293B] tracking-tight mb-2">
                    Welcome back, {user?.name?.split(' ')[0] || 'Member'}!
                </h1>
                <p className="text-slate-500 font-medium text-sm">
                    Member since {joinedDate} • You have <span className="text-[#0F6CBD] font-bold">{activeCount === null ? '...' : activeCount} active shipment{activeCount !== 1 && 's'}</span>.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-[10px] text-sm font-bold text-[#1E293B] hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                    <FaDownload className="w-3 h-3" />
                    Export Data
                </button>
                <button
                    onClick={() => router.push('/products')}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0F6CBD] text-white rounded-[10px] text-sm font-bold hover:bg-[#0E5DA8] transition-all shadow-lg shadow-blue-500/20"
                >
                    <FaPlus className="w-3 h-3" />
                    New Order
                </button>
            </div>
        </div>
    );
}
