import React from 'react';
import Link from 'next/link';
import LoginForm from '@/client/components/features/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | NovaMart Secure Portal',
    description: 'Access the NovaMart B2B2C governance platform.',
    robots: {
        index: false,
        follow: true,
    }
};

export default function LoginPage() {
    return (
        <div className="h-screen w-full flex overflow-hidden">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black via-gray-900 to-black relative items-center justify-center p-12 overflow-hidden">
                {/* Glass Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-transparent backdrop-blur-3xl"></div>

                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 w-full max-w-lg text-white">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-white rounded-full border border-white/20 flex items-center justify-center shadow-lg shadow-white/20">
                            <img src="/assets/Novamart.png" alt="NovaMart" className="w-8 h-8 object-contain" />
                        </div>
                        <span className="text-xl font-bold italic tracking-tight text-white drop-shadow-lg">NOVAMART</span>
                    </div>

                    <h1 className="text-5xl font-bold leading-tight mb-8 text-white drop-shadow-2xl">
                        Elevate your business to the next level.
                    </h1>

                    <p className="text-xl font-bold italic tracking-wide text-white/90 drop-shadow-md mb-12">
                        Structured Commerce. Trusted Connections.
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">



                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 bg-white p-6 xs:p-10 sm:p-12 lg:p-24 relative shadow-2xl z-10 overflow-y-auto">
                {/* Mobile Back to Home Navigation */}
                <div className="lg:hidden absolute top-6 left-6 flex items-center gap-3 z-20">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 p-1 rounded-full border border-black flex items-center justify-center bg-white shadow-sm">
                            <img src="/assets/Novamart.png" alt="N" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xs font-black text-foreground tracking-tighter italic">NovaMart</span>
                    </Link>
                </div>

                <div className="min-h-full w-full flex flex-col items-center justify-center">
                    <div className="w-full max-w-md space-y-8 mt-12 lg:mt-0">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div >
    );
}

