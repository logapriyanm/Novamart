'use client';

import React from 'react';
import { StatusBadge } from '../../../../src/components/ui/AdminUI';
import {
    Percent,
    Map,
    Plus,
    Save,
    CheckCircle,
    FileText
} from 'lucide-react';

const MarginTaxRules = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white">Governance Rules</h1>
                    <p className="text-slate-400 text-sm">Configure platform-wide margins, taxation, and SLA enforcement rules.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">
                    <Plus className="w-4 h-4" />
                    New Governance Rule
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Margin Rules Table */}
                <div className="glass p-8 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Percent className="w-6 h-6 text-indigo-400" />
                        Category Margin Caps
                    </h3>
                    <div className="space-y-4">
                        {['Electronics', 'Industrial Parts', 'Healthcare'].map((cat) => (
                            <div key={cat} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-slate-600"><FileText className="w-5 h-5" /></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-200">{cat}</span>
                                        <span className="text-[10px] text-slate-500 uppercase font-black">Admin Cap: 15%</span>
                                    </div>
                                </div>
                                <input type="text" defaultValue="5.0%" className="w-16 bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-center text-indigo-400 font-bold focus:outline-none focus:border-indigo-500" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tax Rules */}
                <div className="glass p-8 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Map className="w-6 h-6 text-emerald-400" />
                        Regional Tax Slabs
                    </h3>
                    <div className="space-y-4">
                        {['India (GST)', 'Germany (VAT)', 'USA (Sales Tax)'].map((reg) => (
                            <div key={reg} className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-slate-200">{reg}</span>
                                    <StatusBadge status="ACTIVE" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1 p-2 bg-slate-950/50 rounded text-center">
                                        <p className="text-[10px] text-slate-600 font-black uppercase">Standard</p>
                                        <p className="text-sm font-bold text-emerald-400">18%</p>
                                    </div>
                                    <div className="flex-1 p-2 bg-slate-950/50 rounded text-center">
                                        <p className="text-[10px] text-slate-600 font-black uppercase">Reduced</p>
                                        <p className="text-sm font-bold text-amber-400">5%</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarginTaxRules;
