'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaDhl,
    FaUps,
    FaFedex,
    FaAmazon,
    FaShippingFast,
    FaTruckMoving,
    FaBoxOpen
} from 'react-icons/fa';

const iconMap: Record<string, any> = {
    'FaDhl': FaDhl,
    'FaUps': FaUps,
    'FaFedex': FaFedex,
    'FaAmazon': FaAmazon,
    'FaShippingFast': FaShippingFast,
    'FaTruckMoving': FaTruckMoving,
    'FaBoxOpen': FaBoxOpen
};

interface DeliveryPartnersProps {
    partners?: { name: string; icon: string; color: string }[];
}

export default function DeliveryPartners({ partners = [] }: DeliveryPartnersProps) {
    if (partners.length === 0) return null;
    return (
        <div className="w-full   border-slate-100 py-12 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Trusted Delivery <span className="text-rose-500">Partners</span></h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Fast & Secure Shipping Across India</p>
            </div>

            <div className="flex overflow-hidden">
                {/* Scroll Container */}
                <motion.div
                    className="flex gap-16 items-center whitespace-nowrap min-w-full"
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        duration: 30,
                        ease: "linear"
                    }}
                >
                    {/* Render specific number of duplicates to ensure width allows for smooth scrolling without gaps */}
                    {[...partners, ...partners, ...partners, ...partners].map((partner, idx) => {
                        const Icon = iconMap[partner.icon] || FaTruckMoving;
                        return (
                            <div key={idx} className="flex flex-col items-center gap-3 shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 cursor-default group">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                    <Icon className="w-8 h-8" style={{ color: partner.color }} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{partner.name}</span>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}
