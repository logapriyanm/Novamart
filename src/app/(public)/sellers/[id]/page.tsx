'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaStore,
    FaCheckCircle,
    FaStar,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaChevronRight,
    FaTimes
} from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits, MdRateReview } from 'react-icons/md';
import Link from 'next/link';
import Loader from '@/client/components/ui/Loader';
import ReviewList from '@/client/components/features/reviews/ReviewList';
import { useAuth } from '@/client/hooks/useAuth';
import { toast } from 'sonner';
import axios from 'axios';

export default function SellerProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [seller, setSeller] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Products');

    // Rating form state
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [ratingForm, setRatingForm] = useState({
        orderId: '',
        rating: 5,
        delivery: 5,
        packaging: 5,
        communication: 5,
        title: '',
        comment: ''
    });
    const [customerOrders, setCustomerOrders] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/seller/public/${id}`);
                const json = await res.json();
                if (json.success) {
                    setSeller(json.data);
                } else {
                    toast.error('Seller not found');
                }
            } catch (error) {
                console.error('Failed to fetch seller:', error);
                toast.error('Failed to load seller profile');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchSellerData();
    }, [id]);

    // Fetch customer's orders from this seller (for reviewing)
    const fetchCustomerOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/orders?sellerId=${id}&status=DELIVERED`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setCustomerOrders(res.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const handleOpenRatingForm = () => {
        if (!isAuthenticated) {
            toast.error('Please log in to rate this seller');
            router.push(`/auth/login?redirect=/sellers/${id}`);
            return;
        }
        fetchCustomerOrders();
        setShowRatingForm(true);
    };

    const handleSubmitReview = async () => {
        if (!ratingForm.orderId) {
            toast.error('Please select an order');
            return;
        }
        if (!ratingForm.comment.trim()) {
            toast.error('Please write a comment');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/reviews/seller`,
                {
                    orderId: ratingForm.orderId,
                    sellerId: id,
                    rating: ratingForm.rating,
                    delivery: ratingForm.delivery,
                    packaging: ratingForm.packaging,
                    communication: ratingForm.communication,
                    title: ratingForm.title,
                    comment: ratingForm.comment
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Review submitted successfully!');
            setShowRatingForm(false);
            setRatingForm({ orderId: '', rating: 5, delivery: 5, packaging: 5, communication: 5, title: '', comment: '' });
            // Refresh seller data
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/seller/public/${id}`);
            const json = await res.json();
            if (json.success) setSeller(json.data);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Star selector component
    const StarSelector = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
        <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className="p-0.5"
                    >
                        <FaStar className={`w-5 h-5 transition-colors ${star <= value ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'}`} />
                    </button>
                ))}
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen pt-40 flex justify-center bg-white">
                <Loader size="lg" variant="primary" />
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="min-h-screen pt-40 text-center bg-white">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Seller not found.</p>
                <Link href="/products" className="text-black font-black mt-4 block uppercase text-sm tracking-widest hover:underline">Return to Market</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 bg-white">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-8">
                    <Link href="/" className="hover:text-black transition-colors">Home</Link>
                    <span className="text-slate-200">/</span>
                    <Link href="/products" className="hover:text-black transition-colors">Products</Link>
                    <span className="text-slate-200">/</span>
                    <span className="text-black font-extrabold">{seller.businessName}</span>
                </nav>

                {/* Seller Header */}
                <div className="bg-[#fafafa] rounded-2xl p-6 sm:p-10 border border-slate-100 mb-10 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start relative z-10">
                        {/* Avatar */}
                        <div className="relative shrink-0 mx-auto sm:mx-0">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                                {seller.profileImage ? (
                                    <img src={seller.profileImage} alt={seller.businessName} className="w-full h-full object-cover" />
                                ) : (
                                    <FaStore className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
                                )}
                            </div>
                            {seller.isVerified && (
                                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-3 border-white shadow-sm">
                                    <FaCheckCircle className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                            <div>
                                <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">{seller.businessName}</h1>
                                    {seller.isVerified && (
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <FaCheckCircle className="w-3 h-3" />
                                            Verified Seller
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto sm:mx-0">
                                    {seller.description || `${seller.businessName} is a premier partner on NovaMart, providing high-quality products with verified fulfillment excellence.`}
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-slate-400 w-3.5 h-3.5" />
                                    <span className="text-xs font-bold text-slate-500">{seller.city}{seller.state ? `, ${seller.state}` : ''}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-slate-400 w-3.5 h-3.5" />
                                    <span className="text-xs font-bold text-slate-500">Since {new Date(seller.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                                    <FaStar className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-sm font-bold text-black">{seller.stats.averageRating.toFixed(1)}</span>
                                    <span className="text-xs text-slate-400 font-medium">({seller.stats.reviewCount} ratings)</span>
                                </div>
                                <span className="text-xs font-bold text-slate-400">{seller.stats.totalProducts} Products</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                    <div className="flex border-b border-slate-100 bg-[#fafafa]">
                        {['Products', 'Reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-6 sm:px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-black' : 'text-slate-300 hover:text-slate-500'}`}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {tab === 'Products' ? <MdOutlineProductionQuantityLimits className="w-3.5 h-3.5" /> : <MdRateReview className="w-3.5 h-3.5" />}
                                    {tab}
                                </span>
                                {activeTab === tab && (
                                    <motion.div layoutId="sellerActiveTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 sm:p-10">
                        <AnimatePresence mode="wait">
                            {activeTab === 'Products' ? (
                                <motion.div
                                    key="products"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                >
                                    {seller.products.map((product: any) => (
                                        <Link
                                            href={`/products/${product.id || product._id}`}
                                            key={product.id || product._id}
                                            className="group bg-white rounded-xl border border-slate-100 p-4 hover:shadow-xl transition-all hover:scale-[1.02]"
                                        >
                                            <div className="aspect-square bg-[#f5f5f5] rounded-lg overflow-hidden mb-4 relative p-4">
                                                <img
                                                    src={product.images?.[0] || '/placeholder.png'}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</p>
                                                <h3 className="text-sm font-bold text-black tracking-tight truncate">{product.name}</h3>
                                                <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                                                    <p className="text-lg font-bold text-black">₹{product.price?.toLocaleString() || product.basePrice?.toLocaleString()}</p>
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-black group-hover:text-white transition-all">
                                                        <FaChevronRight className="w-3 h-3" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    {seller.products.length === 0 && (
                                        <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                            No active products listed currently.
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="reviews"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    {/* Rate This Seller Button */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-black">Customer Reviews</h3>
                                            <p className="text-xs text-slate-400 font-medium">
                                                {seller.stats.reviewCount} {seller.stats.reviewCount === 1 ? 'rating' : 'ratings'} • {seller.stats.averageRating.toFixed(1)} average
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleOpenRatingForm}
                                            className="px-5 py-2.5 bg-black text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-black/90 transition-all flex items-center gap-2"
                                        >
                                            <FaStar className="w-3 h-3" />
                                            Rate This Seller
                                        </button>
                                    </div>

                                    {/* Review List */}
                                    <ReviewList type="SELLER" targetId={id as string} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Rating Form Modal */}
            <AnimatePresence>
                {showRatingForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowRatingForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <div>
                                    <h3 className="text-lg font-bold text-black">Rate {seller.businessName}</h3>
                                    <p className="text-xs text-slate-400 font-medium mt-1">Share your experience with this seller</p>
                                </div>
                                <button
                                    onClick={() => setShowRatingForm(false)}
                                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                                >
                                    <FaTimes className="w-3 h-3 text-slate-500" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                {/* Select Order */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Order *</label>
                                    {customerOrders.length > 0 ? (
                                        <select
                                            value={ratingForm.orderId}
                                            onChange={e => setRatingForm({ ...ratingForm, orderId: e.target.value })}
                                            className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-black bg-white focus:outline-none focus:border-black transition-colors"
                                        >
                                            <option value="">Choose a delivered order...</option>
                                            {customerOrders.map((order: any) => (
                                                <option key={order._id} value={order._id}>
                                                    Order #{(order._id || '').slice(-6).toUpperCase()} — {new Date(order.createdAt).toLocaleDateString()}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="bg-slate-50 rounded-lg p-4 text-center">
                                            <p className="text-xs text-slate-400 font-medium">
                                                No delivered orders from this seller. You can only review sellers you've purchased from.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Star Ratings */}
                                <div className="space-y-4 bg-slate-50 rounded-xl p-5">
                                    <StarSelector label="Overall Rating" value={ratingForm.rating} onChange={v => setRatingForm({ ...ratingForm, rating: v })} />
                                    <StarSelector label="Delivery" value={ratingForm.delivery} onChange={v => setRatingForm({ ...ratingForm, delivery: v })} />
                                    <StarSelector label="Packaging" value={ratingForm.packaging} onChange={v => setRatingForm({ ...ratingForm, packaging: v })} />
                                    <StarSelector label="Communication" value={ratingForm.communication} onChange={v => setRatingForm({ ...ratingForm, communication: v })} />
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Review Title</label>
                                    <input
                                        type="text"
                                        placeholder="Brief summary of your experience"
                                        value={ratingForm.title}
                                        onChange={e => setRatingForm({ ...ratingForm, title: e.target.value })}
                                        maxLength={100}
                                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-black placeholder:text-slate-300 focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>

                                {/* Comment */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Review *</label>
                                    <textarea
                                        placeholder="Tell us about your experience with this seller..."
                                        value={ratingForm.comment}
                                        onChange={e => setRatingForm({ ...ratingForm, comment: e.target.value })}
                                        maxLength={1000}
                                        rows={4}
                                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-black placeholder:text-slate-300 focus:outline-none focus:border-black transition-colors resize-none"
                                    />
                                    <p className="text-[10px] text-slate-300 font-medium text-right">{ratingForm.comment.length}/1000</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex gap-3 p-6 border-t border-slate-100">
                                <button
                                    onClick={() => setShowRatingForm(false)}
                                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={isSubmitting || !ratingForm.orderId || !ratingForm.comment.trim()}
                                    className="flex-1 py-3 bg-black text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-black/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
