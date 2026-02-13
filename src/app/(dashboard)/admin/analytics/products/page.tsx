'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaExclamationTriangle,
    FaFilter,
    FaGavel,
    FaInfoCircle,
    FaCheckCircle
} from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';

export default function AdminPerformanceMonitor() {
    const [performanceData, setPerformanceData] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchPerformance = async () => {
            try {
                // Fetch products with analytics/risk flags
                const data = await apiClient.get<any[]>('/analytics/admin/quality-audit');
                setPerformanceData(data || []);
            } catch (error) {
                console.error('Failed to fetch performance data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPerformance();
    }, []);

    // Calculate stats dynamic from performanceData
    const avgReturn = performanceData.length
        ? (performanceData.reduce((acc, curr) => acc + parseFloat(curr.returnRate), 0) / performanceData.length).toFixed(1) + '%'
        : '0%';

    const stableCount = performanceData.filter(p => p.status === 'STABLE').length;
    const compliance = performanceData.length
        ? ((stableCount / performanceData.length) * 100).toFixed(1) + '%'
        : '100%';

    const stats = [
        { l: 'Avg Return Rate', v: avgReturn, c: 'text-[#10367D]', b: 'bg-blue-50' },
        { l: 'Quality Compliance', v: compliance, c: 'text-emerald-600', b: 'bg-emerald-50' },
        { l: 'Resolution Speed', v: '4.2h', c: 'text-indigo-600', b: 'bg-indigo-50' }, // Mock for now
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase italic">Ecosystem <span className="text-[#10367D]">Intel</span></h1>
                    <p className="text-slate-400 font-bold text-sm mt-1">Platform Performance Oversight & Governance Audits</p>
                </div>
                <div className="flex items-center gap-4 bg-white border border-slate-100 p-2 rounded-[10px]">
                    <div className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-[10px]">
                        <p className="text-sm font-bold text-rose-500">High Risk Alerts</p>
                        <p className="text-sm font-bold text-rose-600">
                            {performanceData.filter(p => p.status === 'AT_RISK').length.toString().padStart(2, '0')} Asset Flags
                        </p>
                    </div>
                </div>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((s, i) => (
                    <div key={i} className={`p-10 rounded-[10px] border border-slate-100 shadow-sm ${s.b}`}>
                        <p className="text-sm font-bold text-slate-400 mb-3">{s.l}</p>
                        <p className={`text-4xl font-black ${s.c}`}>{s.v}</p>
                        <div className="h-1.5 w-full bg-white/50 rounded-full mt-6 overflow-hidden">
                            <div className={`h-full ${s.c.replace('text', 'bg')}`} style={{ width: '70%' }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Risk Terminal */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                <div className="xl:col-span-8 bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-[#1E293B] flex items-center gap-3">
                            <FaExclamationTriangle className="text-amber-500" /> Quality Audit Queue
                        </h2>
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-[10px] hover:text-[#10367D] transition-colors">
                            <FaFilter className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-sm font-bold text-slate-400 border-b border-slate-50">
                                <tr>
                                    <th className="px-10 py-6">Asset Identity</th>
                                    <th className="px-10 py-6">Performance</th>
                                    <th className="px-10 py-6">Risk Quotient</th>
                                    <th className="px-10 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    <tr><td colSpan={4} className="p-10 text-center animate-pulse">Scanning ecosystem units...</td></tr>
                                ) : performanceData.length === 0 ? (
                                    <tr><td colSpan={4} className="p-20 text-center italic text-slate-400 text-sm font-bold">No quality flags detected. Ecosystem stable.</td></tr>
                                ) : performanceData.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50/30 transition-all">
                                        <td className="px-10 py-8">
                                            <h4 className="text-sm font-bold text-[#1E293B]">{item.name}</h4>
                                            <p className="text-sm text-slate-400 mt-1">{item.id}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-[#1E293B]">{item.returnRate || '0%'} Returns</p>
                                                <p className="text-sm text-slate-400">{item.complaints || 0} Escalations</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`text-sm font-bold px-4 py-1.5 rounded-full border ${item.status === 'STABLE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button className="px-6 py-2.5 bg-[#1E293B] text-white text-sm font-bold rounded-[10px] hover:scale-105 transition-all shadow-lg shadow-[#1E293B]/20">
                                                Audit History
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Delisting Control Sidebar */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="p-10 bg-[#1E293B] rounded-[10px] text-white space-y-10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent pointer-events-none" />
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-3">
                            <FaGavel className="text-rose-500" /> Governance Controls
                        </h3>
                        <div className="space-y-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-[10px] group-hover:border-rose-500/30 transition-all">
                                <p className="text-sm font-bold text-slate-500 mb-1">Delist Product</p>
                                <p className="text-sm text-slate-500 leading-relaxed">Instantly remove asset from marketplace. Notifies all dealers holding stock.</p>
                                <button className="mt-4 px-6 py-3 bg-rose-500 text-white text-sm font-bold rounded-[10px] hover:scale-105 transition-all w-full">Execute Delisting</button>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-[10px] group-hover:border-amber-500/30 transition-all">
                                <p className="text-sm font-bold text-slate-500 mb-1">Issue Correction</p>
                                <p className="text-sm text-slate-500 leading-relaxed">Force specs update for all retail listings. Manufacturer re-audit required.</p>
                                <button className="mt-4 px-6 py-3 bg-amber-500 text-[#1E293B] text-sm font-bold rounded-[10px] hover:scale-105 transition-all w-full">Request Correction</button>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-slate-50 border border-slate-100 rounded-[10px] space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-[10px] bg-white border border-slate-200 flex items-center justify-center text-[#10367D] shadow-sm">
                                <FaInfoCircle className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-[#1E293B]">Auto-Delist Triggers</h4>
                        </div>
                        <ul className="space-y-4">
                            {[
                                { t: 'Return Rate > 12%', v: 'Critical Threshold' },
                                { t: 'Unresolved Disputes > 5', v: 'Safety Risk' },
                                { t: 'Specs Mismatch Reports', v: 'Legal Threshold' },
                            ].map((p, i) => (
                                <li key={i} className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <span className="text-sm font-medium text-slate-400">{p.t}</span>
                                    <span className="text-sm font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">{p.v}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
