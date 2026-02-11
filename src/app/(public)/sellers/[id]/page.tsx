'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaStore,
    FaCheckCircle,
    FaStar,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaBox,
    FaCommentAlt,
    FaArrowLeft,
    FaChevronRight
} from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SellerProfilePage() {
    const { id } = useParams();
    const [seller, setSeller] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Products');

    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/sellers/${id}`);
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

    if (isLoading) {
        return (
            <div className="min-h-screen pt-40 flex justify-center bg-[#F9FAFB]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="min-h-screen pt-40 text-center bg-[#F9FAFB]">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Seller not found.</p>
                <Link href="/products" className="text-primary font-black mt-4 block uppercase text-[10px] tracking-widest">Return to Market</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-40 pb-20 bg-[#F9FAFB]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Back Button */}
                <Link href="/products" className="inline-flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-12 hover:text-black transition-all">
                    <FaArrowLeft /> Back to Discovery
                </Link>

                {/* Seller Header */}
                <div className="bg-white rounded-[2rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

                    <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
                        {/* Avatar/Logo */}
                        <div className="w-32 h-32 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary shadow-inner shrink-0 scale-110">
                            <FaStore className="w-12 h-12" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-wrap items-center gap-4">
                                <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">{seller.businessName}</h1>
                                {seller.isVerified && (
                                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                                        <FaCheckCircle className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Verified Seller</span>
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
                                {seller.description || `${seller.businessName} is a premier partner on NovaMart, providing high-quality industrial and commercial assets with verified fulfillment excellence.`}
                            </p>

                            <div className="flex flex-wrap gap-10 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-3">
                                    <FaMapMarkerAlt className="text-primary w-4 h-4" />
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                                        <p className="text-xs font-bold text-slate-900">{seller.city}, {seller.state || 'India'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="text-primary w-4 h-4" />
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Member Since</p>
                                        <p className="text-xs font-bold text-slate-900">{new Date(seller.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex text-amber-400 gap-1 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100/50">
                                        <FaStar className="w-4 h-4 fill-current" />
                                        <span className="text-sm font-black text-slate-900 italic">{seller.stats.averageRating.toFixed(1)}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Based on {seller.stats.reviewCount} Ratings</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="flex border-b border-slate-50 bg-slate-50/30">
                        {['Products', 'Reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-12 py-7 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <span className="flex items-center gap-3">
                                    {tab === 'Products' ? <FaBox className="w-3.5 h-3.5" /> : <FaCommentAlt className="w-3.5 h-3.5" />}
                                    {tab}
                                </span>
                                {activeTab === tab && (
                                    <motion.div layoutId="sellerActiveTab" className="absolute bottom-0 left-0 right-0 h-[4px] bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-12">
                        <AnimatePresence mode="wait">
                            {activeTab === 'Products' ? (
                                <motion.div
                                    key="products"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                                >
                                    {seller.products.map((product: any) => (
                                        <Link
                                            href={`/products/${product.id || product._id}`}
                                            key={product.id || product._id}
                                            className="group bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-2xl transition-all hover:scale-[1.02]"
                                        >
                                            <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-6 relative p-4">
                                                <img
                                                    src={product.images?.[0] || '/placeholder.png'}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-[9px] font-black text-primary uppercase tracking-widest">{product.category}</p>
                                                <h3 className="text-sm font-black text-slate-800 uppercase italic tracking-tight truncate">{product.name}</h3>
                                                <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                                                    <p className="text-lg font-black text-slate-900 italic tracking-tighter">₹{product.price?.toLocaleString() || product.basePrice?.toLocaleString()}</p>
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                        <FaChevronRight className="w-3 h-3" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    {seller.products.length === 0 && (
                                        <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic opacity-50">
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
                                    className="space-y-10 max-w-4xl mx-auto"
                                >
                                    {seller.reviews.map((review: any) => (
                                        <div key={review._id} className="bg-slate-50/50 p-8 rounded-[1.5rem] border border-slate-100 relative group hover:bg-white hover:shadow-xl transition-all">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-slate-400 text-sm italic uppercase">
                                                        {review.customerId?.name?.substring(0, 2) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{review.customerId?.name}</p>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Verified Experience</p>
                                                    </div>
                                                </div>
                                                <div className="flex text-amber-400 gap-1 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-slate-100'}`} />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pl-1 relative">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/10 rounded-full" />
                                                <div className="pl-6">
                                                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed italic">{review.comment || 'No feedback provided, but rating was positive.'}</p>

                                                    <div className="flex gap-8 mt-6 pt-6 border-t border-slate-100/50">
                                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                            Delivery: <span className="text-emerald-500 ml-1">★ {review.deliveryRating || 'N/A'}</span>
                                                        </div>
                                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                            Packaging: <span className="text-emerald-500 ml-1">★ {review.packagingRating || 'N/A'}</span>
                                                        </div>
                                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                            Support: <span className="text-emerald-500 ml-1">★ {review.communicationRating || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute top-8 right-8 text-[9px] font-bold text-slate-300 uppercase italic opacity-0 group-hover:opacity-100 transition-opacity">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                    {seller.reviews.length === 0 && (
                                        <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic opacity-50">
                                            No seller reviews yet.
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
