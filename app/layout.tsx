import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen relative bg-[#CCDDEA]">
                    {/* Ambient Background Glows */}
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#2772A0]/10 blur-[150px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#2772A0]/5 blur-[150px] rounded-full pointer-events-none" />

                    <main className="relative z-10">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}