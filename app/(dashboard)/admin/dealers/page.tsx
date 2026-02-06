'use client';

import React from 'react';
import { StatusBadge } from '../../../../src/components/ui/AdminUI';
import {
    FaStore as Store,
    FaMapMarkerAlt as MapPin,
    FaChartLine as TrendingUp,
    FaUserCheck as UserCheck,
    FaBan as Ban
} from 'react-icons/fa';

const dealers = [
    { id: 'D-882', name: 'Central Auto Spares', region: 'Germany / EU', orders: 1240, status: 'ACTIVE', revenue: '$4.2M' },
    { id: 'D-883', name: 'Mumbai Logistics Hub', region: 'India / APAC', orders: 890, status: 'FLAGGED', revenue: '$1.8M' },
];

const Dealers = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white">Dealer Network</h1>
                <p className="text-slate-400 text-sm">Monitor regional dealers, local inventory, and fulfillment performance.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {dealers.map((dealer) => (
                    <div key={dealer.id} className="glass p-8 flex flex-col md:flex-row md:items-center gap-8 group hover:border-indigo-500/20 transition-all">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <Store className="w-8 h-8" />
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-slate-100">{dealer.name}</h3>
                                <StatusBadge status={dealer.status} />
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {dealer.region}</span>
                                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {dealer.orders} Fulfilled</span>
                                <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" /> Fully Verified</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 border-l border-white/5 pl-8">
                            <div className="text-center">
                                <p className="text-[10px] text-slate-600 uppercase font-black mb-1">Gross Rev</p>
                                <p className="text-xl font-bold text-indigo-400">{dealer.revenue}</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-300 uppercase tracking-wider transition-all">Audit</button>
                                {dealer.status !== 'SUSPENDED' && (
                                    <button className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Ban className="w-5 h-5" /></button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dealers;
