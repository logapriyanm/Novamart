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
import { GoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';

export default function LoginForm() {
    const router = useRouter();
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [formData, setFormData] = useState({
        identifier: '',
        otp: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            const input = formData.identifier.toLowerCase();
            if (input.includes('admin')) router.push('/admin/dashboard');
            else if (input.includes('customer')) router.push('/');
            else router.push('/');
        }, 1500);
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: credentialResponse.credential })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                router.push('/');
            } else {
                alert(data.message || 'Google Login Failed');
            }
        } catch (error) {
            console.error('Google Login Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOTP = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setOtpSent(true);
        }, 1000);
    };

    return (
        <div className="bg-white/40 backdrop-blur-xl border border-[#10367D]/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-[#10367D]/5">
            {/* Method Switcher */}
            <div className="flex bg-[#10367D]/5 p-1.5 rounded-2xl mb-8">
                <button
                    onClick={() => { setLoginMethod('phone'); setOtpSent(false); }}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${loginMethod === 'phone' ? 'bg-[#10367D] text-white shadow-lg shadow-[#10367D]/20' : 'text-[#10367D]/60 hover:text-[#10367D]'}`}
                >
                    Phone
                </button>
                <button
                    onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${loginMethod === 'email' ? 'bg-[#10367D] text-white shadow-lg shadow-[#10367D]/20' : 'text-[#10367D]/60 hover:text-[#10367D]'}`}
                >
                    Email
                </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#10367D] uppercase tracking-widest ml-1">
                        {loginMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10367D]/60">
                            {loginMethod === 'phone' ? <Phone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                        </div>
                        <input
                            type="text"
                            placeholder={loginMethod === 'phone' ? "+91 00000 00000" : "name@company.com"}
                            className="w-full bg-white/60 border border-[#10367D]/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#10367D] transition-all"
                            value={formData.identifier}
                            onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {otpSent ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#10367D] uppercase tracking-widest ml-1">One-Time Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10367D]/60">
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="0 0 0 0 0 0"
                                        className="w-full bg-white/60 border border-[#10367D]/10 rounded-2xl py-4 pl-12 pr-4 text-sm tracking-[0.5em] font-black focus:outline-none focus:border-[#10367D] transition-all"
                                        value={formData.otp}
                                        onChange={e => setFormData({ ...formData, otp: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#10367D] text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[#10367D]/20 hover:scale-[1.02] transition-all"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In Securely'}
                            </button>
                        </motion.div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSendOTP}
                            disabled={!formData.identifier || isLoading}
                            className="w-full bg-[#10367D] text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[#10367D]/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP Code'}
                            {!isLoading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    )}
                </AnimatePresence>
            </form>

            <div className="mt-8 pt-8 border-t border-[#10367D]/10 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex flex-col gap-6">
                    <div className="relative flex items-center gap-4">
                        <div className="flex-1 h-px bg-[#10367D]/10" />
                        <span className="text-[9px] font-black text-[#10367D]/40">OR SECURE SOCIAL ACCESS</span>
                        <div className="flex-1 h-px bg-[#10367D]/10" />
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.log('Login Failed')}
                            useOneTap
                            theme="outline"
                            shape="pill"
                            size="large"
                            text="continue_with"
                        />
                    </div>

                    <div className="pt-2">
                        Protected by Gov-Grade Escrow Security
                    </div>
                </div>
            </div>
        </div>
    );
}

