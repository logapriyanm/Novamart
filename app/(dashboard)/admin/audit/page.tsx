'use client';

import React from 'react';
import { StatusBadge } from '../../../../src/components/ui/AdminUI';
import {
    FaHistory as History,
    FaSearch as Search,
    FaShieldAlt as Shield,
    FaUser as User,
    FaExternalLinkAlt as ExternalLink
} from 'react-icons/fa';

const logs = [
    { id: '1', admin: 'Super Admin', action: 'APPROVE_PRODUCT', entity: 'PRODUCT', entityId: 'P-101', time: '2 mins ago' },
    { id: '2', admin: 'Ops Admin', action: 'SUSPEND_USER', entity: 'USER', entityId: 'U-209', time: '15 mins ago' },
    { id: '3', admin: 'Finance Admin', action: 'RELEASE_ESCROW', entity: 'ESCROW', entityId: 'E-554', time: '1 hour ago' },
];

const AuditLogs = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white">Immutable Audit Logs</h1>
                    <p className="text-slate-400 text-sm">Full traceability of every administrative action in the system.</p>
                </div>
                <div className="flex px-4 py-2 transparent-indigo text-[10px] font-bold tracking-widest text-indigo-400 uppercase border border-indigo-500/20 rounded-full items-center gap-2">
                    <Shield className="w-3 h-3" />
                    Tamper-Proof Ledger
                </div>
            </div>

            <div className="glass overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Filter by admin or action..."
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all text-slate-300"
                        />
                    </div>
                </div>

                <div className="divide-y divide-white/5 text-sm">
                    {logs.map((log) => (
                        <div key={log.id} className="flex items-center gap-6 p-6 hover:bg-white/[0.02] transition-colors">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-bold text-slate-200">{log.admin}</span>
                                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{log.action}</span>
                                </div>
                                <p className="text-xs text-slate-500">Modified {log.entity} <span className="text-indigo-400 font-mono">#{log.entityId}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-600 font-black uppercase mb-1">{log.time}</p>
                                <button className="text-[10px] text-indigo-400 font-bold hover:underline flex items-center gap-1">View Delta <ExternalLink className="w-3 h-3" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
