'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaBirthdayCake, FaHeart, FaGift } from 'react-icons/fa';

interface OccasionBannerProps {
    type: 'BIRTHDAY' | 'LOVERS_DAY' | 'FESTIVAL' | null;
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
        LOVERS_DAY: {
            title: 'Valentine\'s Special ❤️',
            message: `Celebrate love with ${discount}% OFF on gifts for your special one.`,
            icon: FaHeart,
            bg: 'bg-gradient-to-r from-red-500 to-pink-600',
            textColor: 'text-white'
        },
        FESTIVAL: {
            title: 'Festive Season Sale 🪔',
            message: 'Light up your home with our exclusive offers.',
            icon: FaGift,
            bg: 'bg-gradient-to-r from-amber-400 to-orange-500',
            textColor: 'text-white'
        }
    }[type];

    if (!content) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl p-8 mb-12 shadow-xl ${content.bg} relative overflow-hidden`}
        >
            <div className="absolute top-0 right-0 p-12 opacity-10 transform rotate-12">
                <content.icon size={120} className="text-white" />
            </div>

            <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <content.icon size={32} className="text-white" />
                </div>
                <div>
                    <h2 className={`text-2xl font-black mb-1 ${content.textColor}`}>{content.title}</h2>
                    <p className={`text-lg opacity-90 font-medium ${content.textColor}`}>{content.message}</p>
                </div>
                <button className="ml-auto bg-white text-rose-600 px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-white/90 transition-colors shadow-lg">
                    Claim Offer
                </button>
            </div>
        </motion.div>
    );
}
