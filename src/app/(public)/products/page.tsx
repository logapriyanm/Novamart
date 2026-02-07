'use client';

import React, { useState, Suspense } from 'react';
import CustomerProductCard from '../../../client/components/ui/CustomerProductCard';
import { ProductFilterSidebar, FilterState } from '../../../client/components/ui/ProductFilterSidebar';
import Breadcrumb from '../../../client/components/ui/Breadcrumb';
import {
    FaSearch as Search,
    FaFilter,
    FaTimes,
    FaChevronLeft
} from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const allProducts = [
    {
        id: '1',
        name: 'LG V6 Series Front Load Washing Machine with AI DD™',
        price: 34990,
        originalPrice: 42990,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
        brand: 'LG',
        spec: '8.0 KG LOAD',
        rating: 4.8,
        reviewsCount: 1242,
        seller: { name: 'LG Official Store', isVerified: true, isTopSeller: true },
        highlights: { freeDelivery: true, installation: true, warranty: '2 Yr Warranty' }
    },
    {
        id: '2',
        name: 'Samsung Ecobubble™ Top Load with Hygiene Steam',
        price: 21490,
        originalPrice: 26000,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
        brand: 'SAMSUNG',
        spec: '7.0 KG LOAD',
        rating: 4.6,
        reviewsCount: 856,
        seller: { name: 'Samsung Plaza', isVerified: true, isTopSeller: false },
        highlights: { freeDelivery: true, installation: true, warranty: '2 Yr Warranty' }
    },
    {
        id: '3',
        name: 'Bosch Series 6 Fully Automatic Front Load with i-DOS',
        price: 48990,
        originalPrice: 59990,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
        brand: 'BOSCH',
        spec: '9.0 KG LOAD',
        rating: 4.9,
        reviewsCount: 422,
        seller: { name: 'Bosch Home India', isVerified: true, isTopSeller: true },
        highlights: { freeDelivery: true, installation: true, warranty: '3 Yr Warranty' }
    },
    {
        id: '4',
        name: 'Haier 7.5kg Semi Automatic Top Load Washer',
        price: 12499,
        originalPrice: 15999,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
        brand: 'HAIER',
        spec: '7.5 KG LOAD',
        rating: 4.4,
        reviewsCount: 567,
        seller: { name: 'Nova Express', isVerified: true },
        highlights: { freeDelivery: true, installation: false, warranty: '2 Yr Warranty' }
    }
];

function ProductsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('cat') || '';
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // State for Sort
    const [sortBy, setSortBy] = useState('relevance');

    // State for Filters
    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 100000],
        brands: [],
        rating: null,
        availability: [],
        verifiedOnly: false
    });

    const handleCategoryChange = (slug: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (slug) {
            params.set('cat', slug);
        } else {
            params.delete('cat');
        }
        router.push(`/products?${params.toString()}`);
    };

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearAllFilters = () => {
        setFilters({
            priceRange: [0, 100000],
            brands: [],
            rating: null,
            availability: [],
            verifiedOnly: false
        });
        router.push('/products');
    };

    // Derived State: Filtered & Sorted Products
    const filteredProducts = allProducts.filter(product => {
        // 1. Category Filter (Mock logic as products don't have category field in this snippet, assuming all match for now or add mock logic)
        // In real app, product.category === currentCategory

        // 2. Price Filter
        if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;

        // 3. Brand Filter
        if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;

        // 4. Rating Filter
        if (filters.rating && product.rating < filters.rating) return false;

        // 5. Verified Seller Filter
        if (filters.verifiedOnly && !product.seller.isVerified) return false;

        return true;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'rating': return b.rating - a.rating;
            default: return 0; // Relevance
        }
    });

    const categoryTitle = currentCategory
        ? currentCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : 'All Collections';

    return (
        <div className="min-h-screen pt-32 pb-20 bg-slate-50/50">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                {/* 3️⃣ Breadcrumb section (SEO + UX) */}
                <div className="mb-8">
                    <Breadcrumb
                        items={[
                            // { label: 'Home', href: '/' },
                            { label: 'Products', href: '/products' },
                            { label: categoryTitle }
                        ]}
                    />
                </div>



                {/* 1️⃣ Main Layout Structure */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* SIDEBAR */}
                    <AnimatePresence mode="wait">
                        {isDesktopSidebarOpen && (
                            <motion.aside
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 320, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="hidden lg:block shrink-0 overflow-hidden"
                            >
                                <div className="w-80 pb-8">
                                    <ProductFilterSidebar
                                        currentCategory={currentCategory}
                                        onCategoryChange={handleCategoryChange}
                                        filters={filters}
                                        onFilterChange={handleFilterChange}
                                    />
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* PRODUCT GRID */}
                    <main className="flex-1 min-w-0">
                        {/* 🔁 Filter & Sort Bar Redesign */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 pb-6 border-b border-slate-200/60">

                            <div className="flex items-center gap-4 w-full">
                                {/* Desktop Sidebar Toggle */}
                                <button
                                    onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                                    className="hidden lg:flex p-2 bg-white hover:bg-[#10367D] hover:text-white rounded-xl border border-slate-200 transition-all shadow-sm items-center justify-center"
                                    title={isDesktopSidebarOpen ? "Close Filters" : "Open Filters"}
                                >
                                    {isDesktopSidebarOpen ? <FaChevronLeft className="w-4 h-4" /> : <FaFilter className="w-4 h-4" />}
                                </button>

                                <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-2 sm:pb-0 w-full">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest shrink-0">Active Filters:</span>
                                    <div className="flex items-center gap-3">
                                        {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) && (
                                            <div className="bg-[#10367D]/10 px-4 py-2 rounded-full flex items-center gap-2 border border-[#10367D]/5 hover:bg-[#10367D]/15 transition-colors group cursor-pointer" onClick={() => handleFilterChange('priceRange', [0, 100000])}>
                                                <span className="text-[11px] font-bold text-[#10367D]">Price: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}</span>
                                                <FaTimes className="w-2.5 h-2.5 text-[#10367D]/40 group-hover:text-[#10367D]" />
                                            </div>
                                        )}
                                        {filters.brands.map(brand => (
                                            <div key={brand} className="bg-[#10367D]/10 px-4 py-2 rounded-full flex items-center gap-2 border border-[#10367D]/5 hover:bg-[#10367D]/15 transition-colors group cursor-pointer" onClick={() => handleFilterChange('brands', filters.brands.filter(b => b !== brand))}>
                                                <span className="text-[11px] font-bold text-[#10367D]">{brand}</span>
                                                <FaTimes className="w-2.5 h-2.5 text-[#10367D]/40 group-hover:text-[#10367D]" />
                                            </div>
                                        ))}
                                        {(filters.priceRange[0] === 0 && filters.priceRange[1] === 100000 && filters.brands.length === 0) && (
                                            <span className="text-[11px] font-bold text-slate-400 italic">None</span>
                                        )}
                                        {/* Clear All Button */}
                                        {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100000 || filters.brands.length > 0) && (
                                            <button onClick={clearAllFilters} className="text-[11px] font-black text-[#10367D] uppercase tracking-widest ml-2 px-2 py-2 hover:bg-[#10367D]/5 rounded-lg transition-colors">Clear All</button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 mt-4 sm:mt-0">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Sort by:</span>
                                <div className="relative group">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none bg-white border border-slate-200 rounded-2xl px-6 py-3 pr-12 text-[11px] font-black text-[#1E293B] uppercase tracking-widest focus:outline-none focus:border-[#10367D] transition-all cursor-pointer shadow-sm"
                                    >
                                        <option value="relevance">Relevance</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Top Rated</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5️⃣ PRODUCT GRID */}
                        {filteredProducts.length > 0 ? (
                            <div className={isDesktopSidebarOpen
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
                            }>
                                {filteredProducts.map((product) => (
                                    <CustomerProductCard key={product.id} {...product} />
                                ))}
                            </div>
                        ) : (
                            /* 9️⃣ EMPTY STATE UX */
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-black text-[#1E293B] mb-2">No products found</h3>
                                <p className="text-slate-500 font-medium mb-8 italic">Try adjusting your filters or clearing all to see more options.</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-8 py-4 bg-[#10367D] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* 8️⃣ MOBILE UX (Slide-up Filter Sheet) */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200]"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="lg:hidden fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-[201] rounded-t-[2.5rem] shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-black text-[#1E293B] uppercase tracking-wider">Refine Inventory</h3>
                                    <p className="text-[10px] font-bold text-[#10367D]">NovaMart Trust Certifications</p>
                                </div>
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-full text-slate-400"
                                >
                                    <FaTimes className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                <ProductFilterSidebar
                                    currentCategory={currentCategory}
                                    onCategoryChange={(slug) => {
                                        handleCategoryChange(slug);
                                        setIsMobileFilterOpen(false);
                                    }}
                                    filters={filters}
                                    onFilterChange={handleFilterChange}
                                />
                            </div>

                            <div className="p-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                                <button onClick={clearAllFilters} className="py-4 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clear All</button>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="py-4 bg-[#10367D] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#10367D]/20">Apply Filters</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-40 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#10367D] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}


