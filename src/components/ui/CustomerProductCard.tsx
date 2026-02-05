'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, ShieldCheck, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
    isLiked?: boolean;
}

export default function CustomerProductCard({ id, name, price, image, rating, isLiked: initiallyLiked = false }: ProductCardProps) {
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(initiallyLiked);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [actionType, setActionType] = useState<'LIKE' | 'CART' | null>(null);

    // Mock Auth Check
    const isAuthenticated = false; // Forced false for demonstration

    const handleAction = (type: 'LIKE' | 'CART') => {
        if (!isAuthenticated) {
            setActionType(type);
            setShowAuthModal(true);
            return;
        }

        if (type === 'LIKE') setIsLiked(!isLiked);
    };

    return (
        <>
            <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/60 backdrop-blur-xl border border-[#2772A0]/10 rounded-[2.5rem] overflow-hidden group shadow-lg shadow-[#2772A0]/5 transition-all hover:bg-white/80"
            >
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button
                            onClick={() => handleAction('LIKE')}
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl transition-all ${isLiked ? 'bg-[#2772A0] text-[#CCDDEA]' : 'bg-white/80 text-[#1E293B]/60 hover:text-[#2772A0] backdrop-blur-md'}`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                        <div className="bg-[#2772A0] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-[#2772A0]/20">
                            <ShieldCheck className="w-3 h-3" />
                            Escrow Ready
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-[#1E293B] text-lg leading-tight group-hover:text-[#2772A0] transition-colors">{name}</h3>
                        <div className="flex items-center gap-1 bg-[#2772A0]/5 px-2 py-1 rounded-xl">
                            <Star className="w-3 h-3 text-[#2772A0] fill-current" />
                            <span className="text-[10px] font-black text-[#2772A0]">{rating}</span>
                        </div>
                    </div>

                    <p className="text-[#1E293B]/40 text-xs font-bold uppercase tracking-widest mb-6">Verified Manufacturer</p>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-[#2772A0]">₹{price.toLocaleString()}</span>
                            <span className="text-[8px] font-bold text-[#1E293B]/30 uppercase tracking-[0.2em]">Retail Inclusive</span>
                        </div>
                        <button
                            onClick={() => handleAction('CART')}
                            className="w-12 h-12 rounded-2xl bg-[#2772A0] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#2772A0]/20"
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Auth Required Modal */}
            <AnimatePresence>
                {showAuthModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAuthModal(false)}
                            className="absolute inset-0 bg-[#1E293B]/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden"
                        >
                            {/* Ambient BG for Modal */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2772A0]/5 blur-3xl -mr-32 -mt-32 rounded-full" />

                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="absolute top-8 right-8 text-[#1E293B]/40 hover:text-[#1E293B] transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="relative z-10 text-center">
                                <div className="w-20 h-20 bg-[#2772A0]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#2772A0]/20">
                                    <ShieldCheck className="w-10 h-10 text-[#2772A0]" />
                                </div>
                                <h2 className="text-3xl font-black text-[#1E293B] mb-4 tracking-tight">Authentication Required</h2>
                                <p className="text-[#1E293B]/60 font-medium mb-12 italic">
                                    To {actionType === 'LIKE' ? 'save this item' : 'add this to your cart'},
                                    you must be part of the Novamart platform.
                                </p>

                                <div className="grid grid-cols-1 gap-4">
                                    <button
                                        onClick={() => router.push('/auth/login')}
                                        className="w-full py-5 bg-[#2772A0] text-white font-black text-sm rounded-2xl shadow-xl shadow-[#2772A0]/20 hover:scale-[1.02] transition-all uppercase tracking-widest"
                                    >
                                        Log In to Portal
                                    </button>
                                    <div className="flex items-center gap-4 py-4">
                                        <div className="h-px bg-[#1E293B]/10 flex-1" />
                                        <span className="text-[10px] font-black text-[#1E293B]/30 uppercase tracking-widest">or Register Based on Role</span>
                                        <div className="h-px bg-[#1E293B]/10 flex-1" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            { label: 'Customer', path: '/auth/register/customer' },
                                            { label: 'Dealer', path: '/auth/register/dealer' },
                                            { label: 'Manufacturer', path: '/auth/register/manufacturer' }
                                        ].map((r, i) => (
                                            <button
                                                key={i}
                                                onClick={() => router.push(r.path)}
                                                className="py-4 bg-[#2772A0]/5 border border-[#2772A0]/10 rounded-2xl text-[#2772A0] text-[10px] font-black uppercase tracking-widest hover:bg-[#2772A0] hover:text-white transition-all shadow-sm"
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
