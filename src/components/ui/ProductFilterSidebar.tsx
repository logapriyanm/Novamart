'use client';

import React, { useState } from 'react';
import {
    FaChevronDown as ChevronDown,
    FaFilter as Filter,
    FaChevronLeft,
    FaChevronRight,
    FaStar,
    FaRegStar,
    FaCheckSquare,
    FaSquare
} from 'react-icons/fa';

const mainCategories = [
    { name: 'Kitchen Appliances', count: 120, slug: 'kitchen-appliances' },
    { name: 'Home Appliances', count: 210, slug: 'home-appliances' },
    { name: 'Cleaning & Home Care', count: 340, slug: 'cleaning-home-care' },
    { name: 'Storage & Organization', count: 156, slug: 'storage-organization' },
    { name: 'Personal Care Appliances', count: 85, slug: 'personal-care' },
    { name: 'Home Utility & Accessories', count: 95, slug: 'home-utility' },
    { name: 'Kids & Baby Care', count: 78, slug: 'kids-baby-care' },
    { name: 'Pet Care', count: 189, slug: 'pet-care' },
    { name: 'Smart & Portable Devices', count: 420, slug: 'smart-portable-devices' },
    { name: 'Combos & Value Packs', count: 65, slug: 'combos-value-packs' },
];

const subCategoriesMap: Record<string, string[]> = {
    'kitchen-appliances': ['Mixer Grinders', 'Juicers & Blenders', 'Electric Kettles', 'Induction Cooktops', 'Electric Rice Cookers', 'Electric Lunch Boxes', 'Sandwich Makers', 'Food Choppers & Cutters', 'Coffee & Tea Makers', 'Kitchen Gadgets'],
    'home-appliances': ['Room Heaters', 'Fans', 'Air Coolers', 'Electric Irons', 'Humidifiers', 'Water Heaters', 'Emergency Lights'],
    'cleaning-home-care': ['Spin Mops & Buckets', 'Manual Cleaning Tools', 'Electric Scrubbers', 'Vacuum Cleaners', 'Sink & Drain Cleaners', 'Toilet Cleaning Tools', 'Microfiber Cloths', 'Disinfecting Tools'],
    'storage-organization': ['Kitchen Containers', 'Fridge Organizers', 'Wardrobe Organizers', 'Bathroom Racks', 'Drawer Dividers', 'Multipurpose Storage Boxes'],
    'personal-care': ['Hair Dryers', 'Trimmers', 'Shavers', 'Facial Steamers', 'Massagers', 'Grooming Kits'],
    'home-utility': ['Oil Dispensers', 'Water Bottles', 'Rechargeable Lighters', 'Hooks & Holders', 'Door Accessories', 'Anti-Slip Mats'],
    'kids-baby-care': ['Feeding Accessories', 'Baby Hygiene Tools', 'Baby Comfort Products', 'Child Safety Products'],
    'pet-care': ['Feeding Accessories', 'Grooming Tools', 'Pet Hygiene', 'Comfort Products'],
    'smart-portable-devices': ['USB Rechargeable Devices', 'Travel Appliances', 'Smart Utility Gadgets', 'Emergency Devices'],
    'combos-value-packs': ['Kitchen Combos', 'Cleaning Combos', 'Home Starter Kits', 'Festival Combos'],
};

const brands = ['Samsung', 'LG', 'Prestige', 'Philips', 'Milton', 'Butterfly', 'Singer', 'Havells'];
const colors = [
    { name: 'White', class: 'bg-white border border-slate-200' },
    { name: 'Black', class: 'bg-slate-900' },
    { name: 'Silver', class: 'bg-slate-300' },
    { name: 'Blue', class: 'bg-blue-600' },
    { name: 'Red', class: 'bg-red-600' },
    { name: 'Green', class: 'bg-green-600' },
];

const sizes = ['Small', 'Medium', 'Large', 'Standard', 'Compact', 'Portable'];
const discounts = ['10% & above', '25% & above', '50% & above', '70% & above'];
const ratings = [5, 4, 3, 2];
const shippingZones = ['Zone 1 (Express)', 'Zone 2 (Standard)', 'Zone 3 (Economy)', 'International'];
const tags = ['Best Seller', 'Trending', 'Electric Cutters', 'Smart Chopping Boards', 'Portable Blenders', 'Electric Kettles', 'Cleaners'];

interface ProductFilterSidebarProps {
    isCollapsible?: boolean;
    currentCategory?: string;
    onCategoryChange?: (slug: string) => void;
}

export const ProductFilterSidebar = ({ isCollapsible = true, currentCategory, onCategoryChange }: ProductFilterSidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openSections, setOpenSections] = useState<string[]>(['availability', 'categories', 'price', 'subcategories', 'specific-filters']);

    const toggleSection = (section: string) => {
        setOpenSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    // Get active subcategories
    const activeSubcategories = currentCategory ? subCategoriesMap[currentCategory] || [] : [];

    // Category Specific Filters mapping
    const categorySpecificFilters: Record<string, Array<{ id: string, label: string, options: string[] }>> = {
        'kitchen-appliances': [
            { id: 'power', label: 'Power (Watt)', options: ['500W', '750W', '1000W', '1200W+'] },
            { id: 'capacity', label: 'Capacity', options: ['Up to 500ml', '1L - 2L', '2L - 5L', '5L+'] },
            { id: 'material', label: 'Material', options: ['Stainless Steel', 'Plastic', 'Glass', 'Ceramic'] },
        ],
        'home-appliances': [
            { id: 'heating', label: 'Heating Type', options: ['Convection', 'Radiant', 'PTC Ceramic'] },
            { id: 'energy', label: 'Energy Rating', options: ['5 Star', '4 Star', '3 Star'] },
        ],
        'cleaning-home-care': [
            { id: 'power-type', label: 'Power Type', options: ['Manual', 'Electric (Corded)', 'Battery Powered'] },
            { id: 'area', label: 'Cleaning Area', options: ['Floor', 'Kitchen', 'Windows', 'Restroom'] },
        ],
    };

    const currentSpecificFilters = currentCategory ? categorySpecificFilters[currentCategory] || [] : [];

    // Collapsed view - show only filter icons
    if (isCollapsed) {
        return (
            <aside className="w-16 shrink-0 bg-white/40 backdrop-blur-md border border-[#10367D]/10 rounded-[2rem] p-3 lg:sticky lg:top-32 h-fit self-start relative">
                {/* Expand Button */}
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="absolute -right-3 top-6 w-6 h-6 bg-[#10367D] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                    title="Expand filters"
                >
                    <FaChevronRight className="w-3 h-3" />
                </button>

                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#10367D]/10 flex items-center justify-center text-[#10367D]" title="Filters">
                        <Filter className="w-5 h-5" />
                    </div>
                    <div className="w-8 h-px bg-[#10367D]/10" />
                    {mainCategories.slice(0, 4).map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => onCategoryChange?.(cat.slug)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all ${currentCategory === cat.slug ? 'bg-[#10367D] text-white' : 'bg-white border border-[#10367D]/10 text-[#10367D] hover:bg-[#10367D]/5'}`}
                            title={cat.name}
                        >
                            {cat.name.charAt(0)}
                        </button>
                    ))}
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-full lg:w-72 bg-white/40 backdrop-blur-md border border-[#10367D]/10 rounded-[2rem] p-6 lg:sticky lg:top-32 h-fit self-start relative transition-all duration-300">
            {/* Collapse Button */}
            {isCollapsible && (
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 bg-[#10367D] text-white rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                    title="Collapse filters"
                >
                    <FaChevronLeft className="w-3 h-3" />
                </button>
            )}

            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-wider flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#10367D]" />
                    Filters
                </h3>
                <button className="text-[10px] font-bold text-[#10367D] hover:underline underline-offset-4">Clear All</button>
            </div>

            <div className="space-y-6">
                {/* Main Categories */}
                <div className="space-y-3">
                    <button onClick={() => toggleSection('categories')} className="w-full flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[#10367D]/60 uppercase tracking-widest cursor-pointer">Categories</label>
                        <ChevronDown className={`w-3 h-3 text-[#10367D]/40 transition-transform ${openSections.includes('categories') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('categories') && (
                        <div className="space-y-1.5 pt-1 max-h-48 overflow-y-auto no-scrollbar">
                            {mainCategories.map((cat) => (
                                <button
                                    key={cat.slug}
                                    onClick={() => onCategoryChange?.(cat.slug)}
                                    className={`w-full flex items-center justify-between group py-1.5 px-3 rounded-lg transition-all ${currentCategory === cat.slug ? 'bg-[#10367D]/5 text-[#10367D]' : 'text-[#1E293B]/70 hover:bg-slate-50'}`}
                                >
                                    <span className="text-[xs] font-bold">{cat.name}</span>
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${currentCategory === cat.slug ? 'bg-[#10367D] text-white' : 'bg-slate-100 text-slate-400'}`}>{cat.count}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sub-categories - Dynamic */}
                {activeSubcategories.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-[#10367D]/5">
                        <button onClick={() => toggleSection('subcategories')} className="w-full flex items-center justify-between">
                            <label className="text-[10px] font-bold text-[#10367D]/60 uppercase tracking-widest cursor-pointer">Product Types</label>
                            <ChevronDown className={`w-3 h-3 text-[#10367D]/40 transition-transform ${openSections.includes('subcategories') ? 'rotate-180' : ''}`} />
                        </button>
                        {openSections.includes('subcategories') && (
                            <div className="space-y-2 pt-1">
                                {activeSubcategories.map((sub) => (
                                    <button key={sub} className="w-full flex items-center gap-3 group">
                                        <FaSquare className="text-slate-300" />
                                        <span className="text-sm font-bold text-[#1E293B]/70 group-hover:text-[#10367D] transition-colors">{sub}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Category Specific Filters */}
                {currentSpecificFilters.map((filter) => (
                    <div key={filter.id} className="space-y-3 pt-4 border-t border-[#10367D]/5">
                        <button onClick={() => toggleSection(filter.id)} className="w-full flex items-center justify-between">
                            <label className="text-[10px] font-bold text-[#10367D]/60 uppercase tracking-widest cursor-pointer">{filter.label}</label>
                            <ChevronDown className={`w-3 h-3 text-[#10367D]/40 transition-transform ${openSections.includes(filter.id) ? 'rotate-180' : ''}`} />
                        </button>
                        {openSections.includes(filter.id) && (
                            <div className="space-y-2 pt-1">
                                {filter.options.map((option) => (
                                    <button key={option} className="w-full flex items-center gap-3 group">
                                        <FaSquare className="text-slate-300" />
                                        <span className="text-sm font-bold text-[#1E293B]/70 group-hover:text-[#10367D] transition-colors">{option}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Global Filters - Price, Brands, etc. continue below */}

                {/* Availability */}
                <div className="space-y-3 pt-4 border-t border-[#10367D]/5">
                    <label className="text-[10px] font-bold text-[#10367D]/60 uppercase tracking-widest">Availability</label>
                    <div className="space-y-2">
                        {['In Stock', 'Out of Stock'].map((status) => (
                            <button key={status} className="w-full flex items-center gap-3 group font-bold">
                                {status === 'In Stock' ? <FaCheckSquare className="text-[#10367D]" /> : <FaSquare className="text-slate-200" />}
                                <span className="text-xs text-[#1E293B]/60 group-hover:text-[#10367D]">{status}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4 pt-4 border-t border-[#10367D]/5">
                    <label className="text-[10px] font-bold text-[#10367D]/60 uppercase tracking-widest">Price Range</label>
                    <div className="px-2">
                        <div className="h-1 w-full bg-[#10367D]/10 rounded-full relative">
                            <div className="absolute left-0 right-1/4 h-full bg-[#10367D] rounded-full" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#10367D] rounded-full shadow-md border-2 border-white" />
                            <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#10367D] rounded-full shadow-md border-2 border-white" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/60 border border-[#10367D]/10 rounded-lg px-2 py-1.5 flex items-center justify-center">
                            <span className="text-[10px] font-black text-[#1E293B]">₹0</span>
                        </div>
                        <span className="text-slate-300">-</span>
                        <div className="flex-1 bg-white/60 border border-[#10367D]/10 rounded-lg px-2 py-1.5 flex items-center justify-center">
                            <span className="text-[10px] font-black text-[#1E293B]">₹50,000+</span>
                        </div>
                    </div>
                </div>

                {/* Brands */}
                <div className="space-y-3 pt-4 border-t border-[#10367D]/5">
                    <button onClick={() => toggleSection('brands')} className="w-full flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[#10367D]/60 uppercase tracking-widest cursor-pointer">Brands</label>
                        <ChevronDown className={`w-3 h-3 text-[#10367D]/40 transition-transform ${openSections.includes('brands') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('brands') && (
                        <div className="space-y-2 pt-1 max-h-40 overflow-y-auto no-scrollbar">
                            {brands.map((brand) => (
                                <button key={brand} className="w-full flex items-center gap-3 group">
                                    <FaSquare className="text-slate-200" />
                                    <span className="text-xs font-bold text-[#1E293B]/70 group-hover:text-[#10367D] transition-colors">{brand}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Shipping Zone */}
                <div className="space-y-3 pt-4 border-t border-[#10367D]/5">
                    <button onClick={() => toggleSection('shipping')} className="w-full flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[#10367D]/60 uppercase tracking-widest cursor-pointer">Shipping Zone</label>
                        <ChevronDown className={`w-3 h-3 text-[#10367D]/40 transition-transform ${openSections.includes('shipping') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('shipping') && (
                        <div className="space-y-2 pt-1">
                            {shippingZones.map((zone) => (
                                <button key={zone} className="w-full flex items-center gap-3 group text-left">
                                    <FaSquare className="text-slate-200 shrink-0" />
                                    <span className="text-xs font-bold text-[#1E293B]/70 group-hover:text-[#10367D] transition-colors">{zone}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Rating */}
                <div className="space-y-3 pt-4 border-t border-[#10367D]/5">
                    <button onClick={() => toggleSection('rating')} className="w-full flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[#10367D]/60 uppercase tracking-widest cursor-pointer">Customer Rating</label>
                        <ChevronDown className={`w-3 h-3 text-[#10367D]/40 transition-transform ${openSections.includes('rating') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('rating') && (
                        <div className="space-y-2 pt-1">
                            {ratings.map((rating) => (
                                <button key={rating} className="w-full flex items-center gap-2 group">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            i < rating ?
                                                <FaStar key={i} className="w-3 h-3 text-amber-400" /> :
                                                <FaRegStar key={i} className="w-3 h-3 text-slate-200" />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">& Up</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Discount */}
                <div className="space-y-3 pt-4 border-t border-[#10367D]/5">
                    <button onClick={() => toggleSection('discount')} className="w-full flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[#10367D]/60 uppercase tracking-widest cursor-pointer">Discount</label>
                        <ChevronDown className={`w-3 h-3 text-[#10367D]/40 transition-transform ${openSections.includes('discount') ? 'rotate-180' : ''}`} />
                    </button>
                    {openSections.includes('discount') && (
                        <div className="space-y-2 pt-1">
                            {discounts.map((discount) => (
                                <button key={discount} className="w-full flex items-center gap-3 group">
                                    <FaSquare className="text-slate-200" />
                                    <span className="text-xs font-bold text-[#1E293B]/70 group-hover:text-[#10367D] transition-colors">{discount}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

