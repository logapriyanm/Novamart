'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaLock as Lock,
    FaArrowRight as ArrowRight,
    FaCheckCircle as CheckCircle,
    FaSpinner as Loader2,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/api/services/auth.service';
// import { useSnackbar } from '@/client/context/SnackbarContext';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    // const { showSnackbar } = useSnackbar();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token');
            toast.error('Reset token is required');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.resetPassword(token, password);
            setIsSuccess(true);
            toast.success('Password reset successful!');
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. Token may be expired.');
            toast.error(err.message || 'Error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-black italic uppercase mb-2">System Updated</h2>
                <p className="text-slate-500 font-medium mb-8 italic">Your new password is now active. Redirecting to portal...</p>
                <Link href="/auth/login" className="text-[10px] font-black text-black uppercase tracking-widest underline underline-offset-4">
                    Taking too long? Click here to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-black/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-black/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="w-16 h-16 bg-white rounded-[10px] flex items-center justify-center p-2 mx-auto mb-8 shadow-xl shadow-black/5 border border-black/5">
                    <img src="/assets/Novamart.png" alt="NovaMart" className="w-full h-full object-contain" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/70 backdrop-blur-xl border border-black/10 rounded-[10px] p-8 shadow-2xl shadow-black/5"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black text-black italic uppercase mb-2">Set New Password</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Secure your NovaMart account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-black/50 uppercase tracking-widest ml-1">New Password</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full bg-white/60 border ${error ? 'border-rose-500' : 'border-black/10'} rounded-[10px] py-4 pl-12 pr-12 text-sm font-bold focus:outline-none focus:border-black transition-all`}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-black/50 uppercase tracking-widest ml-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full bg-white/60 border ${error ? 'border-rose-500' : 'border-black/10'} rounded-[10px] py-4 pl-12 pr-12 text-sm font-bold focus:outline-none focus:border-black transition-all`}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <p className="text-rose-500 text-[10px] font-black uppercase text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading || !token}
                            className="w-full bg-black text-white font-black py-5 rounded-[10px] flex items-center justify-center gap-3 shadow-xl shadow-black/20 hover:scale-[1.02] transition-all disabled:opacity-50 uppercase tracking-widest text-[10px]"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
                            {!isLoading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
