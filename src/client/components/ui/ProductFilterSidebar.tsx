'use client';

import React, { useState } from 'react';
import {
    FaChevronDown as ChevronDown,
    FaFilter as Filter,
    FaSearch,
    FaStar,
    FaRegStar,
    FaCheckSquare,
    FaSquare,
    FaShieldAlt
} from 'react-icons/fa';

const mainCategories = [
    { name: 'Kitchen Appliances', count: 120, slug: 'kitchen-appliances' },
    { name: 'Home Appliances', count: 210, slug: 'home-appliances' },
    { name: 'Cleaning & Home Care', count: 340, slug: 'cleaning-home-care' },
    { name: 'Storage & Organization', count: 156, slug: 'storage-organization' },
    { name: 'Personal Care Appliances', count: 85, slug: 'personal-care' },
    { name: 'Home Utility & Accessories', count: 95, slug: 'home-utility' },
];

const subCategoriesMap: Record<string, string[]> = {
    'kitchen-appliances': ['Mixer Grinders', 'Juicers', 'Kettles', 'Induction', 'Rice Cookers'],
    'home-appliances': ['Fans', 'Heaters', 'Air Coolers', 'Irons', 'Water Heaters'],
};

const brands = ['Samsung', 'LG', 'Bosch', 'IFB', 'Haier', 'Whirlpool', 'Panasonic', 'Sony'];

export interface FilterState {
    priceRange: [number, number];
    brands: string[];
    rating: number | null;
    availability: string[];
    verifiedOnly: boolean;
}

interface ProductFilterSidebarProps {
    currentCategory?: string;
    onCategoryChange?: (slug: string) => void;
    filters: FilterState;
    onFilterChange: (key: keyof FilterState, value: any) => void;
}

export const ProductFilterSidebar = ({ currentCategory, onCategoryChange, filters, onFilterChange }: ProductFilterSidebarProps) => {
    const [openSections, setOpenSections] = useState<string[]>(['categories', 'price', 'verified', 'availability']);
    const [brandSearch, setBrandSearch] = useState('');

    const toggleSection = (section: string) => {
        setOpenSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    const filteredBrands = brands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()));

    return (
        <aside className="w-full lg:w-80 bg-surface border border-foreground/10 rounded-2xl p-6 lg:sticky lg:top-32 h-fit self-start shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" />
                    Filter Products
                </h3>
                <button className="text-[10px] font-bold text-primary hover:underline underline-offset-4">Reset All</button>
            </div>

            <div className="flex flex-col gap-6">
                {/* 1️⃣ Category (Contextual) */}
                <div className="space-y-4">
                    <button onClick={() => toggleSection('categories')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Category</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('categories') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('categories') && (
                        <div className="space-y-1.5 pt-1">
                            {mainCategories.map((cat) => (
                                <button
                                    key={cat.slug}
                                    onClick={() => onCategoryChange?.(cat.slug)}
                                    className={`w-full flex items-center gap-3 group py-1 transition-all ${currentCategory === cat.slug ? 'text-primary' : 'text-foreground/60 hover:text-primary'}`}
                                >
                                    <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${currentCategory === cat.slug ? 'bg-primary border-primary' : 'border-foreground/20'}`}>
                                        {currentCategory === cat.slug && <FaCheckSquare className="text-background w-3 h-3" />}
                                    </div>
                                    <span className={`text-xs ${currentCategory === cat.slug ? 'font-bold' : 'font-medium'}`}>{cat.name}</span>
                                    <span className="text-[10px] text-foreground/40 ml-auto">{cat.count}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2️⃣ Price Range (Slider + Input) */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Price Range</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('price') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('price') && (
                        <div className="space-y-5 pt-2 px-2">
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <label className="text-[9px] font-bold text-foreground/40 uppercase mb-1 block">Min Price</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-foreground/40">₹</span>
                                        <input
                                            type="number"
                                            value={filters.priceRange[0]}
                                            onChange={(e) => onFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                                            className="w-full bg-background border border-foreground/5 rounded-lg pl-6 pr-2 py-2 text-xs font-bold text-foreground outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="text-[9px] font-bold text-foreground/40 uppercase mb-1 block">Max Price</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-foreground/40">₹</span>
                                        <input
                                            type="number"
                                            value={filters.priceRange[1]}
                                            onChange={(e) => onFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                                            className="w-full bg-background border border-foreground/5 rounded-lg pl-6 pr-2 py-2 text-xs font-bold text-foreground outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3️⃣ Brand Filter (Searchable) */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('brands')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Brands</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('brands') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('brands') && (
                        <div className="space-y-3 pt-2">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20 w-3 h-3" />
                                <input
                                    type="text"
                                    placeholder="Search brands..."
                                    value={brandSearch}
                                    onChange={(e) => setBrandSearch(e.target.value)}
                                    className="w-full bg-background border border-foreground/5 rounded-lg pl-9 pr-3 py-2 text-sm font-medium focus:outline-none focus:border-primary/20 transition-all text-foreground"
                                />
                            </div>
                            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 thin-scrollbar">
                                {filteredBrands.map((brand) => (
                                    <button
                                        key={brand}
                                        onClick={() => {
                                            const newBrands = filters.brands.includes(brand)
                                                ? filters.brands.filter(b => b !== brand)
                                                : [...filters.brands, brand];
                                            onFilterChange('brands', newBrands);
                                        }}
                                        className="w-full flex items-center gap-3 group py-1"
                                    >
                                        <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${filters.brands.includes(brand) ? 'bg-primary border-primary' : 'border-foreground/10 group-hover:border-primary'}`}>
                                            {filters.brands.includes(brand) && <FaCheckSquare className="text-background w-3 h-3" />}
                                        </div>
                                        <span className={`text-xs ${filters.brands.includes(brand) ? 'font-bold text-primary' : 'font-medium text-foreground/60 group-hover:text-primary'}`}>{brand}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 4️⃣ Verified Seller Filter (USP) */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                        <label className="text-[11px] font-black text-primary uppercase tracking-widest block mb-4 flex items-center gap-2">
                            <FaShieldAlt className="w-3.5 h-3.5" />
                            Trust Certification
                        </label>
                        <div className="space-y-3">
                            <button
                                onClick={() => onFilterChange('verifiedOnly', !filters.verifiedOnly)}
                                className="w-full flex items-center gap-3 group"
                            >
                                <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${filters.verifiedOnly ? 'bg-primary border-primary' : 'border-foreground/20 group-hover:border-primary'}`}>
                                    {filters.verifiedOnly && <FaCheckSquare className="text-background w-3 h-3" />}
                                </div>
                                <span className={`text-xs ${filters.verifiedOnly ? 'font-bold text-primary' : 'font-bold text-foreground'}`}>Verified Sellers Only</span>
                            </button>
                            <button className="w-full flex items-center gap-3 group grayscale hover:grayscale-0 transition-all">
                                <div className="w-4 h-4 rounded border border-foreground/20 transition-colors" />
                                <span className="text-xs font-medium text-foreground/40">Top Rated Sellers (4★+)</span>
                            </button>
                        </div>
                        <p className="text-[9px] text-primary/60 mt-4 leading-relaxed font-medium italic">Buy directly from manufacturers & authorized dealers with NovaMart TrustSEAL.</p>
                    </div>
                </div>

                {/* 5️⃣ Availability (Default ON) */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('availability')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Availability</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('availability') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('availability') && (
                        <div className="space-y-3 pt-1">
                            {['In Stock', 'Out of Stock'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        const newAvailability = filters.availability.includes(status)
                                            ? filters.availability.filter(s => s !== status)
                                            : [...filters.availability, status];
                                        onFilterChange('availability', newAvailability);
                                    }}
                                    className="w-full flex items-center gap-3 group"
                                >
                                    <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${filters.availability.includes(status) ? 'bg-primary border-primary' : 'border-foreground/10 group-hover:border-primary'}`}>
                                        {filters.availability.includes(status) && <FaCheckSquare className="text-background w-3 h-3" />}
                                    </div>
                                    <span className={`text-xs ${filters.availability.includes(status) ? 'font-bold text-primary' : 'font-medium text-foreground/40 group-hover:text-primary'}`}>{status}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 6️⃣ Delivery & Service */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('delivery')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Delivery & Service</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('delivery') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('delivery') && (
                        <div className="space-y-2 pt-1">
                            {['Free Delivery', 'Installation Available', 'Delivery in 2-3 Days'].map((opt) => (
                                <button key={opt} className="w-full flex items-center gap-3 group py-0.5">
                                    <div className="w-4 h-4 rounded border border-foreground/10 transition-colors" />
                                    <span className="text-xs font-medium text-foreground/60 group-hover:text-primary">{opt}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 7️⃣ Ratings */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('rating')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Customer Rating</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('rating') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('rating') && (
                        <div className="space-y-3 pt-1">
                            {[4, 3, 2].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => onFilterChange('rating', filters.rating === rating ? null : rating)}
                                    className="w-full flex items-center gap-2 group"
                                >
                                    <div className={`w-4 h-4 rounded-full border transition-colors flex items-center justify-center mr-1 ${filters.rating === rating ? 'bg-primary border-primary' : 'border-foreground/10 group-hover:border-primary'}`}>
                                        {filters.rating === rating && <div className="w-2 h-2 rounded-full bg-background" />}
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            i < rating ?
                                                <FaStar key={i} className="w-3 h-3 text-amber-500" /> :
                                                <FaRegStar key={i} className="w-3 h-3 text-foreground/10" />
                                        ))}
                                    </div>
                                    <span className={`text-[10px] ${filters.rating === rating ? 'font-black text-foreground' : 'font-bold text-foreground/40'}`}>& above</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 8️⃣ Offers */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('offers')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground/40 uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Special Offers</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('offers') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('offers') && (
                        <div className="space-y-2 pt-1 opacity-60">
                            {['No Cost EMI', 'Bank Offers', 'Exchange Value'].map((opt) => (
                                <button key={opt} className="w-full flex items-center gap-3 group py-0.5">
                                    <div className="w-4 h-4 rounded border border-foreground/10 transition-colors" />
                                    <span className="text-xs font-medium text-foreground/40">{opt}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

