'use client';

import React, { useEffect, useState } from 'react';
import {
    FaHistory,
    FaSearch,
    FaArrowLeft,
    FaCheckCircle,
    FaInfoCircle,
    FaUserShield,
    FaGavel,
    FaFilter,
    FaTerminal,
    FaSpinner
} from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminService } from '@/lib/api/services/admin.service';
import Loader from '@/client/components/ui/Loader';

export default function AuditLogsPanel() {
    const [auditEntries, setAuditEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAuditLogs();
            setAuditEntries(data || []);
        } catch (error) {
            console.error('Failed to fetch audit logs');
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (action: string) => {
        if (!action) return FaInfoCircle;
        if (action.includes('USER')) return FaUserShield;
        if (action.includes('PRODUCT')) return FaGavel;
        if (action.includes('CMS')) return FaTerminal;
        return FaInfoCircle;
    };

    const getColor = (action: string) => {
        if (!action) return 'text-blue-500';
        if (action.includes('REJECT') || action.includes('DELETE')) return 'text-rose-500';
        if (action.includes('APPROVE') || action.includes('VERIFY')) return 'text-emerald-500';
        return 'text-blue-500';
    };

    const filteredLogs = auditEntries.filter(log =>
        log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.role || log.actorRole)?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="flex items-center gap-2 text-sm font-black text-[#067FF9] hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Mission Control
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight uppercase italic">Audit <span className="text-[#067FF9]">Persistence</span></h1>
                        <p className="text-slate-400 font-medium text-sm mt-1">Immutable Administrative Action Records</p>
                    </div>
                </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 lg:p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <h2 className="text-sm font-black text-[#1E293B] flex items-center gap-3">
                        <FaHistory className="text-[#067FF9]" />
                        System Audit Stream
                    </h2>
                    <div className="relative w-80">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                        <input
                            type="text"
                            placeholder="Filter by Action or Role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-100 rounded-[10px] py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-[#067FF9]/30"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-white">
                                <th className="px-10 py-5 text-sm font-black text-slate-400">Protocol ID</th>
                                <th className="px-10 py-5 text-sm font-black text-slate-400">Governor Action</th>
                                <th className="px-10 py-5 text-sm font-black text-slate-400">Actor Role</th>
                                <th className="px-10 py-5 text-sm font-black text-slate-400">Timestamp</th>
                                <th className="px-10 py-5 text-sm font-black text-slate-400 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <td colSpan={5} className="px-10 py-20 text-center">
                                    <div className="flex justify-center">
                                        <Loader size="lg" variant="primary" />
                                    </div>
                                </td>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center text-slate-400 font-bold text-sm">
                                        No audit records found
                                    </td>
                                </tr>
                            ) : filteredLogs.map((log) => {
                                const Icon = getIcon(log.action);
                                return (
                                    <tr key={log._id} className="hover:bg-slate-50 group transition-colors">
                                        <td className="px-10 py-6">
                                            <span className="text-sm font-black text-[#067FF9] tracking-wider">{(log._id || log.id)?.slice(-8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-[10px] bg-slate-100 flex items-center justify-center ${getColor(log.action)}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#1E293B] leading-none">{log.action}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-sm font-bold text-[#1E293B]">{log.role || log.actorRole || 'UNKNOWN'}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-600">{new Date(log.createdAt).toLocaleDateString()}</span>
                                                <span className="text-sm font-black text-[#067FF9] opacity-40">{new Date(log.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <span className="text-sm font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-[10px] border border-slate-100 truncate max-w-[200px] inline-block">
                                                {JSON.stringify(log.details)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 lg:p-10 border-t border-slate-50 bg-[#067FF9]/5 flex items-center justify-between">
                    <p className="text-sm font-black text-[#067FF9] flex items-center gap-3">
                        <FaCheckCircle className="animate-pulse" />
                        Log Persistence Engine Verified • SEC/FINRA Style Audit Ready
                    </p>
                </div>
            </div>
        </div>
    );
}
