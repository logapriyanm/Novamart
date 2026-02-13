'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFlag, FaCheckCircle, FaExclamationTriangle, FaStar, FaStore } from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import Loader from '@/client/components/ui/Loader';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminReviewAnalytics() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get('/reviews/analytics/admin');
                setStats(response);
            } catch (error) {
                console.error('Failed to load admin analytics:', error);
                // toast.error('Failed to load analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader /></div>;
    if (!stats) return <div className="text-center p-12 text-slate-500">No analytics available.</div>;

    return (
        <div className="space-y-8 p-6">
            <h2 className="text-2xl font-bold text-slate-800">Platform Review Health</h2>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium">Total Reviews</p>
                    <p className="text-4xl font-bold text-slate-800 mt-2">{stats.totalReviews}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium">Platform Avg Rating</p>
                    <div className="flex items-end gap-2 mt-2">
                        <span className="text-4xl font-bold text-slate-800">{stats.averagePlatformRating?.toFixed(1)}</span>
                        <FaStar className="text-amber-400 text-2xl mb-1.5" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium">Pending Moderation</p>
                    <p className="text-4xl font-bold text-amber-500 mt-2">{stats.pendingReviews}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium">Flagged (Risk)</p>
                    <p className="text-4xl font-bold text-rose-500 mt-2">{stats.flaggedReviews}</p>
                </div>
            </div>

            {/* Recent Flags */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <FaFlag className="text-rose-500" /> Recent Flags
                </h3>
                <div className="space-y-4">
                    {stats.recentFlags?.length > 0 ? (
                        stats.recentFlags.map((review: any) => (
                            <div key={review._id} className="p-4 bg-rose-50 rounded-xl border border-rose-100 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">FLAGGED</span>
                                        <span className="text-xs text-slate-400">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</span>
                                    </div>
                                    <p className="font-bold text-slate-800 text-sm">Product: {review.productId?.name || 'Unknown'}</p>
                                    <p className="text-xs text-slate-500 mb-2">Seller: {review.sellerId?.businessName || 'Unknown'}</p>
                                    <p className="text-sm text-slate-700 italic">"{review.comment}"</p>

                                    {review.reports?.length > 0 && (
                                        <div className="mt-2 text-xs text-rose-600 font-medium">
                                            Report Reason: {review.reports[0].reason}
                                        </div>
                                    )}
                                </div>
                                <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 text-slate-700 shadow-sm">
                                    Review Case
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-400 italic">No flagged reviews requiring attention.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
