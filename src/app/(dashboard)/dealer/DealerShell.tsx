'use client';

import React, { useState } from 'react';
import Sidebar from '@/client/components/layout/Sidebar';
import { FaSearch as Search, FaBars as Menu, FaQuestionCircle } from 'react-icons/fa';
import UserDropdown from '@/client/components/layout/UserDropdown';
import DashboardNotificationBell from '@/client/components/layout/DashboardNotificationBell';

export default function DealerShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                role="DEALER"
                isCollapsed={isDesktopCollapsed}
            />

            <div className={`flex-1 flex flex-col min-w-0 relative z-10 w-full overflow-hidden transition-all duration-300`}>
                <header className="h-16 md:h-20 border-b border-border/50 bg-white sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 shadow-sm">
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 rounded-[10px] hover:bg-slate-50 text-indigo-600 touch-target transition-all"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Desktop Collapse Toggle */}
                        <button
                            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                            className="hidden md:flex p-2 rounded-[10px] hover:bg-slate-50 text-foreground/50 hover:text-indigo-600 transition-all touch-target"
                            title={isDesktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter hidden sm:block">Market <span className="text-indigo-600">Workspace</span></h2>
                    </div>

                    <div className="flex-1 max-w-xl px-4 md:px-12 hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search products, SKUs, or barcodes..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-[10px] py-2.5 pl-11 pr-4 text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600/50 transition-all text-foreground placeholder:text-foreground/40 placeholder:font-black placeholder:uppercase placeholder:tracking-tighter"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <DashboardNotificationBell />

                        <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors hidden sm:flex border border-slate-100 shadow-sm">
                            <FaQuestionCircle className="w-5 h-5 text-foreground/40" />
                        </button>

                        <UserDropdown />
                    </div>
                </header>

                {/* Dealer Content Area */}
                <main className="flex-1 p-4 lg:p-10 overflow-y-auto bg-slate-50/30">
                    {children}
                </main>
            </div>
        </div>
    );
}
