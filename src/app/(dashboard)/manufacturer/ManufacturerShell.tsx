'use client';

import React, { useState } from 'react';
import Sidebar from '@/client/components/layout/Sidebar';
import { FaSearch as Search, FaShieldAlt as ShieldCheck, FaBars as Menu } from 'react-icons/fa';
import UserDropdown from '@/client/components/layout/UserDropdown';
import DashboardNotificationBell from '@/client/components/layout/DashboardNotificationBell';

export default function ManufacturerShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} role="MANUFACTURER" />

            <div className="flex-1 flex flex-col min-w-0 relative z-10 w-full overflow-hidden">
                <header className="h-20 border-b border-border/50 bg-white sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shadow-sm">
                    <div className="flex items-center gap-4 flex-1">
                        {/* Mobile Logo & Menu */}
                        <div className="md:hidden flex items-center gap-3 mr-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 rounded-[10px] bg-slate-50 text-indigo-600 touch-target transition-all"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div className="w-8 h-8 bg-white rounded-[10px] flex items-center justify-center p-1 shadow-md border border-slate-100">
                                <img src="/assets/Novamart.png" alt="N" className="w-full h-full object-contain" />
                            </div>
                        </div>

                        <div className="relative w-full max-w-sm hidden sm:block group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search production analytics..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-[10px] py-2.5 pl-11 pr-4 text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600/50 transition-all text-foreground placeholder:text-foreground/40 placeholder:font-black placeholder:uppercase placeholder:tracking-tighter"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-[10px] font-black tracking-widest text-indigo-600 uppercase border border-indigo-100 rounded-full shadow-sm">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Production Center
                        </div>
                        <DashboardNotificationBell />
                        <UserDropdown />
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto bg-slate-50/20">
                    {children}
                </main>
            </div>
        </div >
    );
}
