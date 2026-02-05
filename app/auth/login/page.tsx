import React from 'react';
import LoginForm from '../../../src/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | Novamart Secure Portal',
    description: 'Access the Novamart B2B2C governance platform.',
    robots: {
        index: false,
        follow: true,
    }
};

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#CCDDEA] flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center p-2 mx-auto mb-6 shadow-xl shadow-[#2772A0]/10 overflow-hidden border border-[#2772A0]/5">
                        <img src="/logo.png" alt="Novamart" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-4xl font-black text-[#2772A0] tracking-tight">Access Novamart</h1>
                    <p className="text-[#1E293B]/60 text-sm font-bold uppercase tracking-widest mt-2">B2B2C Secure Governance</p>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
