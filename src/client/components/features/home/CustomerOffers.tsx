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

const offers = [
    {
        id: 'welcome',
        icon: FaGift,
        title: 'Welcome / New User Offers',
        subtitle: 'For our newest members',
        details: [
            'Flat ₹X discount on first order',
            'Free delivery on first purchase',
            'Welcome coupon valid for limited days'
        ],
        purpose: ['Increase conversion', 'Reduce hesitation'],
        color: 'bg-indigo-600',
        lightColor: 'bg-indigo-50'
    },
    {
        id: 'festival',
        icon: FaCalendarAlt,
        title: 'Festival & Special Day Offers',
        subtitle: 'Celebrate with us',
        details: [
            'Diwali & Festive Sales',
            'Valentine\'s Day Specials',
            'Birthday Discounts',
            'Seasonal limited-time coupons'
        ],
        purpose: ['Emotional engagement', 'Time-based urgency'],
        color: 'bg-rose-500',
        lightColor: 'bg-rose-50',
        badge: 'Limited Time'
    },
   
    {
        id: 'coupons',
        icon: FaTicketAlt,
        title: 'Coupon Code Offers',
        subtitle: 'Smart savings at checkout',
        details: [
            'Flat & Percentage discount codes',
            'Category-specific vouchers',
            'Codes: NOVA10, FIRSTBUY, FESTIVE20'
        ],
        purpose: ['Easy marketing', 'Campaign tracking'],
        color: 'bg-amber-500',
        lightColor: 'bg-amber-50'
    },
   
];

export default function CustomerOffers() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 mb-6"
                        >
                            <FaGift className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">Rewards Program</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight"
                        >
                            🎁 Customer Offers <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">in NovaMart</span>
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
                    {offers.map((offer, idx) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-200/40 border border-slate-100 transition-all duration-500"
                        >
                            {offer.badge && (
                                <div className="absolute top-8 right-8 px-4 py-1.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                    {offer.badge}
                                </div>
                            )}

                            <div className={`w-16 h-16 rounded-2xl ${offer.lightColor} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                <offer.icon className={`w-8 h-8 ${offer.color.replace('bg-', 'text-')}`} />
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
                                    {offer.details.map((detail, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                                            {detail}
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-6 border-t border-slate-50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Core Purpose</p>
                                    <div className="flex flex-wrap gap-2">
                                        {offer.purpose.map((p, i) => (
                                            <span key={i} className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-600 uppercase border border-slate-100">
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
                    ))}
                </div>

                {/* Bottom Call to Action or Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 p-12 bg-slate-900 rounded-[3rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10"
                >
                    <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

                    <div className="relative z-10 space-y-4">
                        <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                            Ready to unlock exclusive benefits?
                        </h4>
                        <p className="text-slate-400 font-bold max-w-xl">
                            Join thousands of satisfied shoppers on NovaMart and experience a smarter way to shop with premium savings.
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
