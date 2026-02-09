'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaBirthdayCake, FaHeart, FaGift, FaStar } from 'react-icons/fa';

interface OccasionBannerProps {
    type: 'BIRTHDAY' | 'FESTIVAL' | 'ANNIVERSARY' | 'WELCOME' | null;
    discount?: number;
    userName?: string;
}

export default function OccasionBanner({ type, discount, userName }: OccasionBannerProps) {
    if (!type) return null;

    const content = {
        BIRTHDAY: {
            title: `Happy Birthday, ${userName}!`,
            message: `Here's a special ${discount}% OFF just for you. Treat yourself!`,
            icon: FaBirthdayCake,
            bg: 'bg-gradient-to-r from-pink-500 to-rose-500',
            textColor: 'text-white'
        },
        FESTIVAL: {
            title: 'Festive Season Sale 🪔',
            message: 'Light up your home with our exclusive offers.',
            icon: FaGift,
            bg: 'bg-gradient-to-r from-amber-400 to-orange-500',
            textColor: 'text-white'
        },
        ANNIVERSARY: {
            title: `Happy Member Anniversary!`,
            message: `You've been with us for another year. Enjoy ${discount}% OFF as a thank you!`,
            icon: FaStar,
            bg: 'bg-gradient-to-r from-indigo-500 to-purple-600',
            textColor: 'text-white'
        },
        WELCOME: {
            title: `Welcome to NovaMart!`,
            message: `New here? Enjoy ${discount}% OFF on your first purchase.`,
            icon: FaGift,
            bg: 'bg-gradient-to-r from-teal-400 to-emerald-500',
            textColor: 'text-white'
        }
    }[type];

    if (!content) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[10px] p-8 mb-12 border border-white/20 ${content.bg} relative overflow-hidden`}
        >
            <div className="absolute top-0 right-0 p-12 opacity-10 transform rotate-12">
                <content.icon size={120} className="text-white" />
            </div>

            <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
                    <content.icon size={32} className="text-white" />
                </div>
                <div>
                    <h2 className={`text-2xl font-black mb-1 ${content.textColor}`}>{content.title}</h2>
                    <p className={`text-lg opacity-90 font-medium ${content.textColor}`}>{content.message}</p>
                </div>
                <button className="ml-auto bg-white text-black px-6 py-4 rounded-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all shadow-lg active:scale-95">
                    Claim Offer
                </button>
            </div>
        </motion.div>
    );
}
