'use client';

import React from 'react';
import { FaSearch as Search, FaTimes as X, FaChevronDown as ChevronDown, FaFilter as Filter } from 'react-icons/fa';

const categories = [
    { name: 'Grocery', count: null },
    { name: 'Fashion', count: 5 },
    { name: 'Watches', count: null },
    { name: 'Electronics', count: 5 },
    { name: 'Furniture', count: 6 },
    { name: 'Automotive Accessories', count: null },
    { name: 'Appliances', count: 7 },
    { name: 'Kids', count: null },
];

const colors = [
    { name: 'Primary', class: 'bg-[#CCDDEA]' },
    { name: 'Secondary', class: 'bg-[#2772A0]' },
    { name: 'Deep Blue', class: 'bg-[#1E5F86]' },
    { name: 'Light Blue', class: 'bg-[#BCCCDA]' },
    { name: 'Navy', class: 'bg-[#101827]' },
    { name: 'White', class: 'bg-white border border-[#2772A0]/20' },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

export const ProductFilterSidebar = () => {
    return (
        <aside className="w-full lg:w-72 bg-white/40 backdrop-blur-md border border-[#2772A0]/10 rounded-[2rem] p-6 lg:sticky lg:top-28 h-fit self-start">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-wider">Filters</h3>
                <button className="text-[10px] font-bold text-[#2772A0] hover:underline underline-offset-4">Clear All</button>
            </div>

            <div className="space-y-8">
                {/* Categories */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-[#2772A0]/60 uppercase tracking-widest">Products</label>
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                className="w-full flex items-center justify-between group py-1"
                            >
                                <span className="text-sm font-bold text-[#1E293B]/70 group-hover:text-[#2772A0] transition-colors">{cat.name}</span>
                                {cat.count && (
                                    <span className="text-[10px] font-bold bg-[#2772A0]/5 text-[#2772A0] px-1.5 py-0.5 rounded-md">{cat.count}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-[#2772A0]/60 uppercase tracking-widest">Price</label>
                    </div>
                    <div className="px-2">
                        <div className="h-1.5 w-full bg-[#2772A0]/10 rounded-full relative">
                            <div className="absolute left-0 right-1/4 h-full bg-[#2772A0] rounded-full" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2772A0] rounded-full shadow-lg border-2 border-white cursor-pointer" />
                            <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2772A0] rounded-full shadow-lg border-2 border-white cursor-pointer" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white/60 border border-[#2772A0]/10 rounded-xl px-3 py-2">
                            <span className="text-[10px] text-[#1E293B]/40 block opacity-50">$</span>
                            <span className="text-xs font-bold text-[#1E293B]">0</span>
                        </div>
                        <span className="text-[#1E293B]/40 text-xs">to</span>
                        <div className="flex-1 bg-white/60 border border-[#2772A0]/10 rounded-xl px-3 py-2">
                            <span className="text-[10px] text-[#1E293B]/40 block opacity-50">$</span>
                            <span className="text-xs font-bold text-[#1E293B]">2000</span>
                        </div>
                    </div>
                </div>

                {/* Colors */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[#2772A0]/60 uppercase tracking-widest">Colors</label>
                        <ChevronDown className="w-3 h-3 text-[#2772A0]/40" />
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                        {colors.map((color) => (
                            <button
                                key={color.name}
                                className={`w-8 h-8 rounded-full shadow-sm hover:scale-110 transition-transform ${color.class}`}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Sizes */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[#2772A0]/60 uppercase tracking-widest">Sizes</label>
                        <ChevronDown className="w-3 h-3 text-[#2772A0]/40" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                className={`min-w-[2.5rem] px-2 py-2 rounded-xl text-[10px] font-bold border transition-all ${size === 'S' || size === 'XL' ? 'bg-[#2772A0]/10 border-[#2772A0] text-[#2772A0]' : 'bg-white/40 border-[#2772A0]/5 text-[#1E293B]/40 hover:border-[#2772A0]/30'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Discount & Rating placeholders */}
                {['Discount', 'Rating'].map((filter) => (
                    <div key={filter} className="pt-4 border-t border-[#2772A0]/5 flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[#2772A0]/60 uppercase tracking-widest">{filter}</label>
                        <ChevronDown className="w-3 h-3 text-[#2772A0]/40" />
                    </div>
                ))}
            </div>
        </aside>
    );
};
