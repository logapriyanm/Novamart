'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import slider1 from '@/../public/assets/slider-1.json';
import slider2 from '@/../public/assets/slider-2.json';
import {
    FaSearch as Search,
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
    FaChevronRight,
    FaSignOutAlt,
    FaClipboardList,
    FaHeadset,
    FaStar,
    FaComments,
    FaHeart,
    FaShieldAlt
} from 'react-icons/fa';
import {
    HiOutlineShoppingCart,
    HiOutlineUserCircle,
    HiOutlineUser
} from 'react-icons/hi2';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSidebar } from '@/client/context/SidebarContext';
import { useAuth } from '@/client/hooks/useAuth';
import { useCart } from '@/client/context/CartContext';
import NotificationBell from './NotificationBell';
import { mainCategories } from '@/client/data/categoryData';

export default function Navbar() {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, isAuthenticated, logout } = useAuth();
    const { cart } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const lottieRef = useRef<any>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get sidebar context - only available in public layout
    const sidebarContext = (() => {
        try {
            return useSidebar();
        } catch {
            return null;
        }
    })();

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Check page type
    const isProductsPage = pathname?.startsWith('/products');
    const isHomePage = pathname === '/';

    const handleLogout = () => {
        logout();
        setIsProfileDropdownOpen(false);
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const profilePath = user?.role === 'DEALER' ? '/dealer/profile' :
        user?.role === 'MANUFACTURER' ? '/manufacturer/profile' :
            user?.role === 'ADMIN' ? '/admin/profile' : '/customer/profile';

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] bg-background border-b border-foreground/5">
            {/* Top Row: Logo, Search, User Actions */}
            <div className="w-full mx-auto px-4 lg:px-12 py-2">
                <div className="flex items-center justify-between gap-4 lg:gap-8">
                    {/* Brand & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 hover:bg-foreground/5 rounded-[10px]"
                        >
                            <Menu className="w-6 h-6 text-foreground/60" />
                        </button>
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative w-12 h-12 p-2 rounded-full border-2 border-black overflow-hidden flex items-center justify-center bg-white shadow-sm group-hover:shadow-md transition-all">
                                <img src="/assets/Novamart.png" alt="NovaMart" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-2xl font-black text-foreground tracking-tighter hidden sm:block">
                                NovaMart
                            </span>
                        </Link>
                    </div>


                    {/* Actions - Right */}
                    <div className="flex items-center gap-6 lg:gap-8">
                        <Link href="/products" className="btn-primary hidden lg:flex">
                            <FaBox className="w-4 h-4" />
                            <span>Products</span>
                        </Link>


                        <div className="flex-1 max-w-2xl hidden xl:flex items-center mr-8">
                            <form onSubmit={handleSearch} className="flex w-full h-10 bg-surface border-2 border-black/10 rounded-[10px] overflow-hidden shadow-sm focus-within:border-black transition-colors">

                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Enter Product or Service to search..."
                                    className="flex-1 px-4 text-sm focus:outline-none bg-surface text-foreground font-medium placeholder:text-foreground/30"
                                />

                                <button type="submit" className="bg-black hover:bg-black/90 text-background px-6 transition-colors flex items-center justify-center group relative overflow-hidden">
                                    <div className="relative w-6 h-6 group-hover:scale-110 transition-transform">
                                        <img
                                            src="/assets/search-hover-spin.svg"
                                            alt="Search"
                                            className="w-full h-full object-contain brightness-0 invert"
                                        />
                                    </div>
                                </button>
                            </form>
                        </div>




                        {user?.role === 'ADMIN' && (
                            <Link href="/admin" className="btn-primary">
                                <FaShieldAlt className="w-4 h-4" />
                                <span>Admin </span>
                            </Link>
                        )}

                        <div className="h-8 w-px bg-foreground/10 hidden lg:block" />

                        <Link href="/contact" className="flex flex-col items-center group gap-1">
                            <FaHeadset className="w-6 h-6 text-foreground/40 group-hover:text-black transition-colors" />
                            <span className="text-[10px] font-black text-foreground/60 group-hover:text-black transition-colors uppercase italic tracking-tighter">Support</span>
                        </Link>

                        {isAuthenticated && <NotificationBell />}

                        <Link href="/cart" className="flex flex-col items-center group gap-1 relative">
                            <div className="relative">
                                <HiOutlineShoppingCart className="w-6 h-6 text-foreground/40 group-hover:text-black transition-colors" />
                                <span className="absolute -top-2 -right-2 bg-black text-background text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-background shadow-sm">
                                    {cart.length}
                                </span>
                            </div>
                            <span className="text-[10px] font-black text-foreground/60 group-hover:text-black transition-colors uppercase italic tracking-tighter">Cart</span>
                        </Link>
                        {/* Profile Section */}
                        <div
                            className="relative py-2"
                            ref={dropdownRef}
                            onMouseEnter={() => setIsProfileDropdownOpen(true)}
                            onMouseLeave={() => setIsProfileDropdownOpen(false)}
                        >
                            <button
                                className="flex flex-col items-center group gap-1 min-w-[60px]"
                            >
                                {isAuthenticated ? (
                                    <>
                                        <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-[10px] border border-primary/20 group-hover:bg-primary group-hover:text-background transition-all">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <span className="text-[9px] font-black text-primary uppercase tracking-tighter truncate max-w-[80px]">
                                            {user?.name?.split(' ')[0] || 'User'}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineUserCircle className="w-6 h-6 text-foreground/40 group-hover:text-black transition-colors" />
                                        <span className="text-[10px] font-black text-foreground/60 group-hover:text-black transition-colors uppercase italic tracking-tighter">Account</span>
                                    </>
                                )}
                            </button>
                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isProfileDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-0 pt-2 w-64 z-50"
                                    >
                                        <div className="bg-surface rounded-[10px] border border-foreground/10 py-4 overflow-hidden shadow-sm">
                                            {isAuthenticated ? (
                                                <div className="px-6 py-4 border-b border-foreground/5 mb-2">
                                                    <p className="font-black text-foreground truncate">{user?.name}</p>
                                                    <p className="text-[11px] font-bold text-foreground/40 truncate">{user?.email}</p>
                                                </div>
                                            ) : (
                                                <div className="px-6 py-4 border-b border-foreground/5 mb-2">
                                                    <p className="font-black text-foreground truncate">Welcome to NovaMart</p>
                                                    <p className="text-[11px] font-bold text-foreground/40 truncate">Login to access your features</p>
                                                </div>
                                            )}

                                            <div className="px-2 space-y-1">
                                                <Link href={profilePath} onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/5 text-foreground/80 hover:text-primary transition-all group">
                                                    <HiOutlineUser className="w-4 h-4 text-foreground/20 group-hover:text-primary" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">My Profile</span>
                                                </Link>
                                                <Link href="/wishlist" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/5 text-foreground/80 hover:text-primary transition-all group">
                                                    <FaHeart className="w-4 h-4 text-foreground/20 group-hover:text-primary" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">My Wishlist</span>
                                                </Link>
                                                <Link href="/customer/reviews" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/5 text-foreground/80 hover:text-primary transition-all group">
                                                    <FaStar className="w-4 h-4 text-foreground/20 group-hover:text-primary" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">My Reviews</span>
                                                </Link>
                                                <Link href="/profile?tab=orders" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/5 text-foreground/80 hover:text-primary transition-all group">
                                                    <FaClipboardList className="w-4 h-4 text-foreground/20 group-hover:text-primary" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Order History</span>
                                                </Link>
                                                <Link href="/profile?tab=complaints" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/5 text-foreground/80 hover:text-primary transition-all group">
                                                    <FaHeadset className="w-4 h-4 text-foreground/20 group-hover:text-primary" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Disputes & Complaints</span>
                                                </Link>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-foreground/10 px-2">
                                                {isAuthenticated ? (
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-rose-500/5 text-rose-500 transition-all group"
                                                    >
                                                        <FaSignOutAlt className="w-4 h-4" />
                                                        <span className="text-xs font-bold uppercase tracking-widest text-left"> Sign Out</span>
                                                    </button>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <Link href="/auth/login" onClick={() => setIsProfileDropdownOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] bg-primary text-background transition-all group">
                                                            <HiOutlineUserCircle className="w-4 h-4 text-background/80" />
                                                            <span className="text-xs font-bold uppercase tracking-widest text-left">Sign In</span>
                                                        </Link>
                                                        <Link href="/auth/register" onClick={() => setIsProfileDropdownOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] border border-foreground/10 hover:bg-foreground/5 text-foreground transition-all group">
                                                            <FaClipboardList className="w-4 h-4 text-foreground/20" />
                                                            <span className="text-xs font-bold uppercase tracking-widest text-left">Register</span>
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Categories (Products page) or Trust Bar (Home page only) */}
            {(isHomePage || isProductsPage) && (
                <div className="bg-surface border-t border-foreground/5 hidden lg:block transition-all">
                    <div className="max-w-[1600px] mx-auto px-8">
                        <div className="flex items-center gap-4">
                            {/* Categories Toggle Button (on home & products page) */}
                            {sidebarContext && (
                                <button
                                    onClick={sidebarContext.toggleCategorySidebar}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 border-2 ${sidebarContext.isCategorySidebarOpen
                                        ? 'bg-primary text-background border-primary'
                                        : 'bg-background border-foreground/10 text-foreground/60 hover:border-primary hover:bg-primary/5'
                                        }`}
                                >
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <Lottie
                                            lottieRef={lottieRef}
                                            animationData={sidebarContext.isCategorySidebarOpen ? slider2 : slider1}
                                            loop={true}
                                            autoplay={true}
                                            style={{ width: 24, height: 24 }}
                                        />
                                    </div>
                                    <span className="font-black text-[11px] uppercase italic">{sidebarContext.isCategorySidebarOpen ? 'Close' : 'Explore'}</span>
                                </button>
                            )}

                            {isProductsPage || isHomePage ? (
                                // Category Navigation (Visible on Home & Products Page)
                                <div className="flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
                                    {mainCategories.map((cat, i) => {
                                        const isActive = pathname === cat.href || (pathname === '/products' && searchParams?.get('cat') === cat.slug);

                                        return (
                                            <Link
                                                key={i}
                                                href={cat.href}
                                                className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-all rounded-lg flex items-center gap-2 ${isActive
                                                    ? 'bg-primary text-background shadow-md shadow-primary/20'
                                                    : 'text-foreground/60 hover:text-primary hover:bg-background'
                                                    }`}
                                            >
                                                {cat.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Search - Visible only on small screens below top row */}
            <div className="md:hidden px-4 pb-4 bg-background">
                <div className="flex items-center bg-surface rounded-xl px-4 py-3 gap-3 border border-foreground/5">
                    <Search className="w-5 h-5 text-foreground/40" />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="bg-transparent text-sm w-full focus:outline-none font-medium text-foreground placeholder:text-foreground/30"
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
                            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[110] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-80 bg-background z-[120] lg:hidden shadow-2xl overflow-y-auto border-r border-foreground/5"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-xl font-black text-primary">Menu</span>
                                    <div className="flex items-center gap-2">
                                        {isAuthenticated && <NotificationBell />}
                                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-surface rounded-xl border border-foreground/5">
                                            <X className="w-5 h-5 text-foreground" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <Link href="/products" className="flex items-center gap-3 text-sm font-bold text-foreground/70 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                                        <FaBox className="w-5 h-5 text-foreground/20" />
                                        Products
                                    </Link>

                                    <Link href="/contact" className="flex items-center gap-3 text-sm font-bold text-foreground/70 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                                        <FaHeadset className="w-5 h-5 text-foreground/20" />
                                        Contact Support
                                    </Link>

                                    {isAuthenticated ? (
                                        <>
                                            <div className="pt-6 border-t border-foreground/5">
                                                <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-4">My Account</p>
                                                <div className="space-y-4">
                                                    <Link href={profilePath} className="flex items-center gap-3 text-sm font-bold text-foreground/70 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                                                        <HiOutlineUser className="w-5 h-5 text-foreground/20" />
                                                        Profile Dashboard
                                                    </Link>
                                                    <Link href="/profile?tab=orders" className="flex items-center gap-3 text-sm font-bold text-foreground/70 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                                                        <FaClipboardList className="w-5 h-5 text-foreground/20" />
                                                        Orders
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-3 text-sm font-bold text-rose-500 w-full text-left"
                                                    >
                                                        <FaSignOutAlt className="w-5 h-5" />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <Link href="/auth/login" className="flex items-center gap-3 text-sm font-bold text-foreground/70 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                                            <HiOutlineUserCircle className="w-5 h-5 text-foreground/20" />
                                            Sign In
                                        </Link>
                                    )}
                                </div>

                                {!isAuthenticated && (
                                    <div className="mt-12 pt-12 border-t border-foreground/5 space-y-4">
                                        <Link href="/auth/login" className="btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
                                            Sign In
                                        </Link>
                                        <Link href="/auth/register" className="btn-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                                            Register Now
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header >
    );
}
