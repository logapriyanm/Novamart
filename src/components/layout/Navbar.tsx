'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch as Search,
    FaShoppingCart,
    FaUserCircle,
    FaStore,
    FaBox,
    FaBars as Menu,
    FaTimes as X,
    FaShieldAlt as ShieldCheck,
    FaGlobe as Globe,
    FaFileInvoice,
    FaIdCard,
    FaIndustry,
    FaThLarge,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';
import { useSidebar } from '../../context/SidebarContext';


export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Get sidebar context - only available in public layout
    const sidebarContext = (() => {
        try {
            return useSidebar();
        } catch {
            return null;
        }
    })();

    // Check page type
    const isProductsPage = pathname?.startsWith('/products');
    const isHomePage = pathname === '/';

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-200">
            {/* Top Row: Logo, Search, User Actions */}
            <div className="w-full mx-auto px-4 lg:px-8 py-2">
                <div className="flex items-center justify-between gap-4 lg:gap-8">
                    {/* Brand & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
                        >
                            <Menu className="w-6 h-6 text-slate-600" />
                        </button>
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-15 h-15 flex items-center justify-center bg-transparent">
                                <img src="/assets/Novamart.png" alt="Novamart" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-2xl font-black text-[#1E293B] tracking-tighter hidden sm:block">
                                Novamart
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar - Center */}
                    <div className="flex-1 max-w-2xl hidden md:flex items-center">
                        <div className="flex w-full h-10 bg-white border-2 border-[#10367D] rounded-full overflow-hidden shadow-sm">

                            <input
                                type="text"
                                placeholder="Enter Product or Service to search..."
                                className="flex-1 px-4 text-sm focus:outline-none bg-white font-medium"
                            />

                            <button className="bg-[#10367D] hover:bg-[#10367D]/10 text-white px-6 transition-colors flex items-center justify-center group">
                                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Actions - Right */}
                    <div className="flex items-center gap-6 lg:gap-8">
                        <Link href="/products" className="hidden lg:flex items-center gap-2 hover:bg-slate-50 text-slate-600 hover:text-[#10367D] px-5 py-2.5 rounded-full transition-all duration-300 group font-bold">
                            <FaBox className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-widest">Products</span>
                        </Link>

                        <Link href="/sell" className="hidden lg:flex items-center gap-2 bg-[#10367D]/10 hover:bg-[#10367D] text-[#10367D] hover:text-white px-5 py-2.5 rounded-full transition-all duration-300 group">
                            <FaStore className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">Sell</span>
                        </Link>

                        <div className="h-8 w-px bg-slate-200 hidden lg:block" />

                        <Link href="/auth/login" className="flex flex-col items-center group gap-1">
                            <FaUserCircle className="w-6 h-6 text-slate-400 group-hover:text-[#10367D] transition-colors" />
                            <span className="text-[10px] font-bold text-slate-500 group-hover:text-[#10367D] transition-colors">Profile</span>
                        </Link>

                        <Link href="/cart" className="flex flex-col items-center group gap-1 relative">
                            <div className="relative">
                                <FaShoppingCart className="w-6 h-6 text-slate-400 group-hover:text-[#10367D] transition-colors" />
                                <span className="absolute -top-2 -right-2 bg-[#10367D] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">0</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 group-hover:text-[#10367D] transition-colors">Cart</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Categories (Products page) or Trust Bar (Other pages) */}
            <div className="bg-slate-50 border-t border-slate-200 hidden lg:block transition-all">
                <div className="max-w-[1600px] mx-auto px-8">
                    {isProductsPage ? (
                        // Category Navigation (For Products Page)
                        <div className="flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
                            {[
                                { name: 'All Categories', href: '/products' },
                                { name: 'Kitchen Appliances', href: '/products?cat=kitchen-appliances' },
                                { name: 'Home Appliances', href: '/products?cat=home-appliances' },
                                { name: 'Cleaning & Home Care', href: '/products?cat=cleaning-home-care' },
                                { name: 'Storage & Organization', href: '/products?cat=storage-organization' },
                                { name: 'Personal Care Appliances', href: '/products?cat=personal-care' },
                                { name: 'Home Utility & Accessories', href: '/products?cat=home-utility' },
                                { name: 'Kids & Baby Care', href: '/products?cat=kids-baby-care' },
                                { name: 'Pet Care', href: '/products?cat=pet-care' },
                                { name: 'Smart & Portable Devices', href: '/products?cat=smart-portable-devices' },
                                { name: 'Comb combos & Value Packs', href: '/products?cat=combos-value-packs' },
                            ].map((cat, i) => (
                                <Link
                                    key={i}
                                    href={cat.href}
                                    className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-all rounded-lg ${cat.name === 'All Categories'
                                        ? 'bg-[#10367D] text-white'
                                        : 'text-slate-600 hover:text-[#10367D] hover:bg-white'
                                        }`}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        // Trust Bar (For Home & Other Pages) with Categories Toggle
                        <div className="flex items-center justify-between py-3">
                            {/* Categories Toggle Button (only on home page) */}
                            {isHomePage && sidebarContext && (
                                <>
                                    <button
                                        onClick={sidebarContext.toggleCategorySidebar}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${sidebarContext.isCategorySidebarOpen
                                            ? 'bg-[#10367D] text-white'
                                            : 'bg-white border border-[#10367D] text-[#10367D] hover:bg-[#10367D]/10'
                                            }`}
                                    >
                                        <FaThLarge className="w-4 h-4" />
                                        Categories
                                        {sidebarContext.isCategorySidebarOpen ? (
                                            <FaChevronLeft className="w-3 h-3" />
                                        ) : (
                                            <FaChevronRight className="w-3 h-3" />
                                        )}
                                    </button>
                                    <div className="h-4 w-px bg-slate-200" />
                                </>
                            )}
                            <div className="flex items-center gap-2 text-slate-600">
                                <Globe className="w-4 h-4 text-[#74B4DA]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Verified Exporters Only</span>
                            </div>
                            <div className="h-4 w-px bg-slate-200" />
                            <div className="flex items-center gap-2 text-slate-600">
                                <ShieldCheck className="w-4 h-4 text-[#74B4DA]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">TrustSEAL Certified Sellers</span>
                            </div>
                            <div className="h-4 w-px bg-slate-200" />
                            <div className="flex items-center gap-2 text-slate-600">
                                <FaFileInvoice className="w-4 h-4 text-[#74B4DA]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">GST Verified</span>
                            </div>
                            <div className="h-4 w-px bg-slate-200" />
                            <div className="flex items-center gap-2 text-slate-600">
                                <FaIdCard className="w-4 h-4 text-[#74B4DA]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">IEC Verified</span>
                            </div>
                            <div className="h-4 w-px bg-slate-200" />
                            <div className="flex items-center gap-2 text-slate-600">
                                <FaIndustry className="w-4 h-4 text-[#10367D]" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Made in India - Supplied Globally</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Search - Visible only on small screens below top row */}
            <div className="md:hidden px-4 pb-4 bg-white">
                <div className="flex items-center bg-slate-100 rounded-xl px-4 py-3 gap-3">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="bg-transparent text-sm w-full focus:outline-none font-medium"
                    />
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-80 bg-white z-[120] lg:hidden shadow-2xl overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-xl font-black text-[#10367D]">Menu</span>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-xl">
                                        <X className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <Link href="/products" className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-[#10367D]" onClick={() => setIsMobileMenuOpen(false)}>
                                        <FaBox className="w-5 h-5 text-slate-400" />
                                        Products
                                    </Link>
                                    <Link href="/sell" className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-[#10367D]" onClick={() => setIsMobileMenuOpen(false)}>
                                        <FaStore className="w-5 h-5 text-slate-400" />
                                        Start Selling
                                    </Link>
                                    <Link href="/auth/login" className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-[#10367D]" onClick={() => setIsMobileMenuOpen(false)}>
                                        <FaUserCircle className="w-5 h-5 text-slate-400" />
                                        Profile
                                    </Link>
                                </div>

                                <div className="mt-12 pt-12 border-t border-slate-100 space-y-4">
                                    <Link href="/auth/login" className="w-full py-4 bg-[#10367D] text-white text-center rounded-2xl font-black text-xs uppercase tracking-widest block shadow-xl shadow-[#10367D]/20">
                                        Sign In
                                    </Link>
                                    <Link href="/auth/register" className="w-full py-4 border-2 border-[#10367D] text-[#10367D] text-center rounded-2xl font-black text-xs uppercase tracking-widest block">
                                        Register Now
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}

