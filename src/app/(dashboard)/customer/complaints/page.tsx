"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    FaShieldAlt,
    FaSearch,
    FaFilter,
    FaExclamationCircle,
    FaCheckCircle,
    FaClock,
    FaBoxOpen
} from 'react-icons/fa';
import Link from 'next/link';
import Loader from '@/client/components/ui/Loader';
import { toast } from 'sonner';

import { useAuth } from '@/client/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function CustomerComplaintsPage() {
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();
    const [disputes, setDisputes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/auth/login?redirect=/customer/complaints');
            return;
        }
        if (isAuthenticated) {
            fetchDisputes();
        } else {
            // Allow initial load to check auth state
            const token = localStorage.getItem('token');
            if (token) fetchDisputes();
            else setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchDisputes = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/disputes/my`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setDisputes(res.data.data);
            }
        } catch (error: any) {
            console.error('Failed to fetch disputes:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                logout(); // Clear state
                router.push('/auth/login?redirect=/customer/complaints');
            } else {
                toast.error('Failed to load your complaints');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'RESOLVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            case 'ESCALATED': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'OPEN': return <FaExclamationCircle className="w-4 h-4" />;
            case 'RESOLVED': return <FaCheckCircle className="w-4 h-4" />;
            case 'REJECTED': return <FaExclamationCircle className="w-4 h-4" />;
            default: return <FaClock className="w-4 h-4" />;
        }
    };

    const filteredDisputes = disputes.filter(d =>
        filterStatus === 'ALL' ? true : d.status === filterStatus
    );

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <FaShieldAlt className="text-blue-600" />
                                Disputes & Complaints
                            </h1>
                            <p className="text-slate-500 text-sm mt-1 font-medium">
                                Manage and track your raised issues
                            </p>
                        </div>
                        <Link
                            href="/orders"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <FaBoxOpen />
                            Raise New Issue
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2 mt-8 overflow-x-auto no-scrollbar">
                        {['ALL', 'OPEN', 'RESOLVED', 'REJECTED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${filterStatus === status
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredDisputes.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaShieldAlt className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No complaints found</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">
                            {filterStatus !== 'ALL'
                                ? `You don't have any ${filterStatus.toLowerCase()} disputes.`
                                : "You haven't raised any disputes yet. If you have an issue with an order, you can raise it from your Orders page."}
                        </p>
                        <Link
                            href="/orders"
                            className="px-6 py-3 bg-black text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            Go to Orders
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredDisputes.map((dispute) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={dispute._id}
                                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${getStatusColor(dispute.status)}`}>
                                                        {getStatusIcon(dispute.status)}
                                                        {dispute.status}
                                                    </span>
                                                    <span className="text-xs font-medium text-slate-400">
                                                        Case ID: #{dispute._id.slice(-6).toUpperCase()}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-slate-900 text-lg">
                                                    {dispute.reason}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                <FaBoxOpen className="text-slate-400" />
                                                <span className="font-semibold">Order #{dispute.orderId?.customOrderId || dispute.orderId?._id?.slice(-6).toUpperCase()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                <FaClock className="text-slate-400" />
                                                <span className="font-medium">Raised on {new Date(dispute.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {dispute.resolutionMetadata?.resolution && (
                                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mt-4">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Resolution</p>
                                                <p className="font-medium text-slate-900">{dispute.resolutionMetadata.resolution}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                                        <Link
                                            href={`/orders/${dispute.orderId?._id}`}
                                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-center"
                                        >
                                            View Order
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
