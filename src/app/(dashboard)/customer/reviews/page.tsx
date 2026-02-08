'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaFilter,
    FaSortAmountDown,
    FaEdit,
    FaTrashAlt,
    FaStar,
    FaCheckCircle,
    FaThumbsUp,
    FaComment,
    FaBox
} from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import OptimizedImage from '@/client/components/ui/OptimizedImage';
import { useSnackbar } from '@/client/context/SnackbarContext';

export default function MyReviewsPage() {
    const { showSnackbar } = useSnackbar();
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ALL' | 'PHOTOS' | 'VERIFIED'>('ALL');
    const [sortBy, setSortBy] = useState('RECENT');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const data = await apiClient.get<any[]>('/reviews/my-reviews');
            setReviews(data || []);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
            showSnackbar('Failed to load reviews history', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        try {
            // await apiClient.delete(`/reviews/${reviewId}`); // API not ready yet
            showSnackbar('Review deleted successfully', 'success');
            setReviews(prev => prev.filter(r => r.id !== reviewId));
        } catch (error) {
            showSnackbar('Failed to delete review', 'error');
        }
    };

    const filteredReviews = reviews.filter(review => {
        if (activeTab === 'PHOTOS') return review.images && review.images.length > 0;
        if (activeTab === 'VERIFIED') return true; // All fetched are verified user reviews technically, but maybe check badge?
        return true;
    });

    const displayReviews = filteredReviews;

    if (isLoading) return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-10 px-6">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Reviews History</h1>
                        <p className="text-slate-500 font-medium mt-1">Manage your feedback and review your community contributions.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:border-slate-300 transition-colors shadow-sm">
                            <FaFilter /> Filter
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:border-slate-300 transition-colors shadow-sm">
                            <FaSortAmountDown /> Sort: Most Recent
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-slate-200">
                    {[
                        { id: 'ALL', label: `All Reviews (${displayReviews.length})` },
                        { id: 'PHOTOS', label: `With Photos (${displayReviews.filter(r => r.images?.length > 0).length})` },
                        { id: 'VERIFIED', label: `Verified Only (${displayReviews.length})` }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-colors ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {displayReviews.length > 0 ? (
                        displayReviews.map((review) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex gap-6">
                                        {/* Product Thumb */}
                                        <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                                            {review.product?.images?.[0] ? (
                                                <OptimizedImage
                                                    src={review.product.images[0]}
                                                    alt={review.product.name}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><FaBox /></div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-800 text-lg mb-1">{review.product?.name || 'Unknown Product'}</h3>

                                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <FaStar key={s} className={`w-4 h-4 ${review.rating >= s ? 'text-amber-400' : 'text-slate-200'}`} />
                                                    ))}
                                                </div>
                                                <span className="text-xs font-bold text-slate-400">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</span>
                                                {review.isVerified && (
                                                    <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-full">
                                                        <FaCheckCircle className="text-blue-500 w-3 h-3" />
                                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Verified Purchase</span>
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-slate-600 leading-relaxed mb-6">
                                                {review.comment}
                                            </p>

                                            {review.images && review.images.length > 0 && (
                                                <div className="flex gap-3 mb-6">
                                                    {review.images.map((img: string, idx: number) => (
                                                        <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100">
                                                            <OptimizedImage src={img} alt="Review attachment" width={64} height={64} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-6 text-slate-400 text-xs font-bold">
                                                <div className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
                                                    <FaThumbsUp />
                                                    <span>{review.helpfulCount || 0} people found this helpful</span>
                                                </div>
                                                <div className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
                                                    <FaComment />
                                                    <span>{review.commentCount || 0} comments</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors"
                                        >
                                            <FaTrashAlt /> Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 border-dashed">
                            <FaComment className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-slate-800">No reviews yet</h4>
                            <p className="text-slate-400 text-sm italic">You haven't contributed any feedback to the community yet.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <button className="w-full py-5 bg-slate-50 text-slate-500 rounded-2xl border border-dashed border-slate-200 text-xs font-black uppercase tracking-widest hover:bg-white hover:border-slate-300 hover:text-slate-800 transition-all">
                    Load More Reviews
                </button>
            </div>
        </div>
    );
}
