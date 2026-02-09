'use client';

import React, { useState } from 'react';
import {
    FaFilter as Filter,
    FaSearch,
    FaStar,
    FaRegStar,
    FaCheckSquare,
    FaSquare,
    FaShieldAlt
} from 'react-icons/fa';
import { IoIosArrowDropdown as ChevronDown } from 'react-icons/io';
import { productService } from '@/lib/api/services/product.service';
import { sidebarCategories } from '../../../data/categoryData';

// Fallback categorization map for UI display (mapping slug to readable name)
const categoryMap: Record<string, string> = {};
sidebarCategories.forEach(cat => {
    categoryMap[cat.id] = cat.label;
});

// Fallback subCategoriesMap from sidebarCategories
const subCategoriesMapFallback: Record<string, string[]> = {};
sidebarCategories.forEach(cat => {
    subCategoriesMapFallback[cat.id] = cat.subsections.flatMap(sub => sub.items.map(i => i.name));
});

const brands = ['Samsung', 'LG', 'Bosch', 'IFB', 'Haier', 'Whirlpool', 'Panasonic', 'Sony'];

export interface FilterState {
    priceRange: [number, number];
    brands: string[];
    rating: number | null;
    availability: string[];
    verifiedOnly: boolean;
    subCategory: string | null;
    powerConsumption: string[];
    capacity: string[];
    energyRating: string[];
    installationType: string[];
    usageType: string[];
    warranty: string[];
    isSmart: boolean | null;
}

interface ProductFilterSidebarProps {
    currentCategory?: string;
    onCategoryChange?: (slug: string) => void;
    filters: FilterState;
    onFilterChange: (key: keyof FilterState, value: any) => void;
}

export const ProductFilterSidebar = ({ currentCategory, onCategoryChange, filters, onFilterChange }: ProductFilterSidebarProps) => {
    const [openSections, setOpenSections] = React.useState<string[]>(['categories', 'price', 'verified', 'availability']);
    const [brandSearch, setBrandSearch] = React.useState('');
    const [mainCategories, setMainCategories] = React.useState<{ name: string, slug: string }[]>([]);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await productService.getCategories();
                const mapped = cats.map(c => ({
                    name: categoryMap[c] || c.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                    slug: c
                }));
                setMainCategories(mapped);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const toggleSection = (section: string) => {
        setOpenSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    const filteredBrands = brands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()));

    return (
        <aside className="w-full lg:w-80 bg-surface border border-foreground/10 rounded-[10px] p-6 lg:sticky lg:top-32 h-fit self-start shadow-sm flex flex-col gap-6 text-foreground">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Filter className="w-4 h-4 text-black" />
                    Filter Products
                </h3>
                <button
                    onClick={() => {
                        onFilterChange('priceRange', [0, 100000]);
                        onFilterChange('brands', []);
                        onFilterChange('rating', null);
                        onFilterChange('availability', []);
                        onFilterChange('verifiedOnly', false);
                        onFilterChange('subCategory', null);
                        onFilterChange('powerConsumption', []);
                        onFilterChange('capacity', []);
                        onFilterChange('energyRating', []);
                        onFilterChange('installationType', []);
                        onFilterChange('usageType', []);
                        onFilterChange('warranty', []);
                        onFilterChange('isSmart', null);
                    }}
                    className="text-[10px] font-bold text-black hover:underline underline-offset-4"
                >
                    Reset All
                </button>
            </div>

            <div className="flex flex-col gap-6">
                {/* 0️⃣ Categories (Dynamic) */}
                <div className="space-y-4">
                    <button onClick={() => toggleSection('categories')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-black transition-colors">Categories</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('categories') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('categories') && (
                        <div className="space-y-2 pt-1">
                            {mainCategories.map((cat) => (
                                <div key={cat.slug} className="space-y-1">
                                    <button
                                        onClick={() => {
                                            onCategoryChange && onCategoryChange(cat.slug);
                                            onFilterChange('subCategory', null);
                                        }}
                                        className={`w-full flex items-center justify-between py-1 group ${currentCategory === cat.slug ? 'text-black' : 'text-foreground/60'}`}
                                    >
                                        <span className={`text-xs ${currentCategory === cat.slug ? 'font-bold' : 'font-medium group-hover:text-black'}`}>{cat.name}</span>
                                        {/* <span className="text-[9px] font-bold opacity-40">{cat.count}</span> */}
                                    </button>

                                    {/* Show Subcategories if this category is selected */}
                                    {currentCategory === cat.slug && subCategoriesMapFallback[cat.slug] && (
                                        <div className="pl-3 space-y-1 border-l border-foreground/10 ml-1">
                                            <button
                                                onClick={() => onFilterChange('subCategory', null)}
                                                className={`w-full text-left py-1 text-[10px] font-bold transition-colors ${!filters.subCategory ? 'text-black' : 'text-foreground/50 hover:text-black'}`}
                                            >
                                                All {cat.name}
                                            </button>
                                            {subCategoriesMapFallback[cat.slug].map(sub => (
                                                <button
                                                    key={sub}
                                                    onClick={() => onFilterChange('subCategory', sub)}
                                                    className={`w-full text-left py-1 text-[10px] font-bold transition-colors ${filters.subCategory === sub ? 'text-black' : 'text-foreground/50 hover:text-black'}`}
                                                >
                                                    {sub}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* 1️⃣ Trust Certification (New Request) */}
                <div className="space-y-4">
                    <div className="bg-black/5 rounded-[10px] p-4 border border-black/10">
                        <label className="text-[11px] font-black text-black uppercase tracking-widest block mb-4 flex items-center gap-2">
                            <FaShieldAlt className="w-3.5 h-3.5" />
                            Trust Certification
                        </label>
                        <div className="space-y-3">
                            <button
                                onClick={() => onFilterChange('verifiedOnly', !filters.verifiedOnly)}
                                className="w-full flex items-center gap-3 group"
                            >
                                <div className={`w-4 h-4 rounded-[3px] border transition-colors flex items-center justify-center ${filters.verifiedOnly ? 'bg-black border-black' : 'border-foreground/20 group-hover:border-black'}`}>
                                    {filters.verifiedOnly && <FaCheckSquare className="text-white w-3 h-3" />}
                                </div>
                                <span className={`text-xs ${filters.verifiedOnly ? 'font-bold text-black' : 'font-bold text-foreground'}`}>Verified Sellers Only</span>
                            </button>
                            <button className="w-full flex items-center gap-3 group grayscale hover:grayscale-0 transition-all">
                                <div className="w-4 h-4 rounded border border-foreground/20 transition-colors" />
                                <span className="text-xs font-medium text-foreground/40">Top Rated Sellers (4★+)</span>
                            </button>
                        </div>
                        <p className="text-[9px] text-black/60 mt-4 leading-relaxed font-medium italic">Buy directly from manufacturers & authorized dealers with NovaMart TrustSEAL.</p>
                    </div>
                </div>

                {/* 2️⃣ Availability */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('availability')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-black transition-colors">Availability</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('availability') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('availability') && (
                        <div className="space-y-3 pt-1">
                            {['In Stock', 'Out of Stock'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        const newAvailability = (filters.availability || []).includes(status)
                                            ? filters.availability?.filter((s) => s !== status)
                                            : [...(filters.availability || []), status];
                                        onFilterChange('availability', newAvailability || []);
                                    }}
                                    className="w-full flex items-center gap-3 group"
                                >
                                    <div className={`w-4 h-4 rounded-[3px] border transition-colors flex items-center justify-center ${(filters.availability || []).includes(status) ? 'bg-black border-black' : 'border-foreground/10 group-hover:border-black'}`}>
                                        {(filters.availability || []).includes(status) && <FaCheckSquare className="text-white w-3 h-3" />}
                                    </div>
                                    <span className={`text-xs ${(filters.availability || []).includes(status) ? 'font-bold text-black' : 'font-medium text-foreground/40 group-hover:text-black'}`}>{status}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3️⃣ Delivery & Service */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('delivery')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-black transition-colors">Delivery & Service</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('delivery') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('delivery') && (
                        <div className="space-y-2 pt-1">
                            {['Free Delivery', 'Installation Available', 'Delivery in 2-3 Days'].map((opt) => (
                                <button key={opt} className="w-full flex items-center gap-3 group py-0.5">
                                    <div className="w-4 h-4 rounded-[3px] border border-foreground/10 transition-colors" />
                                    <span className="text-xs font-medium text-foreground/60 group-hover:text-black">{opt}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 4️⃣ Rating */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('rating')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-black transition-colors">Customer Rating</label>
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
                                    <div className={`w-4 h-4 rounded-full border transition-colors flex items-center justify-center mr-1 ${filters.rating === rating ? 'bg-black border-black' : 'border-foreground/10 group-hover:border-black'}`}>
                                        {filters.rating === rating && <div className="w-2 h-2 rounded-full bg-white" />}
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

                {/* 5️⃣ Offers */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('offers')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground/40 uppercase tracking-widest cursor-pointer group-hover:text-black transition-colors">Special Offers</label>
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

                {/* 6️⃣ Price Range (Slider + Input) */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-black transition-colors">Price Range</label>
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
                                            className="w-full bg-background border border-foreground/5 rounded-[5px] pl-6 pr-2 py-2 text-xs font-bold text-foreground outline-none focus:border-black/20"
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
                                            className="w-full bg-background border border-foreground/5 rounded-[5px] pl-6 pr-2 py-2 text-xs font-bold text-foreground outline-none focus:border-black/20"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 7️⃣ Brand Filter (Searchable) */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('brands')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-black transition-colors">Brands</label>
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
                                        <div className={`w-4 h-4 rounded-[3px] border transition-colors flex items-center justify-center ${filters.brands.includes(brand) ? 'bg-black border-black' : 'border-foreground/10 group-hover:border-black'}`}>
                                            {filters.brands.includes(brand) && <FaCheckSquare className="text-white w-3 h-3" />}
                                        </div>
                                        <span className={`text-xs ${filters.brands.includes(brand) ? 'font-bold text-black' : 'font-medium text-foreground/60 group-hover:text-black'}`}>{brand}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 8️⃣ Power Consumption */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('power')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Power Consumption</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('power') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('power') && (
                        <div className="space-y-2 pt-1">
                            {['Less than 1000W', '1000W - 1500W', '1500W - 2000W', 'Above 2000W', '5 Star Rated', '4 Star Rated', '3 Star Rated'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const newVal = (filters.powerConsumption || []).includes(opt)
                                            ? filters.powerConsumption.filter(v => v !== opt)
                                            : [...(filters.powerConsumption || []), opt];
                                        onFilterChange('powerConsumption', newVal);
                                    }}
                                    className="w-full flex items-center gap-3 group py-0.5"
                                >
                                    <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${(filters.powerConsumption || []).includes(opt) ? 'bg-primary border-primary' : 'border-foreground/10 group-hover:border-primary'}`}>
                                        {(filters.powerConsumption || []).includes(opt) && <FaCheckSquare className="text-background w-3 h-3" />}
                                    </div>
                                    <span className={`text-xs ${(filters.powerConsumption || []).includes(opt) ? 'font-bold text-primary' : 'font-medium text-foreground/60 group-hover:text-primary'}`}>{opt}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 9️⃣ Capacity */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('capacity')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Capacity</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('capacity') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('capacity') && (
                        <div className="space-y-2 pt-1">
                            {['Less than 200L / 6kg', '200L - 300L / 6-8kg', '300L - 500L / 8-10kg', 'Above 500L / 10kg+'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const newVal = (filters.capacity || []).includes(opt)
                                            ? filters.capacity.filter(v => v !== opt)
                                            : [...(filters.capacity || []), opt];
                                        onFilterChange('capacity', newVal);
                                    }}
                                    className="w-full flex items-center gap-3 group py-0.5"
                                >
                                    <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${(filters.capacity || []).includes(opt) ? 'bg-primary border-primary' : 'border-foreground/10 group-hover:border-primary'}`}>
                                        {(filters.capacity || []).includes(opt) && <FaCheckSquare className="text-background w-3 h-3" />}
                                    </div>
                                    <span className={`text-xs ${(filters.capacity || []).includes(opt) ? 'font-bold text-primary' : 'font-medium text-foreground/60 group-hover:text-primary'}`}>{opt}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 🔟 Energy Rating */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('energy')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Energy Rating</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('energy') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('energy') && (
                        <div className="space-y-2 pt-1">
                            {['5 Star', '4 Star', '3 Star'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const newVal = (filters.energyRating || []).includes(opt)
                                            ? filters.energyRating.filter(v => v !== opt)
                                            : [...(filters.energyRating || []), opt];
                                        onFilterChange('energyRating', newVal);
                                    }}
                                    className="w-full flex items-center gap-3 group py-0.5"
                                >
                                    <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${(filters.energyRating || []).includes(opt) ? 'bg-primary border-primary' : 'border-foreground/10 group-hover:border-primary'}`}>
                                        {(filters.energyRating || []).includes(opt) && <FaCheckSquare className="text-background w-3 h-3" />}
                                    </div>
                                    <span className={`text-xs ${(filters.energyRating || []).includes(opt) ? 'font-bold text-primary' : 'font-medium text-foreground/60 group-hover:text-primary'}`}>{opt}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 1️⃣1️⃣ Installation Type */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('installation')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Installation Type</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('installation') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('installation') && (
                        <div className="space-y-2 pt-1">
                            {['Freestanding', 'Built-in', 'Wall Mounted'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const newVal = (filters.installationType || []).includes(opt)
                                            ? filters.installationType.filter(v => v !== opt)
                                            : [...(filters.installationType || []), opt];
                                        onFilterChange('installationType', newVal);
                                    }}
                                    className="w-full flex items-center gap-3 group py-0.5"
                                >
                                    <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${(filters.installationType || []).includes(opt) ? 'bg-primary border-primary' : 'border-foreground/10 group-hover:border-primary'}`}>
                                        {(filters.installationType || []).includes(opt) && <FaCheckSquare className="text-background w-3 h-3" />}
                                    </div>
                                    <span className={`text-xs ${(filters.installationType || []).includes(opt) ? 'font-bold text-primary' : 'font-medium text-foreground/60 group-hover:text-primary'}`}>{opt}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 1️⃣2️⃣ Usage Type */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('usage')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Usage Type</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('usage') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('usage') && (
                        <div className="space-y-2 pt-1">
                            {['Home', 'Commercial', 'Industrial'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const newVal = (filters.usageType || []).includes(opt)
                                            ? filters.usageType.filter(v => v !== opt)
                                            : [...(filters.usageType || []), opt];
                                        onFilterChange('usageType', newVal);
                                    }}
                                    className="w-full flex items-center gap-3 group py-0.5"
                                >
                                    <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${(filters.usageType || []).includes(opt) ? 'bg-primary border-primary' : 'border-foreground/10 group-hover:border-primary'}`}>
                                        {(filters.usageType || []).includes(opt) && <FaCheckSquare className="text-background w-3 h-3" />}
                                    </div>
                                    <span className={`text-xs ${(filters.usageType || []).includes(opt) ? 'font-bold text-primary' : 'font-medium text-foreground/60 group-hover:text-primary'}`}>{opt}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 1️⃣3️⃣ Warranty */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button onClick={() => toggleSection('warranty')} className="w-full flex items-center justify-between group">
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-primary transition-colors">Warranty</label>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform ${openSections.includes('warranty') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('warranty') && (
                        <div className="space-y-2 pt-1">
                            {['1 Year', '2 Years', '3 Years+', 'Compressor Warranty'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const newVal = (filters.warranty || []).includes(opt)
                                            ? filters.warranty.filter(v => v !== opt)
                                            : [...(filters.warranty || []), opt];
                                        onFilterChange('warranty', newVal);
                                    }}
                                    className="w-full flex items-center gap-3 group py-0.5"
                                >
                                    <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${(filters.warranty || []).includes(opt) ? 'bg-primary border-primary' : 'border-foreground/10 group-hover:border-primary'}`}>
                                        {(filters.warranty || []).includes(opt) && <FaCheckSquare className="text-background w-3 h-3" />}
                                    </div>
                                    <span className={`text-xs ${(filters.warranty || []).includes(opt) ? 'font-bold text-primary' : 'font-medium text-foreground/60 group-hover:text-primary'}`}>{opt}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 1️⃣4️⃣ Smart Feature */}
                <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <button
                        onClick={() => onFilterChange('isSmart', !filters.isSmart)}
                        className="w-full flex items-center gap-3 group"
                    >
                        <div className={`w-4 h-4 rounded-[3px] border transition-colors flex items-center justify-center ${filters.isSmart ? 'bg-black border-black' : 'border-foreground/20 group-hover:border-black'}`}>
                            {filters.isSmart && <FaCheckSquare className="text-white w-3 h-3" />}
                        </div>
                        <label className="text-[11px] font-black text-foreground uppercase tracking-widest cursor-pointer group-hover:text-black transition-colors">Smart / IoT Enabled</label>
                    </button>
                </div>
            </div>
        </aside>
    );
};

