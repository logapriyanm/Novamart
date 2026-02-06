'use client';

import React, { useState } from 'react';
import Sidebar from '../../../src/components/admin/Sidebar';
import { FaBell as Bell, FaSearch as Search, FaShieldAlt as ShieldCheck, FaBars as Menu } from 'react-icons/fa';

export default function DealerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#EBEBEB] text-[#1E293B] font-sans selection:bg-[#10367D]/30 overflow-x-hidden">
            {/* Visual background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#10367D]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#10367D]/5 blur-[120px] rounded-full" />
            </div>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} role="DEALER" />

            <div className="flex-1 flex flex-col min-w-0 relative z-10 w-full overflow-hidden">
                {/* Dealer Header */}
                <header className="h-20 border-b border-[#10367D]/10 bg-white/60 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl bg-white/40 border border-[#10367D]/10 text-[#10367D]"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="relative w-full max-w-sm hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10367D]/60" />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                className="w-full bg-white/40 border border-[#10367D]/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#10367D]/50 transition-all text-[#1E293B]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#10367D]/10 text-[10px] font-bold tracking-widest text-[#10367D] uppercase border border-[#10367D]/20 rounded-full">
                            <ShieldCheck className="w-3 h-3" />
                            Dealer Verified
                        </div>

                        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/40 border border-[#10367D]/10 hover:bg-white/60 transition-colors">
                            <Bell className="w-5 h-5 text-[#10367D]" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
                        </button>

                        <div className="hidden sm:block h-8 w-px bg-[#10367D]/10 mx-2" />

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#10367D] flex items-center justify-center text-white font-black text-xs shadow-lg shadow-[#10367D]/20">
                                DL
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dealer Content Area */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

