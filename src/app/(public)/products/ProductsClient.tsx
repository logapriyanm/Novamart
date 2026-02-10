'use client';

import React, { useState, useEffect } from 'react';
import CustomerProductCard from '@/client/components/ui/CustomerProductCard';
import { ProductFilterSidebar, FilterState } from '@/client/components/features/products/ProductFilterSidebar';
import Breadcrumb from '@/client/components/ui/Breadcrumb';
import { productService } from '@/lib/api/services/product.service';
import {
    FaSearch as Search,
    FaFilter,
    FaTimes,
    FaChevronLeft
} from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductsClientProps {
    forcedCategory?: string;
}

export default function ProductsClient({ forcedCategory }: ProductsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paramCategory = searchParams.get('cat');

    const currentCategory = forcedCategory || paramCategory || '';
    const searchQuery = searchParams.get('q') || '';

    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('relevance');

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

    useEffect(() => {
        fetchProducts();
    }, [currentCategory, searchQuery, sortBy, JSON.stringify(filters)]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const params: any = {
                status: 'APPROVED',
                category: currentCategory,
                q: searchQuery,
                sortBy: sortBy,
                minPrice: filters.priceRange[0],
                maxPrice: filters.priceRange[1],
                subCategory: filters.subCategory
            };

            // Collect technical filters (spec_*)
            const specList: string[] = [];
            Object.entries(filters).forEach(([key, value]) => {
                if (key.startsWith('spec_') && value) {
                    if (Array.isArray(value) && value.length > 0) {
                        specList.push(`${key.replace('spec_', '')}:${value.join('|')}`);
                    } else if (typeof value === 'string' && value) {
                        specList.push(`${key.replace('spec_', '')}:${value}`);
                    }
                }
            });
            if (specList.length > 0) {
                params.specs = specList.join(',');
            }

            const response = await productService.getAllProducts(params);
            const data = response?.products || [];

            const adapted = data.map(p => ({
                id: p.id,
                inventoryId: p.inventory?.[0]?.id,
                name: p.name,
                price: p.inventory?.[0]?.price || p.basePrice,
                originalPrice: p.inventory?.[0]?.originalPrice || p.basePrice,
                image: p.images?.[0] || '/assets/placeholder-product.png',
                brand: p.manufacturer?.companyName || 'NovaMart',
                spec: p.category,
                subCategory: p.specifications?.subCategory,
                rating: p.averageRating || 0,
                reviewsCount: p.reviewCount || 0,
                seller: {
                    id: p.inventory?.[0]?.dealer?.id,
                    name: p.inventory?.[0]?.dealer?.businessName || p.manufacturer?.companyName || 'Verified Seller',
                    isVerified: p.manufacturer?.isVerified || false
                },
                inStock: (p.inventory?.[0]?.stock || 0) > 0,
                colors: p.colors || [],
                sizes: p.sizes || [],
                highlights: {
                    freeDelivery: p.basePrice > 2000,
                    installation: p.category?.toLowerCase() === 'machinery',
                    warranty: p.specifications?.warranty || '1 Year'
                }
            }));
            setProducts(adapted);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryChange = (slug: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (slug) {
            params.set('cat', slug);
        } else {
            params.delete('cat');
        }
        params.delete('sub');
        router.push(`/products?${params.toString()}`);
    };

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearAllFilters = () => {
        setFilters({
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
        router.push('/products');
    };

    const filteredProducts = products.filter(product => {
        if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
        if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;
        if (filters.rating && product.rating < filters.rating) return false;
        if (filters.subCategory && product.subCategory !== filters.subCategory) return false;
        return true;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'rating': return b.rating - a.rating;
            default: return 0;
        }
    });

    const categoryTitle = currentCategory
        ? currentCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : 'All Collections';

    return (
        <div className="min-h-screen pt-20 md:pt-32 pb-10 md:pb-20 bg-slate-50/50">
            <h1 className="sr-only">
                {currentCategory ? `Verified Wholesale ${categoryTitle} - NovaMart` : 'Quality Wholesale Products - NovaMart'}
            </h1>
            <div className="container-responsive">
                <div className="mb-8">
                    <Breadcrumb
                        items={[
                            { label: 'Products', href: '/products' },
                            { label: categoryTitle }
                        ]}
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
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

                    <main className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-10 pb-6 border-b border-slate-200/60">
                            <div className="flex items-center gap-2 sm:gap-4 w-full">
                                <button
                                    onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                                    className="hidden lg:flex p-2 bg-white hover:bg-black hover:text-white rounded-[10px] border border-slate-200 transition-all shadow-sm items-center justify-center"
                                    title={isDesktopSidebarOpen ? "Close Filters" : "Open Filters"}
                                >
                                    {isDesktopSidebarOpen ? <FaChevronLeft className="w-4 h-4" /> : <FaFilter className="w-4 h-4" />}
                                </button>

                                <button
                                    onClick={() => setIsMobileFilterOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 rounded-[10px] border border-slate-200 transition-all shadow-sm text-sm font-bold text-black"
                                >
                                    <FaFilter className="w-3.5 h-3.5 text-black" />
                                    Filters
                                </button>

                                <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-2 sm:pb-0 w-full">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest shrink-0">Active Filters:</span>
                                    <div className="flex items-center gap-3">
                                        {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) && (
                                            <div className="bg-black/5 px-4 py-2 rounded-[5px] flex items-center gap-2 border border-foreground/5 hover:bg-black/10 transition-colors group cursor-pointer" onClick={() => handleFilterChange('priceRange', [0, 100000])}>
                                                <span className="text-[11px] font-bold text-black">Price: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}</span>
                                                <FaTimes className="w-2.5 h-2.5 text-black/40 group-hover:text-black" />
                                            </div>
                                        )}
                                        {filters.brands.map(brand => (
                                            <div key={brand} className="bg-black/5 px-4 py-2 rounded-[5px] flex items-center gap-2 border border-foreground/5 hover:bg-black/10 transition-colors group cursor-pointer" onClick={() => handleFilterChange('brands', filters.brands.filter(b => b !== brand))}>
                                                <span className="text-[11px] font-bold text-black">{brand}</span>
                                                <FaTimes className="w-2.5 h-2.5 text-black/40 group-hover:text-black" />
                                            </div>
                                        ))}
                                        {(filters.priceRange[0] === 0 && filters.priceRange[1] === 100000 && filters.brands.length === 0) && (
                                            <span className="text-[11px] font-bold text-slate-400 italic">None</span>
                                        )}
                                        {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100000 || filters.brands.length > 0) && (
                                            <button onClick={clearAllFilters} className="text-[11px] font-black text-black uppercase tracking-widest ml-2 px-2 py-2 hover:bg-black/5 rounded-[10px] transition-colors">Clear All</button>
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
                                        className="appearance-none bg-white border border-slate-200 rounded-[10px] px-6 py-3 pr-12 text-[11px] font-black text-black uppercase tracking-widest focus:outline-none focus:border-black transition-all cursor-pointer shadow-sm"
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

                        {isLoading ? (
                            <div className={isDesktopSidebarOpen
                                ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
                            }>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="bg-white rounded-[10px] p-4 border border-slate-100 animate-pulse h-64 md:h-96"></div>
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className={isDesktopSidebarOpen
                                ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
                            }>
                                {filteredProducts.map((product) => (
                                    <CustomerProductCard key={product.id} {...product} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[10px] p-10 md:p-20 text-center">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-[10px] flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-6 h-6 md:w-8 md:h-8 text-slate-300" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-black mb-2 uppercase italic">No products found</h3>
                                <p className="text-slate-500 font-medium mb-8 italic">Try adjusting your filters or clearing all to see more options.</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-6 py-3 md:px-8 md:py-4 bg-black text-white rounded-[10px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-105 transition-all"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

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
                            className="lg:hidden fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-[201] rounded-t-[20px] shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-black text-black uppercase tracking-wider">Refine Inventory</h3>
                                    <p className="text-[10px] font-bold text-black opacity-40">NovaMart Trust Certifications</p>
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
                                <button onClick={clearAllFilters} className="py-4 border border-slate-200 rounded-[10px] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clear All</button>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="py-4 bg-black text-white rounded-[10px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/20">Apply Filters</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
