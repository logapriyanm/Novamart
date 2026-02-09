import React from 'react';
import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/client/context/AuthContext';
import { SidebarProvider } from '@/client/context/SidebarContext';
import { CartProvider } from '@/client/context/CartContext';
import { SnackbarProvider } from '@/client/context/SnackbarContext';
import { NotificationProvider } from '@/client/context/NotificationContext';
import { TrackingProvider } from '@/client/context/TrackingContext';
import FCMHandler from '@/client/components/utils/FCMHandler';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    metadataBase: new URL('https://novamart.com'),
    title: {
        default: 'NovaMart – Wholesale & B2B E-Commerce Marketplace',
        template: '%s | NovaMart'
    },
    description: 'NovaMart is a secure B2B2C marketplace connecting manufacturers, dealers, and buyers with escrow-protected payments and wholesale pricing.',
    keywords: ['wholesale marketplace', 'B2B ecommerce', 'verified sellers', 'escrow payments', 'bulk buying', 'manufacturer direct'],
    authors: [{ name: 'NovaMart Team' }],
    creator: 'NovaMart',
    publisher: 'NovaMart',
    manifest: '/manifest.json',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://novamart.com',
        title: 'NovaMart – Wholesale & B2B E-Commerce Marketplace',
        description: 'Secure B2B2C marketplace connecting manufacturers, dealers, and buyers.',
        siteName: 'NovaMart',
        images: [
            {
                url: '/og-image.jpg', // Make sure this exists or update later
                width: 1200,
                height: 630,
                alt: 'NovaMart Marketplace',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NovaMart – Wholesale & B2B E-Commerce Marketplace',
        description: 'Secure B2B2C marketplace connecting manufacturers, dealers, and buyers.',
        images: ['/twitter-image.jpg'], // Make sure this exists or update later
        creator: '@novamart',
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <SnackbarProvider>
                    <AuthProvider>
                        <TrackingProvider>
                            <NotificationProvider>
                                <FCMHandler />
                                <CartProvider>
                                    <SidebarProvider>
                                        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                                            <div className="min-h-screen relative bg-background overflow-hidden">
                                                {/* Ambient Background Glows */}
                                                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#10367D]/10 blur-[150px] rounded-full pointer-events-none" />
                                                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#10367D]/5 blur-[150px] rounded-full pointer-events-none" />

                                                <main className="relative z-10">
                                                    {children}
                                                </main>
                                            </div>
                                        </GoogleOAuthProvider>
                                    </SidebarProvider>
                                </CartProvider>
                            </NotificationProvider>
                        </TrackingProvider>
                    </AuthProvider>
                </SnackbarProvider>
            </body>
        </html>
    );
}


