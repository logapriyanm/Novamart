import React from 'react';
import { FaTrophy as Trophy } from 'react-icons/fa';

export default function HeroSection() {
    return (
        <div className="bg-[#101827] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#101827] via-transparent to-[#101827] z-10" />
            <div className="max-w-7xl mx-auto px-6 py-8 lg:py-12 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-amber-400 mb-6">
                        <Trophy className="w-3 h-3" />
                        India SME 100 Awards 2025
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-black text-white mb-6 leading-tight tracking-tighter">
                        The Ultimate <br /> Home <span className="text-[#10367D]">Appliance Hub</span>
                    </h1>
                    <p className="text-white/60 text-lg font-medium mb-8 max-w-xl">
                        Novamart Recognized Among India's Top 100 Most Innovative Marketplace for Home Appliance Supply Chains.
                    </p>
                    <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Presented By</span>
                            <span className="text-xl font-black text-white">AXIS BANK</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Organised By</span>
                            <span className="text-sm font-black text-white">INDIA SME FORUM</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <div className="aspect-[16/9] lg:aspect-[2/1] rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700">
                        <img
                            src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop"
                            alt="Modern Appliances"
                            className="w-full h-full object-cover"
                        />
                    </div>

                </div>
            </div>

            {/* Visual Accent */}
            <div className="h-2 w-full bg-gradient-to-r from-[#10367D] via-[#10367D] to-[#10367D]" />
        </div>
    );
}

