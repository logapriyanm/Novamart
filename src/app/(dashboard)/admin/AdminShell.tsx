'use client';

import React, { useState } from 'react';
import Sidebar from '@/client/components/layout/Sidebar';
import AdminHeader from '@/client/components/layout/AdminHeader';
import { FaBars as Menu } from 'react-icons/fa';

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} role="ADMIN" />

            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader />

                {/* Mobile Menu Toggle */}
                <div className="md:hidden p-4 bg-surface border-b border-foreground/5">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-[10px] bg-background border border-foreground/5 text-foreground/60 touch-target"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
