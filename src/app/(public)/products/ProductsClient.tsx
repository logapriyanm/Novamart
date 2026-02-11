'use client';

import React, { useState, useEffect } from 'react';
import CustomerProductCard from '@/client/components/ui/CustomerProductCard';
import CustomerProductListRow from '@/client/components/ui/CustomerProductListRow';
import { ProductFilterSidebar, FilterState } from '@/client/components/features/products/ProductFilterSidebar';
import { productService } from '@/lib/api/services/product.service';
import {
    FaSearch as Search,
    FaFilter,
    FaTimes,
    FaThLarge,
    FaList,
    FaChevronRight
} from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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
    const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 5000000],
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
                category: currentCategory === 'all' ? '' : (currentCategory || ''),
                q: searchQuery,
                sortBy,
                minPrice: filters.priceRange[0],
                maxPrice: filters.priceRange[1],
                subCategory: (filters.subCategory && filters.subCategory !== 'null') ? filters.subCategory : undefined
            };

            Object.keys(params).forEach(key => (params as any)[key] === undefined && delete (params as any)[key]);

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
                inventoryId: p.inventory?.[0]?._id,
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
                    id: p.inventory?.[0]?.dealerId?._id,
                    name: p.inventory?.[0]?.dealerId?.businessName || p.manufacturer?.companyName || 'Verified Seller',
                    isVerified: p.manufacturer?.isVerified || false
                },
                inStock: (p.inventory?.[0]?.stock || 0) > 0,
                colors: p.colors || [],
                sizes: p.sizes || [],
                highlights: {
                    freeDelivery: p.basePrice > 2000,
                    installation: p.category?.toLowerCase() === 'machinery',
                    warranty: p.specifications?.warranty || '1 Year'
                },
                description: p.description,
                stockStatus: (p.inventory?.[0]?.stock || 0) > 10 ? 'IN_STOCK' : (p.inventory?.[0]?.stock || 0) > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK'
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
            priceRange: [0, 5000000],
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

    const categoryTitle = currentCategory
        ? currentCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : 'All Electronics';

    // Get active filter count/list
    const activeFilters = [];
    if (filters.brands.length > 0) activeFilters.push(...filters.brands.map(b => ({ key: 'brands', label: b, value: b })));
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000000) activeFilters.push({
        key: 'priceRange',
        label: `₹${filters.priceRange[0]} - ₹${filters.priceRange[1]}`,
        value: [0, 5000000]
    });
    if (filters.subCategory) activeFilters.push({ key: 'subCategory', label: filters.subCategory, value: null });

    return (
        <div className="min-h-screen pb-20 bg-[#F8FAFC]">
            {/* 1️⃣ TOP BAR DESIGN (ABOVE PRODUCTS) */}
            <header className="sticky top-20 z-40 bg-white border-b border-slate-200 py-4 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-4 xs:px-6">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <FaChevronRight className="w-2 h-2" />
                        <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
                        <FaChevronRight className="w-2 h-2" />
                        <span className="text-slate-600">{categoryTitle}</span>
                    </nav>

                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4">
                        <div className="flex items-baseline gap-2 xs:gap-4">
                            <h1 className="text-xl xs:text-2xl font-black text-slate-900 tracking-tight uppercase italic">
                                {categoryTitle}
                            </h1>
                            <span className="text-[10px] xs:text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                {products.length.toLocaleString()} Products
                            </span>
                        </div>

                        <div className="flex items-center justify-between xs:justify-end gap-3 xs:gap-6">
                            {/* View Toggle */}
                            <div className="flex items-center bg-slate-100 rounded-[10px] p-1 shadow-inner border border-slate-200">
                                <button
                                    onClick={() => setViewType('grid')}
                                    className={`p-2 rounded-[8px] transition-all flex items-center justify-center ${viewType === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <FaThLarge className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setViewType('list')}
                                    className={`p-2 rounded-[8px] transition-all flex items-center justify-center ${viewType === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <FaList className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative group flex-1 xs:flex-none">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full appearance-none bg-white border border-slate-200 rounded-[10px] pl-3 xs:pl-4 pr-8 xs:pr-10 py-2.5 text-[10px] xs:text-[11px] font-black text-slate-900 uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-all cursor-pointer shadow-sm min-w-[130px] xs:min-w-[160px]"
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="price-low">Price Low</option>
                                    <option value="price-high">Price High</option>
                                    <option value="rating">Rating</option>
                                </select>
                                <div className="absolute right-3 xs:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <FaChevronRight className="w-2.5 h-2.5 text-slate-400 rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Filter Pills */}
                    <AnimatePresence>
                        {activeFilters.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 overflow-hidden"
                            >
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Filters:</span>
                                {activeFilters.map((f, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            if (f.key === 'brands') {
                                                handleFilterChange('brands', filters.brands.filter(b => b !== f.value));
                                            } else {
                                                handleFilterChange(f.key, f.value);
                                            }
                                        }}
                                        className="bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-[5px] text-[10px] font-black uppercase flex items-center gap-2 transition-all group"
                                    >
                                        {f.label}
                                        <FaTimes className="w-2 h-2 text-blue-300 group-hover:text-blue-500" />
                                    </button>
                                ))}
                                <button
                                    onClick={clearAllFilters}
                                    className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest ml-2 transition-colors"
                                >
                                    Clear All
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <div className="max-w-[1440px] mx-auto px-4 xs:px-6 py-6 xs:py-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
                {/* 2️⃣ LEFT: FILTER SIDEBAR */}
                <aside className="hidden lg:block w-72 shrink-0">
                    <ProductFilterSidebar
                        currentCategory={currentCategory}
                        onCategoryChange={handleCategoryChange}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        isOpen={isDesktopSidebarOpen}
                        onToggle={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                    />
                </aside>

                {/* 3️⃣ CENTER: PRODUCT GRID / LIST */}
                <main className="flex-1 min-w-0">
                    <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="lg:hidden w-full flex items-center justify-center gap-2 mb-6 py-4 bg-white border border-slate-200 rounded-[10px] text-xs font-black uppercase tracking-widest shadow-sm"
                    >
                        <FaFilter className="w-3.5 h-3.5" />
                        Show Filters
                    </button>

                    {isLoading ? (
                        <div className={viewType === 'grid'
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "space-y-6"
                        }>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-[10px] border border-slate-100 animate-pulse h-96"></div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className={viewType === 'grid'
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "space-y-6"
                        }>
                            {products.map((product) => (
                                viewType === 'grid' ? (
                                    <CustomerProductCard key={product.id} {...product} />
                                ) : (
                                    <CustomerProductListRow key={product.id} {...product} />
                                )
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[20px] p-20 text-center shadow-sm">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase italic tracking-tight">No results matched</h3>
                            <p className="text-slate-500 font-medium mb-8 italic">Adjust your filters or query to find the right equipment.</p>
                            <button
                                onClick={clearAllFilters}
                                className="px-10 py-4 bg-blue-600 text-white rounded-[10px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-105 transition-all"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Filter Sheet */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="lg:hidden fixed right-0 top-0 bottom-0 w-[320px] bg-white z-[101] shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Filter Results</h3>
                                    <p className="text-[10px] font-bold text-slate-400">{products.length} Items Found</p>
                                </div>
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center text-slate-400"
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
                                <button onClick={clearAllFilters} className="py-4 border border-slate-200 rounded-[10px] text-[10px] font-black uppercase tracking-widest text-slate-400">Clear</button>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="py-4 bg-blue-600 text-white rounded-[10px] text-[10px] font-black uppercase tracking-widest">Apply</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
