'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaBox, FaShoppingCart, FaRupeeSign, FaWarehouse,
    FaSync, FaCheckCircle, FaTruck, FaMoneyBillWave,
    FaExclamationTriangle, FaArrowRight, FaBolt
} from 'react-icons/fa';
import Link from 'next/link';

export default function DealerDashboard() {
    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight">Dashboard Overview</h1>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Welcome back, Apex. Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">Last updated: 2 mins ago</span>
                    <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-foreground hover:bg-muted transition-colors shadow-sm">
                        <FaSync className="w-3 h-3 text-muted-foreground" />
                        Sync Data
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Today's Orders */}
                <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FaShoppingCart className="w-5 h-5" />
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">+12%</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-muted-foreground mb-1">Today's Orders</p>
                        <h3 className="text-3xl font-black text-foreground tracking-tight">18</h3>
                    </div>
                </div>

                {/* Card 2: Revenue */}
                <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <FaMoneyBillWave className="w-5 h-5" />
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">+8.4%</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-muted-foreground mb-1">Revenue</p>
                        <h3 className="text-3xl font-black text-foreground tracking-tight">₹3.2L</h3>
                    </div>
                </div>

                {/* Card 3: Active Inventory */}
                <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <FaBox className="w-5 h-5" />
                        </div>
                        <span className="bg-muted text-muted-foreground px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Stable</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-muted-foreground mb-1">Active Inventory</p>
                        <h3 className="text-3xl font-black text-foreground tracking-tight">42</h3>
                    </div>
                </div>

                {/* Card 4: Escrow Balance */}
                <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <FaWarehouse className="w-5 h-5" />
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">+₹12k</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-muted-foreground mb-1">Escrow Balance</p>
                        <h3 className="text-3xl font-black text-foreground tracking-tight">₹1.4L</h3>
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
                            <h3 className="text-sm font-black text-foreground">Order Status Pipeline</h3>
                            <Link href="/dealer/orders" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                                View All Orders
                            </Link>
                        </div>

                        {/* Visual Pipeline */}
                        <div className="flex h-12 w-full rounded-xl overflow-hidden mb-2">
                            <div className="flex-1 bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white relative group cursor-pointer hover:bg-blue-600 transition-colors">
                                NEW (5)
                            </div>
                            <div className="flex-1 bg-blue-400 flex items-center justify-center text-[10px] font-bold text-white relative group cursor-pointer hover:bg-blue-500 transition-colors">
                                PROC (8)
                            </div>
                            <div className="flex-[1.5] bg-blue-300 flex items-center justify-center text-[10px] font-bold text-white relative group cursor-pointer hover:bg-blue-400 transition-colors">
                                SHIP (12)
                            </div>
                            <div className="flex-[2] bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white relative group cursor-pointer hover:bg-emerald-600 transition-colors">
                                DEL (45)
                            </div>
                        </div>

                        {/* Legend/Status Dots */}
                        <div className="flex justify-between px-4 sm:px-10 mt-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <div className="flex flex-col items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                New
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                Processing
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                                Shipped
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Delivered
                            </div>
                        </div>
                    </div>

                    {/* Low Stock Items */}
                    <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <FaExclamationTriangle className="w-4 h-4 text-amber-500" />
                                <h3 className="text-sm font-black text-foreground">Low Stock Items</h3>
                            </div>
                            <button className="px-3 py-1.5 bg-muted rounded-lg text-[10px] font-black text-foreground uppercase tracking-widest hover:bg-muted/80 transition-colors">
                                Manage Inventory
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="pb-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Product Name</th>
                                        <th className="pb-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Category</th>
                                        <th className="pb-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Stock Level</th>
                                        <th className="pb-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right pr-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    <tr className="group hover:bg-muted/20 transition-colors">
                                        <td className="py-4 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                                                    <FaBox className="w-3 h-3" />
                                                </div>
                                                <span className="text-xs font-bold text-foreground">Organic Cotton T-Shirt</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-xs font-medium text-muted-foreground">Apparel</td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md text-[10px] font-bold">5 Left</span>
                                        </td>
                                        <td className="py-4 text-right pr-2">
                                            <button className="text-[10px] font-bold text-primary hover:underline">Update</button>
                                        </td>
                                    </tr>
                                    <tr className="group hover:bg-muted/20 transition-colors">
                                        <td className="py-4 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                                                    <FaBolt className="w-3 h-3" />
                                                </div>
                                                <span className="text-xs font-bold text-foreground">Wireless Pro Mouse</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-xs font-medium text-muted-foreground">Electronics</td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md text-[10px] font-bold">2 Left</span>
                                        </td>
                                        <td className="py-4 text-right pr-2">
                                            <button className="text-[10px] font-bold text-primary hover:underline">Update</button>
                                        </td>
                                    </tr>
                                    <tr className="group hover:bg-muted/20 transition-colors">
                                        <td className="py-4 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                                                    <FaBox className="w-3 h-3" />
                                                </div>
                                                <span className="text-xs font-bold text-foreground">Smart Coffee Maker</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-xs font-medium text-muted-foreground">Home & Living</td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded-md text-[10px] font-bold">0 Left</span>
                                        </td>
                                        <td className="py-4 text-right pr-2">
                                            <button className="text-[10px] font-bold text-primary hover:underline">Update</button>
                                        </td>
                                    </tr>
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
                            <h3 className="text-sm font-black text-foreground">System Alerts</h3>
                            <FaBolt className="w-3 h-3 text-muted-foreground" />
                        </div>

                        <div className="space-y-6 relative">
                            {/* Alert 1 */}
                            <div className="flex gap-4 relative">
                                <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border-2 border-background shadow-sm shrink-0">
                                    <FaCheckCircle className="w-3 h-3" />
                                </div>
                                <div className="border-l-2 border-border/50 absolute left-4 top-8 h-full -ml-[1px]"></div>
                                <div>
                                    <h4 className="text-xs font-bold text-foreground">Manufacturer ABC Approved</h4>
                                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">Your sourcing request for Fall Collection has been approved.</p>
                                    <span className="text-[9px] font-black text-muted-foreground/60 uppercase mt-1 block">14:20 PM</span>
                                </div>
                            </div>

                            {/* Alert 2 */}
                            <div className="flex gap-4 relative">
                                <div className="relative z-10 w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center border-2 border-background shadow-sm shrink-0">
                                    <FaMoneyBillWave className="w-3 h-3" />
                                </div>
                                <div className="border-l-2 border-border/50 absolute left-4 top-8 h-full -ml-[1px]"></div>
                                <div>
                                    <h4 className="text-xs font-bold text-foreground">Settlement Released</h4>
                                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">Payment for Order #124 has been verified.</p>
                                    <span className="text-[9px] font-black text-muted-foreground/60 uppercase mt-1 block">11:05 AM</span>
                                </div>
                            </div>

                            {/* Alert 3 */}
                            <div className="flex gap-4 relative">
                                <div className="relative z-10 w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center border-2 border-background shadow-sm shrink-0">
                                    <FaTruck className="w-3 h-3" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-foreground">Delayed Shipment</h4>
                                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">Logistics report: Batch #89 might be delayed.</p>
                                    <span className="text-[9px] font-black text-muted-foreground/60 uppercase mt-1 block">YESTERDAY</span>
                                </div>
                            </div>

                            <button className="w-full text-center text-[10px] font-bold text-muted-foreground hover:text-primary mt-4 pt-4 border-t border-border/50 transition-colors">
                                Clear All Notifications
                            </button>
                        </div>
                    </div>

                    {/* Grow Your Fleet Promo */}
                    <div className="bg-blue-600 rounded-2xl p-6 shadow-lg shadow-blue-500/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black text-white mb-2">Grow Your Fleet</h3>
                            <p className="text-xs text-blue-100 font-medium leading-relaxed mb-6">
                                Add new logistics partners to reduce shipping times by up to 15%.
                            </p>
                            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-colors">
                                Explore Partners
                            </button>
                        </div>
                        {/* Background Decorations */}
                        <FaTruck className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
