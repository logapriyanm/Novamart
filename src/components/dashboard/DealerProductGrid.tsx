'use client';

import React from 'react';
import { ProductFilterSidebar } from '../ui/ProductFilterSidebar';
import { ProductManagementCard } from '../ui/ProductManagementCard';
import { FaSearch as Search, FaPlus as Plus, FaTh as Grid, FaList as ListIcon, FaChevronRight as ChevronRight } from 'react-icons/fa';

const mockProducts = [
    {
        name: "World's Most Expensive T Shirt",
        category: "Fashion",
        price: 266.24,
        originalPrice: 354.99,
        discount: 25,
        rating: 4.9,
        stock: 12,
        orders: 48,
        publishDate: "12 Oct, 20...",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=TSHIRT&backgroundColor=f8fafc"
    },
    {
        name: "Like Style Women Black Handbag",
        category: "Fashion",
        price: 742.00,
        rating: 4.2,
        stock: 6,
        orders: 30,
        publishDate: "06 Jan, 20...",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=BAG&backgroundColor=f8fafc"
    },
    {
        name: "Black Horn Backpack For Men B...",
        category: "Grocery",
        price: 113.24,
        originalPrice: 150.99,
        discount: 25,
        rating: 3.8,
        stock: 10,
        orders: 48,
        publishDate: "26 Mar, 20...",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=PACK&backgroundColor=f8fafc"
    },
    {
        name: "Innovative Education Book",
        category: "Kids",
        price: 96.26,
        rating: 4.7,
        stock: 12,
        orders: 48,
        publishDate: "12 Oct, 20...",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=BOOK&backgroundColor=f8fafc"
    },
    {
        name: "Sangria Girls Mint Green & Off-...",
        category: "Kids",
        price: 24.07,
        originalPrice: 96.26,
        discount: 75,
        rating: 4.7,
        stock: 6,
        orders: 30,
        publishDate: "06 Jan, 20...",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=SHOE&backgroundColor=f8fafc"
    },
    {
        name: "Lace-Up Casual Shoes For Men",
        category: "Fashion",
        price: 229.00,
        rating: 4.0,
        stock: 10,
        orders: 48,
        publishDate: "26 Mar, 20...",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=CASUAL&backgroundColor=f8fafc"
    }
];

export const DealerProductGrid = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            {/* Sidebar */}
            <ProductFilterSidebar />

            {/* Main Content */}
            <div className="flex-1 space-y-8">
                {/* Utility Header */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex items-center gap-4">
                        <button className="bg-[#10367D] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-[#10367D]/20 active:scale-95 transition-all text-sm">
                            <Plus className="w-4 h-4" />
                            Add Product
                        </button>
                        <div className="flex p-1 bg-white/40 backdrop-blur-md border border-[#10367D]/10 rounded-2xl">
                            <button className="p-2 rounded-xl bg-[#10367D] text-white shadow-lg">
                                <Grid className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-xl text-[#10367D]/40 hover:text-[#10367D] transition-colors">
                                <ListIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10367D]/40" />
                        <input
                            type="text"
                            placeholder="Search Products..."
                            className="w-full bg-white/40 border border-[#10367D]/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#10367D]/50 transition-all"
                        />
                    </div>
                </div>

                {/* Breadcrumbs Placeholder */}
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#10367D]/40">
                    <span>Products</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#10367D]">Product Grid</span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {mockProducts.map((product, idx) => (
                        <ProductManagementCard key={idx} {...product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

