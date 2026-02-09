'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaBox, FaShoppingCart, FaRupeeSign, FaWarehouse,
    FaSync, FaCheckCircle, FaTruck, FaMoneyBillWave,
    FaExclamationTriangle, FaArrowRight, FaBolt, FaBell
} from 'react-icons/fa';
import { HiOutlineRefresh } from 'react-icons/hi';
import Link from 'next/link';
import { dealerService } from '@/lib/api/services/dealer.service';
import { notificationService } from '@/lib/api/services/notification.service';

import EmptyState from '@/client/components/ui/EmptyState';

export default function DealerDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [inventory, setInventory] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [statsData, inventoryData, notifData] = await Promise.all([
                dealerService.getAnalytics(),
                dealerService.getInventory(),
                notificationService.getNotifications()
            ]);
            setStats(statsData);
            setInventory(inventoryData || []);
            setNotifications(notifData || []);
        } catch (error) {
            console.error('Failed to fetch dealer dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const lowStockItems = inventory.filter(p => p.stock <= 10).slice(0, 5);

    return (
        <div className="space-y-8 pb-12 animate-fade-in text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-foreground/5 pb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#1E293B]">Dealer Operations</h1>
                    <p className="text-sm font-medium text-slate-400 mt-1">Local fulfillment and sales performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dealer/orders" className="px-8 py-3 bg-black text-white rounded-[12px] hover:bg-black/90 transition-all shadow-xl shadow-black/10 text-xs font-black uppercase tracking-widest">
                        Process Orders
                    </Link>
                </div>
            </div>

            {/* Metrics - Limited to 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="Revenue"
                    value={`₹${isLoading ? '...' : ((stats?.revenue || 0) / 100000).toFixed(1) + 'L'}`}
                    trend="Sales"
                />
                <MetricCard
                    label="Orders"
                    value={isLoading ? '...' : stats?.totalOrders || '0'}
                    trend="Active"
                />
                <MetricCard
                    label="SKUs"
                    value={isLoading ? '...' : stats?.inventoryCount || '0'}
                    trend="In Stock"
                />
                <MetricCard
                    label="Hold"
                    value={`₹${isLoading ? '...' : ((stats?.escrowBalance || 0) / 100000).toFixed(1) + 'L'}`}
                    trend="Escrow"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Operations */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Weekly Performance */}
                    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Fulfillment Pipeline</h3>
                            <Link href="/dealer/orders" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-black transition-colors">View Pipeline</Link>
                        </div>

                        <div className="flex h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-10">
                            {['CREATED', 'PAID', 'SHIPPED', 'DELIVERED'].map((status, idx) => {
                                const count = stats?.orderStats?.find((s: any) => s.status === status)?._count || 0;
                                const total = stats?.totalOrders || 1;
                                const width = (count / total) * 100;
                                const colors = ['bg-blue-500', 'bg-blue-400', 'bg-indigo-500', 'bg-emerald-500'];
                                return (
                                    <div key={status} style={{ width: `${width}%` }} className={`${colors[idx]} h-full`} />
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { label: 'New', color: 'bg-blue-500' },
                                { label: 'Settled', color: 'bg-blue-400' },
                                { label: 'Transit', color: 'bg-indigo-500' },
                                { label: 'Complete', color: 'bg-emerald-500' }
                            ].map(item => (
                                <div key={item.label} className="flex flex-col items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inventory Snapshot with Empty State */}
                    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Inventory Alerts</h3>
                        </div>

                        {inventory.length === 0 ? (
                            <EmptyState
                                icon={FaBox}
                                title="Inventory Empty"
                                description="You haven't added any products to your local inventory yet."
                                actionLabel="Browse Marketplace"
                                actionPath="/dealer/marketplace"
                            />
                        ) : lowStockItems.length === 0 ? (
                            <div className="py-12 text-center text-[10px] font-bold text-slate-300 uppercase italic tracking-widest bg-slate-50/50 rounded-[15px] border-2 border-dashed border-slate-100">
                                All stock levels healthy
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {lowStockItems.map((item) => (
                                            <tr key={item.id} className="group transition-colors">
                                                <td className="py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-[12px] bg-slate-50 border border-slate-100 p-1">
                                                            <img src={item.product?.images?.[0] || '/assets/placeholder.png'} alt="" className="w-full h-full object-contain" />
                                                        </div>
                                                        <span className="text-xs font-black text-slate-800">{item.product?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5">
                                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${item.stock === 0 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                                        {item.stock} Units
                                                    </span>
                                                </td>
                                                <td className="py-5 text-right">
                                                    <Link href="/dealer/marketplace" className="text-[10px] font-black text-black hover:underline uppercase tracking-widest">Stock Up</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Updates */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-8">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Active Feed</h3>

                        {notifications.length === 0 ? (
                            <EmptyState
                                icon={FaBell}
                                title="No Notifications"
                                description="We'll notify you here when your orders or negotiations need attention."
                            />
                        ) : (
                            <div className="space-y-4">
                                {notifications.slice(0, 3).map((notif) => (
                                    <div key={notif.id} className="p-5 bg-slate-50 rounded-[15px] border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                                        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{notif.title}</h4>
                                        <p className="text-[9px] font-medium text-slate-500 mt-2 leading-relaxed">{notif.message}</p>
                                    </div>
                                ))}
                                <Link href="/dealer/notifications" className="block text-center pt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-black">View History</Link>
                            </div>
                        )}
                    </div>

                    <div className="bg-emerald-600 rounded-[24px] p-8 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black italic tracking-tight uppercase">Bulk Sourcing</h3>
                            <p className="text-xs text-white/70 font-medium leading-relaxed mb-8 mt-3 uppercase tracking-widest">
                                Collaboration is live. Pool demand with other dealers to unlock 15% lower MOQ.
                            </p>
                            <Link href="/dealer/pooling" className="block w-full text-center py-4 bg-white text-emerald-700 rounded-[12px] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all">
                                View Active Pools
                            </Link>
                        </div>
                        <FaBolt className="absolute -bottom-6 -right-6 w-36 h-36 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, trend }: any) {
    return (
        <div className="bg-white rounded-[20px] p-8 border border-slate-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{trend}</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{value}</h3>
        </div>
    );
}
