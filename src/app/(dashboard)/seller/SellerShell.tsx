'use client';

import React, { useState } from 'react';
import Sidebar from '@/client/components/layout/Sidebar';
import DashboardHeader from '@/client/components/layout/DashboardHeader';

export default function SellerShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                role="SELLER"
                isCollapsed={isDesktopCollapsed}
            />

            <div className="flex-1 flex flex-col min-w-0 relative z-10 w-full overflow-hidden">
                <DashboardHeader
                    role="SELLER"
                    onMenuClick={() => setIsSidebarOpen(true)}
                    searchPlaceholder="Search products, SKUs, or barcodes..."
                    title={
                        <h2 className="text-sm font-bold text-slate-900">
                            Market <span className="text-indigo-600">Workspace</span>
                        </h2>
                    }
                />

                {/* Seller Content Area */}
                <main className="flex-1 p-4 lg:p-10 bg-slate-50/30 overflow-y-auto no-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
