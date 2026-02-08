'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaBox as Package,
    FaHeart as Heart,
    FaStar as Star,
    FaShoppingBag as Bag,
    FaArrowRight as ArrowRight,
    FaChevronRight as ChevronRight,
    FaClock as Clock,
} from 'react-icons/fa';
import { WhiteCard, StatsCard, TrackingBadge } from '@/client/components/features/dashboard/DashboardUI';
import { useAuth } from '@/client/hooks/useAuth';
import { customerService } from '@/lib/api/services/customer.service';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';
import HighSellingProducts from '../../../client/components/features/dashboard/customer/HighSellingProducts';



export default function CustomerDashboard() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [ordersData, statsData, recsData] = await Promise.all([
                customerService.getOrders(),
                customerService.getStats().catch(() => null),
                apiClient.get<any[]>('/products', { params: { limit: 4, sortBy: 'rating' } })
            ]);
            setOrders(ordersData || []);
            setStats(statsData);
            setRecommendations(recsData || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight italic">Account <span className="text-primary">Dashboard</span></h1>
                <p className="text-foreground/40 font-bold mt-2 uppercase tracking-widest text-[10px]">
                    Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] || 'Member'}</span>! You have {orders.filter(o => o.status !== 'DELIVERED').length} active orders.
                </p>
            </div>

            {/* Profile Completion Card */}
            <WhiteCard className="p-8 relative overflow-hidden bg-slate-50/50">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="max-w-md space-y-4 text-center md:text-left">
                        <h2 className="text-xl font-black text-foreground tracking-tight italic">Complete your <span className="text-primary">profile</span></h2>
                        <p className="text-[10px] text-foreground/40 font-bold leading-relaxed uppercase tracking-widest">
                            Personalize your experience and unlock faster checkouts by completing your account details.
                        </p>
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                                <span className="text-primary">65% Progress</span>
                            </div>
                            <div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-foreground/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </div>
                    </div>
                    <button className="px-10 py-4 bg-primary text-background rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                        Update Profile
                    </button>
                    {/* Subtle checkmark icon decoration */}
                    <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none">
                        <Package className="w-60 h-60 text-primary" />
                    </div>
                </div>
            </WhiteCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard icon={Bag} label="Total Orders" value={isLoading ? '...' : (stats?.totalOrders || orders.length).toString()} colorClass="bg-primary" />
                <StatsCard icon={Package} label="Active Orders" value={isLoading ? '...' : (stats?.activeOrders || orders.filter(o => ['CREATED', 'PAID', 'CONFIRMED', 'SHIPPED'].includes(o.status)).length).toString()} colorClass="bg-orange-500" />
                <StatsCard icon={Heart} label="Total Spent" value={isLoading ? '...' : `₹${(stats?.totalSpent || 0).toLocaleString()}`} colorClass="bg-rose-500" />
                <StatsCard icon={Star} label="Account Level" value="Level 1" colorClass="bg-emerald-500" />
            </div>

            {/* High Selling Products (Top 8) */}
            <HighSellingProducts />

            {/* Recent Orders Table */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-foreground tracking-tight italic">Recent <span className="text-primary">Orders</span></h3>
                    <Link href="/customer/orders" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                        Full History <ChevronRight className="w-2.5 h-2.5" />
                    </Link>
                </div>

                <WhiteCard className="overflow-hidden border-none shadow-xl shadow-primary/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-foreground/5 bg-slate-50/50">
                                    <th className="px-8 py-5 text-[9px] font-black text-foreground/40 uppercase tracking-[0.2em]">Product</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-foreground/40 uppercase tracking-[0.2em]">Order ID</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-foreground/40 uppercase tracking-[0.2em]">Date</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-foreground/40 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-foreground/40 uppercase tracking-[0.2em]">Total</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-foreground/40 uppercase tracking-[0.2em]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={6} className="px-8 py-5"><div className="h-10 bg-slate-50 rounded-lg w-full"></div></td>
                                        </tr>
                                    ))
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">No orders found</p>
                                            <Link href="/products" className="text-xs font-black text-primary underline uppercase tracking-widest mt-2 block">Start Shopping</Link>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.slice(0, 5).map((order) => (
                                        <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-background rounded-xl p-2 border border-foreground/5 shrink-0 flex items-center justify-center">
                                                        {order.items?.[0]?.product?.images?.[0] ? (
                                                            <img src={order.items[0].product.images[0]} alt="" className="w-full h-full object-contain" />
                                                        ) : (
                                                            <Package className="w-5 h-5 text-slate-200" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-foreground line-clamp-1">{order.items?.[0]?.product?.name || 'Order Item'}</p>
                                                        <p className="text-[9px] font-bold text-foreground/40 truncate uppercase mt-0.5">Qty: {order.items?.[0]?.quantity || 1}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-[10px] font-black text-foreground/50 uppercase">#{order.id.slice(0, 8)}</td>
                                            <td className="px-8 py-5 text-[10px] font-bold text-foreground/50">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="px-8 py-5">
                                                <TrackingBadge status={order.status} />
                                            </td>
                                            <td className="px-8 py-5 text-[12px] font-black text-foreground">₹{order.totalAmount}</td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Details</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </WhiteCard>
            </div>

            {/* Recommended for You */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-foreground tracking-tight italic">Recommended <span className="text-primary">for you</span></h3>
                    <Link href="/products" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Discover More</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendations.length === 0 && !isLoading ? (
                        <div className="col-span-full py-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Exploring new curated picks for you...</div>
                    ) : recommendations.map((product, idx) => (
                        <WhiteCard key={idx} className="p-4 group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                            <div className="aspect-square bg-background rounded-2xl mb-4 relative overflow-hidden group-hover:bg-slate-100 transition-colors">
                                <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1586769852044-692d6e3703a0?q=80&w=300'} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-foreground/40 hover:text-rose-500 shadow-sm transition-colors">
                                    <Heart className="w-3 h-3" />
                                </button>
                            </div>
                            <h4 className="text-[11px] font-black text-[#1E293B] truncate mb-1 uppercase tracking-tight">{product.name}</h4>
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-base font-black text-[#1E293B]">₹{Number(product.basePrice).toLocaleString()}</p>
                                <button className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-[#10367D] hover:bg-primary hover:text-white transition-all">
                                    <Bag className="w-3 h-3" />
                                </button>
                            </div>
                        </WhiteCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
