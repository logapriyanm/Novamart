'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa';
import CategorySidebarLeft from './CategorySidebarLeft';
import FeaturedProductsGrid from '../features/products/FeaturedProductsGrid';
import SpecialProductsList from '../features/products/SpecialProductsList';

import { FilterState } from '../features/products/ProductFilterSidebar';

interface CategoryLayoutProps {
    categorySlug: string;
}

export default function CategoryLayout({ categorySlug }: CategoryLayoutProps) {
    const categoryName = categorySlug
        ? categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : 'Category';
    const description = `Premium selection of high-performance ${categoryName.toLowerCase()} for your home and kitchen.`;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Lifted Filter State
    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 100000],
        brands: [],
        rating: null,
        availability: [],
        verifiedOnly: false,
        subCategory: null,
        powerConsumption: [],
        capacity: [],
        energyRating: [],
        installationType: [],
        usageType: [],
        warranty: [],
        isSmart: false
    });

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-background text-foreground pt-39 pb-0">
            <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
                {/* Layout Container */}
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT SIDEBAR */}
                    <AnimatePresence mode="wait">
                        {isSidebarOpen && (
                            <motion.aside
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 320, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="hidden lg:block shrink-0 overflow-hidden"
                            >
                                <div className="w-80 space-y-8 pb-8">
                                    <CategorySidebarLeft
                                        categorySlug={categorySlug}
                                        filters={filters}
                                        onFilterChange={handleFilterChange}
                                    />
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* MAIN CONTENT */}
                    <main className="flex-1 min-w-0 space-y-12">
                        {/* Sidebar Toggle & Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className="p-2 bg-surface hover:bg-primary hover:text-background rounded-xl border border-foreground/5 transition-all shadow-lg"
                                    title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                                >
                                    {isSidebarOpen ? <FaChevronLeft className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
                                </button>
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight text-foreground">{categoryName}</h2>
                                    {filters.subCategory && (
                                        <p className="text-sm font-medium text-primary mt-1">Showing: {filters.subCategory}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {filters.subCategory && (
                                    <button
                                        onClick={() => handleFilterChange('subCategory', null)}
                                        className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all"
                                    >
                                        Clear: {filters.subCategory} ×
                                    </button>
                                )}
                            </div>
                        </div>

                        <section>
                            {/* Toolbar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                {/* Left: View Toggle */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleFilterChange('viewMode', 'grid')}
                                        className={`p-2.5 rounded-lg transition-all border ${filters.viewMode !== 'list' ? 'bg-white border-foreground/10 text-primary shadow-sm' : 'bg-transparent border-transparent text-foreground/40 hover:text-foreground'}`}
                                        title="Grid View"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                    </button>
                                    <button
                                        onClick={() => handleFilterChange('viewMode', 'list')}
                                        className={`p-2.5 rounded-lg transition-all border ${filters.viewMode === 'list' ? 'bg-white border-foreground/10 text-primary shadow-sm' : 'bg-transparent border-transparent text-foreground/40 hover:text-foreground'}`}
                                        title="List View"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                                    </button>
                                </div>

                                {/* Right: Sort By */}
                                <div className="flex-1 w-full sm:w-auto flex md:justify-end">
                                    <div className="w-full md:w-auto md:min-w-[300px] flex items-center justify-between gap-4 bg-white px-6 py-3.5 rounded-xl border border-foreground/10 shadow-sm cursor-pointer group hover:border-primary/20 transition-all">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-foreground">Sort By</span>
                                        </div>
                                        <select
                                            className="bg-transparent text-sm font-medium outline-none text-foreground/70 cursor-pointer w-full text-right"
                                            value={filters.sortBy || 'relevance'}
                                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                        >
                                            <option value="relevance">Relevance</option>
                                            <option value="price_asc">Price: Low to High</option>
                                            <option value="price_desc">Price: High to Low</option>
                                            <option value="rating">Top Rated</option>
                                            <option value="newest">Newest Arrivals</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
                                <button className="text-sm font-bold text-primary hover:underline">View All</button>
                            </div>
                            <FeaturedProductsGrid
                                columns={isSidebarOpen ? 4 : 5}
                                filters={filters}
                                viewMode={filters.viewMode || 'grid'}
                                categorySlug={categorySlug}
                            />
                        </section>

                        <section className="bg-surface rounded-[2.5rem] p-8 lg:p-12 border border-foreground/5">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold tracking-tight text-foreground">Offer Products</h2>
                            </div>
                            <SpecialProductsList />
                        </section>
                    </main>

                </div>
            </div>
        </div>
    );
}
