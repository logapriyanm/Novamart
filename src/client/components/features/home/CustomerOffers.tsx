'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaGift,
    FaStar,
    FaCalendarAlt,
    FaLayerGroup,
    FaTicketAlt,
    FaTruck,
    FaBolt,
    FaArrowRight
} from 'react-icons/fa';

const iconMap: Record<string, any> = {
    'FaGift': FaGift,
    'FaStar': FaStar,
    'FaCalendarAlt': FaCalendarAlt,
    'FaLayerGroup': FaLayerGroup,
    'FaTicketAlt': FaTicketAlt,
    'FaTruck': FaTruck,
    'FaBolt': FaBolt
};

interface CustomerOffersProps {
    offers?: any[];
    ctaTitle?: string;
    ctaSubtitle?: string;
}

export default function CustomerOffers({
    offers = [],
    ctaTitle = "Ready to unlock exclusive benefits?",
    ctaSubtitle = "Join thousands of satisfied shoppers on NovaMart and experience a smarter way to shop with premium savings."
}: CustomerOffersProps) {
    if (offers.length === 0) return null;

    return (
        <section className="py-10 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-indigo-200/30 rounded-full blur-[120px] opacity-60 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-blue-200/30 rounded-full blur-[120px] opacity-60 translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-[1300px] mx-auto px-4 lg:px-8 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-3xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight"
                        >
                            🎁 Customer Offers in
                            <span className="text-transparent text-4xl italic bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600"> NovaMart</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 text-lg text-slate-500 font-medium leading-relaxed max-w-2xl"
                        >
                            NovaMart provides personalized, seasonal, and business-driven
                            offers to attract customers and increase repeat purchases.
                        </motion.p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {offers.map((offer, idx) => {
                        const Icon = iconMap[offer.icon] || FaGift;
                        return (
                            <motion.div
                                key={offer.id || idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-white/40 backdrop-blur-xl rounded-[24px] p-10 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-200/40 border border-white/50 transition-all duration-500 hover:-translate-y-2"
                            >
                                {offer.badge && (
                                    <div className="absolute top-8 right-8 px-4 py-1.5 rounded-full bg-rose-100 text-rose-600 text-sm font-semibold">
                                        {offer.badge}
                                    </div>
                                )}

                                <div className={`w-16 h-16 rounded-[20px] ${offer.lightColor || 'bg-white/60'} backdrop-blur-md flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/50 shadow-sm`}>
                                    <Icon className={`w-8 h-8 ${(offer.color || 'bg-indigo-600').replace('bg-', 'text-')}`} />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                                            {offer.title}
                                        </h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            {offer.subtitle}
                                        </p>
                                    </div>

                                    <ul className="space-y-3 py-4">
                                        {(offer.details || []).map((detail: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="pt-6 border-t border-slate-50">
                                        <p className="text-sm font-semibold text-slate-400 mb-3">Core purpose</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(offer.purpose || []).map((p: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-slate-50 rounded-lg text-sm font-semibold text-slate-600 border border-slate-100">
                                                    ✔ {p}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-8 right-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                    <FaArrowRight className="text-indigo-600" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Call to Action or Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-10 p-12 bg-slate-900 rounded-[10px] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10"
                >
                    <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

                    <div className="relative z-10 space-y-4">
                        <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                            {ctaTitle}
                        </h4>
                        <p className="text-slate-400 font-bold max-w-xl">
                            {ctaSubtitle}
                        </p>
                    </div>

                    <button className="relative z-10 px-10 py-5 bg-white text-slate-900 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-3 group">
                        Sign Up Now
                        <FaBolt className="w-3 h-3 text-indigo-600 group-hover:animate-bounce" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
