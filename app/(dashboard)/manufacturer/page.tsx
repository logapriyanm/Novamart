'use client';

import React from 'react';
import {
    Package,
    Users,
    TrendingUp,
    Truck,
    Plus,
    ChevronRight,
    ArrowUpRight,
    Settings,
    Clock,
    Quote
} from 'lucide-react';
import { Card, StatusBadge } from '../../../src/components/ui/AdminUI';
import { motion } from 'framer-motion';
import { TestimonialCard } from '../../../src/components/ui/TestimonialCard';

const stats = [
    { name: 'Active Inventory', value: '1,280 Units', icon: Package, change: '+5%', isUp: true },
    { name: 'Total Dealers', value: '42 Approved', icon: Users, change: '+2', isUp: true },
    { name: 'Monthly Revenue', value: '₹240,000', icon: TrendingUp, change: '+12%', isUp: true },
    { name: 'Pending Delivery', value: '15 Orders', icon: Truck, change: '-3', isUp: false },
];

export default function ManufacturerDashboard() {
    // Mock user status (In real app, fetch from auth context)
    const userStatus = 'UNDER_VERIFICATION';

    return (
        <div className="space-y-8 animate-fade-in">
            {userStatus === 'UNDER_VERIFICATION' && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/20">
                        <Clock className="w-8 h-8" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-amber-800 font-bold text-lg">Verification in Progress</h3>
                        <p className="text-amber-700/70 text-sm font-medium">Your business details are being audited by our governance team. Listing features will be unlocked once approved (SLA: 24h).</p>
                    </div>
                    <button className="px-6 py-3 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-all active:scale-95 shadow-lg shadow-amber-500/10">
                        View Application Status
                    </button>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-lg shadow-[#2772A0]/5 border border-[#2772A0]/10 overflow-hidden">
                            <img src="/logo.png" alt="Novamart" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-[#2772A0]">Manufacturer Center</h1>
                    </div>
                    <p className="text-[#1E293B]/60 text-xs lg:text-sm font-medium">Manage production and regional networks.</p>
                </div>
                <div className="flex flex-wrap gap-2 lg:gap-4 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none justify-center bg-white/40 border border-[#2772A0]/10 flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#2772A0] hover:bg-white/60 rounded-xl transition-all shadow-sm">
                        <Settings className="w-4 h-4" />
                        Network
                    </button>
                    <button
                        disabled={userStatus === 'UNDER_VERIFICATION'}
                        className="flex-1 sm:flex-none justify-center bg-[#2772A0] text-[#CCDDEA] flex items-center gap-2 px-6 py-2 text-xs font-bold hover:bg-[#1E5F86] rounded-xl transition-all shadow-lg shadow-[#2772A0]/20 active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                        <Plus className="w-5 h-5" />
                        List Product
                    </button>
                </div>
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
                {/* Recent Orders / Sales Graph Placeholder */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-[#1E293B]">Distribution Map</h2>
                        <button className="text-xs font-bold text-[#2772A0] hover:underline">View Regional Insights</button>
                    </div>
                    <div className="h-64 rounded-2xl bg-[#2772A0]/5 border-2 border-dashed border-[#2772A0]/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#2772A0]/40 uppercase tracking-widest">Regional Demand Heatmap (MongoDB Data)</span>
                    </div>
                </Card>

                {/* Dealer Approvals */}
                <Card>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-[#1E293B]">Dealer Approvals</h2>
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">5</div>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-[#2772A0]/5 hover:border-[#2772A0]/20 transition-all">
                                <div className="w-10 h-10 rounded-full bg-[#2772A0]/10 flex items-center justify-center text-[#2772A0] font-bold text-xs">
                                    D{i}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-[#1E293B]">Dealer North #0{i}</h4>
                                    <span className="text-[10px] text-[#2772A0]/60 font-medium">Delhi, India</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#2772A0]/40" />
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 bg-[#2772A0]/5 hover:bg-[#2772A0]/10 text-[#2772A0] text-xs font-bold rounded-xl transition-all">
                        View Network Application Queue
                    </button>
                </Card>
            </div>

            {/* Testimonials Section */}
            <div className="space-y-8 pt-8 border-t border-[#2772A0]/10 pb-12">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold text-[#2772A0] flex items-center gap-3">
                        <Quote className="w-6 h-6" />
                        Network Testimonials
                    </h2>
                    <p className="text-[#1E293B]/60 text-xs font-bold uppercase tracking-widest">Enterprise Success Stories</p>
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
                </div>
            </div>
        </div>
    );
}
