'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCheck,
    FaTimes,
    FaStar,
    FaUser,
    FaStore,
    FaBox,
    FaFilter,
    FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'sonner';
import { adminService } from '@/lib/api/services/admin.service';
import { WhiteCard, StatusBadge } from '@/client/components/features/dashboard/DashboardUI';

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING');

    const fetchReviews = async () => {
        try {
            const data = await adminService.getPendingReviews();
            setReviews(data || []);
        } catch (error) {
            toast.error('Failed to load reviews');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleModerate = async (reviewId: string, type: string, status: string) => {
        try {
            await adminService.moderateReview(reviewId, type, status);
            toast.success(`Review ${status.toLowerCase()}ed`);
            fetchReviews();
        } catch (error) {
            toast.error('Moderation failed');
        }
    };

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Review Moderation</h1>
                <p className="text-slate-400 font-bold mt-2">
                    Maintain platform integrity by reviewing and approving customer feedback.
                </p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <WhiteCard className="p-8 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-1">Pending Approval</p>
                        <h4 className="text-3xl font-black text-slate-800 italic">{reviews.filter(r => r.status === 'PENDING').length}</h4>
                    </div>
                    <div className="w-14 h-14 bg-amber-50 rounded-[10px] flex items-center justify-center text-amber-500 border border-amber-100">
                        <FaExclamationTriangle className="w-6 h-6" />
                    </div>
                </WhiteCard>
                {/* Add more stats as needed */}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between bg-white p-4 rounded-[10px] border border-slate-100 shadow-sm">
                <div className="flex gap-2">
                    {['PENDING', 'APPROVED', 'REJECTED'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-6 py-2.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <button className="w-12 h-12 bg-slate-900 text-white rounded-[10px] flex items-center justify-center hover:bg-black transition-all shadow-lg shadow-black/10">
                    <FaFilter className="w-4 h-4" />
                </button>
            </div>

            {/* Review List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs animate-pulse">Scanning database...</div>
                ) : reviews.filter(r => r.status === filter).length === 0 ? (
                    <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs border border-dashed border-slate-200 rounded-[10px]">No reviews found in this category.</div>
                ) : reviews.filter(r => r.status === filter).map((review) => (
                    <WhiteCard key={review._id} className="p-8 hover:shadow-xl transition-all border-none overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex flex-col lg:flex-row gap-10">
                            {/* Reviewer & Meta */}
                            <div className="w-full lg:w-64 space-y-6 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[10px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                                        <FaUser />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase italic tracking-tight">{review.customerId?.name || 'Anonymous'}</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Customer</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${review.type === 'PRODUCT' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                                            {review.type === 'PRODUCT' ? <FaBox className="w-3.5 h-3.5" /> : <FaStore className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">{review.type} Review</span>
                                    </div>
                                    <div className="pl-1">
                                        <div className="flex text-amber-400 gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-100'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-4">
                                <div className="p-6 bg-slate-50 rounded-[10px] border border-slate-100/50">
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                        "{review.comment || (review.rating >= 4 ? 'Default positive feedback.' : 'No comment provided.')}"
                                    </p>
                                </div>

                                {review.type === 'SELLER' && (
                                    <div className="flex flex-wrap gap-6 px-2">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Delivery: <span className="text-slate-800 ml-1">{review.deliveryRating || 'N/A'}</span></div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Packaging: <span className="text-slate-800 ml-1">{review.packagingRating || 'N/A'}</span></div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Support: <span className="text-slate-800 ml-1">{review.communicationRating || 'N/A'}</span></div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="w-full lg:w-48 flex lg:flex-col items-center justify-center gap-4 shrink-0">
                                {review.status === 'PENDING' ? (
                                    <>
                                        <button
                                            onClick={() => handleModerate(review._id, review.type, 'APPROVED')}
                                            className="w-full h-14 bg-emerald-500 text-white rounded-[10px] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all font-mono"
                                        >
                                            <FaCheck className="w-3 h-3" /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleModerate(review._id, review.type, 'REJECTED')}
                                            className="w-full h-14 bg-slate-100 text-slate-400 rounded-[10px] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all border border-transparent"
                                        >
                                            <FaTimes className="w-3 h-3" /> Hide
                                        </button>
                                    </>
                                ) : (
                                    <div className={`px-8 py-4 rounded-[10px] border ${review.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'} text-[10px] font-black uppercase tracking-[0.2em]`}>
                                        {review.status}
                                    </div>
                                )}
                            </div>
                        </div>
                    </WhiteCard>
                ))}
            </div>
        </div>
    );
}
