'use client';

import React from 'react';
import Navbar from '../../client/components/layout/Navbar';
import Footer from '../../client/components/layout/Footer';
import { SidebarProvider } from '../../client/context/SidebarContext';
import HomeCategorySidebar from '../../client/components/home/HomeCategorySidebar';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <HomeCategorySidebar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}


