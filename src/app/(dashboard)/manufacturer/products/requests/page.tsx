'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaBox, FaStore, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';
import Loader from '@/client/components/ui/Loader';

interface ProductRequest {
    _id: string;
    sellerId: {
        _id: string;
        businessName: string;
        city: string;
        logo?: string;
        contactInfo?: {
            phone?: string;
            email?: string;
        };
    };
    productId: {
        _id: string;
        name: string;
        basePrice: number;
        images: string[];
    };
    region: string;
    createdAt: string;
    requestedQuantity?: number;
}

export default function ProductRequestsPage() {
    const [requests, setRequests] = useState<ProductRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await apiClient.get<any>('/manufacturer/products/requests');
            setRequests(data?.data || []); // Adjusted for response structure { success: true, data: [] }
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to load product requests');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (inventoryId: string) => {
        setProcessingId(inventoryId);
        try {
            await apiClient.post('/manufacturer/products/requests/approve', { inventoryId });
            toast.success('Request approved successfully');
            // Remove from list or update status
            setRequests(prev => prev.filter(req => req._id !== inventoryId));
        } catch (error: any) {
            toast.error(error.message || 'Failed to approve request');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (inventoryId: string) => {
        if (!confirm('Are you sure you want to reject this request?')) return;
        setProcessingId(inventoryId);
        try {
            // Placeholder for reject logic
            toast.info('Rejection feature coming soon');
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader size="lg" variant="primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-[#1E293B]">Product Allocations</h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Manage stock requests from your retail partners.</p>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 border-dashed">
                    <FaBox className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No Pending Requests</h3>
                    <p className="text-slate-500 text-sm">All product requests have been processed.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    <AnimatePresence>
                        {requests.map((request) => (
                            <motion.div
                                key={request._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    {/* Product Image */}
                                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                                        {request.productId?.images?.[0] ? (
                                            <img src={request.productId.images[0]} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <FaBox />
                                            </div>
                                        )}
                                    </div>

                                    {/* Request Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-slate-900 truncate">{request.productId?.name || 'Unknown Product'}</h3>
                                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-100 flex items-center gap-1">
                                                <FaClock className="w-2 h-2" /> Pending
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <FaStore className="text-slate-400" />
                                                <span className="text-slate-700">{request.sellerId?.businessName || 'Unknown Seller'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <FaBox className="text-slate-400" />
                                                <span className="text-slate-900 font-bold">Qty: {request.requestedQuantity || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <FaMapMarkerAlt className="text-slate-400" />
                                                <span>{request.region}</span>
                                            </div>
                                            <div>
                                                Requested: {new Date(request.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <button
                                            onClick={() => handleReject(request._id)}
                                            disabled={!!processingId}
                                            className="flex-1 md:flex-none px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-50 hover:text-rose-600 transition-colors disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleApprove(request._id)}
                                            disabled={!!processingId}
                                            className="flex-1 md:flex-none px-6 py-2 bg-[#0F6CBD] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#0d5a9e] transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {processingId === request._id ? (
                                                <Loader size="sm" variant="white" />
                                            ) : (
                                                <>
                                                    Approve <FaCheck className="w-3 h-3" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
