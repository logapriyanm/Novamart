'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FaPlus,
    FaSearch,
    FaFilter,
    FaRocket
} from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import SellerProductCard from '@/client/components/features/seller/SellerProductCard';
import ProductSkeleton from '@/client/components/ui/ProductSkeleton';

export default function SellerProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DRAFT'>('ALL');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<any>('/seller/inventory');
            setProducts(res || []);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleListing = async (inventoryId: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;

        // Optimistic Update
        setProducts(prev => prev.map(p =>
            p._id === inventoryId ? { ...p, isListed: newStatus } : p
        ));

        try {
            await apiClient.put('/seller/inventory/toggle-listing', {
                inventoryId,
                isListed: newStatus
            });
            toast.success(newStatus ? 'Product listed successfully' : 'Product delisted');
        } catch (error: any) {
            // Revert
            setProducts(prev => prev.map(p =>
                p._id === inventoryId ? { ...p, isListed: currentStatus } : p
            ));
            toast.error(error.message || 'Failed to update listing status');
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = (p.customName || p.productId?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'ALL'
            ? true
            : filter === 'ACTIVE'
                ? p.isListed
                : !p.isListed;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-slate-900 min-h-screen">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">My <span className="text-secondary">Inventory</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">Manage Listings & Visuals</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/seller/discovery"
                        className="px-6 py-4 bg-primary text-white rounded-[10px] font-black text-sm uppercase tracking-[0.1em] shadow-lg shadow-primary/30 hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center gap-3"
                    >
                        <FaPlus className="w-4 h-4" />
                        Source New Product
                    </Link>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-0 bg-[#f8fafc] z-20 py-4 -my-4 px-1">
                {/* Search */}
                <div className="relative w-full sm:w-96 group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                    {['ALL', 'ACTIVE', 'DRAFT'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${filter === f
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {f === 'ALL' ? 'All Items' : f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    Array(8).fill(0).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))
                ) : filteredProducts.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MdOutlineProductionQuantityLimits className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black italic text-slate-900">No products found</h3>
                        <p className="text-slate-400 font-medium mt-2">Try adjusting your search or filters.</p>
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="mt-6 text-primary font-bold text-sm hover:underline">
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    filteredProducts.map((item) => (
                        <SellerProductCard
                            key={item._id}
                            id={item.productId?._id} // For router push if needed
                            inventoryId={item._id}
                            name={item.productId?.name}
                            customName={item.customName}
                            price={item.price}
                            originalPrice={item.originalPrice}
                            image={item.productId?.images?.[0]}
                            customImages={item.customImages}
                            rating={item.productId?.averageRating || 0}
                            reviewsCount={item.productId?.reviewCount || 0}
                            brand={item.productId?.manufacturerId?.companyName}
                            isListed={item.isListed}
                            stock={item.stock}
                            highlights={{
                                freeDelivery: item.price > 2000,
                                installation: false,
                                warranty: item.productId?.specifications?.warranty || 'Standard'
                            }}
                            onToggleListing={handleToggleListing}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
