'use client';

import React from 'react';
import CustomerProductCard from '../../../src/components/ui/CustomerProductCard';
import { FaSearch as Search, FaFilter as Filter, FaSlidersH as SlidersHorizontal, FaMagic as Sparkles } from 'react-icons/fa';

const allProducts = [
    {
        id: '1',
        name: 'Quantum Force Industrial Drill',
        price: 12499,
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop',
        rating: 4.9
    },
    {
        id: '2',
        name: 'Solaris Pro Energy Panel v2',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1509391366360-fe5bb6521e7c?q=80&w=800&auto=format&fit=crop',
        rating: 4.8
    },
    {
        id: '3',
        name: 'Apex Precision Multimeter',
        price: 3200,
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
        rating: 4.7
    },
    {
        id: '4',
        name: 'Titan Heavy Duty Wrench Set',
        price: 5600,
        image: 'https://images.unsplash.com/photo-1530124560672-9993215239b9?q=80&w=800&auto=format&fit=crop',
        rating: 4.6
    },
    {
        id: '5',
        name: 'Omni Digital Caliper Pro',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc73b4?q=80&w=800&auto=format&fit=crop',
        rating: 4.9
    },
    {
        id: '6',
        name: 'Spectra LED Work Light',
        price: 4200,
        image: 'https://images.unsplash.com/photo-1517055727180-d1a6764d74f0?q=80&w=800&auto=format&fit=crop',
        rating: 4.5
    }
];

export default function ProductsPage() {
    return (
        <div className="min-h-screen pt-40 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2772A0]/10 border border-[#2772A0]/20 text-[10px] font-black uppercase tracking-widest text-[#2772A0] mb-4">
                            <Sparkles className="w-3 h-3" />
                            Global Verified Inventory
                        </div>
                        <h1 className="text-5xl font-black text-[#1E293B] tracking-tight leading-tight">
                            Protocol Grade <span className="text-[#2772A0]">Supplies</span>
                        </h1>
                        <p className="text-[#1E293B]/60 text-lg font-medium italic mt-4 max-w-lg">
                            Direct manufacturer access with state-enforced escrow safety. Browse vetted industrial and commercial assets.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E293B]/40" />
                            <input
                                type="text"
                                placeholder="Search platform inventory..."
                                className="w-full h-14 bg-white/60 backdrop-blur-xl border border-[#2772A0]/10 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-[#2772A0] transition-all"
                            />
                        </div>
                        <button className="h-14 px-6 bg-white border border-[#2772A0]/10 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#2772A0] hover:bg-[#2772A0]/5 transition-all">
                            <SlidersHorizontal className="w-5 h-5" />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {allProducts.map((product) => (
                        <CustomerProductCard key={product.id} {...product} />
                    ))}
                </div>

                <div className="mt-20 flex justify-center">
                    <button className="px-10 py-4 bg-white border border-[#2772A0]/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1E293B]/60 hover:text-[#2772A0] transition-all hover:bg-[#2772A0]/5">
                        Load More Inventories
                    </button>
                </div>
            </div>
        </div>
    );
}
