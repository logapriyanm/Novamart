'use client';

import React, { useState } from 'react';
import Sidebar from '@/client/components/layout/Sidebar';
import DashboardHeader from '@/client/components/layout/DashboardHeader';

export default function DealerShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                role="DEALER"
                isCollapsed={isDesktopCollapsed}
            />

            <div className={`flex-1 flex flex-col min-w-0 relative z-10 w-full transition-all duration-300 no-scrollbar`}>
                <DashboardHeader
                    role="DEALER"
                    onMenuClick={() => setIsSidebarOpen(true)}
                    searchPlaceholder="Search products, SKUs, or barcodes..."
                    title={
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">
                            Market <span className="text-indigo-600">Workspace</span>
                        </h2>
                    }
                />

                {/* Dealer Content Area */}
                <main className="flex-1 p-4 lg:p-10 bg-slate-50/30">
                    {children}
                </main>
            </div>
        </div>
    );
}
