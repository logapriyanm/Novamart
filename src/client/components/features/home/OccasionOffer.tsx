'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaBirthdayCake, FaGift } from 'react-icons/fa';

interface OccasionOfferProps {
    data: {
        type: 'LOVERS_DAY' | 'BIRTHDAY';
        discount: number;
    } | null;
}

export default function OccasionOffer({ data }: OccasionOfferProps) {
    if (!data) return null;

    const isBirthday = data.type === 'BIRTHDAY';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative w-full rounded-[2.5rem] p-8 mb-12 overflow-hidden shadow-2xl shadow-primary/20 bg-gradient-to-r ${isBirthday
                    ? 'from-[#FF6B6B] to-[#FF8E53]'
                    : 'from-[#F06292] to-[#EC407A]'
                }`}
        >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl text-white shadow-inner">
                        {isBirthday ? <FaBirthdayCake /> : <FaHeart />}
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter mb-1">
                            {isBirthday ? "Happy Birthday! 🎂" : "Happy Lover's Day! ❤️"}
                        </h2>
                        <p className="text-white/80 font-bold uppercase tracking-widest text-xs">
                            {isBirthday
                                ? "Celebrate your special day with a special treat from us."
                                : "Give the gift of premium comfort to your loved ones."
                            }
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Exclusive Voucher</p>
                        <p className="text-5xl font-black text-white tracking-tighter">
                            {data.discount}% <span className="text-xl">OFF</span>
                        </p>
                    </div>
                    <button className="px-8 py-4 bg-white text-rose-500 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-rose-900/20 flex items-center gap-3">
                        Claim Offer
                        <FaGift className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Micro-animations: Floating particles */}
            <motion.div
                animate={{ y: [0, -10, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 left-[20%] text-white text-xl"
            >
                {isBirthday ? "🎈" : "💖"}
            </motion.div>
            <motion.div
                animate={{ y: [0, 15, 0], opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 right-[30%] text-white text-2xl"
            >
                {isBirthday ? "🎁" : "🌹"}
            </motion.div>
        </motion.div>
    );
}
