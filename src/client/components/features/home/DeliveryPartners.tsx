'use client';

import React from 'react';
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
    // Duplicate for seamless loop
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
        <div className="w-full bg-white border-y border-slate-100 py-12 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Trusted Delivery <span className="text-rose-500">Partners</span></h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Fast & Secure Shipping Across India</p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee flex gap-16 items-center whitespace-nowrap min-w-full group-hover:[animation-play-state:paused]">
                    {PARTNERS.map((partner, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-3 shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 cursor-default">
                            <partner.icon className="w-12 h-12" style={{ color: partner.color }} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{partner.name}</span>
                        </div>
                    ))}
                </div>

                {/* Duplicate container for seamless loop if needed by CSS implementation (Tailwind animate-marquee usually handles this via keyframes, but double rendering ensures coverage) */}
                <div className="absolute top-0 animate-marquee2 flex gap-16 items-center whitespace-nowrap min-w-full group-hover:[animation-play-state:paused] ml-16">
                    {PARTNERS.map((partner, idx) => (
                        <div key={`dup-${idx}`} className="flex flex-col items-center gap-3 shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 cursor-default">
                            <partner.icon className="w-12 h-12" style={{ color: partner.color }} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{partner.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); } 
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    );
}
