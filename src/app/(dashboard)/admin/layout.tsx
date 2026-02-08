'use client';

import React, { useState } from 'react';
import Sidebar from '../../../client/components/layout/Sidebar';
import AdminHeader from '../../../client/components/layout/AdminHeader';
import { FaBars as Menu } from 'react-icons/fa';
import RoleGuard from '../../../client/components/features/auth/RoleGuard';
import { Role } from '../../../lib/api/contract';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <RoleGuard allowedRoles={[Role.ADMIN]}>
            <div className="flex min-h-screen bg-background">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <div className="flex-1 flex flex-col min-w-0">
                    <AdminHeader />

                    {/* Mobile Menu Toggle (Only visible on small screens) */}
                    <div className="lg:hidden p-4 bg-surface border-b border-foreground/5">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-xl bg-background border border-foreground/5 text-foreground/60"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </RoleGuard>
    );
}

