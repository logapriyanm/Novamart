'use client';

import React from 'react';
import { StatusBadge } from '../../../../src/components/ui/AdminUI';
import {
    MoreVertical,
    Search,
    Filter,
    Download,
    AlertCircle
} from 'lucide-react';

const users = [
    { id: '1', name: 'Global Manufacturing Inc.', email: 'admin@globalmfg.com', role: 'MANUFACTURER', status: 'ACTIVE', risk: 'Low' },
    { id: '2', name: 'Regional Tech Spares', email: 'sales@techspares.in', role: 'DEALER', status: 'PENDING', risk: 'Medium' },
    { id: '3', name: 'Apex Logistics Ltd.', email: 'gov@apex.com', role: 'MANUFACTURER', status: 'SUSPENDED', risk: 'High' },
    { id: '4', name: 'John Doe', email: 'john@example.com', role: 'CUSTOMER', status: 'ACTIVE', risk: 'Low' },
];

const UserManagement = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-[#2772A0]">User Management</h1>
                    <p className="text-[#1E293B]/60 text-xs lg:text-sm font-medium">Review, verify, and moderate all platform participants.</p>
                </div>
                <div className="flex flex-wrap gap-2 lg:gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none justify-center bg-white/40 border border-[#2772A0]/10 flex items-center gap-2 px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold text-[#2772A0] hover:bg-white/60 rounded-xl transition-all shadow-sm">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <button className="flex-1 sm:flex-none justify-center bg-[#2772A0] text-[#CCDDEA] flex items-center gap-2 px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold hover:bg-[#1E5F86] rounded-xl transition-all shadow-lg shadow-[#2772A0]/20">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            <div className="bg-white/40 border border-[#2772A0]/10 rounded-3xl overflow-hidden backdrop-blur-md">
                <div className="p-4 lg:p-6 border-b border-[#2772A0]/10 bg-white/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2772A0]/60" />
                        <input
                            type="text"
                            placeholder="Search entities..."
                            className="w-full bg-white/40 border border-[#2772A0]/10 rounded-xl py-2 pl-10 pr-4 text-xs lg:text-sm focus:outline-none focus:border-[#2772A0]/50 transition-all text-[#1E293B]"
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="text-[9px] lg:text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            12 Pending
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-[#2772A0]/10 bg-[#2772A0]/5">
                                <th className="px-6 py-4 text-[10px] font-bold text-[#2772A0]/60 uppercase tracking-wider">Entity / Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#2772A0]/60 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#2772A0]/60 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#2772A0]/60 uppercase tracking-wider">Risk Score</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#2772A0]/60 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2772A0]/5">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#1E293B] group-hover:text-[#2772A0] transition-colors">{user.name}</span>
                                            <span className="text-xs text-[#2772A0]/60 font-medium">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold text-[#2772A0] px-2 py-0.5 bg-[#2772A0]/5 rounded border border-[#2772A0]/10 uppercase tracking-tighter">{user.role}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={user.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.risk === 'Low' ? 'bg-emerald-500' :
                                                user.risk === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
                                                }`} />
                                            <span className="text-xs font-bold text-[#1E293B]/70">{user.risk}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-[#2772A0]/10 rounded-lg text-[#2772A0]/40 hover:text-[#2772A0] transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                            {user.status === 'PENDING' && (
                                                <button className="bg-[#2772A0] text-[#CCDDEA] text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#1E5F86] transition-all uppercase tracking-widest active:scale-95">Verify</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="p-4 border-t border-[#2772A0]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] lg:text-[10px] font-bold text-[#2772A0]/60 uppercase tracking-wider bg-white/20">
                        <span>Showing 4 of 2,840 users</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 rounded-lg bg-white/40 border border-[#2772A0]/10 hover:bg-white/60 disabled:opacity-50" disabled>Previous</button>
                            <button className="px-3 py-1.5 rounded-lg bg-white/40 border border-[#2772A0]/10 hover:bg-white/60">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
