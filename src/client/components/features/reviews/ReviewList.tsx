'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaThumbsUp, FaThumbsDown, FaFlag, FaCheckCircle, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Review {
    _id: string;
    rating: number;
    title?: string;
    comment: string;
    pros?: string[];
    cons?: string[];
    images?: string[];
    verifiedPurchase: boolean;
    customerId: {
        name: string;
        avatar?: string;
    };
    createdAt: string;
    votes: { up: number; down: number };
    // Seller specific
    deliveryRating?: number;
    packagingRating?: number;
    communicationRating?: number;
}

interface ReviewListProps {
    type: 'PRODUCT' | 'SELLER';
    targetId: string;
}

export default function ReviewList({ type, targetId }: ReviewListProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const endpoint = type === 'PRODUCT' ? `/api/reviews/product/${targetId}` : `/api/reviews/seller/${targetId}`;
            const { data } = await axios.get(endpoint, {
                params: { page, sort, limit: 10 }
            });

            if (page === 1) {
                setReviews(data.data);
            } else {
                setReviews(prev => [...prev, ...data.data]);
            }
            setTotalPages(data.pagination.pages);
        } catch (error) {
            console.error('Failed to fetch reviews', error);
            toast.error('Could not load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1); // Reset to page 1 on sort change
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetId, sort, type]);

    useEffect(() => {
        if (page > 1) fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleVote = async (reviewId: string, voteType: 'up' | 'down') => {
        try {
            await axios.post(`/api/reviews/${reviewId}/vote`, { type: voteType });
            // Optimistic update
            setReviews(prev => prev.map(r => {
                if (r._id === reviewId) {
                    return {
                        ...r,
                        votes: {
                            ...r.votes,
                            [voteType]: r.votes[voteType] + 1
                        }
                    };
                }
                return r;
            }));
            toast.success('Vote recorded');
        } catch (error) {
            toast.error('Failed to vote');
        }
    };

    const handleReport = async (reviewId: string) => {
        try {
            const reason = prompt('Reason for reporting this review?');
            if (!reason) return;

            await axios.post(`/api/reviews/${reviewId}/report`, { reason });
            toast.success('Review reported to moderation team');
        } catch (error) {
            toast.error('Failed to report review');
        }
    };

    const StarDisplay = ({ rating, size = 'sm' }: { rating: number, size?: 'sm' | 'md' | 'lg' }) => (
        <div className="flex gap-0.5 text-yellow-400">
            {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(rating) ? 'opacity-100' : 'text-slate-200'} size={size === 'lg' ? 20 : size === 'md' ? 16 : 12} />
            ))}
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header / Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    Customer Reviews
                    <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{reviews.length} loaded</span>
                </h3>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <FaFilter className="text-slate-400" />
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-slate-50 border-none text-sm font-medium text-slate-600 focus:ring-0 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                        <option value="newest">Newest First</option>
                        <option value="highest">Highest Rated</option>
                        <option value="lowest">Lowest Rated</option>
                        <option value="helpful">Most Helpful</option>
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                <AnimatePresence>
                    {reviews.map((review, idx) => (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 relative"
                        >
                            {/* Review Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#10367D]/10 text-[#10367D] flex items-center justify-center font-bold text-lg">
                                        {review.customerId?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{review.customerId?.name || 'NovaMart User'}</p>
                                        <p className="text-xs text-slate-400">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</p>
                                    </div>
                                    {review.verifiedPurchase && (
                                        <span className="ml-2 flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                            <FaCheckCircle /> Verified Purchase
                                        </span>
                                    )}
                                </div>
                                <button onClick={() => handleReport(review._id)} className="text-slate-300 hover:text-red-400 transition-colors" title="Report Abuse">
                                    <FaFlag size={12} />
                                </button>
                            </div>

                            {/* Ratings Content */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <StarDisplay rating={review.rating} size="md" />
                                    {review.title && <h4 className="font-bold text-slate-800">{review.title}</h4>}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                            </div>

                            {/* Pros / Cons */}
                            {(review.pros?.length || 0) > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-green-600">Pros:</span>
                                    {review.pros?.map((p, i) => (
                                        <span key={i} className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">{p}</span>
                                    ))}
                                </div>
                            )}
                            {(review.cons?.length || 0) > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-red-600">Cons:</span>
                                    {review.cons?.map((c, i) => (
                                        <span key={i} className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">{c}</span>
                                    ))}
                                </div>
                            )}

                            {/* Seller Ratings Breakdown */}
                            {type === 'SELLER' && (
                                <div className="grid grid-cols-3 gap-2 mt-2 bg-slate-50 p-3 rounded-lg">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Delivery</p>
                                        <div className="flex justify-center"><StarDisplay rating={review.deliveryRating || 0} /></div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Packaging</p>
                                        <div className="flex justify-center"><StarDisplay rating={review.packagingRating || 0} /></div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Comm.</p>
                                        <div className="flex justify-center"><StarDisplay rating={review.communicationRating || 0} /></div>
                                    </div>
                                </div>
                            )}


                            {/* Actions (Votes) */}
                            <div className="flex items-center gap-4 pt-2 border-t border-slate-50 mt-2">
                                <span className="text-xs text-slate-400">Was this helpful?</span>
                                <button onClick={() => handleVote(review._id, 'up')} className="flex items-center gap-1 text-slate-400 hover:text-green-500 text-xs font-medium transition-colors">
                                    <FaThumbsUp /> {review.votes?.up || 0}
                                </button>
                                <button onClick={() => handleVote(review._id, 'down')} className="flex items-center gap-1 text-slate-400 hover:text-red-500 text-xs font-medium transition-colors">
                                    <FaThumbsDown /> {review.votes?.down || 0}
                                </button>
                            </div>

                        </motion.div>
                    ))}
                </AnimatePresence>

                {reviews.length === 0 && !loading && (
                    <div className="text-center py-12 text-slate-400">
                        <p>No reviews yet. Be the first to share your experience!</p>
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10367D]"></div>
                    </div>
                )}

                {page < totalPages && !loading && (
                    <button
                        onClick={() => setPage(p => p + 1)}
                        className="w-full py-3 bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        Load More Reviews
                    </button>
                )}
            </div>
        </div>
    );
}
