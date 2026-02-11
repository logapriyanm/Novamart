'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaCog,
    FaShieldAlt,
    FaDatabase,
    FaNetworkWired,
    FaArrowLeft,
    FaSave,
    FaExclamationTriangle,
    FaMicrochip
} from 'react-icons/fa';
import Link from 'next/link';
import { useProfile } from '@/client/hooks/useProfile';
import { toast } from 'sonner';

interface AdminSettings {
    maintenanceMode: boolean;
    strictKYC: boolean;
    escrowHold: boolean;
    debugLogging: boolean;
}

export default function PlatformSettingsPortal() {
    const [isSaving, setIsSaving] = useState(false);
    // const { showSnackbar } = useSnackbar();

    // Use the custom hook for persistence
    const { profile, saveProfile, isLoaded } = useProfile<AdminSettings>('admin_settings', {
        maintenanceMode: false,
        strictKYC: true,
        escrowHold: false,
        debugLogging: false
    });

    const handleSave = () => {
        setIsSaving(true);
        // Simulate network delay
        setTimeout(() => {
            setIsSaving(false);
            toast.success('System Parameters Saved Successfully!');
        }, 800);
    };

    const toggleSetting = (key: keyof AdminSettings) => {
        saveProfile({ [key]: !profile[key] });
    };

    if (!isLoaded) return null; // Avoid hydration mismatch

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Mission Control
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Terminal <span className="text-[#10367D]">Configuration</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">High-Level Platform Parameter Control</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 bg-[#10367D] text-white text-xs font-black uppercase tracking-widest rounded-[10px] shadow-xl shadow-[#10367D]/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-3"
                    >
                        {isSaving ? 'Deploying Changes...' : 'Save System Parameters'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Core System Toggles */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-[10px] p-10 lg:p-12 border border-slate-100 shadow-sm">
                        <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em] mb-10 flex items-center gap-4">
                            <FaMicrochip className="text-[#10367D]" />
                            Operational Overrides
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Maintenance Mode */}
                            <button
                                onClick={() => toggleSetting('maintenanceMode')}
                                className="p-8 bg-slate-50 rounded-[10px] border border-slate-100 space-y-4 text-left hover:bg-slate-100 transition-colors w-full"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black text-[#1E293B] uppercase tracking-widest">Maintenance Mode</h3>
                                    <div className={`w-10 h-5 rounded-full p-1 flex transition-all ${profile.maintenanceMode ? 'bg-[#10367D] justify-end' : 'bg-slate-300 justify-start'}`}>
                                        <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Kill-switch for public access. All non-admin routes will be redirected to splash.</p>
                            </button>

                            {/* Strict KYC */}
                            <button
                                onClick={() => toggleSetting('strictKYC')}
                                className="p-8 bg-slate-50 rounded-[10px] border border-slate-100 space-y-4 text-left hover:bg-slate-100 transition-colors w-full"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black text-[#1E293B] uppercase tracking-widest">Strict KYC Gate</h3>
                                    <div className={`w-10 h-5 rounded-full p-1 flex transition-all ${profile.strictKYC ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                                        <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Require full document verification before any cart operations are allowed.</p>
                            </button>

                            {/* Escrow Hold */}
                            <button
                                onClick={() => toggleSetting('escrowHold')}
                                className="p-8 bg-slate-50 rounded-[10px] border border-slate-100 space-y-4 text-left hover:bg-slate-100 transition-colors w-full"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black text-[#1E293B] uppercase tracking-widest">Escrow Hold-All</h3>
                                    <div className={`w-10 h-5 rounded-full p-1 flex transition-all ${profile.escrowHold ? 'bg-[#10367D] justify-end' : 'bg-slate-300 justify-start'}`}>
                                        <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Prevent automatic settlements for all entities till manual audit completion.</p>
                            </button>

                            {/* Debug Logging */}
                            <button
                                onClick={() => toggleSetting('debugLogging')}
                                className="p-8 bg-slate-50 rounded-[10px] border border-slate-100 space-y-4 text-left hover:bg-slate-100 transition-colors w-full"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black text-[#1E293B] uppercase tracking-widest">Debug Logging</h3>
                                    <div className={`w-10 h-5 rounded-full p-1 flex transition-all ${profile.debugLogging ? 'bg-[#10367D] justify-end' : 'bg-slate-300 justify-start'}`}>
                                        <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Enable high-verbosity logs in the Audit Persistence module.</p>
                            </button>
                        </div>
                    </div>

                    <div className="bg-rose-50 rounded-[10px] p-10 border border-rose-100 flex items-start gap-6">
                        <div className="w-14 h-14 rounded-[10px] bg-rose-500/10 flex items-center justify-center text-rose-600 flex-shrink-0">
                            <FaExclamationTriangle className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-rose-800 uppercase tracking-widest mb-2">Destructive Protocol Center</h4>
                            <p className="text-[11px] font-bold text-rose-700 leading-relaxed mb-6">These actions affect the fundamental platform state and cannot be undone without manual database intervention.</p>
                            <div className="flex gap-4">
                                <button onClick={() => toast.warning('Audit Buffer Flushed!')} className="px-6 py-3 bg-rose-600 text-white rounded-[10px] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 active:scale-95 transition-all">Flush Audit Buffer</button>
                                <button onClick={() => toast.warning('API Tokens Reset!')} className="px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-[10px] text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Reset All API Tokens</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* API & Cloud Settings */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#1E293B] rounded-[10px] p-10 text-white shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10367D]/10 blur-2xl rounded-full" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-10 opacity-60 flex items-center gap-3">
                            <FaNetworkWired className="w-4 h-4 text-[#10367D]" />
                            Cloud Handshake
                        </h3>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Escrow Gateway ID</label>
                                <div className="p-4 bg-white/5 rounded-[10px] border border-white/10 text-xs font-bold tracking-wider">
                                    RZP_LIVE_9901_ZAA
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Auth Salt Level</label>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-[10px] border border-white/10">
                                    <span className="text-xs font-bold text-[#10367D]">RATING: PARANOID</span>
                                    <FaShieldAlt className="w-4 h-4 text-emerald-500" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">System Version</label>
                                <div className="p-4 bg-white/5 rounded-[10px] border border-white/10 text-xs font-black text-[#10367D]">
                                    NovaMart Engine v4.8.2-Stable
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[10px] p-8 border border-slate-100">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Database Health</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-bold">
                                <span className="text-slate-400 uppercase tracking-widest">Indexing Efficiency</span>
                                <span className="text-emerald-500">99.8%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[99.8%]" />
                            </div>
                            <p className="text-[9px] font-medium text-slate-400 leading-relaxed italic">Last automated maintenance ran 4h ago during low throughput period.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

