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
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight italic">Dealer <span className="text-primary">Overview</span></h1>
                    <p className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-[0.2em] text-[10px]">Welcome back. Your business pulse looks {stats?.revenue > 0 ? 'strong' : 'ready'}.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">Live Inventory Spine Active</span>
                    <button onClick={fetchDashboardData} className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-foreground hover:bg-muted transition-colors shadow-sm">
                        <HiOutlineRefresh className={`w-3 h-3 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
                        Sync Pulse
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FaShoppingCart className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-widest text-[9px]">Total Orders</p>
                        <h3 className="text-3xl font-black text-foreground tracking-tight italic">{isLoading ? '...' : stats?.totalOrders || '0'}</h3>
                    </div>
                </div>

                <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <FaMoneyBillWave className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-widest text-[9px]">Total Revenue</p>
                        <h3 className="text-3xl font-black text-foreground tracking-tight italic">₹{isLoading ? '...' : ((stats?.revenue || 0) / 100000).toFixed(1) + 'L'}</h3>
                    </div>
                </div>

                <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <FaBox className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-widest text-[9px]">Active SKUs</p>
                        <h3 className="text-3xl font-black text-foreground tracking-tight italic">{isLoading ? '...' : stats?.inventoryCount || '0'}</h3>
                    </div>
                </div>

                <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <FaWarehouse className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-widest text-[9px]">Escrow Balance</p>
                        <h3 className="text-3xl font-black text-foreground tracking-tight italic">₹{isLoading ? '...' : ((stats?.escrowBalance || 0) / 100000).toFixed(1) + 'L'}</h3>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column (2/3) */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Order Status Pipeline */}
                    <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-foreground uppercase italic tracking-tight">Order <span className="text-primary">Pipeline</span></h3>
                            <Link href="/dealer/orders" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                                Full Registry
                            </Link>
                        </div>

                        <div className="flex h-12 w-full rounded-xl overflow-hidden mb-2">
                            {['CREATED', 'PAID', 'SHIPPED', 'DELIVERED'].map((status, idx) => {
                                const count = stats?.orderStats?.find((s: any) => s.status === status)?._count || 0;
                                const total = stats?.totalOrders || 1;
                                const width = Math.max((count / total) * 100, 10);
                                const colors = ['bg-blue-600', 'bg-blue-500', 'bg-blue-400', 'bg-emerald-500'];
                                const labels = { 'CREATED': 'NEW', 'PAID': 'PROC', 'SHIPPED': 'SHIP', 'DELIVERED': 'COMPL' };
                                return (
                                    <div
                                        key={status}
                                        style={{ width: `${width}%` }}
                                        className={`${colors[idx]} flex items-center justify-center text-[10px] font-bold text-white relative group cursor-pointer transition-all border-r border-white/10`}
                                        title={`${count} Orders`}
                                    >
                                        {(labels as any)[status]}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-between px-4 sm:px-10 mt-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <div className="flex flex-col items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                New
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                Process
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                                Shipping
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Finalized
                            </div>
                        </div>
                    </div>

                    {/* Low Stock Items */}
                    <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <FaExclamationTriangle className="w-4 h-4 text-amber-500" />
                                <h3 className="text-sm font-black text-foreground uppercase italic tracking-tight">Critical <span className="text-primary">Stock</span></h3>
                            </div>
                            <Link href="/dealer/inventory" className="px-3 py-1.5 bg-muted rounded-lg text-[10px] font-black text-foreground uppercase tracking-widest hover:bg-muted/80 transition-colors">
                                Top Up
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="pb-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Asset</th>
                                        <th className="pb-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Type</th>
                                        <th className="pb-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Stock</th>
                                        <th className="pb-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right pr-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {isLoading ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan={4} className="py-4"><div className="h-4 bg-muted rounded w-full"></div></td>
                                            </tr>
                                        ))
                                    ) : lowStockItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-10 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Inventory levels normal</td>
                                        </tr>
                                    ) : (
                                        lowStockItems.map((item) => (
                                            <tr key={item.id} className="group hover:bg-muted/20 transition-colors">
                                                <td className="py-4 pl-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground overflow-hidden">
                                                            {item.product?.images?.[0] ? (
                                                                <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <FaBox className="w-3 h-3" />
                                                            )}
                                                        </div>
                                                        <span className="text-xs font-bold text-foreground truncate max-w-[150px]">{item.product?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-xs font-medium text-muted-foreground tracking-tight">{item.product?.category?.name || 'Item'}</td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${item.stock === 0 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                                        {item.stock} Left
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right pr-2">
                                                    <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Procure</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column (1/3) */}
                <div className="xl:col-span-1 space-y-6">
                    {/* System Alerts */}
                    <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm h-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-foreground uppercase italic tracking-tight">System <span className="text-primary">Pulse</span></h3>
                            <FaBolt className="w-3 h-3 text-muted-foreground" />
                        </div>

                        <div className="space-y-6 relative">
                            {notifications.length === 0 ? (
                                <div className="py-10 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Directives clear</div>
                            ) : (
                                notifications.slice(0, 5).map((notif, idx) => (
                                    <div key={notif.id} className="flex gap-4 relative">
                                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 border-background shadow-sm shrink-0 ${notif.type.includes('URGENT') ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
                                            }`}>
                                            <FaBell className="w-3 h-3" />
                                        </div>
                                        {idx < Math.min(notifications.length, 5) - 1 && (
                                            <div className="border-l-2 border-border/50 absolute left-4 top-8 h-full -ml-[1px]"></div>
                                        )}
                                        <div>
                                            <h4 className="text-xs font-black text-foreground uppercase tracking-tight">{notif.title}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed font-medium">{notif.message}</p>
                                            <span className="text-[9px] font-black text-muted-foreground/60 uppercase mt-1 block tracking-widest">
                                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}

                            <button className="w-full text-center text-[10px] font-bold text-muted-foreground hover:text-primary mt-4 pt-4 border-t border-border/50 transition-colors uppercase tracking-[0.2em]">
                                Dismiss Feed
                            </button>
                        </div>
                    </div>

                    {/* Promo */}
                    <div className="bg-primary rounded-2xl p-6 shadow-lg shadow-primary/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black text-white italic tracking-tight">Scale Your <span className="text-white/60">Fleet</span></h3>
                            <p className="text-xs text-white/50 font-medium leading-relaxed mb-6 mt-2 uppercase tracking-widest">
                                Add logistics partners to decrease lead times by up to 22%.
                            </p>
                            <Link href="/dealer/partners" className="bg-white text-primary px-4 py-2 rounded-lg text-xs font-black uppercase tracking-[0.2em] hover:scale-105 transition-all block text-center">
                                Expand Network
                            </Link>
                        </div>
                        <FaTruck className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}
