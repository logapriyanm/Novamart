'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaUsers,
    FaStore,
    FaArrowLeft,
    FaChartLine,
    FaBoxOpen,
    FaChevronRight,
    FaStar,
    FaShieldAlt,
    FaHistory
} from 'react-icons/fa';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';

export default function DealerRelationshipPortal() {
    const [approvedDealers, setApprovedDealers] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchDealers = async () => {
            try {
                // Endpoint confirmed in manufacturerRoutes.js: router.get('/network', ...)
                const data = await apiClient.get<any[]>('/manufacturer/network');
                const mapped = data.map(d => ({
                    id: d.id,
                    name: d.businessName,
                    location: `${d.city || 'Unknown'}, ${d.state || ''}`,
                    volume: '₹0.0L', // Placeholder
                    returns: '0%', // Placeholder
                    rating: d.averageRating || 5.0,
                    status: d.isVerified ? 'Active' : 'Pending'
                }));
                setApprovedDealers(mapped);
            } catch (error) {
                console.error('Failed to fetch dealers', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDealers();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/manufacturer" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Command Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Dealer <span className="text-[#10367D]">Network</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Authorized Distribution & Partner Governance</p>
                    </div>
                </div>
            </div>

            {/* Network Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#1E293B] rounded-[10px] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#10367D]/10 blur-2xl rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 opacity-60 flex items-center gap-3">
                        <FaStore className="w-4 h-4 text-[#10367D]" />
                        Active Outlets
                    </h3>
                    <div className="space-y-4">
                        <p className="text-4xl font-black">42</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pan-India Network</p>
                    </div>
                </div>

                <div className="bg-white rounded-[10px] p-10 border border-slate-100 shadow-sm flex flex-col justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                        <FaChartLine className="w-4 h-4 text-emerald-500" />
                        Network Throughput
                    </h3>
                    <div>
                        <p className="text-4xl font-black text-[#1E293B]">₹84.2L</p>
                        <p className="text-[10px] font-black text-[#10367D] uppercase tracking-widest mt-2">Cumulative Supply Volume</p>
                    </div>
                </div>

                <div className="bg-white rounded-[10px] p-10 border border-slate-100 shadow-sm flex flex-col justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                        <FaStar className="w-4 h-4 text-amber-500" />
                        Ecosystem Trust
                    </h3>
                    <div>
                        <p className="text-4xl font-black text-[#1E293B]">4.85</p>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-2">Avg Partner Rating</p>
                    </div>
                </div>
            </div>

            {/* Dealer Directory */}
            <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Authorized Dealer Ledger</h2>
                    <div className="flex items-center gap-3 text-[10px] font-black text-[#10367D] uppercase tracking-widest">
                        <FaShieldAlt /> System Audited
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dealer Entity</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">B2B Volume</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Return Index</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {approvedDealers.map((dealer) => (
                                <tr key={dealer.id} className="hover:bg-slate-50 group transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-[10px] bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#10367D] group-hover:text-white transition-all">
                                                <FaStore className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-[#1E293B]">{dealer.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{dealer.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-xs font-bold text-slate-600">{dealer.location}</span>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <p className="text-sm font-black text-[#1E293B]">{dealer.volume}</p>
                                        <p className="text-[8px] font-bold text-emerald-600 uppercase mt-0.5">High Performance</p>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <span className={`text-xs font-black ${parseFloat(dealer.returns) > 1 ? 'text-rose-500' : 'text-emerald-500'}`}>{dealer.returns}</span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button className="w-10 h-10 rounded-[10px] bg-[#10367D]/5 text-[#10367D] flex items-center justify-center hover:bg-[#10367D] hover:text-white transition-all ml-auto focus:shadow-lg">
                                            <FaChevronRight className="w-3 h-3" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-10 border-t border-slate-50 bg-[#10367D]/5 flex justify-center">
                    <p className="text-[10px] font-black text-[#10367D] uppercase tracking-[0.2em] flex items-center gap-3">
                        <FaHistory />
                        Historical Supply Data Indexed for Active Entities
                    </p>
                </div>
            </div>
        </div>
    );
}
