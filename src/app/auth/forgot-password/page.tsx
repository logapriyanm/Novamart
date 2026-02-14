'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaEnvelope as Mail,
    FaArrowRight as ArrowRight,
    FaArrowLeft as ArrowLeft,
    FaCheckCircle as CheckCircle
} from 'react-icons/fa';
import Link from 'next/link';
import { authService } from '@/lib/api/services/auth.service';
import Loader from '@/client/components/ui/Loader';
// import { useSnackbar } from '@/client/context/SnackbarContext';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    // const { showSnackbar } = useSnackbar();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setIsSubmitted(true);
            toast.success('Reset link sent successfully!');
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link. Please try again.');
            toast.error(err.message || 'Error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-black/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-black/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="w-16 h-16 bg-white rounded-[10px] flex items-center justify-center p-2 mx-auto mb-8 shadow-xl shadow-black/5 border border-black/5">
                    <img src="/assets/Novamart.png" alt="NovaMart" className="w-full h-full object-contain" />
                </div>

                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.div
                            key="request-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/70 backdrop-blur-xl border border-black/10 rounded-[10px] p-8 shadow-2xl shadow-black/5"
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-black text-black italic uppercase italic mb-2">Password Recovery</h1>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Enter your email to receive a reset link</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-black text-black/50 uppercase tracking-widest ml-1">Official Email</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="name@company.com"
                                            className={`w-full bg-white/60 border ${error ? 'border-rose-500' : 'border-black/10'} rounded-[10px] py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-black transition-all`}
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>
                                    {error && <p className="text-rose-500 text-sm font-black uppercase mt-1 ml-1">{error}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-black text-white font-black py-5 rounded-[10px] flex items-center justify-center gap-3 shadow-xl shadow-black/20 hover:scale-[1.02] transition-all disabled:opacity-50 uppercase tracking-widest text-sm"
                                >
                                    {isLoading ? <Loader size="sm" variant="white" /> : 'Send Recovery Link'}
                                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-black/5 text-center">
                                <Link href="/auth/login" className="text-sm font-black text-slate-400 hover:text-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                    <ArrowLeft className="w-3 h-3" />
                                    Back to Login
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-message"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/70 backdrop-blur-xl border border-black/10 rounded-[10px] p-10 shadow-2xl shadow-black/5 text-center"
                        >
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-black text-black italic uppercase mb-2">Check Your Email</h2>
                            <p className="text-slate-500 font-medium mb-8">
                                If an account exists for <span className="text-black font-bold">{email}</span>,
                                you will receive a password reset link shortly.
                            </p>
                            <Link href="/auth/login">
                                <button className="w-full bg-black text-white font-black py-4 rounded-[10px] uppercase tracking-widest text-sm shadow-xl shadow-black/20">
                                    Return to Login
                                </button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
