import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Filter, Grid, List as ListIcon, ChevronDown, Plus } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Industrial Categories | Novamart B2B2C',
    description: 'Browse our extensive range of industrial products from verified manufacturers.',
};

export default function CategoryPage() {
    return (
        <div className="min-h-screen bg-[#CCDDEA] pt-24 lg:pt-32 pb-20 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 lg:space-y-12">
                {/* SEO Optimized Header */}
                <div className="flex flex-col gap-3 lg:gap-4 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-[10px] font-bold text-[#2772A0]/60 uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#2772A0]">Home</Link>
                        <span>/</span>
                        <span className="text-[#2772A0]">Categories</span>
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-extrabold text-[#2772A0] tracking-tight">Industrial Marketplace</h1>
                    <p className="text-sm lg:text-xl text-[#1E293B]/70 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                        Access raw materials and precision parts directly from verified manufacturers.
                    </p>
                </div>

                {/* Filter & Sort Bar */}
                <div className="flex items-center justify-between h-auto min-h-16 p-4 lg:px-6 bg-white/40 backdrop-blur-xl border border-[#2772A0]/10 rounded-2xl shadow-sm overflow-x-auto custom-scrollbar no-scrollbar">
                    <div className="flex items-center gap-4 lg:gap-8 min-w-max">
                        <button className="flex items-center gap-2 text-xs lg:text-sm font-bold text-[#2772A0] hover:text-[#1E5F86]">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                        <div className="h-6 w-px bg-[#2772A0]/10" />
                        <div className="flex items-center gap-4 lg:gap-6">
                            {['Steel', 'Bearings', 'Chemicals', 'Electronics'].map((cat) => (
                                <button key={cat} className="text-xs lg:text-sm font-bold text-[#1E293B]/60 hover:text-[#2772A0] transition-colors">{cat}</button>
                            ))}
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-4 min-w-max">
                        <button className="p-2 text-[#2772A0]/40 hover:text-[#2772A0] transition-colors"><Grid className="w-5 h-5" /></button>
                        <button className="p-2 text-[#2772A0]/40 hover:text-[#2772A0] transition-colors"><ListIcon className="w-5 h-5" /></button>
                        <div className="h-6 w-px bg-[#2772A0]/10 mx-2" />
                        <button className="flex items-center gap-2 text-sm font-bold text-[#2772A0]">
                            Sort
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Product/Category Grid Placeholder */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="group bg-white/40 border border-[#2772A0]/10 rounded-3xl p-6 hover:border-[#2772A0]/40 transition-all hover:translate-y-[-4px]">
                            <div className="aspect-square bg-gradient-to-br from-[#2772A0]/10 to-[#1E5F86]/10 rounded-2xl mb-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/10 group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 bg-[#2772A0] text-[#CCDDEA] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">Premium</div>
                            </div>
                            <h3 className="text-lg font-bold text-[#1E293B] mb-2 group-hover:text-[#2772A0] transition-colors">Industrial Component #{i}</h3>
                            <div className="flex items-center justify-between pt-4 border-t border-[#2772A0]/5">
                                <span className="text-xl font-bold text-[#2772A0]">₹4,250.00</span>
                                <button className="p-2 rounded-xl bg-[#2772A0]/5 text-[#2772A0] hover:bg-[#2772A0] hover:text-white transition-all">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
