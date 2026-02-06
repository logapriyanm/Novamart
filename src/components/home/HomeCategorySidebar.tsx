'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBlender,
    FaCouch,
    FaBaby,
    FaBars,
    FaChevronRight,
    FaFire,
    FaStar,
    FaUtensils,
    FaHome,
    FaGem,
    FaBroom,
    FaPaw,
    FaLeaf,
    FaWind,
    FaTimes,
    FaChevronDown as ChevronDown,
    FaTv,
    FaBox,
    FaUserEdit,
    FaTools,
    FaMobileAlt,
    FaGift
} from 'react-icons/fa';
import { useSidebar } from '../../context/SidebarContext';

const categories = [
    {
        name: 'Kitchen Appliances',
        icon: FaUtensils,
        href: '/products?cat=kitchen-appliances',
        count: 120,
        trending: true,
        subcategories: ['Mixer Grinders', 'Juicers & Blenders', 'Electric Kettles', 'Induction Cooktops', 'Electric Rice Cookers', 'Electric Lunch Boxes', 'Sandwich Makers', 'Food Choppers & Cutters', 'Coffee & Tea Makers', 'Kitchen Gadgets']
    },
    {
        name: 'Home Appliances',
        icon: FaTv,
        href: '/products?cat=home-appliances',
        count: 210,
        trending: true,
        subcategories: ['Room Heaters', 'Fans', 'Air Coolers', 'Electric Irons', 'Humidifiers', 'Water Heaters', 'Emergency Lights']
    },
    {
        name: 'Cleaning & Home Care',
        icon: FaBroom,
        href: '/products?cat=cleaning-home-care',
        count: 340,
        subcategories: ['Spin Mops & Buckets', 'Manual Cleaning Tools', 'Electric Scrubbers', 'Vacuum Cleaners', 'Sink & Drain Cleaners', 'Toilet Cleaning Tools', 'Microfiber Cloths', 'Disinfecting Tools']
    },
    {
        name: 'Storage & Organization',
        icon: FaBox,
        href: '/products?cat=storage-organization',
        count: 156,
        subcategories: ['Kitchen Containers', 'Fridge Organizers', 'Wardrobe Organizers', 'Bathroom Racks', 'Drawer Dividers', 'Multipurpose Storage Boxes']
    },
    {
        name: 'Personal Care Appliances',
        icon: FaUserEdit,
        href: '/products?cat=personal-care',
        count: 85,
        subcategories: ['Hair Dryers', 'Trimmers', 'Shavers', 'Facial Steamers', 'Massagers', 'Grooming Kits']
    },
    {
        name: 'Home Utility & Accessories',
        icon: FaTools,
        href: '/products?cat=home-utility',
        count: 95,
        subcategories: ['Oil Dispensers', 'Water Bottles', 'Rechargeable Lighters', 'Hooks & Holders', 'Door Accessories', 'Anti-Slip Mats']
    },
    {
        name: 'Kids & Baby Care',
        icon: FaBaby,
        href: '/products?cat=kids-baby-care',
        count: 78,
        trending: true,
        subcategories: ['Feeding Accessories', 'Baby Hygiene Tools', 'Baby Comfort Products', 'Child Safety Products']
    },
    {
        name: 'Pet Care',
        icon: FaPaw,
        href: '/products?cat=pet-care',
        count: 189,
        subcategories: ['Feeding Accessories', 'Grooming Tools', 'Pet Hygiene', 'Comfort Products']
    },
    {
        name: 'Smart & Portable Devices',
        icon: FaMobileAlt,
        href: '/products?cat=smart-portable-devices',
        count: 420,
        trending: true,
        subcategories: ['USB Rechargeable Devices', 'Travel Appliances', 'Smart Utility Gadgets', 'Emergency Devices']
    },
    {
        name: 'Combos & Value Packs',
        icon: FaGift,
        href: '/products?cat=combos-value-packs',
        count: 65,
        subcategories: ['Kitchen Combos', 'Cleaning Combos', 'Home Starter Kits', 'Festival Combos']
    },
];

export default function HomeCategorySidebar() {
    const { isCategorySidebarOpen, closeCategorySidebar } = useSidebar();
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleClose = () => {
        setIsMobileOpen(false);
        closeCategorySidebar();
    };

    const toggleExpand = (e: React.MouseEvent, name: string) => {
        e.preventDefault();
        setExpandedCategory(expandedCategory === name ? null : name);
    };

    const SidebarContent = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-wider flex items-center gap-2">
                    <FaBars className="w-4 h-4 text-[#10367D]" />
                    Categories
                </h3>
                <button
                    onClick={handleClose}
                    className="lg:hidden p-1.5 hover:bg-[#10367D]/10 rounded-lg transition-colors"
                >
                    <FaTimes className="w-4 h-4 text-[#1E293B]/60" />
                </button>
            </div>

            {/* Trending Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#10367D] uppercase tracking-widest">
                    <FaFire className="w-3 h-3" />
                    Trending Now
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.filter(c => c.trending).map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="px-3 py-1.5 bg-[#10367D]/5 border border-[#10367D]/10 rounded-full text-[10px] font-bold text-[#10367D] hover:bg-[#10367D] hover:text-white transition-all"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Categories List */}
            <div className="space-y-1">
                <div className="text-[10px] font-bold text-[#10367D]/60 uppercase tracking-widest mb-3">
                    All Categories
                </div>
                {categories.map((cat) => (
                    <div key={cat.name} className="space-y-1">
                        <Link
                            href={cat.href}
                            className="flex items-center justify-between group py-2 px-3 rounded-xl hover:bg-[#10367D]/5 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white border border-[#10367D]/10 flex items-center justify-center text-[#10367D] group-hover:bg-[#10367D] group-hover:text-white group-hover:border-[#10367D] transition-all shadow-sm">
                                    <cat.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-bold text-[#1E293B]/80 group-hover:text-[#10367D] transition-colors">
                                    {cat.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {cat.subcategories && (
                                    <button
                                        onClick={(e) => toggleExpand(e, cat.name)}
                                        className="p-1 hover:bg-[#10367D]/10 rounded-md transition-colors"
                                    >
                                        <ChevronDown className={`w-3 h-3 text-[#10367D] transition-transform ${expandedCategory === cat.name ? 'rotate-180' : ''}`} />
                                    </button>
                                )}
                                <span className="text-[10px] font-bold text-[#1E293B]/40 bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                                    {cat.count}
                                </span>
                                <FaChevronRight className="w-3 h-3 text-[#1E293B]/20 group-hover:text-[#10367D] group-hover:translate-x-0.5 transition-all" />
                            </div>
                        </Link>

                        {/* Subcategories */}
                        <AnimatePresence>
                            {expandedCategory === cat.name && cat.subcategories && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden pl-11 pr-3 space-y-1"
                                >
                                    {cat.subcategories.map((sub) => (
                                        <Link
                                            key={sub}
                                            href={`${cat.href}&sub=${sub.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="block py-1.5 text-xs font-medium text-[#1E293B]/60 hover:text-[#10367D] transition-colors"
                                        >
                                            {sub}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* View All Link */}
            <Link
                href="/categories"
                className="block w-full py-3 bg-[#10367D] text-white text-center text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#10367D]/90 transition-all shadow-lg shadow-[#10367D]/20"
            >
                Browse All Categories
            </Link>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#10367D] text-white rounded-full shadow-xl shadow-[#10367D]/30 flex items-center justify-center hover:scale-105 transition-transform"
            >
                <FaBars className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar - controlled by navbar context */}
            {isCategorySidebarOpen && (
                <aside className="hidden lg:block shrink-0 transition-all duration-300 w-72">
                    <div className="sticky top-40 bg-white/60 backdrop-blur-xl border border-[#10367D]/10 rounded-3xl p-4 shadow-lg shadow-[#10367D]/5 relative z-10">
                        <SidebarContent />
                    </div>
                </aside>
            )}

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white z-[201] p-6 overflow-y-auto shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

