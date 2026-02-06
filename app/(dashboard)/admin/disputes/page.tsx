'use client';

import React from 'react';
import { StatusBadge } from '../../../../src/components/ui/AdminUI';
import {
    FaShieldAlt as ShieldAlert,
    FaMapMarkerAlt as MapPin,
    FaCommentAlt as MessageSquare,
    FaBalanceScale as Scale,
    FaGavel as Hammer
} from 'react-icons/fa';

const disputes = [
    { id: 'DIS-001', order: 'ORD-1229', parties: 'SteelCorp vs Global Dealer', type: 'Quality Mismatch', amount: '$4,500.00', status: 'DISPUTED' },
    { id: 'DIS-002', order: 'ORD-1230', parties: 'TechSystems vs Mumbai Spares', type: 'Delayed Delivery', amount: '$12,000.00', status: 'UNDER_VERIFICATION' },
];

const Disputes = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white">Dispute Resolution Center</h1>
                <p className="text-slate-400 text-sm">Evidence-based mediation between manufacturers, dealers, and customers.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {disputes.map((dispute) => (
                    <div key={dispute.id} className="glass p-8 flex flex-col md:flex-row md:items-center gap-8 group hover:border-indigo-500/20 transition-all">
                        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <ShieldAlert className="w-8 h-8" />
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-slate-100">{dispute.parties}</h3>
                                <StatusBadge status={dispute.status} />
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                                <span className="flex items-center gap-1 font-mono text-indigo-400">Order #{dispute.order}</span>
                                <span className="flex items-center gap-1 text-rose-400"><Scale className="w-3 h-3" /> {dispute.type}</span>
                                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 12 Evidence Uploads</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 border-l border-white/5 pl-8">
                            <div className="text-center">
                                <p className="text-[10px] text-slate-600 uppercase font-black mb-1">Frozen Funds</p>
                                <p className="text-xl font-bold text-slate-100">{dispute.amount}</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">
                                    <Hammer className="w-4 h-4" />
                                    Mediate
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Disputes;
