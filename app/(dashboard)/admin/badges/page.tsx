'use client';

import React from 'react';
import { StatusBadge } from '../../../../src/components/ui/AdminUI';
import {
    FaAward as Award,
    FaCheckCircle as CheckCircle2,
    FaShieldAlt as ShieldCheck,
    FaStar as Star,
    FaBolt as Zap,
    FaPlus as Plus
} from 'react-icons/fa';

const badges = [
    { id: '1', name: 'Verified Manufacturer', icon: ShieldCheck, color: 'text-indigo-400', users: 142 },
    { id: '2', name: 'Premium Dealer', icon: Star, color: 'text-amber-400', users: 89 },
    { id: '3', name: 'Fast Fulfillment', icon: Zap, color: 'text-emerald-400', users: 310 },
];

const BadgesTrust = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white">Badges & Trust System</h1>
                    <p className="text-slate-400 text-sm">Manage dynamic trust signals and automatic merchant badges.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">
                    <Plus className="w-4 h-4" />
                    Create New Badge
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {badges.map((badge) => (
                    <div key={badge.id} className="glass p-8 flex flex-col items-center text-center group hover:border-indigo-500/30 transition-all cursor-pointer">
                        <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform">
                            <badge.icon className={`w-10 h-10 ${badge.color}`} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 mb-2">{badge.name}</h3>
                        <p className="text-xs text-slate-500 mb-6 leading-relaxed">Assigned to partners meeting high SLA and security standards.</p>
                        <div className="w-full pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span>Total Holders</span>
                            <span className="text-slate-300 font-mono text-xs">{badge.users}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BadgesTrust;
