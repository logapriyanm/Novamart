'use client';

import React, { useState, useEffect } from 'react';
import {
    FaPercentage,
    FaBalanceScale,
    FaShieldAlt,
    FaExclamationCircle,
    FaArrowLeft,
    FaArrowUp,
    FaArrowDown,
    FaSave,
    FaSync,
    FaSpinner
} from 'react-icons/fa';
import Link from 'next/link';

export default function PricingGovernancePanel() {
    const [isSaving, setIsSaving] = useState(false);
    const [rules, setRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/admin/margin-rules', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setRules(data.data || []);
                }
            } catch (err) {
                console.error('Failed to fetch margin rules');
            } finally {
                setLoading(false);
            }
        };
        fetchRules();
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1200);
    };

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
                        <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight uppercase italic">Economic <span className="text-[#067FF9]">Governance</span></h1>
                        <p className="text-slate-400 font-medium text-sm mt-1">Commission Protocols & Fee Structures</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 bg-[#067FF9] text-white text-sm font-black rounded-[10px] shadow-xl shadow-[#067FF9]/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-3"
                    >
                        {isSaving ? (
                            <>
                                <FaSync className="w-3 h-3 animate-spin" />
                                Synchronizing...
                            </>
                        ) : (
                            <>
                                Push Global Updates
                                <FaSave className="w-3 h-3" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Global Overrides */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1E293B] rounded-[10px] p-10 text-white shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#067FF9]/20 blur-2xl rounded-full" />
                        <h3 className="text-sm font-black tracking-[0.2em] mb-8 opacity-60 flex items-center gap-3 italic">
                            <FaShieldAlt className="w-4 h-4" />
                            Safety Limits
                        </h3>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-sm font-black text-slate-400">Hard Margin Ceiling</label>
                                <div className="flex items-center justify-between p-5 bg-white/5 rounded-[10px] border border-white/10">
                                    <span className="text-2xl font-black">50%</span>
                                    <div className="flex flex-col gap-1">
                                        <button className="text-slate-400 hover:text-white"><FaArrowUp className="w-3 h-3" /></button>
                                        <button className="text-slate-400 hover:text-white"><FaArrowDown className="w-3 h-3" /></button>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed">System will auto-reject any SKU crossing this retail margin.</p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-black text-slate-400">Global Min Price Floor</label>
                                <div className="flex items-center justify-between p-5 bg-white/5 rounded-[10px] border border-white/10">
                                    <span className="text-2xl font-black">₹49</span>
                                    <div className="flex flex-col gap-1">
                                        <button className="text-slate-400 hover:text-white"><FaArrowUp className="w-3 h-3" /></button>
                                        <button className="text-slate-400 hover:text-white"><FaArrowDown className="w-3 h-3" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-[10px] p-8 border border-amber-100 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-[10px] bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
                            <FaExclamationCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-amber-800 mb-1">Protection Notice</h4>
                            <p className="text-xs font-medium text-amber-700 leading-relaxed">Updates to tax slabs will trigger an immediate recalculation of all pending inventory in the product approval queue.</p>
                        </div>
                    </div>
                </div>

                {/* Category Rules Table */}
                <div className="lg:col-span-2 bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 lg:p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-black text-[#1E293B]">Category-Specific Rules</h2>
                            <p className="text-sm font-black text-slate-400 mt-1">Granular Control by Industry Type</p>
                        </div>
                        <button className="px-5 py-2.5 bg-white border border-[#067FF9]/10 text-[#067FF9] text-sm font-black rounded-[10px] hover:bg-[#067FF9] hover:text-white transition-all">Add Category Rule</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50 bg-white">
                                    <th className="px-10 py-5 text-sm font-black text-slate-400">Category</th>
                                    <th className="px-10 py-5 text-sm font-black text-slate-400 text-center">Max Margin</th>
                                    <th className="px-10 py-5 text-sm font-black text-slate-400 text-center">Price Floor</th>
                                    <th className="px-10 py-5 text-sm font-black text-slate-400 text-center">GST Slab</th>
                                    <th className="px-10 py-5 text-sm font-black text-slate-400 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-10 py-12 text-center">
                                        <FaSpinner className="w-5 h-5 animate-spin text-slate-300 mx-auto" />
                                    </td></tr>
                                ) : rules.length === 0 ? (
                                    <tr><td colSpan={5} className="px-10 py-12 text-center text-sm font-bold text-slate-300">
                                        No margin rules configured yet
                                    </td></tr>
                                ) : (
                                    rules.map((rule) => (
                                        <tr key={rule._id || rule.id} className="hover:bg-slate-50 group transition-colors">
                                            <td className="px-10 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-[#1E293B]">{rule.category}</span>
                                                    <span className="text-xs font-bold text-slate-400 mt-1">{rule._id?.slice(-6) || ''}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className="px-3 py-1 bg-blue-50 text-[#067FF9] rounded-[10px] text-sm font-black">{rule.maxCap || rule.maxMargin}%</span>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className="text-sm font-bold text-[#1E293B]">₹{rule.minPriceFloor || '—'}</span>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className="text-sm font-black text-slate-400">{rule.taxSlab || '—'}</span>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black tracking-wider ${rule.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    {rule.isActive !== false ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-10 border-t border-slate-50 bg-slate-50/30 flex justify-center">
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                            <FaBalanceScale className="text-[#067FF9]" />
                            NovaMart Governance Protocol v4.0 • Compliant with GOI Tax Standards
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
