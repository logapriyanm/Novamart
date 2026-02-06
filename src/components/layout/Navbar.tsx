'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch as Search,
    FaShoppingBag as ShoppingBag,
    FaUser as User,
    FaBars as Menu,
    FaTimes as X,
    FaArrowRight as ArrowRight,
    FaShieldAlt as ShieldCheck,
    FaGlobe as Globe,
    FaChevronDown as ChevronDown
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Logo from "../../../assets/Novamart.png"


export default function Navbar() {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchCategory, setSearchCategory] = useState('Product');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const mainCategories = [
        { name: 'All Categories', icon: Menu },
        { name: 'Refrigerators', href: '/products?cat=refrigerators' },
        { name: 'Washing Machines', href: '/products?cat=washing-machines' },
        { name: 'Air Conditioners', href: '/products?cat=ac' },
        { name: 'Microwave Ovens', href: '/products?cat=ovens' },
        { name: 'Kitchen Appliances', href: '/products?cat=kitchen' },
        { name: 'Home Entertainment', href: '/products?cat=tv' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-200">
            {/* Top Row: Logo, Search, User Actions */}
            <div className="w-full mx-auto px-4 lg:px-8 py-4">
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
                            <div className="w-10 h-10  flex items-center justify-center bg-transparent">
                                <img src={Logo.src} alt="Novamart" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-2xl font-black text-[#1E293B] tracking-tighter hidden sm:block">
                                Novamart
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar - Center */}
                    <div className="flex-1 max-w-2xl hidden md:flex items-center">
                        <div className="flex w-full h-12 bg-white border-2 border-[#2772A0] rounded-full overflow-hidden shadow-sm">
                            <div className="relative group px-4 flex items-center border-r border-slate-200 bg-slate-50 cursor-pointer">
                                <span className="text-xs font-bold text-slate-700 mr-1">{searchCategory}</span>
                                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#2772A0] transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Enter Product or Service to search..."
                                className="flex-1 px-4 text-sm focus:outline-none bg-white font-medium"
                            />
                            <div className="px-4 flex items-center bg-white cursor-pointer hover:bg-slate-50">
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <div className="w-0.5 h-3 bg-slate-300 mx-0.5 animate-pulse" />
                                    <div className="w-0.5 h-4 bg-slate-400 mx-0.5 animate-pulse" />
                                    <div className="w-0.5 h-2 bg-slate-300 mx-0.5 animate-pulse" />
                                </div>
                            </div>
                            <button className="bg-[#2772A0] hover:bg-[#BE123C] text-white px-6 transition-colors flex items-center justify-center group">
                                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Actions - Right */}
                    <div className="flex items-center gap-4 lg:gap-8">
                        <Link href="/auth/login" className="flex flex-col items-center group">
                            <User className="w-6 h-6 text-slate-600 group-hover:text-[#2772A0] transition-colors" />
                            <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Sign In / Join</span>
                        </Link>
                        <Link href="/contact" className="hidden lg:flex flex-col items-center group">
                            <ShieldCheck className="w-6 h-6 text-[#2772A0] group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black text-[#2772A0] mt-1 uppercase tracking-tight">Get Best Price</span>
                        </Link>
                        <Link href="/cart" className="flex flex-col items-center relative group">
                            <div className="relative">
                                <ShoppingBag className="w-6 h-6 text-slate-600 group-hover:text-[#2772A0] transition-colors" />
                                <span className="absolute -top-2 -right-2 bg-[#2772A0] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">0</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Cart</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Category Navigation */}
            <div className="bg-slate-50 border-t border-slate-200 hidden lg:block overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <ul className="flex items-center gap-2 py-2 whitespace-nowrap overflow-x-auto no-scrollbar">
                        {mainCategories.map((cat, i) => (
                            <li key={i} className="flex items-center">
                                {cat.name === 'All Categories' ? (
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-800 hover:text-[#2772A0] hover:border-[#2772A0] transition-all group shadow-sm">
                                        <cat.icon className="w-4 h-4 text-[#2772A0]" />
                                        {cat.name}
                                        <ChevronDown className="w-3 h-3 text-slate-400" />
                                    </button>
                                ) : (
                                    <Link
                                        href={cat.href!}
                                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-[#2772A0] transition-colors flex items-center gap-2 group border border-transparent hover:border-slate-200 hover:bg-white rounded-lg"
                                    >
                                        {cat.name}
                                        {i < mainCategories.length - 1 && cat.name !== 'Industrial Machinery' && (
                                            <ChevronDown className="w-3 h-3 text-slate-300 group-hover:text-[#2772A0]" />
                                        )}
                                    </Link>
                                )}
                            </li>
                        ))}
                        <li className="ml-auto">
                            <Link href="/categories" className="text-xs font-black text-[#2772A0] hover:text-[#2772A0] transition-colors flex items-center gap-1 group">
                                View All Categories
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </li>
                    </ul>
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
                                    <span className="text-xl font-black text-[#2772A0]">Menu</span>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-xl">
                                        <X className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {mainCategories.map((cat, i) => (
                                        <Link
                                            key={i}
                                            href={cat.href || '#'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between text-sm font-bold text-slate-700 hover:text-[#2772A0]"
                                        >
                                            <div className="flex items-center gap-3">
                                                {cat.icon && <cat.icon className="w-5 h-5 text-slate-400" />}
                                                {cat.name}
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-slate-300 -rotate-90" />
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-12 pt-12 border-t border-slate-100 space-y-4">
                                    <Link href="/auth/login" className="w-full py-4 bg-[#2772A0] text-white text-center rounded-2xl font-black text-xs uppercase tracking-widest block shadow-xl shadow-[#2772A0]/20">
                                        Sign In
                                    </Link>
                                    <Link href="/auth/register" className="w-full py-4 border-2 border-[#2772A0] text-[#2772A0] text-center rounded-2xl font-black text-xs uppercase tracking-widest block">
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
