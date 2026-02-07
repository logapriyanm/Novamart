'use client';

import React, { useState } from 'react';
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
import { WhiteCard, StatsCard, TrackingBadge } from '../../../client/components/ui/DashboardUI';
import { useAuth } from '../../../client/hooks/useAuth';

const RECENT_ORDERS = [
    { id: 'ORD-882194', name: 'Noise-Cancelling Wireless Pro', color: 'Midnight Black', qty: 1, date: 'Oct 22, 2023', status: 'SHIPPED', total: 249.00, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200' },
    { id: 'ORD-881044', name: 'Series 8 Smart Watch Elite', size: '44mm', qty: 1, date: 'Oct 18, 2023', status: 'IN TRANSIT', total: 399.00, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=200' },
    { id: 'ORD-875531', name: 'Minimalist Oak Wall Clock', color: 'Oak Wood', qty: 2, date: 'Oct 12, 2023', status: 'DELIVERED', total: 84.50, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=200' },
];

const RECOMMENDED = [
    { name: 'Mechanical Clicky Keyboard', price: 129.99, rating: 4.8, reviews: 1250, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=300' },
    { name: 'Precision Wireless Mouse', price: 79.00, rating: 4.9, reviews: 850, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=300' },
    { name: 'Aluminum Laptop Stand', price: 45.50, rating: 4.7, reviews: 420, image: 'https://images.unsplash.com/photo-1544244015-0cd4b3ff28d7?q=80&w=300' },
    { name: 'LED Task Desk Lamp', price: 32.00, rating: 4.5, reviews: 210, image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=300' },
];

export default function CustomerDashboard() {
    const { user } = useAuth();

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight">Account Dashboard</h1>
                <p className="text-foreground/40 font-bold mt-2">
                    Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] || 'Ravi'}</span>! You have 2 active orders today.
                </p>
            </div>

            {/* Profile Completion Card */}
            <WhiteCard className="p-8 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="max-w-md space-y-4 text-center md:text-left">
                        <h2 className="text-xl font-black text-foreground tracking-tight">Complete your profile</h2>
                        <p className="text-xs text-foreground/40 font-bold leading-relaxed">
                            Personalize your experience and unlock faster checkouts by completing your account details. You're almost there!
                        </p>
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                                <span className="text-primary">65% Progress</span>
                            </div>
                            <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-foreground/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </div>
                    </div>
                    <button className="px-10 py-4 bg-primary text-background rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all transform active:scale-95">
                        Complete Profile
                    </button>
                    {/* Subtle checkmark icon decoration */}
                    <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                        <Package className="w-60 h-60 text-primary" />
                    </div>
                </div>
            </WhiteCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard icon={Bag} label="Total Orders" value="24" colorClass="bg-primary" />
                <StatsCard icon={Package} label="Active Orders" value="02" colorClass="bg-orange-500" />
                <StatsCard icon={Heart} label="Saved Items" value="15" colorClass="bg-rose-500" />
                <StatsCard icon={Star} label="Reviews Given" value="08" colorClass="bg-emerald-500" />
            </div>

            {/* Recent Orders Table */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-foreground tracking-tight">Recent Orders</h3>
                    <button className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                        View All Orders <ChevronRight className="w-2.5 h-2.5" />
                    </button>
                </div>

                <WhiteCard className="overflow-hidden border-none shadow-xl shadow-primary/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-foreground/5">
                                    <th className="px-8 py-5 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Product</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Order ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Total</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {RECENT_ORDERS.map((order, idx) => (
                                    <tr key={idx} className="group hover:bg-background transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-background rounded-xl p-2 border border-foreground/5 shrink-0">
                                                    <img src={order.image} alt={order.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-foreground line-clamp-1">{order.name}</p>
                                                    <p className="text-[9px] font-bold text-foreground/40 truncate uppercase mt-0.5">Qty: {order.qty} • {order.color || order.size}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-[11px] font-bold text-foreground/50 uppercase">#{order.id}</td>
                                        <td className="px-8 py-5 text-[11px] font-bold text-foreground/50">{order.date}</td>
                                        <td className="px-8 py-5">
                                            <TrackingBadge status={order.status} />
                                        </td>
                                        <td className="px-8 py-5 text-[13px] font-black text-foreground">${order.total.toFixed(2)}</td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Track</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </WhiteCard>
            </div>

            {/* Recommended for You */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-foreground tracking-tight">Recommended for you</h3>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/40 hover:bg-surface hover:text-primary transition-all">
                            <ChevronRight className="w-3 h-3 rotate-180" />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/40 hover:bg-surface hover:text-primary transition-all">
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {RECOMMENDED.map((product, idx) => (
                        <WhiteCard key={idx} className="p-4 group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                            <div className="aspect-square bg-background rounded-2xl mb-4 relative overflow-hidden group-hover:bg-surface transition-colors">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-foreground/40 hover:text-rose-500 shadow-sm transition-colors">
                                    <Heart className="w-3 h-3" />
                                </button>
                            </div>
                            <h4 className="text-[13px] font-black text-foreground truncate mb-1">{product.name}</h4>
                            <div className="flex items-center gap-1.5 mb-3">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-2 h-2 ${s <= Math.round(product.rating) ? 'text-amber-500' : 'text-foreground/10'}`} />)}
                                </div>
                                <span className="text-[10px] font-bold text-foreground/40">{product.rating} ({product.reviews})</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-black text-foreground">${product.price.toFixed(2)}</p>
                                <button className="w-8 h-8 rounded-xl bg-background flex items-center justify-center text-foreground/40 hover:bg-primary hover:text-background transition-all">
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
