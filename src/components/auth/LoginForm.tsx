'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaEnvelope as Mail,
    FaLock as Lock,
    FaPhoneAlt as Phone,
    FaArrowRight as ArrowRight,
    FaMobileAlt as Smartphone,
    FaSpinner as Loader2
} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const router = useRouter();
    const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
        otp: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock API Call - In production, this would fetch user role & status
        setTimeout(() => {
            setIsLoading(false);

            // Mocking different users based on input to test redirect matrix
            const input = formData.identifier.toLowerCase();

            if (input.includes('admin')) {
                router.push('/admin/dashboard');
            } else if (input.includes('customer')) {
                router.push('/customer/dashboard');
            } else if (input.includes('dealer')) {
                if (input.includes('active')) {
                    router.push('/dealer/dashboard');
                } else {
                    router.push('/dealer/pending');
                }
            } else if (input.includes('manufacturer')) {
                if (input.includes('active')) {
                    router.push('/manufacturer/dashboard');
                } else {
                    router.push('/'); // Default or pending page if needed
                }
            } else {
                // Default fallback as per user request (mirroring previous behavior or landing)
                router.push('/admin/dashboard');
            }
        }, 1500);
    };

    const handleSendOTP = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setOtpSent(true);
        }, 1000);
    };

    return (
        <div className="bg-white/40 backdrop-blur-xl border border-[#2772A0]/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-[#2772A0]/5">
            {/* Method Switcher */}
            <div className="flex bg-[#2772A0]/5 p-1.5 rounded-2xl mb-8">
                <button
                    onClick={() => { setLoginMethod('password'); setOtpSent(false); }}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${loginMethod === 'password' ? 'bg-[#2772A0] text-[#CCDDEA] shadow-lg shadow-[#2772A0]/20' : 'text-[#2772A0]/60 hover:text-[#2772A0]'}`}
                >
                    Password
                </button>
                <button
                    onClick={() => setLoginMethod('otp')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${loginMethod === 'otp' ? 'bg-[#2772A0] text-[#CCDDEA] shadow-lg shadow-[#2772A0]/20' : 'text-[#2772A0]/60 hover:text-[#2772A0]'}`}
                >
                    OTP Login
                </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#2772A0] uppercase tracking-widest ml-1">
                        {loginMethod === 'password' ? 'Email / Phone' : 'Phone Number'}
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2772A0]/60">
                            {loginMethod === 'password' ? <Mail className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                        </div>
                        <input
                            type="text"
                            placeholder={loginMethod === 'password' ? "email@company.com" : "+91 00000 00000"}
                            className="w-full bg-white/60 border border-[#2772A0]/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#2772A0] transition-all"
                            value={formData.identifier}
                            onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                        />
                    </div>
                </div>

                {loginMethod === 'password' ? (
                    <div className="space-y-1">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] font-bold text-[#2772A0] uppercase tracking-widest">Password</label>
                            <button type="button" className="text-[10px] font-bold text-[#2772A0]/40 uppercase hover:text-[#2772A0] transition-colors">Forgot?</button>
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2772A0]/60">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-white/60 border border-[#2772A0]/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#2772A0] transition-all"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {otpSent ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-1"
                            >
                                <label className="text-[10px] font-bold text-[#2772A0] uppercase tracking-widest ml-1">Activation Code</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2772A0]/60">
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        className="w-full bg-white/60 border border-[#2772A0]/10 rounded-2xl py-4 pl-12 pr-4 text-sm tracking-[0.5em] font-black focus:outline-none focus:border-[#2772A0] transition-all"
                                        value={formData.otp}
                                        onChange={e => setFormData({ ...formData, otp: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSendOTP}
                                className="w-full bg-[#2772A0]/5 border border-[#2772A0]/10 text-[#2772A0] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#2772A0]/10 transition-all active:scale-[0.98]"
                            >
                                Receive OTP Code
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                    </AnimatePresence>
                )}

                <button
                    type="submit"
                    disabled={isLoading || (loginMethod === 'otp' && !otpSent)}
                    className="w-full bg-[#2772A0] text-[#CCDDEA] font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[#2772A0]/20 hover:bg-[#1E5F86] transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Sign In to Portal
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-[#2772A0]/10 text-center">
                <p className="text-xs font-medium text-[#1E293B]/60 mb-4">
                    New to the platform?
                </p>
                <div className="grid grid-cols-1 gap-3">
                    <Link href="/auth/register/customer" className="text-[#2772A0] text-[10px] font-black uppercase tracking-widest p-3 bg-[#2772A0]/5 rounded-xl hover:bg-[#2772A0] hover:text-white transition-all">
                        Register as Customer
                    </Link>
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/auth/register/dealer" className="text-[#2772A0] text-[10px] font-black uppercase tracking-widest p-3 border border-[#2772A0]/10 rounded-xl hover:bg-[#2772A0]/5 transition-all text-center">
                            Dealer
                        </Link>
                        <Link href="/auth/register/manufacturer" className="text-[#2772A0] text-[10px] font-black uppercase tracking-widest p-3 border border-[#2772A0]/10 rounded-xl hover:bg-[#2772A0]/5 transition-all text-center">
                            Manufacturer
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
