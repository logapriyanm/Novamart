'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBars,
    FaChevronRight,
    FaTimes,
    FaUserCircle,
    FaUtensils,
    FaTv,
    FaBroom,
    FaBox,
    FaUserEdit,
    FaTools,
    FaMobileAlt,
    FaIndustry,
    FaFan
} from 'react-icons/fa';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import { useSidebar } from '../../../context/SidebarContext';
import { useAuth } from '@/client/hooks/useAuth';
import { sidebarCategories, helpSettings } from '../../../data/categoryData';

// Icon Map
const iconMap: Record<string, React.ElementType> = {
    'FaUtensils': FaUtensils,
    'FaTv': FaTv,
    'FaBroom': FaBroom,
    'FaBox': FaBox,
    'FaUserEdit': FaUserEdit,
    'FaTools': FaTools,
    'FaMobileAlt': FaMobileAlt,
    'FaIndustry': FaIndustry,
    'FaFan': FaFan
};

export default function HomeCategorySidebar() {
    const { isCategorySidebarOpen, closeCategorySidebar } = useSidebar();
    const { user, isAuthenticated } = useAuth();
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const toggleCategory = (id: string) => {
        setExpandedCategory(curr => curr === id ? null : id);
    };

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
                        className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-[365px] bg-white z-[1001] shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header - Amazon Style */}
                        {isAuthenticated ? (
                            <Link href="/customer/profile" onClick={closeCategorySidebar} className="bg-[#232f3e] text-white p-4 flex items-center gap-3 shrink-0 hover:bg-[#232f3e]/90 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs border border-primary/20">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold">Hello, {user?.name?.split(' ')[0]}</span>
                                </div>
                            </Link>
                        ) : (
                            <Link href="/auth/login" onClick={closeCategorySidebar} className="bg-[#232f3e] text-white p-4 flex items-center gap-3 shrink-0 hover:bg-[#232f3e]/90 transition-colors">
                                <FaUserCircle className="w-8 h-8 opacity-80" />
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold">Hello, Sign In</span>
                                </div>
                            </Link>
                        )}

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                            <div className="space-y-1">
                                {sidebarCategories.map((category) => {
                                    const Icon = iconMap[category.icon] || FaBox;
                                    const isExpanded = expandedCategory === category.id;

                                    return (
                                        <div key={category.id} className="border-b border-gray-100 last:border-0">
                                            <button
                                                onClick={() => toggleCategory(category.id)}
                                                className={`w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50 text-[#10367D]' : 'text-gray-800'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Icon className={`w-5 h-5 ${isExpanded ? 'text-[#10367D]' : 'text-gray-500'}`} />
                                                    <span className="font-bold text-sm text-left">{category.label}</span>
                                                </div>
                                                {isExpanded ? <IoIosArrowDropup className="w-4 h-4 text-gray-400" /> : <IoIosArrowDropdown className="w-4 h-4 text-gray-400" />}
                                            </button>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-gray-50/50"
                                                    >
                                                        <div className="py-2 px-6 pb-6 space-y-6">
                                                            {category.subsections.map((sub, idx) => (
                                                                <div key={idx} className="space-y-3">
                                                                    <h4 className="text-sm font-semibold text-gray-600 pl-2 border-l-2 border-[#10367D]">{sub.label}</h4>
                                                                    <div className="grid grid-cols-1 gap-1 pl-2">
                                                                        {sub.items.map((item, i) => (
                                                                            <Link
                                                                                key={i}
                                                                                href={item.href}
                                                                                onClick={closeCategorySidebar}
                                                                                className="text-sm font-medium text-gray-600 hover:text-[#10367D] hover:bg-white px-3 py-2 rounded-lg transition-all flex items-center gap-2"
                                                                            >
                                                                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                                                {item.name}
                                                                            </Link>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Help & Settings Section */}
                            <div className="border-t border-gray-200 mt-6 pt-6 pb-20 px-8 space-y-4">
                                <h3 className="text-lg font-bold text-gray-900">Help & Settings</h3>
                                <div className="space-y-1">
                                    {helpSettings.map((item, idx) => (
                                        <Link
                                            key={idx}
                                            href={item.href}
                                            className="block text-sm font-medium text-gray-700 hover:text-[#10367D] py-2"
                                            onClick={closeCategorySidebar}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.aside>

                    <style jsx global>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 6px;
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

