'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { FaPlus, FaClock, FaCheck, FaTimes, FaCog, FaTruck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface CustomRequest {
    _id: string;
    productName: string;
    productCategory: string;
    requestType: string;
    status: string;
    totalQuantity: number;
    requiredDeliveryDate: string;
    manufacturerResponse?: {
        proposedPrice: number;
        proposedDeliveryDate: string;
    };
    createdAt: string;
}

export default function CustomRequestsPage() {
    const [requests, setRequests] = useState<CustomRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [features, setFeatures] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        initPage();
    }, []);

    const initPage = async () => {
        const feat = await fetchFeatures();
        if (feat?.allowCustomRequests) {
            await fetchRequests();
        } else {
            setLoading(false);
        }
    };

    const fetchFeatures = async () => {
        try {
            const res = await apiClient.get<any>('/subscription/features');
            if (res.success) {
                setFeatures(res.data);
                return res.data;
            }
        } catch (error) {
            console.error('Failed to fetch features');
        }
        return null;
    };

    const fetchRequests = async () => {
        try {
            const res = await apiClient.get<any>('/custom-manufacturing/requests');
            if (res.success) {
                setRequests(res.data);
            }
        } catch (error) {
            // Only show error if we expected to have access
            console.error('Failed to load custom requests');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'REQUESTED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'NEGOTIATING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'IN_PRODUCTION': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'COMPLETED': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'REQUESTED': return <FaClock className="w-4 h-4" />;
            case 'NEGOTIATING': return <FaCog className="w-4 h-4 animate-spin" />;
            case 'APPROVED': return <FaCheck className="w-4 h-4" />;
            case 'IN_PRODUCTION': return <FaCog className="w-4 h-4" />;
            case 'COMPLETED': return <FaTruck className="w-4 h-4" />;
            case 'REJECTED': return <FaTimes className="w-4 h-4" />;
            default: return <FaClock className="w-4 h-4" />;
        }
    };

    const filteredRequests = requests.filter(req =>
        filter === 'ALL' || req.status === filter
    );

    if (!features?.allowCustomRequests) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="max-w-2xl w-full bg-white rounded-[30px] p-12 text-center border border-slate-100 shadow-xl">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-[20px] flex items-center justify-center mx-auto mb-6">
                        <FaCog className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-4 italic uppercase">
                        PRO Feature
                    </h1>
                    <p className="text-slate-600 font-bold mb-8">
                        Custom manufacturing requests are available for PRO and ENTERPRISE tier subscribers.
                        Upgrade your subscription to request custom products from manufacturers.
                    </p>
                    <button
                        onClick={() => router.push('/dealer/subscription')}
                        className="px-8 py-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-[15px] font-black uppercase tracking-wider hover:shadow-2xl transition-all"
                    >
                        Upgrade to PRO
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic uppercase">
                        Custom <span className="text-[#067FF9]">Manufacturing</span>
                    </h1>
                    <p className="text-sm font-bold text-slate-500">
                        Request custom products tailored to your specifications
                    </p>
                </div>
                <button
                    onClick={() => router.push('/dealer/custom-requests/create')}
                    className="flex items-center gap-3 px-6 py-4 bg-[#067FF9] text-white rounded-[15px] font-black uppercase tracking-wider hover:shadow-2xl transition-all"
                >
                    <FaPlus className="w-4 h-4" />
                    New Request
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {['ALL', 'REQUESTED', 'NEGOTIATING', 'APPROVED', 'IN_PRODUCTION', 'COMPLETED'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-6 py-3 rounded-[10px] font-black uppercase tracking-wider text-xs whitespace-nowrap transition-all ${filter === status
                            ? 'bg-[#067FF9] text-white shadow-lg'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-[#067FF9]'
                            }`}
                    >
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-[20px] p-6 border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total</p>
                    <p className="text-3xl font-black text-[#067FF9]">{requests.length}</p>
                </div>
                <div className="bg-white rounded-[20px] p-6 border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Pending</p>
                    <p className="text-3xl font-black text-yellow-600">
                        {requests.filter(r => ['REQUESTED', 'NEGOTIATING'].includes(r.status)).length}
                    </p>
                </div>
                <div className="bg-white rounded-[20px] p-6 border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Active</p>
                    <p className="text-3xl font-black text-purple-600">
                        {requests.filter(r => r.status === 'IN_PRODUCTION').length}
                    </p>
                </div>
                <div className="bg-white rounded-[20px] p-6 border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Completed</p>
                    <p className="text-3xl font-black text-green-600">
                        {requests.filter(r => r.status === 'COMPLETED').length}
                    </p>
                </div>
            </div>

            {/* Requests List */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-12 h-12 border-4 border-[#067FF9] border-t-transparent rounded-full mx-auto"></div>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="bg-white rounded-[30px] p-16 text-center border border-slate-100">
                    <FaCog className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-slate-800 mb-3 italic uppercase">
                        {filter === 'ALL' ? 'No Requests Yet' : `No ${filter} Requests`}
                    </h3>
                    <p className="text-slate-500 font-bold mb-8">
                        {filter === 'ALL'
                            ? 'Create your first custom manufacturing request'
                            : `You don't have any ${filter.toLowerCase()} requests`
                        }
                    </p>
                    {filter === 'ALL' && (
                        <button
                            onClick={() => router.push('/dealer/custom-requests/create')}
                            className="px-8 py-4 bg-[#067FF9] text-white rounded-[15px] font-black uppercase tracking-wider hover:shadow-2xl transition-all"
                        >
                            Create First Request
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredRequests.map((request, idx) => (
                        <motion.div
                            key={request._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => router.push(`/dealer/custom-requests/${request._id}`)}
                            className="bg-white rounded-[25px] p-8 border border-slate-100 hover:shadow-2xl transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-[#067FF9] transition-colors">
                                        {request.productName}
                                    </h3>
                                    <p className="text-sm font-bold text-slate-500">
                                        {request.productCategory} • {request.requestType}
                                    </p>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-[10px] border ${getStatusColor(request.status)}`}>
                                    {getStatusIcon(request.status)}
                                    <span className="text-xs font-black uppercase">{request.status.replace('_', ' ')}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-50 rounded-[15px] p-4 border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Quantity</p>
                                    <p className="text-lg font-black text-slate-800">{request.totalQuantity} units</p>
                                </div>
                                <div className="bg-slate-50 rounded-[15px] p-4 border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Delivery</p>
                                    <p className="text-sm font-black text-slate-800">
                                        {new Date(request.requiredDeliveryDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            {request.manufacturerResponse && (
                                <div className="bg-green-50 border border-green-200 rounded-[15px] p-4">
                                    <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-2">
                                        Manufacturer Response
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-green-700 font-bold">Proposed Price</p>
                                            <p className="text-lg font-black text-green-800">
                                                ₹{request.manufacturerResponse.proposedPrice.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-green-700 font-bold">Delivery Date</p>
                                            <p className="text-sm font-black text-green-800">
                                                {new Date(request.manufacturerResponse.proposedDeliveryDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
