import React from 'react';
import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/client/context/AuthContext';
import { SidebarProvider } from '@/client/context/SidebarContext';
import { CartProvider } from '@/client/context/CartContext';

import { NotificationProvider } from '@/client/context/NotificationContext';
import { TrackingProvider } from '@/client/context/TrackingContext';
import FCMHandler from '@/client/components/utils/FCMHandler';
import InstructionButton from '@/client/components/layout/InstructionButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    metadataBase: new URL('https://novamart.com'),
    title: {
        default: 'NovaMart – Wholesale & B2B E-Commerce Marketplace',
        template: '%s | NovaMart'
    },
    description: 'NovaMart is a secure B2B2C marketplace connecting manufacturers, dealers, and buyers with escrow-protected payments and wholesale pricing.',
    keywords: ['wholesale marketplace', 'B2B ecommerce', 'verified sellers', 'escrow payments', 'bulk buying', 'manufacturer direct', 'industrial supply'],
    authors: [{ name: 'NovaMart Team' }],
    creator: 'NovaMart',
    publisher: 'NovaMart',
    manifest: '/manifest.json',
    alternates: {
        canonical: '/',
    },
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
        description: 'Secure B2B2C marketplace connecting manufacturers, dealers, and buyers with verified sellers and escrow protection.',
        siteName: 'NovaMart',
        images: [
            {
                url: '/og-image.jpg',
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
        images: ['/twitter-image.jpg'],
        creator: '@novamart',
    },
    icons: {
        icon: '/assets/Novamart.png',
        shortcut: '/assets/Novamart.png',
        apple: '/assets/Novamart.png',
    },
};

import { Toaster } from 'sonner';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>

                <AuthProvider>
                    <TrackingProvider>
                        <NotificationProvider>
                            <FCMHandler />
                            <CartProvider>
                                <SidebarProvider>
                                    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                                        <div className="min-h-screen relative bg-background overflow-hidden">
                                            <script
                                                type="application/ld+json"
                                                dangerouslySetInnerHTML={{
                                                    __html: JSON.stringify({
                                                        "@context": "https://schema.org",
                                                        "@type": "Organization",
                                                        "name": "NovaMart",
                                                        "url": "https://novamart.com",
                                                        "logo": "https://novamart.com/assets/Novamart.png",
                                                        "contactPoint": {
                                                            "@type": "ContactPoint",
                                                            "telephone": "+91-1800-NOVAMART",
                                                            "contactType": "customer service",
                                                            "areaServed": "IN",
                                                            "availableLanguage": "en"
                                                        },
                                                        "sameAs": [
                                                            "https://twitter.com/novamart",
                                                            "https://facebook.com/novamart",
                                                            "https://linkedin.com/company/novamart"
                                                        ]
                                                    })
                                                }}
                                            />
                                            {/* Ambient Background Glows */}
                                            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#10367D]/10 blur-[150px] rounded-full pointer-events-none" />
                                            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#10367D]/5 blur-[150px] rounded-full pointer-events-none" />

                                            <main className="relative z-10">
                                                {children}
                                            </main>
                                            <InstructionButton />
                                        </div>
                                        <Toaster richColors position="top-right" />
                                    </GoogleOAuthProvider>
                                </SidebarProvider>
                            </CartProvider>
                        </NotificationProvider>
                    </TrackingProvider>
                </AuthProvider>

            </body>
        </html>
    );
}


