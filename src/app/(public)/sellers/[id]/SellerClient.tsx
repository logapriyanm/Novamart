'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sellerService } from '@/lib/api/services/seller.service';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStore, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaShieldAlt, FaComments } from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import Link from 'next/link';
import { useAuth } from '@/client/hooks/useAuth';
import { chatService } from '@/lib/api/services/chat.service';
import Loader from '@/client/components/ui/Loader';

interface SellerClientProps {
    id: string;
    initialData?: any;
}

export default function SellerClient({ id, initialData }: SellerClientProps) {
    const [seller, setSeller] = useState<any>(initialData || null);
    const [isLoading, setIsLoading] = useState(!initialData);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('products');
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    const handleMessageSeller = async () => {
        if (!isAuthenticated) {
            alert('Please login to message the seller');
            router.push('/auth/login');
            return;
        }

        try {
            setIsMessageLoading(true);
            const chat = await chatService.createChat(seller.userId);
            router.push(`/customer/messages?chatId=${chat.id}`);
        } catch (error) {
            console.error('Failed to create chat:', error);
            alert('Failed to initiate chat');
        } finally {
            setIsMessageLoading(false);
        }
    };

    useEffect(() => {
        const fetchSeller = async () => {
            if (initialData) return;
            if (id) {
                try {
                    const data = await sellerService.getPublicProfile(id);
                    setSeller(data);
                } catch (error) {
                    console.error('Failed to fetch seller:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchSeller();
    }, [id, initialData]);

    if (isLoading) {
        return <div className="min-h-screen pt-32 flex justify-center"><Loader size="xl" /></div>;
    }

    if (!seller) {
        return <div className="min-h-screen pt-32 text-center text-slate-500 font-bold uppercase tracking-widest text-sm">Seller not found</div>;
    }

    return (
        <div className="min-h-screen  pt-28 pb-20">
            <div className="container-responsive">
                {/* Header Card (Ultra Premium) */}
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-500/5 border border-slate-100 p-8 md:p-12 mb-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-blue-100/50 transition-colors" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#067FF9] to-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/20 transform hover:rotate-3 transition-transform">
                                <FaStore size={48} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <h1 className="text-3xl md:text-5xl font-black text-[#1E293B] tracking-tight italic uppercase">
                                        {seller.businessName}
                                    </h1>
                                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                                        <FaShieldAlt size={14} />
                                        <span className="text-sm font-black uppercase tracking-widest">Verified Seller</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-6 text-slate-400 font-bold uppercase tracking-widest text-sm">
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-[#067FF9]" />
                                        <span>{seller.city}, {seller.state}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-[#067FF9]" />
                                        <span>Serving since {new Date(seller.joinedAt).getFullYear()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 lg:pl-10 lg:border-l border-slate-100">
                            <div className="flex gap-10 mr-6">
                                <div className="text-center group/stat">
                                    <div className="text-4xl font-black text-[#1E293B] group-hover:text-[#067FF9] transition-colors">{seller.stats.totalProducts}</div>
                                    <div className="text-sm font-black text-slate-400 uppercase tracking-widest mt-1">Catalog Size</div>
                                </div>
                                <div className="text-center group/stat">
                                    <div className="text-4xl font-black text-[#1E293B] flex items-center justify-center gap-2 group-hover:text-amber-500 transition-colors">
                                        {seller.stats.averageRating.toFixed(1)}
                                        <FaStar className="text-amber-400 fill-amber-400" size={24} />
                                    </div>
                                    <div className="text-sm font-black text-slate-400 uppercase tracking-widest mt-1">{seller.stats.reviewCount} Reviews</div>
                                </div>
                            </div>

                            <button
                                onClick={handleMessageSeller}
                                disabled={isMessageLoading}
                                className="bg-black text-white px-8 py-4 rounded-[10px] font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[#067FF9] transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50"
                            >
                                <FaComments size={18} />
                                {isMessageLoading ? (
                                    <>
                                        <Loader size="sm" variant="white" />
                                        <span>Connecting...</span>
                                    </>
                                ) : 'Message Seller'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs & Content */}
                <div className="flex items-center gap-4 mb-8 border-b border-slate-200 pb-1">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-4 px-6 font-black uppercase tracking-widest text-xs transition-all relative ${activeTab === 'products' ? 'text-[#067FF9]' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Storefront
                        {activeTab === 'products' && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#067FF9]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`pb-4 px-6 font-black uppercase tracking-widest text-xs transition-all relative ${activeTab === 'reviews' ? 'text-[#067FF9]' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Customer Feedback
                        {activeTab === 'reviews' && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#067FF9]" />
                        )}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'products' ? (
                        <motion.div
                            key="products-grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {seller.inventory.map((item: any) => (
                                <Link href={`/products/${item.id}`} key={item.inventoryId} className="group">
                                    <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                        <div className="aspect-square bg-slate-50 relative overflow-hidden">
                                            {item.images?.[0] ? (
                                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><MdOutlineProductionQuantityLimits size={40} className="text-slate-200" /></div>
                                            )}
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-black text-black shadow-sm">
                                                {item.category?.toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-black text-[#1E293B] uppercase italic tracking-tight mb-2 group-hover:text-[#067FF9] transition-colors">{item.name}</h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xl font-black text-black tracking-tighter">₹{parseFloat(item.price).toLocaleString()}</span>
                                                {item.stock < 10 && (
                                                    <span className="text-sm font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-md">Low Stock</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="reviews-list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-3xl space-y-6"
                        >
                            {seller.reviews?.length > 0 ? (
                                seller.reviews.map((review: any, idx: number) => (
                                    <div key={idx} className="bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center font-black text-[#067FF9] uppercase">
                                                    {review.customer?.name?.[0] || 'C'}
                                                </div>
                                                <div>
                                                    <div className="font-black text-[#1E293B] uppercase text-xs">{review.customer?.name}</div>
                                                    <div className="text-sm text-slate-400 font-bold uppercase">{new Date(review.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-amber-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} size={12} className={i < review.rating ? 'fill-current' : 'text-slate-200'} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-600 italic font-medium leading-relaxed">"{review.comment || 'No comment provided.'}"</p>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm italic">No verified reviews yet for this seller.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
