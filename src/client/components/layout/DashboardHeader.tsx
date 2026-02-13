'use client';

import React from 'react';
import { FaSearch as Search, FaBars as Menu, FaShieldAlt as ShieldCheck } from 'react-icons/fa';
import UserDropdown from './UserDropdown';
import NotificationBell from './NotificationBell';
import DashboardBreadcrumb from './DashboardBreadcrumb';

interface DashboardHeaderProps {
    role: 'ADMIN' | 'MANUFACTURER' | 'SELLER';
    onMenuClick: () => void;
    searchPlaceholder?: string;
    showBadge?: boolean;
    badgeText?: string;
    title?: React.ReactNode;
}

export default function DashboardHeader({
    role,
    onMenuClick,
    searchPlaceholder = "Search mission control...",
    showBadge,
    badgeText,
    title
}: DashboardHeaderProps) {
    return (
        <header className="h-20 border-b border-border/50 bg-white sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shadow-sm">
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Menu & Logo */}
                <div className="md:hidden flex items-center gap-3 mr-4">
                    <button
                        onClick={onMenuClick}
                        className={`p-2 rounded-[10px] bg-slate-50 touch-target transition-all ${role === 'MANUFACTURER' || role === 'SELLER' ? 'text-indigo-600' : 'text-slate-600'
                            }`}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="w-8 h-8 bg-white rounded-[10px] flex items-center justify-center p-1 shadow-md border border-slate-100">
                        <img src="/assets/Novamart.png" alt="N" className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Breadcrumb Navigation */}
                <div className="hidden sm:block mr-4">
                    <DashboardBreadcrumb />
                </div>

                {/* Search Bar */}
                <div className="relative w-full max-w-sm hidden md:block group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full bg-slate-50 border border-slate-100 rounded-[10px] py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600/50 transition-all text-foreground placeholder:text-foreground/40 placeholder:font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-6">
                {/* Badge (e.g., Production Center) */}
                {showBadge && (
                    <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-xs font-bold text-indigo-600 border border-indigo-100 rounded-full shadow-sm">
                        {role === 'MANUFACTURER' && <ShieldCheck className="w-3.5 h-3.5" />}
                        {badgeText}
                    </div>
                )}

                <NotificationBell variant="dashboard" />
                <UserDropdown />
            </div>
        </header>
    );
}
