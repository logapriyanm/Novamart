'use client';

import React from 'react';
import { StatusBadge } from '../../../../src/components/ui/AdminUI';
import {
    FaAward as Award,
    FaCog as Settings,
    FaSearch as Search,
    FaChartLine as Activity,
    FaChartBar as BarChart4
} from 'react-icons/fa';

const PlatformSettings = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white">Platform Governance Settings</h1>
                <p className="text-slate-400 text-sm">Critical system toggles, API keys, and global business parameters.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass p-8 space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        System Toggles
                    </h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Allow Public Manufacturer Signup', desc: 'If off, only invite-only onboarding is allowed.' },
                            { name: 'Global Maintenance Mode', desc: 'Restricts all public facing APIs and frontend.' },
                            { name: 'Automatic Escrow Release', desc: 'Release funds 48h after delivery heartbeat.' }
                        ].map((toggle) => (
                            <div key={toggle.name} className="flex items-center justify-between gap-8">
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-200">{toggle.name}</p>
                                    <p className="text-xs text-slate-500">{toggle.desc}</p>
                                </div>
                                <div className="w-12 h-6 bg-slate-800 rounded-full flex items-center px-1 border border-white/5"><div className="w-4 h-4 bg-slate-600 rounded-full" /></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass p-8 space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Settings className="w-5 h-5 text-indigo-400" />
                        API & Integration Status
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-200">Payment Gateway</span>
                                <span className="text-xs text-slate-500">Stripe / Razorpay Connected</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-200">Logistics API</span>
                                <span className="text-xs text-slate-500">FedEx / DHL Real-time Feed</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformSettings;
