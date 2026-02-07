import React from 'react';
import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../client/context/AuthContext';
import { SidebarProvider } from '../client/context/SidebarContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Novamart | B2B2C E-commerce Platform',
    description: 'Enterprise-grade B2B2C connection platform with escrow and dispute resolution.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <AuthProvider>
                    <SidebarProvider>
                        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                            <div className="min-h-screen relative bg-secondary">
                                {/* Ambient Background Glows */}
                                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#10367D]/10 blur-[150px] rounded-full pointer-events-none" />
                                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#10367D]/5 blur-[150px] rounded-full pointer-events-none" />

                                <main className="relative z-10">
                                    {children}
                                </main>
                            </div>
                        </GoogleOAuthProvider>
                    </SidebarProvider>
                </AuthProvider>
            </body>
        </html>
    );
}


