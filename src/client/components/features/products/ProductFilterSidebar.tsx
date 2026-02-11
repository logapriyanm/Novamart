'use client';

import React, { useState } from 'react';
import {
    FaFilter as Filter,
    FaSearch,
    FaStar,
    FaRegStar,
    FaCheckSquare,
    FaShieldAlt,
    FaChevronDown,
    FaUndo
} from 'react-icons/fa';
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
    [key: string]: any;
}

interface ProductFilterSidebarProps {
    currentCategory?: string;
    onCategoryChange?: (slug: string) => void;
    filters: FilterState;
    onFilterChange: (key: string, value: any) => void;
    isOpen?: boolean;
    onToggle?: () => void;
}

export const ProductFilterSidebar = ({ currentCategory, onCategoryChange, filters, onFilterChange, isOpen = true, onToggle }: ProductFilterSidebarProps) => {
    const [openSections, setOpenSections] = React.useState<string[]>(['categories', 'price', 'brands', 'technical']);
    const [brandSearch, setBrandSearch] = React.useState('');
    const [mainCategories, setMainCategories] = React.useState<{ name: string, slug: string, count?: number }[]>([]);
    const [availableBrands, setAvailableBrands] = React.useState<string[]>([]);
    const [priceLimits, setPriceLimits] = React.useState({ min: 0, max: 100000 });
    const [technicalFilters, setTechnicalFilters] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await productService.getFilters({
                    category: currentCategory || 'all',
                    subCategory: filters.subCategory || 'all'
                });

                if (response) {
                    const { categories, brands, minPrice, maxPrice, technicalFilters: tech } = response;
                    const mappedCats = categories.map((c: any) => ({
                        name: categoryMap[c.name] || c.name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                        slug: c.name,
                        count: c.count
                    }));
                    setMainCategories(mappedCats);
                    setAvailableBrands(brands || []);
                    setPriceLimits({ min: minPrice, max: maxPrice });
                    setTechnicalFilters(tech || []);
                }
            } catch (error) {
                console.error('Failed to fetch filters:', error);
            }
        };
        fetchFilters();
    }, [currentCategory, filters.subCategory]);

    const toggleSection = (section: string) => {
        setOpenSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    const filteredBrands = availableBrands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()));

    const resetFilters = () => {
        onFilterChange('priceRange', [0, 5000000]);
        onFilterChange('brands', []);
        onFilterChange('rating', null);
        onFilterChange('availability', []);
        onFilterChange('verifiedOnly', false);
        onFilterChange('subCategory', null);
    };

    return (
        <aside className="bg-white border border-slate-200 rounded-[10px] shadow-sm flex flex-col divide-y divide-slate-100 overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-4 xs:p-5 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-900" />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Advanced Filters</h3>
                </div>
                <button
                    onClick={resetFilters}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-[8px] hover:bg-white"
                    title="Reset all filters"
                >
                    <FaUndo className="w-3 h-3" />
                </button>
            </div>

            {/* Verification Section Quick Filter */}
            <div className="p-4 xs:p-5">
                <button
                    onClick={() => onFilterChange('verifiedOnly', !filters.verifiedOnly)}
                    className={`w-full flex items-center justify-between p-3 rounded-[10px] border transition-all ${filters.verifiedOnly ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'}`}
                >
                    <div className="flex items-center gap-2">
                        <FaShieldAlt className={`w-4 h-4 ${filters.verifiedOnly ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="text-[11px] font-black uppercase tracking-wider">Verified Sellers</span>
                    </div>
                    {filters.verifiedOnly && <div className="w-2 h-2 rounded-full bg-blue-600 shadow-sm" />}
                </button>
            </div>

            {/* Categories Section */}
            <div className="p-4 xs:p-5">
                <button onClick={() => toggleSection('categories')} className="w-full flex items-center justify-between mb-4 group">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Industrial Categories</span>
                    <FaChevronDown className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${openSections.includes('categories') ? 'rotate-180' : ''}`} />
                </button>
                {openSections.includes('categories') && (
                    <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 thin-scrollbar">
                        {mainCategories.map((cat) => (
                            <div key={cat.slug} className="space-y-1">
                                <button
                                    onClick={() => onCategoryChange && onCategoryChange(cat.slug)}
                                    className={`w-full flex items-center justify-between py-2 px-3 rounded-[8px] transition-all text-left ${currentCategory === cat.slug ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'hover:bg-slate-50 text-slate-600'}`}
                                >
                                    <span className="text-[10px] xs:text-[11px] font-bold uppercase tracking-wide">{cat.name}</span>
                                    {cat.count && <span className={`text-[9px] font-black ${currentCategory === cat.slug ? 'text-blue-200' : 'text-slate-300'}`}>{cat.count}</span>}
                                </button>
                                {currentCategory === cat.slug && subCategoriesMapFallback[cat.slug] && (
                                    <div className="ml-4 pl-3 border-l-2 border-blue-100 flex flex-col pt-1 pb-2 gap-1">
                                        {subCategoriesMapFallback[cat.slug].map(sub => (
                                            <button
                                                key={sub}
                                                onClick={() => onFilterChange('subCategory', sub)}
                                                className={`text-left py-1 text-[10px] font-bold transition-colors ${filters.subCategory === sub ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
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

            {/* Price Range Section */}
            <div className="p-4 xs:p-5 overflow-hidden">
                <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between mb-4 group">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Price Range</span>
                    <FaChevronDown className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${openSections.includes('price') ? 'rotate-180' : ''}`} />
                </button>
                {openSections.includes('price') && (
                    <div className="space-y-4 pt-1">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Min (₹)</label>
                                <input
                                    type="number"
                                    value={filters.priceRange[0]}
                                    onChange={(e) => onFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[6px] px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Max (₹)</label>
                                <input
                                    type="number"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => onFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[6px] px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Brands Section */}
            <div className="p-4 xs:p-5 overflow-hidden">
                <button onClick={() => toggleSection('brands')} className="w-full flex items-center justify-between mb-4 group">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Available Brands</span>
                    <FaChevronDown className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${openSections.includes('brands') ? 'rotate-180' : ''}`} />
                </button>
                {openSections.includes('brands') && (
                    <div className="space-y-3 pt-1">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                            <input
                                type="text"
                                placeholder="Search brands..."
                                value={brandSearch}
                                onChange={(e) => setBrandSearch(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-[10px] pl-9 pr-3 py-2.5 text-[11px] font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 thin-scrollbar">
                            {filteredBrands.length > 0 ? filteredBrands.map((brand) => (
                                <button
                                    key={brand}
                                    onClick={() => {
                                        const newBrands = filters.brands.includes(brand)
                                            ? filters.brands.filter(b => b !== brand)
                                            : [...filters.brands, brand];
                                        onFilterChange('brands', newBrands);
                                    }}
                                    className="w-full flex items-center gap-3 group py-1.5"
                                >
                                    <div className={`w-4 h-4 rounded-[4px] border transition-all flex items-center justify-center ${filters.brands.includes(brand) ? 'bg-blue-600 border-blue-600' : 'border-slate-200 bg-white group-hover:border-slate-400'}`}>
                                        {filters.brands.includes(brand) && <FaCheckSquare className="text-white w-2.5 h-2.5" />}
                                    </div>
                                    <span className={`text-[11px] font-bold ${filters.brands.includes(brand) ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{brand}</span>
                                </button>
                            )) : (
                                <p className="text-[10px] text-slate-400 italic py-2">No brands found</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Ratings Section */}
            <div className="p-4 xs:p-5">
                <button onClick={() => toggleSection('rating')} className="w-full flex items-center justify-between mb-4 group">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Seller Rating</span>
                    <FaChevronDown className={`w-3 h-3 text-slate-300 transition-transform duration-300 ${openSections.includes('rating') ? 'rotate-180' : ''}`} />
                </button>
                {openSections.includes('rating') && (
                    <div className="space-y-3 pt-1">
                        {[4, 3, 2].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => onFilterChange('rating', filters.rating === rating ? null : rating)}
                                className="w-full flex items-center gap-3 py-1 bg-white group"
                            >
                                <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${filters.rating === rating ? 'border-blue-600 bg-white' : 'border-slate-200 group-hover:border-slate-400'}`}>
                                    {filters.rating === rating && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        i < rating ?
                                            <FaStar key={i} className="w-2.5 h-2.5 text-amber-400" /> :
                                            <FaRegStar key={i} className="w-2.5 h-2.5 text-slate-200" />
                                    ))}
                                </div>
                                <span className={`text-[10px] font-bold ${filters.rating === rating ? 'text-slate-900' : 'text-slate-400'}`}>& Above</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Technical Filter Banner */}
            <div className="p-4 xs:p-5 bg-slate-50/50">
                <div className="px-4 py-3 bg-white border border-slate-100 rounded-[10px] text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Industrial Quality</p>
                    <p className="text-[10px] font-bold text-slate-600 leading-relaxed italic">Download technical data sheets on product detail pages.</p>
                </div>
            </div>
        </aside>
    );
};

