'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa';
import CategorySidebarLeft from './CategorySidebarLeft';
import FeaturedProductsGrid from '../features/products/FeaturedProductsGrid';
import SpecialProductsList from '../features/products/SpecialProductsList';

import { FilterState } from '../features/products/ProductFilterSidebar';

interface CategoryLayoutProps {
    categoryName: string;
    description: string;
    categorySlug: string;
}

export default function CategoryLayout({ categoryName, description, categorySlug }: CategoryLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Lifted Filter State
    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 100000],
        brands: [],
        rating: null,
        availability: [],
        verifiedOnly: false,
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
        <div className="min-h-screen bg-background text-foreground pt-32 pb-20">
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
                        <div className="flex items-center gap-4 mb-8">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 bg-surface hover:bg-primary hover:text-background rounded-xl border border-foreground/5 transition-all shadow-lg"
                                title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                            >
                                {isSidebarOpen ? <FaChevronLeft className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
                            </button>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">{categoryName}</h2>
                        </div>

                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold uppercase tracking-wide opacity-70">Featured Products</h2>
                                <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</button>
                            </div>
                            <FeaturedProductsGrid columns={isSidebarOpen ? 4 : 5} filters={filters} />
                        </section>

                        <section className="bg-surface rounded-[2.5rem] p-8 lg:p-12 border border-foreground/5">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Offer Products</h2>
                            </div>
                            <SpecialProductsList />
                        </section>
                    </main>

                </div>
            </div>
        </div>
    );
}
