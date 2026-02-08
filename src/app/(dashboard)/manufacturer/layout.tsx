'use client';

import React, { useState } from 'react';
import Sidebar from '../../../client/components/layout/Sidebar';
import { FaBell as Bell, FaSearch as Search, FaShieldAlt as ShieldCheck, FaBars as Menu } from 'react-icons/fa';
import RoleGuard from '../../../client/components/features/auth/RoleGuard';
import { Role } from '../../../lib/api/contract';

export default function ManufacturerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <RoleGuard allowedRoles={[Role.MANUFACTURER]}>
            <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} role="MANUFACTURER" />

                <div className="flex-1 flex flex-col min-w-0 relative z-10 w-full overflow-hidden">
                    <header className="h-20 border-b border-foreground/5 bg-surface/60 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
                        <div className="flex items-center gap-4 flex-1">
                            {/* Mobile Logo & Menu */}
                            <div className="lg:hidden flex items-center gap-3 mr-4">
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="p-2 rounded-xl bg-background border border-foreground/5 text-primary"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 shadow-md border border-foreground/[0.03]">
                                    <img src="/logo.png" alt="N" className="w-full h-full object-contain" />
                                </div>
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                console.log('Search submit');
                            }} className="relative w-full max-w-sm hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                                <input
                                    type="text"
                                    placeholder="Search production..."
                                    className="w-full bg-background border border-foreground/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                                />
                            </form>
                        </div>

                        <div className="flex items-center gap-3 lg:gap-6">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-[10px] font-bold tracking-widest text-amber-600 uppercase border border-amber-500/20 rounded-full">
                                <ShieldCheck className="w-3 h-3" />
                                Factory Hub
                            </div>
                            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-background border border-foreground/5 hover:bg-background/60 transition-colors">
                                <Bell className="w-5 h-5 text-foreground" />
                            </button>
                            <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-amber-500/20">
                                MF
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </RoleGuard>
    );
}

