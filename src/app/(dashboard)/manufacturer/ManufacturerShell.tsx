'use client';

import React, { useState } from 'react';
import Sidebar from '@/client/components/layout/Sidebar';
import DashboardHeader from '@/client/components/layout/DashboardHeader';

export default function ManufacturerShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                role="MANUFACTURER"
                isCollapsed={isDesktopCollapsed}
            />

            <div className="flex-1 flex flex-col min-w-0 relative z-10 w-full no-scrollbar transition-all duration-300">
                <DashboardHeader
                    role="MANUFACTURER"
                    onMenuClick={() => setIsSidebarOpen(true)}
                    searchPlaceholder="Search production analytics..."
                    showBadge={true}
                    badgeText="Production Center"
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-10 bg-slate-50/20">
                    {children}
                </main>
            </div>
        </div >
    );
}
