'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBars,
    FaChevronRight,
    FaTimes,
    FaUserCircle,
    FaFire,
    FaUtensils,
    FaTv,
    FaBroom,
    FaBox,
    FaUserEdit,
    FaTools,
    FaBaby,
    FaPaw,
    FaMobileAlt,
    FaGift,
    FaChevronDown
} from 'react-icons/fa';
import { useSidebar } from '../../context/SidebarContext';

const categories = [
    {
        name: 'Trending',
        items: [
            { name: 'Bestsellers', href: '/products?sort=bestsellers' },
            { name: 'New Releases', href: '/products?sort=new-releases' },
            { name: 'Movers and Shakers', href: '/products?sort=movers-shakers' },
        ]
    },
    {
        name: 'Digital Content and Devices',
        items: [
            { name: 'Kitchen Appliances', icon: FaUtensils, href: '/products/category/kitchen-appliances', hasSub: true },
            { name: 'Home Appliances', icon: FaTv, href: '/products/category/home-appliances', hasSub: true },
            { name: 'Cleaning & Home Care', icon: FaBroom, href: '/products/category/cleaning-home-care', hasSub: true },
            { name: 'Storage & Organization', icon: FaBox, href: '/products/category/storage-organization', hasSub: true },
        ]
    },
    {
        name: 'Shop By Category',
        items: [
            { name: 'Personal Care', icon: FaUserEdit, href: '/products/category/personal-care', hasSub: true },
            { name: 'Home Utility', icon: FaTools, href: '/products/category/home-utility', hasSub: true },
            { name: 'Kids & Baby', icon: FaBaby, href: '/products/category/kids-baby-care', hasSub: true },
            { name: 'Pet Care', icon: FaPaw, href: '/products/category/pet-care', hasSub: true },
            { name: 'Smart Devices', icon: FaMobileAlt, href: '/products/category/smart-portable-devices', hasSub: true },
        ]
    }
];

export default function HomeCategorySidebar() {
    const { isCategorySidebarOpen, closeCategorySidebar } = useSidebar();
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    return (
        <AnimatePresence>
            {isCategorySidebarOpen && (
                <>
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCategorySidebar}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
                    />

                    {/* Close Button - Outside Sidebar */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={closeCategorySidebar}
                        className="fixed left-[380px] top-4 z-[1001] text-white hover:text-gray-300 transition-colors"
                    >
                        <FaTimes className="w-8 h-8" />
                    </motion.button>

                    {/* Sidebar Drawer */}
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed left-0 top-0 bottom-0 w-[365px] bg-white z-[1001] shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header - Amazon Style */}
                        <div className="bg-[#232f3e] text-white p-4 flex items-center gap-3 shrink-0">
                            <FaUserCircle className="w-8 h-8 opacity-80" />
                            <div className="flex flex-col">
                                <span className="text-lg font-bold">Hello, Sign In</span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                            {categories.map((section, idx) => (
                                <div key={section.name} className={`${idx !== 0 ? 'border-t border-gray-200 mt-2 pt-2' : ''}`}>
                                    <h3 className="px-8 py-3 text-lg font-bold text-gray-900">
                                        {section.name}
                                    </h3>
                                    <div className="space-y-0.5">
                                        {section.items.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={closeCategorySidebar}
                                                className="group flex items-center justify-between px-8 py-2.5 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.icon && <item.icon className="w-4 h-4 text-gray-500 group-hover:text-[#10367D]" />}
                                                    <span className="text-sm font-medium text-gray-700 group-hover:text-black">
                                                        {item.name}
                                                    </span>
                                                </div>
                                                {item.hasSub && (
                                                    <FaChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Additional Help/Settings Section */}
                            <div className="border-t border-gray-200 mt-6 pt-6 pb-20 px-8 space-y-4">
                                <h3 className="text-lg font-bold text-gray-900">Help & Settings</h3>
                                <div className="space-y-2">
                                    <Link href="/profile" className="block text-sm font-medium text-gray-700 hover:text-[#10367D]">Your Account</Link>
                                    <Link href="/contact" className="block text-sm font-medium text-gray-700 hover:text-[#10367D]">Customer Service</Link>
                                    <Link href="/auth/login" className="block text-sm font-medium text-gray-700 hover:text-[#10367D]">Sign In</Link>
                                </div>
                            </div>
                        </div>
                    </motion.aside>

                    <style jsx global>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 8px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: #d1d5db;
                            border-radius: 4px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                            background: #9ca3af;
                        }
                    `}</style>
                </>
            )}
        </AnimatePresence>
    );
}

