'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaStar, FaUpload, FaCheck, FaTimes, FaSpinner, FaCheckCircle, FaChevronRight, FaCloudUploadAlt } from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import Link from 'next/link';
import Loader from '@/client/components/ui/Loader';
import { apiClient } from '@/lib/api/client';
import MediaUpload from '@/client/components/ui/MediaUpload';
import OptimizedImage from '@/client/components/ui/OptimizedImage';
import { toast } from 'sonner';

export default function CustomerReviewPortal() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

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
    const [deliveryRating, setDeliveryRating] = useState(0);

    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!params.id) return;
            try {
                const data = await apiClient.get(`/orders/${params.id}`) as any;
                setOrder(data);

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
            await apiClient.post('/reviews/product', {
                orderItemId: reviewItem.id,
                productId: reviewItem.product.id,
                rating,
                comment: `**${headline}**\n\n${reviewText}`,
                images: media,
                isAnonymous
            });

            if ((dealerRating > 0 || deliveryRating > 0) && order.dealer) {
                await apiClient.post('/reviews/seller', {
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

    const ratingLabels: { [key: number]: string } = {
        1: 'Poor',
        2: 'Fair',
        3: 'Average',
        4: 'Good',
        5: 'Excellent'
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader size="lg" variant="primary" />
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pb-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-[24px] p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
                >
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-emerald-500/20">
                        <FaCheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3 uppercase italic tracking-tighter">Review Submitted!</h2>
                    <p className="text-sm font-bold text-slate-400 mb-10 leading-relaxed uppercase">
                        Thank you for your feedback. Your detailed review helps our community business partners.
                    </p>
                    <button
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="w-full py-4 bg-[#10367D] text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#0d2a61] transition-all shadow-lg shadow-blue-900/20 italic"
                    >
                        Return to Order Details
                    </button>
                </motion.div>
            </div>
        );
    }

    if (!reviewItem) {
        return <div className="min-h-screen pt-32 text-center font-bold text-slate-400 uppercase tracking-widest">Item not found for review.</div>;
    }

    return (
        <div className="min-h-screen bg-[#F9FBFF] pb-24 pt-28">
            <div className="max-w-[800px] mx-auto px-6">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-10">
                    <Link href="/orders" className="hover:text-[#10367D] transition-colors">Orders</Link>
                    <FaChevronRight className="w-2 h-2 opacity-30" />
                    <span>{reviewItem.product?.category || 'Category'}</span>
                    <FaChevronRight className="w-2 h-2 opacity-30" />
                    <span className="text-slate-900">Write a Review</span>
                </div>

                {/* Product Info Header */}
                <div className="bg-white rounded-[20px] p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-10 flex gap-8 items-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100 p-3 flex items-center justify-center">
                        {reviewItem.product?.images?.[0] ? (
                            <img
                                src={reviewItem.product.images[0]}
                                alt={reviewItem.product.name}
                                className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-110 duration-500"
                            />
                        ) : (
                            <MdOutlineProductionQuantityLimits className="text-slate-200 w-10 h-10" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <FaCheckCircle className="text-blue-500 w-3.5 h-3.5" />
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] italic">Verified Purchase</span>
                        </div>
                        <h1 className="text-xl font-black text-slate-900 leading-tight mb-2 uppercase italic tracking-tighter truncate">
                            {reviewItem.product?.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-5 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            <span className="flex items-center gap-1.5">Seller: <span className="text-slate-900">{order.dealer?.businessName || 'Authorized Dealer'}</span></span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span>Ordered on: <span className="text-slate-900">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">

                    {/* Overall Rating */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Overall Rating</h3>
                        <div className="flex items-center gap-5">
                            <div className="flex gap-2.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setRating(s)}
                                        className="transition-all hover:scale-110 active:scale-95 focus:outline-none"
                                    >
                                        <FaStar
                                            className={`w-9 h-9 transition-colors duration-300 ${rating >= s ? 'text-blue-600 fill-blue-600' : 'text-slate-200'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-[11px] font-black text-slate-400 uppercase tracking-widest"
                                >
                                    {ratingLabels[rating]}
                                </motion.span>
                            )}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-10">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Review Headline</label>
                            <input
                                type="text"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                className="w-full bg-white border border-slate-100 rounded-xl px-6 py-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:text-slate-300 placeholder:uppercase placeholder:font-black placeholder:text-[9px] placeholder:tracking-widest"
                                placeholder="e.g. Robust performance for industrial use"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Write Your Review</label>
                            <div className="relative">
                                <textarea
                                    rows={6}
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    className="w-full bg-white border border-slate-100 rounded-[20px] px-6 py-5 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:text-slate-300 resize-none leading-relaxed"
                                    placeholder="Share your experience with this product's performance, build quality, and value..."
                                />
                                <div className="absolute bottom-4 right-6 text-[9px] text-slate-300 font-black uppercase tracking-widest">
                                    Minimum 20 characters
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media Upload */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Add Photos or Video</h3>

                        {media.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                                {media.map((url, i) => (
                                    <div key={url} className="w-24 h-24 rounded-2xl overflow-hidden relative group shrink-0 border border-slate-100 bg-white">
                                        <OptimizedImage src={url} alt="Review" width={100} height={100} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setMedia(m => m.filter((_, idx) => idx !== i))}
                                            className="absolute top-2 right-2 w-6 h-6 bg-slate-900/80 backdrop-blur-md text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[30px] h-48 flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 hover:bg-blue-500/[0.01] transition-all cursor-pointer group relative overflow-hidden">
                            <div className="absolute inset-0 z-10 opacity-0">
                                <MediaUpload multiple onUploadSuccess={(info) => setMedia([...media, info.secure_url])} />
                            </div>
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500 group-hover:text-white">
                                <FaCloudUploadAlt className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Drag and drop or click to upload</p>
                                <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-tight">Up to 5 photos and 1 video (Max 20MB)</p>
                            </div>
                        </div>
                    </div>

                    {/* Logistics Section */}
                    <div className="bg-white rounded-[30px] p-10 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-10">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Logistics & Service</h3>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between group">
                                <div className="space-y-1.5">
                                    <p className="font-black text-slate-900 text-xs uppercase tracking-tight italic">Dealer Rating</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Responsiveness and technical support</p>
                                </div>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setDealerRating(s)}
                                            className="focus:outline-none hover:scale-125 transition-transform"
                                        >
                                            <FaStar className={`w-5 h-5 transition-colors ${dealerRating >= s ? 'text-blue-600 fill-blue-600' : 'text-slate-100'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full h-px bg-slate-50" />

                            <div className="flex items-center justify-between group">
                                <div className="space-y-1.5">
                                    <p className="font-black text-slate-900 text-xs uppercase tracking-tight italic">Delivery Experience</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Speed and condition of packaging</p>
                                </div>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setDeliveryRating(s)}
                                            className="focus:outline-none hover:scale-125 transition-transform"
                                        >
                                            <FaStar className={`w-5 h-5 transition-colors ${deliveryRating >= s ? 'text-blue-600 fill-blue-600' : 'text-slate-100'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isAnonymous ? 'bg-blue-600 border-blue-600 text-white scale-110' : 'border-slate-200 bg-white group-hover:border-blue-600'
                                }`}>
                                {isAnonymous && <FaCheckCircle className="w-3.5 h-3.5" />}
                                <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="hidden" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Post review anonymously</span>
                        </label>

                        <div className="flex items-center gap-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="text-[11px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary"
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

