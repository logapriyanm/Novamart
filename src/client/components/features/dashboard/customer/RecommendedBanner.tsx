'use client';

import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

export default function RecommendedBanner() {
    return (
        <div className="relative overflow-hidden rounded-[10px] bg-gradient-to-br from-slate-100 to-slate-200 p-8 md:p-12">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                <div className="max-w-lg space-y-6">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                        AI Recommendation
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-[#1E293B] leading-tight">
                        Upgrade your Workspace
                    </h2>
                    <p className="text-slate-600 font-medium leading-relaxed max-w-sm">
                        Based on your recent B2B office supply purchases, we thought you might like these productivity essentials at special corporate rates.
                    </p>

                    <div className="flex gap-4 pt-4">
                        <div className="flex items-center gap-3 bg-white p-3 rounded-[10px] shadow-sm">
                            <img src="https://images.unsplash.com/photo-1618384887929-16ec33caa9ea?q=80&w=100" alt="Mouse" className="w-12 h-12 rounded-[10px] object-cover" />
                            <div>
                                <p className="text-xs font-black text-[#1E293B]">Ergo Pro Mouse</p>
                                <p className="text-[10px] font-bold text-[#0F6CBD]">₹79.99</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-[10px] shadow-sm">
                            <img src="https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=100" alt="Keyboard" className="w-12 h-12 rounded-[10px] object-cover" />
                            <div>
                                <p className="text-xs font-black text-[#1E293B]">Mechanical Keyboard</p>
                                <p className="text-[10px] font-bold text-[#0F6CBD]">₹129.99</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banner Image / Right Side */}
                <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto md:h-64 rounded-[10px] overflow-hidden shadow-2xl skew-x-[-3deg] md:rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white">
                    <img
                        src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800"
                        alt="Workspace Setup"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                        <button className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-wider group">
                            Curation <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/50 rounded-full blur-3xl z-0 pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl z-0 pointer-events-none"></div>
        </div>
    );
}
