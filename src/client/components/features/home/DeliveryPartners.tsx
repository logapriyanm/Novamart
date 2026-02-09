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

const PARTNERS = [
    { name: 'BlueDart', icon: FaTruckMoving, color: '#0056b3' },
    { name: 'DHL Express', icon: FaDhl, color: '#d40511' },
    { name: 'FedEx', icon: FaFedex, color: '#4d148c' },
    { name: 'Delhivery', icon: FaShippingFast, color: '#ff3e6c' },
    { name: 'DTDC', icon: FaBoxOpen, color: '#00529b' },
    { name: 'Ecom Express', icon: FaTruckMoving, color: '#1a237e' },
    { name: 'Shadowfax', icon: FaShippingFast, color: '#00af87' },
    { name: 'XpressBees', icon: FaBoxOpen, color: '#e65100' },
    { name: 'Amazon Shipping', icon: FaAmazon, color: '#FF9900' },
    { name: 'UPS', icon: FaUps, color: '#351c15' },
];

export default function DeliveryPartners() {
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
                    {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-3 shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 cursor-default group">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <partner.icon className="w-8 h-8" style={{ color: partner.color }} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{partner.name}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
