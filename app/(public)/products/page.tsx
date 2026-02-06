'use client';

import React, { useState } from 'react';
import CustomerProductCard from '../../../src/components/ui/CustomerProductCard';
import { ProductFilterSidebar } from '../../../src/components/ui/ProductFilterSidebar';
import Breadcrumb from '../../../src/components/ui/Breadcrumb';
import { FaSearch as Search, FaSlidersH as SlidersHorizontal, FaMagic as Sparkles, FaTimes, FaFilter } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const allProducts = [
    { id: '1', name: 'ProClean 500W Mixer Grinder', price: 3499, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop', rating: 4.8 },
    { id: '2', name: 'FrostGuard Smart Fridge v2', price: 45999, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop', rating: 4.9 },
    { id: '3', name: 'Solaris Pro Energy Panel', price: 12499, image: 'https://images.unsplash.com/photo-1509391366360-fe5bb6521e7c?q=80&w=800&auto=format&fit=crop', rating: 4.7 },
    { id: '4', name: 'EcoWash Silent Runner', price: 28999, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop', rating: 4.6 },
    { id: '5', name: 'Culina Master Induction', price: 5499, image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop', rating: 4.5 }
];

import { Suspense } from 'react';

function ProductsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('cat') || '';
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleCategoryChange = (slug: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (slug) {
            params.set('cat', slug);
        } else {
            params.delete('cat');
        }
        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="min-h-screen pt-28 pb-20">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                {/* Breadcrumb section */}
                <Breadcrumb
                    items={[
                        { label: 'Products', href: '/products' },
                        { label: currentCategory ? currentCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'All Collections' }
                    ]}
                />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black text-[#1E293B] tracking-tight mb-2">
                            {currentCategory ? currentCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'All Collections'}
                        </h1>
                        <p className="text-slate-500 font-medium">Explore India's most innovative home appliance marketplace.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E293B]/40" />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                className="w-full h-12 bg-white/60 backdrop-blur-xl border border-[#10367D]/10 rounded-xl pl-11 pr-4 text-sm focus:outline-none focus:border-[#10367D] transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="lg:hidden h-12 px-4 bg-[#10367D] text-white rounded-xl flex items-center gap-2 text-xs font-bold"
                        >
                            <FaFilter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Main Layout */}
                <div className="flex gap-8">
                    {/* Desktop Filter Sidebar */}
                    <div className="hidden lg:block">
                        <ProductFilterSidebar
                            currentCategory={currentCategory}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>

                    {/* Products Grid */}
                    <main className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#10367D]/5">
                            <p className="text-sm font-bold text-[#1E293B]/60">
                                Showing <span className="text-[#10367D]">{allProducts.length}</span> products
                            </p>
                            <select className="bg-white/60 border border-[#10367D]/10 rounded-lg px-3 py-2 text-xs font-bold text-[#10367D] focus:outline-none cursor-pointer">
                                <option>Sort by: Featured</option>
                                <option>New arrivals</option>
                                <option>Price low → high</option>
                                <option>Price high → low</option>
                                <option>Rating</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {allProducts.map((product) => (
                                <CustomerProductCard key={product.id} {...product} />
                            ))}
                        </div>

                        <div className="mt-16 flex justify-center">
                            <button className="px-10 py-4 bg-white border border-[#10367D]/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1E293B]/60 hover:text-[#10367D] transition-all hover:bg-[#10367D]/5">
                                Load More Inventories
                            </button>
                        </div>
                    </main>
                </div>
            </div>

            {/* Mobile Filter Overlay */}
            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white z-[201] p-6 overflow-y-auto shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-wider">Filters</h3>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="p-2 hover:bg-[#10367D]/10 rounded-lg transition-colors"
                                >
                                    <FaTimes className="w-4 h-4 text-[#1E293B]/60" />
                                </button>
                            </div>
                            <ProductFilterSidebar
                                currentCategory={currentCategory}
                                onCategoryChange={(slug) => {
                                    handleCategoryChange(slug);
                                    setIsFilterOpen(false);
                                }}
                            />
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


