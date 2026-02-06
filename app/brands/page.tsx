import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { FaStar as Star, FaShieldAlt as ShieldCheck, FaArrowRight as ArrowRight } from 'react-icons/fa';

export const metadata: Metadata = {
    title: 'Verified Global Brands | Novamart B2B2C',
    description: 'Explore verified manufacturers and leading industrial brands on our secure B2B2C platform.',
};

const brands = [
    { name: 'SteelSeries Industrial', sector: 'Metallurgy', rating: 4.9, logo: 'SS', verified: true },
    { name: 'Apex Precision', sector: 'Electronics', rating: 4.8, logo: 'AP', verified: true },
    { name: 'Global Bearings Co.', sector: 'Mechanical', rating: 4.7, logo: 'GB', verified: true },
    { name: 'HydroChem Ltd.', sector: 'Chemicals', rating: 4.9, logo: 'HC', verified: true },
];

export default function BrandPage() {
    return (
        <div className="min-h-screen bg-[#CCDDEA] pt-24 lg:pt-32 pb-16 lg:pb-20 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12 lg:space-y-20">
                {/* Brand Hero */}
                <div className="text-center space-y-4 lg:space-y-6 max-w-3xl mx-auto px-2">
                    <span className="text-[9px] lg:text-[10px] font-bold text-[#2772A0] px-3 lg:px-4 py-1.5 lg:py-2 bg-[#2772A0]/10 rounded-full border border-[#2772A0]/20 uppercase tracking-widest lg:tracking-[0.2em]">Verified Network</span>
                    <h1 className="text-3xl lg:text-6xl font-extrabold text-[#2772A0] tracking-tight leading-tight">Verified Manufacturers</h1>
                    <p className="text-sm lg:text-lg text-[#1E293B]/70 leading-relaxed font-medium">
                        Every manufacturer on Novamart undergoes rigorous factory audits to ensure absolute trust in every transaction.
                    </p>
                </div>

                {/* Brand Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                    {brands.map((brand) => (
                        <div key={brand.name} className="group bg-white/40 border border-[#2772A0]/10 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-10 backdrop-blur-md hover:border-[#2772A0]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-4 lg:gap-8 w-full sm:w-auto">
                                <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-[#2772A0] to-[#1E5F86] flex items-center justify-center text-white text-xl lg:text-3xl font-black shadow-xl shadow-[#2772A0]/20 flex-shrink-0">
                                    {brand.logo}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 lg:gap-3 mb-1 lg:mb-2">
                                        <h3 className="text-lg lg:text-2xl font-bold text-[#2772A0]">{brand.name}</h3>
                                        {brand.verified && <ShieldCheck className="w-4 h-4 text-[#2772A0]" />}
                                    </div>
                                    <div className="flex items-center gap-4 lg:gap-6">
                                        <span className="text-[10px] lg:text-sm font-bold text-[#1E293B]/60 uppercase tracking-widest">{brand.sector}</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-[#2772A0] fill-[#2772A0]" />
                                            <span className="text-xs lg:text-sm font-bold text-[#2772A0]">{brand.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#2772A0]/5 border border-[#2772A0]/10 flex items-center justify-center text-[#2772A0] group-hover:bg-[#2772A0] group-hover:text-white transition-all self-end sm:self-center flex-shrink-0">
                                <ArrowRight className="w-5 h-5 lg:w-6 h-6" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Trust Banner */}
                <div className="bg-[#2772A0] rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-16 relative overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[150%] bg-white/5 blur-[120px] rounded-full rotate-12" />
                    <h2 className="text-[#CCDDEA] text-2xl lg:text-4xl font-bold mb-4 lg:mb-6 max-w-2xl leading-tight">Become a Verified Manufacturer</h2>
                    <p className="text-[#CCDDEA]/60 text-sm lg:text-lg mb-8 lg:mb-10 max-w-xl">Join 400+ leading brands already scaling through our secure escrow platform.</p>
                    <Link href="/auth/register" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-[#CCDDEA] text-[#2772A0] px-8 lg:px-10 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black uppercase text-xs lg:text-sm tracking-widest hover:scale-105 transition-transform shadow-2xl">
                            Apply Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
