'use client';

import React from 'react';
import {
    FaShoppingBag as ShoppingBag,
    FaHeart as Heart,
    FaMapMarkerAlt as MapPin,
    FaCommentAlt as MessageSquare,
    FaBox as Package,
    FaClock as Clock,
    FaShieldAlt as Shield
} from 'react-icons/fa';
import { Card, StatusBadge } from '../../../src/components/ui/AdminUI';

const recentOrders = [
    { id: 'ORD-991', product: 'Premium Steel Grade A', dealer: 'North Steel Corp', status: 'ACTIVE', amount: '₹1,200.00' },
    { id: 'ORD-982', product: 'Industrial Bearings x10', dealer: 'Regional Tech Spares', status: 'COMPLETED', amount: '₹450.00' },
];

export default function CustomerDashboard() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-lg shadow-[#10367D]/5 border border-[#10367D]/10 overflow-hidden">
                            <img src="/logo.png" alt="Novamart" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-[#10367D]">Your Account</h1>
                    </div>
                    <p className="text-[#1E293B]/60 text-xs lg:text-sm font-medium">Track orders and manage escrow security.</p>
                </div>
                <button className="bg-[#10367D] text-white px-6 py-2 text-xs font-bold rounded-xl shadow-lg shadow-[#10367D]/20">
                    Support
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <Card className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-[#10367D]/5 flex items-center justify-center text-[#10367D]">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-[#1E293B]">3</span>
                        <p className="text-[10px] font-bold text-[#10367D]/60 uppercase tracking-widest">Active Orders</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/5 flex items-center justify-center text-amber-600">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-[#1E293B]">1</span>
                        <p className="text-[10px] font-bold text-[#10367D]/60 uppercase tracking-widest">Ongoing Dispute</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-600">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-[#1E293B]">12</span>
                        <p className="text-[10px] font-bold text-[#10367D]/60 uppercase tracking-widest">Total Purchases</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#10367D]" />
                            Recent Activity
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="p-4 rounded-2xl bg-white/60 border border-[#10367D]/5 flex items-center justify-between group hover:border-[#10367D]/30 transition-all">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold text-[#1E293B]">{order.product}</span>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <p className="text-[10px] text-[#10367D]/60 font-bold uppercase">{order.id} • {order.dealer}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-[#10367D]">{order.amount}</span>
                                    <p className="text-[10px] text-[#1E293B]/40 font-bold mt-1">Status Checked</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-[#10367D] to-[#1E5F86] border-none">
                        <h3 className="text-white font-bold text-lg mb-2">Escrow Protected</h3>
                        <p className="text-white/70 text-sm mb-6">All your payments are held in a secure state-driven escrow until you confirm delivery satisfaction.</p>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/10">
                            Learn How Escrow Works
                        </button>
                    </Card>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 rounded-3xl bg-white/40 border border-[#10367D]/10 flex flex-col items-center gap-2 hover:bg-white/60 transition-all">
                            <MapPin className="w-5 h-5 text-[#10367D]" />
                            <span className="text-[10px] font-bold text-[#10367D] uppercase">Addresses</span>
                        </button>
                        <button className="p-4 rounded-3xl bg-white/40 border border-[#10367D]/10 flex flex-col items-center gap-2 hover:bg-white/60 transition-all">
                            <MessageSquare className="w-5 h-5 text-[#10367D]" />
                            <span className="text-[10px] font-bold text-[#10367D] uppercase">Support</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

