'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaBox as Package,
    FaHeart as Heart,
    FaCog as Settings,
    FaCreditCard as CreditCard,
    FaMapMarkerAlt as MapPin,
    FaShoppingBag as ShoppingBag,
    FaStar as Star,
    FaChartLine as TrendingUp,
    FaChevronRight as ChevronRight,
    FaExternalLinkAlt as ArrowUpRight
} from 'react-icons/fa';
import { Card, StatusBadge } from '../../../../src/components/ui/AdminUI';

const recentOrders = [
    { id: '#ORD-9921', item: 'Quantum Force Drill', price: '₹12,499', status: 'SHIPPED', date: '2h ago' },
    { id: '#ORD-9920', item: 'Solaris Energy Panel', price: '₹45,000', status: 'PROCESSING', date: '5h ago' },
    { id: '#ORD-9918', item: 'Apex Multimeter', price: '₹3,200', status: 'DELIVERED', date: 'Yesterday' }
];

export default function CustomerDashboard() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-[#1E293B] tracking-tight uppercase">Your Account</h1>
                <p className="text-[#1E293B]/40 text-xs font-bold uppercase tracking-[0.2em]">Retail & Escrow Summary</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Orders', value: '12', icon: ShoppingBag, color: 'text-[#2772A0]' },
                    { label: 'Wishlist Items', value: '08', icon: Heart, color: 'text-rose-500' },
                    { label: 'Active Escrows', value: '02', icon: CreditCard, color: 'text-emerald-500' },
                    { label: 'Loyalty Points', value: '1,240', icon: Star, color: 'text-amber-500' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-[#2772A0]/10 flex items-center justify-between group hover:border-[#2772A0]/30 transition-all"
                    >
                        <div>
                            <p className="text-[10px] font-black text-[#1E293B]/40 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-[#1E293B]">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-[#2772A0]/5 transition-transform group-hover:scale-110 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Purchases */}
                <div className="lg:col-span-8">
                    <Card className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-black text-[#1E293B] uppercase tracking-tighter">Recent Purchases</h3>
                                <p className="text-[10px] font-bold text-[#1E293B]/40 uppercase italic mt-1">Order history & status tracking</p>
                            </div>
                            <button className="flex items-center gap-2 text-[10px] font-black text-[#2772A0] uppercase tracking-widest hover:underline">
                                View Full History
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {recentOrders.map((order, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC]/50 hover:bg-white transition-all border border-transparent hover:border-[#2772A0]/10 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#2772A0] shadow-sm">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-black text-[#1E293B] text-sm">{order.item}</p>
                                            <p className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-tighter mt-0.5">{order.id} • {order.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-8">
                                        <p className="font-black text-[#2772A0]">{order.price}</p>
                                        <StatusBadge status={order.status as any} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Account Details & Address */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-8 bg-[#2772A0] text-white">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md">
                                <TrendingUp className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Account Status</p>
                                <p className="text-xl font-black">Elite Member</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-sm font-medium opacity-90 italic">
                            <p>You have **2 pending escrows** totaling ₹48,200. Verification is in progress.</p>
                        </div>
                        <button className="w-full mt-8 py-4 bg-white text-[#2772A0] font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                            Manage Wallet
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </Card>

                    <Card className="p-8">
                        <h4 className="text-[10px] font-black text-[#1E293B]/40 uppercase tracking-widest mb-6 py-1 border-b border-[#2772A0]/10 flex items-center justify-between">
                            Shipping Profile
                            <MapPin className="w-3 h-3" />
                        </h4>
                        <div className="space-y-4">
                            <p className="text-sm font-black text-[#1E293B]">CyberHub, Unit 4B, Tokyo</p>
                            <p className="text-[10px] font-bold text-[#1E293B]/40 uppercase leading-relaxed italic">Primary address verified for lightning-fast factory-direct delivery.</p>
                        </div>
                        <button className="w-full mt-6 py-3 bg-[#2772A0]/5 text-[#2772A0] font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#2772A0] hover:text-white transition-all">
                            Change Destination
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
