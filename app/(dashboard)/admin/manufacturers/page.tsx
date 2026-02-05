'use client';

import React from 'react';
import { StatusBadge } from '../../../../src/components/ui/AdminUI';
import {
    Factory,
    MapPin,
    Package,
    Globe,
    CheckCircle,
    XCircle
} from 'lucide-react';

const manufacturers = [
    { id: 'M-001', name: 'Precision Parts Corp', region: 'North America', status: 'ACTIVE', products: 12, quality: '98%' },
    { id: 'M-002', name: 'Shenzhen Tech Spares', region: 'Asia Pacific', status: 'UNDER_VERIFICATION', products: 45, quality: '99%' },
];

const Manufacturers = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white">Manufacturer Hub</h1>
                <p className="text-slate-400 text-sm">Oversee global manufacturing partners and verify factory-direct compliance.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {manufacturers.map((mfg) => (
                    <div key={mfg.id} className="glass p-8 flex flex-col md:flex-row md:items-center gap-8 group hover:border-indigo-500/20 transition-all">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <Factory className="w-8 h-8" />
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-slate-100">{mfg.name}</h3>
                                <StatusBadge status={mfg.status} />
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {mfg.region}</span>
                                <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {mfg.products} Catalog Items</span>
                                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Global Tier 1</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 border-l border-white/5 pl-8">
                            <div className="text-center">
                                <p className="text-[10px] text-slate-600 uppercase font-black mb-1">Quality Rating</p>
                                <p className="text-xl font-bold text-emerald-400">{mfg.quality}</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button className="px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">Manage</button>
                                {mfg.status === 'UNDER_VERIFICATION' && (
                                    <button className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><CheckCircle className="w-5 h-5" /></button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Manufacturers;
