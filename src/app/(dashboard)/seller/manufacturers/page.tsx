'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaIndustry,
    FaMapMarkerAlt,
    FaBox,
    FaCheckCircle,
    FaPlus,
    FaSearch,
    FaFilter,
    FaPaperPlane
} from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import Loader from '@/client/components/ui/Loader';
import Image from 'next/image';

interface Manufacturer {
    id: string;
    companyName: string;
    factoryAddress: string;
    logo?: string;
    products: any[];
    _count: {
        products: number;
    };
    // requestStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NONE'; // We might need to fetch this or derive it
}

export default function ManufacturerNetworkPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [requests, setRequests] = useState<any[]>([]); // To track existing requests

    // Modal State
    const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
    const [requestMessage, setRequestMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [manufacturersRes, requestsRes] = await Promise.all([
                apiClient.get('/seller/manufacturers'),
                apiClient.get('/seller/my-requests')
            ]);

            if (manufacturersRes) {
                setManufacturers(manufacturersRes as any);
            }
            if (requestsRes) {
                setRequests(requestsRes as any);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load manufacturer network');
        } finally {
            setIsLoading(false);
        }
    };

    const getRequestStatus = (manufacturerId: string) => {
        const req = requests.find(r => r.manufacturerId._id === manufacturerId || r.manufacturerId === manufacturerId);
        return req ? req.status : null;
    };

    const handleRequestAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedManufacturer) return;

        setIsSubmitting(true);
        try {
            const res = await apiClient.post('/seller/request-access', {
                manufacturerId: selectedManufacturer.id,
                message: requestMessage
            });

            if (res) {
                toast.success('Access request sent successfully');
                setSelectedManufacturer(null);
                setRequestMessage('');
                fetchData(); // Refresh to update status
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to send request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredManufacturers = manufacturers.filter(m =>
        m.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.factoryAddress?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader size="xl" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black italic uppercase text-slate-800 tracking-wider">
                        Manufacturer Network
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Discover and connect with top industrial manufacturers
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center gap-3 bg-white p-1 rounded-[10px] border border-slate-200 shadow-sm w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search manufacturers..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm outline-none bg-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredManufacturers.map((m) => {
                    const status = getRequestStatus(m.id);
                    const isApproved = status === 'APPROVED';
                    const isPending = status === 'PENDING';

                    return (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[10px] border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                        >
                            <div className="p-6 flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-[10px] bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                        {m.logo ? (
                                            <Image src={m.logo} alt={m.companyName} width={64} height={64} className="w-full h-full object-cover" />
                                        ) : (
                                            <FaIndustry className="w-8 h-8 text-slate-300" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{m.companyName}</h3>
                                        <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                                            <FaMapMarkerAlt className="w-3 h-3" />
                                            <span className="line-clamp-1">{m.factoryAddress || 'Global'}</span>
                                        </div>
                                    </div>
                                </div>
                                {isApproved && (
                                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-[4px] border border-emerald-100 flex items-center gap-1">
                                        <FaCheckCircle /> PARTNER
                                    </span>
                                )}
                            </div>

                            <div className="px-6 py-4 bg-slate-50/50 border-y border-slate-100 flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Products</span>
                                    <span className="text-xs font-semibold text-slate-600 bg-slate-200/50 px-2 py-0.5 rounded-[4px]">
                                        {m._count?.products || 0} Listed
                                    </span>
                                </div>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                    {m.products?.length > 0 ? (
                                        m.products.slice(0, 4).map((p: any, i: number) => (
                                            <div key={i} className="w-12 h-12 rounded-[8px] bg-white border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden" title={p.name}>
                                                {p.images?.[0] ? (
                                                    <Image src={p.images[0]} alt={p.name} width={48} height={48} className="w-full h-full object-cover" />
                                                ) : (
                                                    <FaBox className="w-4 h-4 text-slate-300" />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">No public products listed</p>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 px-6">
                                {isApproved ? (
                                    <button disabled className="w-full py-2.5 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-[10px] border border-emerald-100 text-center cursor-default">
                                        Already Connected
                                    </button>
                                ) : isPending ? (
                                    <button disabled className="w-full py-2.5 bg-amber-50 text-amber-600 font-bold text-xs rounded-[10px] border border-amber-100 text-center cursor-default">
                                        Request Pending
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setSelectedManufacturer(m)}
                                        className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-[10px] shadow-lg shadow-slate-900/10 hover:bg-black transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaPlus className="w-3 h-3" />
                                        Request Access
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}

                {filteredManufacturers.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-400">
                        <FaIndustry className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No manufacturers found matching your search</p>
                    </div>
                )}
            </div>

            {/* Request Modal */}
            <AnimatePresence>
                {selectedManufacturer && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedManufacturer(null)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[10px] shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-bold text-lg text-slate-800">Connect with {selectedManufacturer.companyName}</h3>
                                <p className="text-xs text-slate-500 mt-1">Send a request to access their wholesale catalog.</p>
                            </div>

                            <form onSubmit={handleRequestAccess} className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Message (Optional)</label>
                                    <textarea
                                        className="w-full border border-slate-200 rounded-[10px] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 min-h-[100px]"
                                        placeholder="Introduce your business and what products you are interested in..."
                                        value={requestMessage}
                                        onChange={e => setRequestMessage(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedManufacturer(null)}
                                        className="flex-1 py-3 text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-[10px] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 text-white font-bold text-sm bg-slate-900 hover:bg-black rounded-[10px] shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader size="sm" variant="white" /> : (
                                            <>
                                                <FaPaperPlane className="w-3 h-3" /> Send Request
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
