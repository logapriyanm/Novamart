'use client';

import React from 'react';
import {
    ShoppingCart,
    Box,
    History,
    AlertCircle,
    Store,
    ArrowUpRight,
    TrendingUp,
    ChevronRight,
    Plus,
    Quote
} from 'lucide-react';
import { Card, StatusBadge } from '../../../src/components/ui/AdminUI';
import { TestimonialCard } from '../../../src/components/ui/TestimonialCard';

const stats = [
    { name: 'Inventory Value', value: '₹84,200', icon: Store, change: '+12%', isUp: true },
    { name: 'Monthly Orders', value: '156', icon: ShoppingCart, change: '+18.5%', isUp: true },
    { name: 'Return Rate', value: '1.2%', icon: AlertCircle, change: '-0.4%', isUp: false },
    { name: 'Gross Margin', value: '22%', icon: TrendingUp, change: '+2%', isUp: true },
];

export default function DealerDashboard() {
    // Mock user status
    const userStatus = 'PENDING';

    return (
        <div className="space-y-8 animate-fade-in">
            {userStatus === 'PENDING' && (
                <div className="bg-[#2772A0]/5 border border-[#2772A0]/20 rounded-3xl p-6 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shrink-0">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-[#1E293B] font-bold">Profile Pending Completion</h3>
                        <p className="text-[#1E293B]/60 text-xs font-medium">Please finish your bank KYC to enable retail settlements.</p>
                    </div>
                    <button className="px-4 py-2 bg-[#2772A0] text-white font-bold text-xs rounded-lg">Complete KYC</button>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-lg shadow-[#2772A0]/5 border border-[#2772A0]/10 overflow-hidden">
                            <img src="/logo.png" alt="Novamart" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-[#2772A0]">Dealer Portal</h1>
                    </div>
                    <p className="text-[#1E293B]/60 text-xs lg:text-sm font-medium">Monitor inventory and settlements.</p>
                </div>
                <button
                    disabled={userStatus === 'PENDING'}
                    className="bg-[#2772A0] text-[#CCDDEA] px-6 py-2 text-xs font-bold rounded-xl shadow-lg shadow-[#2772A0]/20 disabled:opacity-50"
                >
                    Settlements
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat) => (
                    <Card key={stat.name} className="group hover:border-[#2772A0]/30 transition-all cursor-default">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#2772A0]/5 border border-[#2772A0]/10 flex items-center justify-center text-[#2772A0] group-hover:scale-110 transition-transform">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stat.change}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#2772A0]/60 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.name}</span>
                            <span className="text-2xl font-bold text-[#1E293B]">{stat.value}</span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Orders Table */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-[#1E293B]">Active Retail Orders</h2>
                        <button className="text-xs font-bold text-[#2772A0] hover:underline">View All Orders</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/60 border border-[#2772A0]/5 group hover:border-[#2772A0]/30 transition-all">
                                <div className="p-3 rounded-lg bg-[#2772A0]/5 text-[#2772A0]">
                                    <Box className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold text-[#1E293B]">Order #RTL-440{i}</span>
                                        <StatusBadge status={i === 2 ? 'DISPUTED' : 'ACTIVE'} />
                                    </div>
                                    <span className="text-[10px] text-[#2772A0]/60 font-bold uppercase">Customer: John Doe • ₹420.00</span>
                                </div>
                                <button className="p-2 hover:bg-[#2772A0]/10 rounded-lg text-[#2772A0] transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Margin Analytics */}
                <Card className="flex flex-col">
                    <h2 className="text-xl font-bold text-[#1E293B] mb-8">Settlement Queue</h2>
                    <div className="flex-1 border-2 border-dashed border-[#2772A0]/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
                        <TrendingUp className="w-12 h-12 text-[#2772A0]/20 mb-4" />
                        <span className="text-2xl font-bold text-[#2772A0]">₹12,450.00</span>
                        <p className="text-[10px] font-bold text-[#1E293B]/40 mt-2 uppercase">Pending Escrow Release (SLA: 24h)</p>
                        <button className="mt-8 w-full py-3 bg-[#2772A0] text-[#CCDDEA] font-bold text-sm rounded-xl hover:bg-[#1E5F86] transition-all shadow-lg shadow-[#2772A0]/20">
                            Request Early Release
                        </button>
                    </div>
                </Card>
            </div>

            {/* Success Stories & Feedback Section */}
            <div className="space-y-8 pb-12">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold text-[#1E293B] flex items-center gap-3">
                            <Quote className="w-6 h-6 text-[#2772A0]" />
                            Partner Success Stories
                        </h2>
                        <p className="text-[#1E293B]/60 text-xs font-bold uppercase tracking-widest">Feedback from the Novamart Network</p>
                    </div>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    <TestimonialCard
                        variant="QUOTE_FEATURE"
                        name="Victoria Wotton"
                        role="Regional Supply head"
                        company="Fementum Odio Co."
                        content="Since 1985 Reed has pioneered specialist recruitment. Sourcing knowledgeable, skilled professionals pioneered Specialist recruitment, sourcing."
                        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria"
                        className="break-inside-avoid"
                    />
                    <TestimonialCard
                        variant="CENTRIC"
                        name="Victoria Wotton"
                        role="Regional Supply head"
                        company="Fementum Odio Co."
                        content="Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria2"
                        className="break-inside-avoid"
                    />
                    <TestimonialCard
                        variant="HORIZONTAL"
                        name="Victoria Wotton"
                        role="Chief Operations"
                        company="Fementum Odio Co."
                        content="I really appreciate!! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria3"
                        className="break-inside-avoid"
                    />
                    <TestimonialCard
                        variant="CLEAN"
                        name="Victoria Wotton"
                        role="Logistics Manager"
                        company="Fementum Odio Co."
                        content="Direct yet Friendly Tone. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria4"
                        className="break-inside-avoid"
                    />
                    <TestimonialCard
                        variant="QUOTE_FEATURE"
                        name="Victoria Wotton"
                        role="Regional Supply head"
                        company="Fementum Odio Co."
                        content="When an unknown printer took A galley of type and scrambled it to make a type specimen Book. It has survived not only Five centuries."
                        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria5"
                        className="break-inside-avoid"
                    />
                    <TestimonialCard
                        variant="CENTRIC"
                        name="Good Services!"
                        role="Victoria Wotton"
                        company="Fementum Odio Co."
                        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida."
                        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria6"
                        className="break-inside-avoid"
                    />
                </div>
            </div>
        </div>
    );
}