'use client';

import React, { useState } from 'react';
import Sidebar from '@/client/components/layout/Sidebar';
import Navbar from '@/client/components/layout/Navbar';
import { FaBell as Bell, FaSearch as Search, FaShieldAlt as ShieldCheck, FaBars as Menu } from 'react-icons/fa';
import { useAuth } from '@/client/context/AuthContext';
import RoleGuard from '@/client/components/features/auth/RoleGuard';
import { Role } from '@/lib/api/contract';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { user } = useAuth();

    return (
        <RoleGuard allowedRoles={[Role.CUSTOMER]}>
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex pt-[73px] min-h-[calc(100vh-73px)] text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} role="CUSTOMER" />

                    <div className="flex-1 flex flex-col min-w-0 relative z-10 w-full overflow-hidden">
                        {/* Mobile Dashboard Header */}
                        <div className="lg:hidden px-4 py-3 border-b border-foreground/5 flex items-center justify-between bg-surface/50 backdrop-blur-sm sticky top-0 z-20">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="p-2 bg-white rounded-xl border border-foreground/10 text-foreground shadow-sm active:scale-95 transition-all"
                                >
                                    <Menu className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-black text-foreground uppercase tracking-wider">Dashboard</span>
                            </div>
                        </div>

                        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}
