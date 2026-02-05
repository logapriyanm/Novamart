'use client';

import React from 'react';
import { StatusBadge } from '../../../../src/components/ui/AdminUI';
import {
    Wallet,
    ArrowRight,
    Lock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

const escrows = [
    { id: 'ESC-99A', order: 'ORD-881', dealer: 'Mumbai Spares', manufacturer: 'TechSystems', amount: '$12,400.00', status: 'HOLD' },
    { id: 'ESC-99B', order: 'ORD-882', dealer: 'Delhi Logistics', manufacturer: 'SteelCorp', amount: '$5,900.00', status: 'HOLD' },
    { id: 'ESC-99C', order: 'ORD-880', dealer: 'Bangalore Hub', manufacturer: 'GreenBuild', amount: '$32,100.00', status: 'FROZEN' },
];

const EscrowManagement = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white">Escrow & Wallet Ledger</h1>
                <p className="text-slate-400 text-sm">Monitor platform-wide frozen funds and automated stakeholder payouts.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="glass p-6 border-l-4 border-l-blue-500">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1 font-mono">Total Under HOLD</p>
                    <p className="text-2xl font-bold text-slate-100">$3.14M</p>
                </div>
                <div className="glass p-6 border-l-4 border-l-rose-500">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1 font-mono">FROZEN (Disputed)</p>
                    <p className="text-2xl font-bold text-slate-100">$482K</p>
                </div>
                <div className="glass p-6 border-l-4 border-l-emerald-500">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1 font-mono">Total RELEASED (24h)</p>
                    <p className="text-2xl font-bold text-slate-100">$190K</p>
                </div>
                <div className="glass p-6 border-l-4 border-l-indigo-500">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1 font-mono">Processing Fee Earned</p>
                    <p className="text-2xl font-bold text-slate-100">$45.2K</p>
                </div>
            </div>

            <div className="glass overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Escrow ID / Order</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Stakeholders</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">State</th>
                            <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Settlement</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {escrows.map((item) => (
                            <tr key={item.id} className="hover:bg-white/[0.01]">
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-200">{item.id}</span>
                                        <span className="text-xs text-indigo-400 font-mono">#{item.order}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
                                        <span>{item.manufacturer}</span>
                                        <ArrowRight className="w-3 h-3" />
                                        <span>{item.dealer}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 font-bold text-slate-200">{item.amount}</td>
                                <td className="px-8 py-6">
                                    <StatusBadge status={item.status} />
                                </td>
                                <td className="px-8 py-6 text-right">
                                    {item.status === 'HOLD' ? (
                                        <button className="flex items-center gap-2 px-3 py-1.5 ml-auto bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 rounded-lg text-[10px] font-bold uppercase transition-all">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Release
                                        </button>
                                    ) : (
                                        <button className="flex items-center gap-2 px-3 py-1.5 ml-auto bg-white/5 border border-white/10 hover:border-rose-500/50 hover:text-rose-400 rounded-lg text-[10px] font-bold uppercase transition-all">
                                            <Lock className="w-3 h-3" />
                                            Frozen
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EscrowManagement;
