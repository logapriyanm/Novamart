'use client';

import React from 'react';
import { StatusBadge } from '../../../../src/components/ui/AdminUI';
import {
    ShieldAlert,
    Activity,
    UserX,
    Zap,
    Fingerprint
} from 'lucide-react';

const risks = [
    { id: '1', target: 'Mumbai Spares', signal: 'Multi-IP Login', severity: 'HIGH', status: 'PENDING' },
    { id: '2', target: 'John Doe', signal: 'Rapid Dispute Cycle', severity: 'MEDIUM', status: 'ACTIVE' },
];

const FraudRisk = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white">Fraud & Risk Engine</h1>
                <p className="text-slate-400 text-sm">Automated signal detection and manual intervention for platform security.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-8 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-rose-400 font-bold uppercase tracking-widest text-xs">
                        <ShieldAlert className="w-5 h-5" />
                        Critical Risk Signals
                    </div>
                    {risks.map((risk) => (
                        <div key={risk.id} className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-between group cursor-pointer hover:bg-rose-500/10 transition-all">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-100">{risk.signal}</span>
                                <span className="text-xs text-slate-500">Target: {risk.target}</span>
                            </div>
                            <StatusBadge status={risk.severity} />
                        </div>
                    ))}
                </div>

                <div className="glass p-8 flex flex-col gap-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-400" />
                        Automated Restrictions
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-200">Force MFA for Dealers</span>
                                <span className="text-xs text-slate-500">Applied on high-value transfers</span>
                            </div>
                            <div className="w-10 h-5 bg-indigo-500 rounded-full flex items-center px-1"><div className="w-3 h-3 bg-white rounded-full ml-auto" /></div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-200">AI Pattern Detection</span>
                                <span className="text-xs text-slate-500">Real-time behavior analysis</span>
                            </div>
                            <div className="w-10 h-5 bg-indigo-500 rounded-full flex items-center px-1"><div className="w-3 h-3 bg-white rounded-full ml-auto" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FraudRisk;
