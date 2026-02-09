'use client';

import React, { useState } from 'react';
import Sidebar from '@/client/components/layout/Sidebar';
import { FaBell as Bell, FaSearch as Search, FaShieldAlt as ShieldCheck, FaBars as Menu, FaQuestionCircle } from 'react-icons/fa';
import RoleGuard from '@/client/components/features/auth/RoleGuard';
import UserDropdown from '@/client/components/layout/UserDropdown';
import { Role } from '@/lib/api/contract';

export default function DealerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    return (
        <RoleGuard allowedRoles={[Role.DEALER]}>
            <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    role="DEALER"
                    isCollapsed={isDesktopCollapsed}
                />

                <div className={`flex-1 flex flex-col min-w-0 relative z-10 w-full overflow-hidden transition-all duration-300`}>
                    <header className="h-16 md:h-20 border-b border-foreground/5 bg-surface sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl hover:bg-background text-primary"
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            {/* Desktop Collapse Toggle - Image 1 shows a clean header, maybe specific button or just implicit. 
                               User asked for "dealer sidebar close and open", so adding explicit toggle. */}
                            <button
                                onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                                className="hidden lg:flex p-2 rounded-xl hover:bg-background text-foreground/50 hover:text-primary transition-colors"
                                title={isDesktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            <h2 className="text-xl font-bold text-foreground hidden sm:block">Dealer Workspace</h2>
                        </div>

                        <div className="flex-1 max-w-xl px-4 md:px-12 hidden md:block">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                console.log('Search submit');
                            }} className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                                <input
                                    type="text"
                                    placeholder="Search products, SKUs, or barcodes..."
                                    className="w-full bg-background border-none rounded-lg py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all text-foreground placeholder:text-foreground/40 placeholder:font-medium"
                                />
                            </form>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-background transition-colors">
                                <Bell className="w-5 h-5 text-foreground/60" />
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-surface" />
                            </button>

                            <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-background transition-colors hidden sm:flex">
                                <FaQuestionCircle className="w-5 h-5 text-foreground/60" />
                            </button>

                            <UserDropdown />
                        </div>
                    </header>

                    {/* Dealer Content Area */}
                    <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-background/50">
                        {children}
                    </main>
                </div>
            </div>
        </RoleGuard>
    );
}
