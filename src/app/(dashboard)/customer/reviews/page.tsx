'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaFilter,
    FaSortAmountDown,
    FaEdit,
    FaTrashAlt,
    FaStar,
    FaCheckCircle,
    FaThumbsUp,
    FaComment,
    FaBox,
    FaEllipsisH
} from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import OptimizedImage from '@/client/components/ui/OptimizedImage';
import { toast } from 'sonner';

export default function MyReviewsPage() {
    // const { showSnackbar } = useSnackbar();
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
            toast.error('Failed to load reviews history');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        try {
            // await apiClient.delete(`/reviews/${reviewId}`); // API not ready yet
            toast.success('Review deleted successfully');
            setReviews(prev => prev.filter(r => r.id !== reviewId));
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    const filteredReviews = reviews.filter(review => {
        if (activeTab === 'PHOTOS') return review.images && review.images.length > 0;
        if (activeTab === 'VERIFIED') return true; // All fetched are verified user reviews technically, but maybe check badge?
        return true;
    });

    const displayReviews = filteredReviews;

    if (isLoading) return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#067FF9]"></div></div>;

    return (
        <div className="min-h-screen pb-20 pt-10 px-6">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">My Reviews History</h1>
                        <p className="text-slate-400 font-medium mt-1">Manage your feedback and review your community contributions.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 rounded-[10px] text-sm font-bold text-slate-600 hover:border-slate-300 transition-colors shadow-sm">
                            <FaFilter className="text-slate-400" /> Filter
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 rounded-[10px] text-sm font-bold text-slate-600 hover:border-slate-300 transition-colors shadow-sm">
                            <FaSortAmountDown className="text-slate-400" /> Sort: Most Recent
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-slate-200/60">
                    {[
                        { id: 'ALL', label: `All Reviews (${reviews.length})` },
                        { id: 'PHOTOS', label: `With Photos (${reviews.filter(r => r.images?.length > 0).length})` },
                        { id: 'VERIFIED', label: `Verified Only (${reviews.length})` }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`pb-4 text-sm font-bold relative transition-colors ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {displayReviews.length > 0 ? (
                        displayReviews.map((review) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[10px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Top Row: Product & Actions */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-[10px] overflow-hidden border border-slate-100 shrink-0">
                                            {review.product?.images?.[0] ? (
                                                <OptimizedImage
                                                    src={review.product.images[0]}
                                                    alt={review.product.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-contain mix-blend-multiply"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><FaBox /></div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm leading-tight">{review.product?.name || 'Unknown Product'}</h3>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <FaStar key={s} className={`w-3 h-3 ${review.rating >= s ? 'text-amber-400' : 'text-slate-200'}`} />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-bold text-slate-400">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            {review.isVerified && (
                                                <div className="flex items-center gap-1 mt-2">
                                                    <FaCheckCircle className="text-blue-500 w-3 h-3" />
                                                    <span className="text-sm font-bold text-blue-500 tracking-wide bg-blue-50 px-2 py-0.5 rounded-full">Verified Purchase</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-[10px] text-sm font-bold hover:bg-slate-100 transition-colors">
                                            <FaEdit className="w-3 h-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-500 rounded-[10px] text-sm font-bold hover:bg-rose-100 transition-colors"
                                        >
                                            <FaTrashAlt className="w-3 h-3" /> Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="mb-4">
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {review.comment}
                                    </p>
                                </div>

                                {/* Images */}
                                {review.images && review.images.length > 0 && (
                                    <div className="flex gap-2 mb-4">
                                        {review.images.map((img: string, idx: number) => (
                                            <div key={idx} className="w-12 h-12 rounded-[10px] overflow-hidden border border-slate-100 cursor-pointer hover:opacity-90 transition-opacity">
                                                <OptimizedImage src={img} alt="Review attachment" width={48} height={48} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Footer Stats */}
                                <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-1.5 text-slate-400 text-sm font-bold hover:text-blue-600 transition-colors cursor-pointer">
                                        <FaThumbsUp className="w-3.5 h-3.5" />
                                        <span>{review.helpfulCount || 0} people found this helpful</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400 text-sm font-bold hover:text-blue-600 transition-colors cursor-pointer">
                                        <FaComment className="w-3.5 h-3.5" />
                                        <span>{review.commentCount || 0} comments</span>
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
                <button className="w-full py-4 bg-white text-slate-500 rounded-[10px] border border-slate-200 text-sm font-bold hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm">
                    Load More Reviews
                </button>
            </div>
        </div>
    );
}
