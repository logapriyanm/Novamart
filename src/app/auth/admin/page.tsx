'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaLock, FaKey, FaArrowRight, FaClock, FaEye, FaEyeSlash } from 'react-icons/fa';

import { useAuth } from '@/client/hooks/useAuth';
import { useSnackbar } from '@/client/context/SnackbarContext';

export default function AdminLoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        identifier: '',
        cred: '',
        otp: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInitialAuth = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate checking ID
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
        }, 1000);
    };

    const handleFinalAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Real Authentication Call
            await login({
                email: formData.identifier,
                password: formData.cred
            });
            // Redirect is handled by AuthContext (logic we saw earlier)
            // But if it falls through, we can ensure redirect here too, 
            // though AuthContext redirect is better as it handles role check.
        } catch (err: any) {
            console.error(err);
            setError('Authentication Failed: Invalid Credentials or Access Denied');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
            {/* Audited Entry Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#10367D]/30 via-transparent to-transparent" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 lg:p-12 shadow-2xl">
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-[#10367D] flex items-center justify-center text-white mb-6 shadow-xl shadow-[#10367D]/20">
                            <FaShieldAlt className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Governor Portal</h1>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Audited Access Protocol</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleInitialAuth}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#10367D] uppercase tracking-widest ml-4">Governor Identity</label>
                                    <div className="relative">
                                        <FaKey className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="admin@novamart.com"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold focus:outline-none focus:border-[#10367D] transition-all"
                                            value={formData.identifier}
                                            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#10367D] uppercase tracking-widest ml-4">Credential Hash</label>
                                    <div className="relative">
                                        <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••••••"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white font-bold focus:outline-none focus:border-[#10367D] transition-all"
                                            value={formData.cred}
                                            onChange={(e) => setFormData({ ...formData, cred: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-500 text-[10px] font-bold text-center uppercase tracking-wider">
                                        {error}
                                    </div>
                                )}

                                <button
                                    disabled={isLoading}
                                    className="w-full py-5 bg-[#10367D] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#10367D]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                >
                                    {isLoading ? 'Verifying Credentials...' : (
                                        <>
                                            Initiate Handshake
                                            <FaArrowRight className="w-3 h-3" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleFinalAuth}
                                className="space-y-8"
                            >
                                <div className="text-center text-slate-400 space-y-2">
                                    <p className="text-sm font-medium">Secondary Security Protocol Required</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#10367D]">Enter OTP (Any 6 digits for Demo)</p>
                                </div>

                                <div className="flex justify-center gap-3">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="0 0 0 0 0 0"
                                        className="w-full bg-white/5 border-2 border-[#10367D] rounded-2xl py-6 text-center text-2xl font-black text-[#10367D] tracking-[0.5em] focus:outline-none"
                                        value={formData.otp}
                                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                    />
                                </div>

                                <button
                                    disabled={isLoading}
                                    className="w-full py-5 bg-[#10367D] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#10367D]/20 hover:scale-[1.02] transition-all"
                                >
                                    {isLoading ? 'Finalizing Audit...' : 'Authorize Governance Access'}
                                </button>

                                <div className="flex items-center justify-center gap-2 text-slate-500 text-[9px] font-bold uppercase tracking-widest">
                                    <FaClock className="w-3 h-3 text-[#10367D]" />
                                    Session will be logged for 24h audit
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex justify-center gap-8 opacity-40">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" className="h-4 grayscale invert" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-3 grayscale invert" />
                </div>
            </motion.div>
        </div>
    );
}

