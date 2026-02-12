'use client';

import React from 'react';
import Link from 'next/link';
import {
    Handshake,
    Package,
    UserPlus,
    ArrowRight,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

interface B2BAction {
    label: string;
    count: number;
    link: string;
    icon: string;
}

interface B2BShortcutsProps {
    metrics: {
        role: 'DEALER' | 'MANUFACTURER';
        actions: B2BAction[];
    };
}

const iconMap: Record<string, any> = {
    Negotiate: Handshake,
    Package: Package,
    UserPlus: UserPlus,
};

import { useAuth } from '@/client/hooks/useAuth';

export default function B2BShortcuts({ metrics }: B2BShortcutsProps) {
    const { user } = useAuth();
    if (!user || !metrics) return null;

    const isManufacturer = metrics.role === 'MANUFACTURER';

    return (
        <section className="relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-[#FF5733]/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 -z-10 w-72 h-72 bg-blue-500/5 blur-[80px] rounded-full" />

            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <span className="w-2 h-8 bg-[#FF5733] rounded-full inline-block" />
                        {isManufacturer ? 'Manufacturer Control Center' : 'Dealer Procurement Hub'}
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium italic">
                        {isManufacturer ? 'Monitor your network and active negotiations' : 'Manage allocations and source products efficiently'}
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    <ShieldCheck className="w-4 h-4 text-[#FF5733]" />
                    NovaMart Verified {metrics.role}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {metrics.actions.map((action, idx) => {
                    const Icon = iconMap[action.icon] || TrendingUp;
                    return (
                        <motion.div
                            key={action.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link
                                href={action.link}
                                className="group relative flex items-center justify-between p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-[#FF5733]/30 transition-all duration-500 overflow-hidden"
                            >
                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF5733]/5 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000" />

                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FF5733]/10 transition-all duration-500">
                                        <Icon className="w-8 h-8 text-slate-800 group-hover:text-[#FF5733] transition-colors" />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                                            {action.label}
                                        </span>
                                        <span className="block text-3xl font-black text-slate-900 group-hover:text-[#FF5733] transition-colors">
                                            {action.count || 0}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">View Details</span>
                                        <div className="w-8 h-1 bg-slate-100 group-hover:w-full group-hover:bg-[#FF5733] transition-all duration-500" />
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-[#FF5733] group-hover:border-[#FF5733] group-hover:rotate-[-45deg] transition-all duration-500">
                                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
