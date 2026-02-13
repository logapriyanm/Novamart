'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/client/hooks/useAuth';

export default function UnauthorizedPage() {
    const { user, isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center flex-col bg-background text-foreground px-4">
            <h1 className="text-6xl sm:text-8xl font-black text-primary/20">403</h1>
            <h2 className="text-xl sm:text-2xl font-bold mt-4 mb-2 text-center">Access Denied</h2>
            <p className="text-foreground/60 mb-8 max-w-md text-center text-sm">
                You do not have permission to view this page.
                {isAuthenticated && user && (
                    <span className="block mt-2">Your role: <strong>{user.role}</strong></span>
                )}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
                <Link
                    href="/"
                    className="px-6 py-3 bg-primary text-white font-bold rounded-[10px] hover:bg-primary/90 transition-all shadow-lg"
                >
                    Home
                </Link>
                {user?.role === 'SELLER' && (
                    <Link href="/seller" className="px-6 py-3 border-2 border-primary rounded-[10px] font-bold hover:bg-primary/5">
                        Seller Dashboard
                    </Link>
                )}
                {user?.role === 'MANUFACTURER' && (
                    <Link href="/manufacturer" className="px-6 py-3 border-2 border-primary rounded-[10px] font-bold hover:bg-primary/5">
                        Manufacturer Dashboard
                    </Link>
                )}
                {user?.role === 'CUSTOMER' && (
                    <Link href="/customer" className="px-6 py-3 border-2 border-primary rounded-[10px] font-bold hover:bg-primary/5">
                        My Account
                    </Link>
                )}
            </div>
        </div>
    );
}
