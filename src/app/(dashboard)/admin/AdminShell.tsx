'use client';

import React, { useState } from 'react';
import Sidebar from '@/client/components/layout/Sidebar';
import DashboardHeader from '@/client/components/layout/DashboardHeader';

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                role="ADMIN"
                isCollapsed={isDesktopCollapsed}
            />

            <div className="flex-1 flex flex-col min-w-0 no-scrollbar transition-all duration-300">
                <DashboardHeader
                    role="ADMIN"
                    onMenuClick={() => setIsSidebarOpen(true)}
                    searchPlaceholder="Search mission control..."
                    title={
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900 uppercase tracking-tighter italic">Mission <span className="text-primary tracking-normal">Control</span></span>
                        </div>
                    }
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
