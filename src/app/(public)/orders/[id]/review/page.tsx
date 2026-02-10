'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    FaStar,
    FaCheckCircle,
    FaCloudUploadAlt,
    FaBox
} from 'react-icons/fa';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import MediaUpload from '@/client/components/ui/MediaUpload';
import OptimizedImage from '@/client/components/ui/OptimizedImage';
import { toast } from 'sonner';

export default function CustomerReviewPortal() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    // const { showSnackbar } = useSnackbar();

    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reviewItem, setReviewItem] = useState<any>(null);

    // Form State
    const [rating, setRating] = useState(0);
    const [headline, setHeadline] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [media, setMedia] = useState<string[]>([]);

    // Logistics Ratings
    const [dealerRating, setDealerRating] = useState(0);
    const [deliveryRating, setDeliveryRating] = useState(0); // Delivery Experience

    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!params.id) return;
            try {
                const data = await apiClient.get(`/orders/${params.id}`) as any;
                setOrder(data);

                // Determine which item to review
                const productId = searchParams.get('productId');
                if (productId && data.items) {
                    const item = data.items.find((i: any) => i.product.id === productId);
                    setReviewItem(item);
                } else if (data.items && data.items.length > 0) {
                    setReviewItem(data.items[0]);
                }
            } catch (error) {
                console.error('Failed to fetch order', error);
                toast.error('Failed to load order details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [params.id, searchParams]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating || !reviewItem) {
            toast.error('Please provide an overall rating');
            return;
        }
        if (reviewText.length < 20) {
            toast.error('Review text must be at least 20 characters');
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Submit Product Review
            await apiClient.post('/api/reviews/product', {
                orderItemId: reviewItem.id,
                productId: reviewItem.product.id,
                rating,
                comment: `**${headline}**\n\n${reviewText}`,
                images: media,
                isAnonymous
            });

            // 2. Submit Seller Review (if ratings provided)
            if (dealerRating > 0 && order.dealer) {
                await apiClient.post('/api/reviews/seller', {
                    orderId: order.id,
                    dealerId: order.dealer.id,
                    rating: dealerRating,
                    delivery: deliveryRating,
                    packaging: deliveryRating,
                    communication: dealerRating,
                    comment: "Logistics Feedback"
                });
            }

            setIsSubmitted(true);
            toast.success('Review submitted successfully!');
        } catch (error) {
            console.error('Submission failed', error);
            toast.error('Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10367D]"></div></div>;
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in relative z-[100]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-3xl p-12 text-center shadow-2xl border border-slate-100"
                >
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-green-500/20">
                        <FaCheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">Review Submitted!</h2>
                    <p className="text-sm font-medium text-slate-400 mb-8 leading-relaxed">
                        Thank you for your feedback. Your review helps the community make better decisions.
                    </p>
                    <Link href={`/orders/${order.id}`} className="block w-full py-4 bg-[#10367D] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0d2a61] transition-colors shadow-lg shadow-blue-900/20">
                        Return to Order
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (!reviewItem) {
        return <div className="min-h-screen pt-32 text-center">Item not found for review.</div>;
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-28">
            <div className="max-w-3xl mx-auto px-6">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-8">
                    <Link href="/orders" className="hover:text-[#10367D]">Orders</Link>
                    <span>›</span>
                    <span>{reviewItem.product?.category || 'Industrial Tools'}</span>
                    <span>›</span>
                    <span className="text-slate-800">Write a Review</span>
                </div>

                {/* Product Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm mb-8 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100 p-2 relative group">
                        {reviewItem.product?.images?.[0] ? (
                            <img
                                src={reviewItem.product.images[0]}
                                alt={reviewItem.product.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><FaBox /></div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <FaCheckCircle className="text-blue-500 w-3 h-3" />
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Verified Purchase</span>
                        </div>
                        <h1 className="text-lg font-black text-slate-800 leading-tight mb-1">{reviewItem.product?.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1">Seller: <span className="text-slate-800 font-bold">{order.dealer?.businessName}</span></span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>Ordered on: <span className="text-slate-800 font-bold">{new Date(order.createdAt).toLocaleDateString()}</span></span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Overall Rating */}
                    <div>
                        <h3 className="text-sm font-black text-slate-800 mb-4">Overall Rating</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setRating(s)}
                                        onMouseEnter={() => setRating(s)}
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <FaStar className={`w-8 h-8 ${rating >= s ? 'text-blue-600' : 'text-slate-200'}`} />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <span className="text-sm font-bold text-slate-400">
                                    {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Fair' : 'Poor'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Review Text */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Review Headline</label>
                            <input
                                type="text"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-300"
                                placeholder="Robust performance for industrial use"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Write Your Review</label>
                            <textarea
                                rows={5}
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-300 resize-none leading-relaxed"
                                placeholder="We purchased this for our warehouse assembly line. The torque is exceptional compared to previous models..."
                            />
                            <p className="text-[9px] text-slate-400 text-right mt-1 font-bold">Minimum 20 characters</p>
                        </div>
                    </div>

                    {/* Media Upload (Drag and drop style) */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Add Photos or Video</label>

                        {/* Existing Images */}
                        {media.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 mb-2">
                                {media.map((url, i) => (
                                    <div key={i} className="w-24 h-24 rounded-xl overflow-hidden relative group shrink-0 border border-slate-200 bg-white">
                                        <OptimizedImage src={url} alt="Review" width={100} height={100} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setMedia(m => m.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl h-40 flex flex-col items-center justify-center gap-3 hover:border-blue-300 transition-colors cursor-pointer group relative">
                            <div className="absolute inset-0 z-10 opacity-0">
                                <MediaUpload multiple onUploadSuccess={(info) => setMedia([...media, info.secure_url])} />
                            </div>
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaCloudUploadAlt className="w-5 h-5" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-black text-slate-800">Drag and drop or click to upload</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-1">Up to 5 photos and 1 video (Max 20MB)</p>
                            </div>
                        </div>
                    </div>

                    {/* Logistics */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
                        <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2">Logistics & Service</h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">Dealer Rating</p>
                                    <p className="text-[10px] text-slate-400 font-bold">Responsiveness and technical support</p>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button key={s} type="button" onClick={() => setDealerRating(s)} className="focus:outline-none hover:scale-110 transition-transform">
                                            <FaStar className={`w-5 h-5 ${dealerRating >= s ? 'text-blue-600' : 'text-slate-200'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full h-px bg-slate-50" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">Delivery Experience</p>
                                    <p className="text-[10px] text-slate-400 font-bold">Speed and condition of packaging</p>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button key={s} type="button" onClick={() => setDeliveryRating(s)} className="focus:outline-none hover:scale-110 transition-transform">
                                            <FaStar className={`w-5 h-5 ${deliveryRating >= s ? 'text-blue-600' : 'text-slate-200'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isAnonymous ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                {isAnonymous && <FaCheckCircle className="w-3 h-3" />}
                                <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="hidden" />
                            </div>
                            <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700">Post review anonymously</span>
                        </label>

                        <div className="flex items-center gap-4">
                            <button type="button" onClick={() => router.back()} className="text-sm font-bold text-slate-500 hover:text-slate-800 px-4 py-2">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-10 py-3.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Posting...' : 'Post Review'}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
