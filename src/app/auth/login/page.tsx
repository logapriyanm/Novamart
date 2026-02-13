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
        <div className="min-h-screen w-full flex overflow-hidden">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0a0f1c] relative items-center justify-center p-12 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#10367D] rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#10367D] rounded-full blur-[120px] opacity-20"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#74b4da] rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 w-full max-w-lg text-white">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-white rounded-full border flex items-center justify-center">
                            <img src="/assets/Novamart.png" alt="NovaMart" className="w-8 h-8 object-contain" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">NOVAMART</span>
                    </div>

                    <h1 className="text-5xl font-bold leading-tight mb-8">
                        Elevate your business to the next level.
                    </h1>

                    <p className="text-lg text-gray-400 leading-relaxed mb-12">
                        Join thousands of B2B and B2C partners scaling their operations through our secure global marketplace ecosystem.
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                      
                        
                        
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-6 xs:p-10 sm:p-12 lg:p-24 relative">
                {/* Mobile Back to Home Navigation */}
                <div className="lg:hidden absolute top-6 left-6 flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 p-1 rounded-full border border-black flex items-center justify-center bg-white shadow-sm">
                            <img src="/assets/Novamart.png" alt="N" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xs font-black text-foreground tracking-tighter italic">NovaMart</span>
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-8 mt-12 lg:mt-0">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

