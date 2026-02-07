'use client';

import React, { useState } from 'react';
import Sidebar from '../../../client/components/admin/Sidebar';
import Navbar from '../../../client/components/layout/Navbar';
import { FaBell as Bell, FaSearch as Search, FaShieldAlt as ShieldCheck, FaBars as Menu } from 'react-icons/fa';
import { useAuth } from '../../../client/context/AuthContext';
import RoleGuard from '../../../client/components/auth/RoleGuard';
import { Role } from '../../../lib/api/contract';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { user } = useAuth();

    return (
        <RoleGuard allowedRoles={[Role.CUSTOMER]}>
            <div className="min-h-screen bg-secondary">
                <Navbar />
                <div className="flex pt-[73px] min-h-[calc(100vh-73px)] text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} role="CUSTOMER" />

                    <div className="flex-1 flex flex-col min-w-0 relative z-10 w-full overflow-hidden">
                        {/* Header commented out in original file */}

                        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}
