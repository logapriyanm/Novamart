'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaComments, FaIndustry, FaClock,
    FaCheckCircle, FaTimesCircle, FaArrowRight, FaPaperPlane, FaTimes
} from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import Loader from '@/client/components/ui/Loader';

export default function SellerNegotiations() {
    // const { showSnackbar } = useSnackbar();
    const [negotiations, setNegotiations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');

    useEffect(() => {
        fetchNegotiations();
    }, []);

    const fetchNegotiations = async () => {
        setLoading(true);
        try {
            const data = await apiClient.get<any>('/negotiation');
            setNegotiations(data || []);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load negotiations');
        } finally {
            setLoading(false);
        }
    };

    const filteredNegotiations = negotiations.filter(neg =>
        filterStatus === 'ALL' || neg.status === filterStatus
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-[#1E293B]">
                    My <span className="text-[#0F6CBD]">Negotiations</span>
                </h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                    Active price negotiations with manufacturers
                </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 border-b border-slate-200">
                {['ALL', 'REQUESTED', 'NEGOTIATING', 'ACCEPTED', 'DEAL_CLOSED'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-colors ${filterStatus === status ? 'text-[#0F6CBD]' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {status}
                        {filterStatus === status && (
                            <motion.div
                                layoutId="negotiation-tab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F6CBD]"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Negotiations List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader size="lg" variant="primary" />
                </div>
            ) : filteredNegotiations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[10px] border border-dashed border-slate-200">
                    <FaComments className="w-12 h-12 text-slate-100 mb-4" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        No {filterStatus.toLowerCase()} negotiations found
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredNegotiations.map((negotiation) => (
                        <motion.div
                            key={negotiation._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[10px] border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-[10px] flex items-center justify-center">
                                        <FaIndustry className="text-[#0F6CBD] text-2xl" />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-black text-slate-800">
                                            {negotiation.manufacturerId?.companyName || 'Unknown Manufacturer'}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-bold mt-1 flex items-center gap-2">
                                            <MdOutlineProductionQuantityLimits className="w-3 h-3" />
                                            {negotiation.productId?.name || 'Unknown Product'}
                                        </p>

                                        <div className="flex items-center gap-4 mt-3 text-xs font-bold text-slate-600">
                                            <span>{negotiation.quantity} units</span>
                                            <span className="text-[#0F6CBD]">₹{negotiation.currentOffer}/unit</span>
                                            <span className="flex items-center gap-1 text-slate-400">
                                                <FaClock className="w-3 h-3" />
                                                {new Date(negotiation.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span
                                        className={`px-4 py-2 rounded-[10px] text-xs font-black uppercase tracking-wider ${negotiation.status === 'REQUESTED'
                                            ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                            : negotiation.status === 'NEGOTIATING' || negotiation.status === 'OFFER_MADE'
                                                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                                : negotiation.status === 'ACCEPTED' || negotiation.status === 'DEAL_CLOSED'
                                                    ? 'bg-green-50 text-green-600 border border-green-100'
                                                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                                            }`}
                                    >
                                        {(negotiation.status === 'ACCEPTED' || negotiation.status === 'DEAL_CLOSED') && <FaCheckCircle className="inline mr-1" />}
                                        {negotiation.status === 'REJECTED' && <FaTimes className="inline mr-1" />}
                                        {negotiation.status.replace('_', ' ')}
                                    </span>

                                    <Link href={`/seller/negotiations/${negotiation._id}`}>
                                        <button className="px-6 py-3 bg-[#0F6CBD] text-white rounded-[10px] font-black text-sm hover:bg-[#0F6CBD]/90 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                                            Open Chat
                                            <FaArrowRight className="w-3 h-3" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
