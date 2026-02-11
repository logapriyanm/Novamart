'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaEnvelope as Mail,
    FaLock as Lock,
    FaPhoneAlt as Phone,
    FaArrowRight as ArrowRight,
    FaMobileAlt as Smartphone,
    FaSpinner as Loader2,
    FaKey,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
// import { useSnackbar } from '../../../context/SnackbarContext';

export default function LoginForm() {
    const router = useRouter();
    const { login, loginWithGoogle, loginWithPhone, sendOtp, isAuthenticated, isLoading: authLoading, user } = useAuth();
    // const { showSnackbar } = useSnackbar();

    React.useEffect(() => {
        if (isAuthenticated && !authLoading && user) {
            const role = user.role;
            if (role === 'ADMIN') router.replace('/admin/dashboard');
            else if (role === 'MANUFACTURER') router.replace('/manufacturer/dashboard');
            else if (role === 'DEALER') router.replace('/dealer/dashboard');
            else router.replace('/');
        }
    }, [isAuthenticated, authLoading, user, router]);
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
    const [authMode, setAuthMode] = useState<'otp' | 'password'>('password');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
        otp: ''
    });

    const [errors, setErrors] = useState<{ identifier?: string; password?: string; otp?: string; general?: string }>({});

    const validateFields = () => {
        const newErrors: typeof errors = {};
        const trimmedIdentifier = formData.identifier.trim();

        if (loginMethod === 'email') {
            if (!trimmedIdentifier) newErrors.identifier = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedIdentifier)) newErrors.identifier = 'Invalid email format';
        } else {
            if (!trimmedIdentifier) newErrors.identifier = 'Phone number is required';
            else if (!/^[6-9]\d{9}$/.test(trimmedIdentifier)) newErrors.identifier = 'Invalid Indian phone number';
        }

        if (authMode === 'password' && !formData.password) newErrors.password = 'Password is required';
        if (authMode === 'otp' && otpSent && (!formData.otp || formData.otp.length !== 6)) newErrors.otp = 'Six-digit OTP is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFields()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const trimmedIdentifier = formData.identifier.trim();
            if (loginMethod === 'phone') {
                await loginWithPhone(trimmedIdentifier, formData.otp);
            } else {
                await login({
                    email: trimmedIdentifier,
                    password: formData.password
                });
            }

            // Redirect logic is now handled in AuthContext
        } catch (error: any) {
            if (error.details && typeof error.details === 'object') {
                const backendErrors: any = {};
                Object.entries(error.details).forEach(([field, code]) => {
                    backendErrors[field] = typeof code === 'string' ? code.replace(/_/g, ' ') : 'Invalid';
                });
                setErrors(backendErrors);
            } else {
                setErrors({ general: error.message || 'Authentication failed. Please check your credentials.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            if (credentialResponse.credential) {
                await loginWithGoogle(credentialResponse.credential);
            }
        } catch (error: any) {
            toast.error(error.message || 'Google Login Failed');
        }
    };

    const handleSendOTP = async () => {
        try {
            await sendOtp(formData.identifier);
            setOtpSent(true);
            toast.success('OTP Sent successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send OTP');
        }
    };

    return (
        <div className="bg-white/40 backdrop-blur-xl border border-black/10 rounded-[10px] p-6 sm:p-8 lg:p-10 shadow-2xl shadow-black/5">
            <div className="text-center flex mb-10">
                <div className="w-20 h-15 bg-white rounded-4xl flex items-center justify-center p-2 mx-auto mb-6 shadow-xl shadow-black/10 overflow-hidden border border-black/5">
                    <img src="/assets/Novamart.png" alt="NovaMart" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-xl font-black text-black tracking-tight italic uppercase"> Continue your journey with NovaMart</h1>

            </div>

            {/* Method Switcher */}
            <div className="flex bg-black/5 p-1.5 rounded-[10px] mb-8">
                <button
                    onClick={() => { setLoginMethod('phone'); setOtpSent(false); }}
                    className={`flex-1 py-3 rounded-[5px] text-[10px] font-black uppercase tracking-wider transition-all ${loginMethod === 'phone' ? 'bg-black text-white shadow-lg shadow-black/20' : 'text-black/40 hover:text-black'}`}
                >
                    Phone
                </button>
                <button
                    onClick={() => { setLoginMethod('email'); setOtpSent(false); setAuthMode('password'); }}
                    className={`flex-1 py-3 rounded-[5px] text-[10px] font-black uppercase tracking-wider transition-all ${loginMethod === 'email' ? 'bg-black text-white shadow-lg shadow-black/20' : 'text-black/40 hover:text-black'}`}
                >
                    Email
                </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-black/50 uppercase tracking-widest ml-1">
                        {loginMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20">
                            {loginMethod === 'phone' ? <Phone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                        </div>
                        <input
                            type="text"
                            name="identifier"
                            autoComplete={loginMethod === 'phone' ? "tel" : "email"}
                            placeholder={loginMethod === 'phone' ? "+91 00000 00000" : "name@company.com"}
                            className={`w-full bg-white/60 border ${errors.identifier ? 'border-rose-500' : 'border-black/10'} rounded-[10px] py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-black transition-all`}
                            value={formData.identifier}
                            onChange={e => {
                                setFormData({ ...formData, identifier: e.target.value });
                                if (errors.identifier) setErrors({ ...errors, identifier: undefined });
                            }}
                        />
                        {errors.identifier && <p className="text-rose-500 text-[9px] font-black uppercase tracking-tighter mt-1 ml-1">{errors.identifier}</p>}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {authMode === 'password' ? (
                        <motion.div
                            key="password-fields"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-black/50 uppercase tracking-widest ml-1">Secure Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className={`w-full bg-white/60 border ${errors.password ? 'border-rose-500' : 'border-black/10'} rounded-[10px] py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-black transition-all`}
                                        value={formData.password}
                                        onChange={e => {
                                            setFormData({ ...formData, password: e.target.value });
                                            if (errors.password) setErrors({ ...errors, password: undefined });
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                                    </button>
                                    {errors.password && <p className="text-rose-500 text-[9px] font-black uppercase tracking-tighter mt-1 ml-1">{errors.password}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-2">
                                <Link href="/auth/forgot-password">
                                    <button type="button" className="text-[10px] font-black text-black uppercase tracking-wider hover:underline underline-offset-4">Forgot Password?</button>
                                </Link>
                                {loginMethod === 'phone' && (
                                    <button
                                        type="button"
                                        onClick={() => setAuthMode('otp')}
                                        className="text-[10px] font-black text-black uppercase tracking-wider hover:underline underline-offset-4 flex items-center gap-1.5"
                                    >
                                        <Smartphone className="w-3 h-3" />
                                        Login via OTP
                                    </button>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !formData.identifier || !formData.password}
                                className="w-full bg-black text-white font-black py-5 rounded-[10px] flex items-center justify-center gap-3 shadow-xl shadow-black/20 hover:scale-[1.02] transition-all disabled:opacity-50 uppercase tracking-widest text-[10px]"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Secure Portal'}
                                {!isLoading && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp-fields"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {otpSent ? (
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-black/50 uppercase tracking-widest ml-1">One-Time Password</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20">
                                                <Smartphone className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="0 0 0 0 0 0"
                                                className="w-full bg-white/60 border border-black/10 rounded-[10px] py-4 pl-12 pr-4 text-sm tracking-[0.5em] font-black focus:outline-none focus:border-black transition-all"
                                                value={formData.otp}
                                                onChange={e => setFormData({ ...formData, otp: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-black text-white font-black py-5 rounded-[10px] flex items-center justify-center gap-3 shadow-xl shadow-black/20 hover:scale-[1.02] transition-all uppercase tracking-widest text-[10px]"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In Securely'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-end px-2">
                                        <button
                                            type="button"
                                            onClick={() => setAuthMode('password')}
                                            className="text-[10px] font-black text-black uppercase tracking-wider hover:underline underline-offset-4 flex items-center gap-1.5"
                                        >
                                            <FaKey className="w-3 h-3" />
                                            Use Password
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={!formData.identifier || isLoading}
                                        className="w-full bg-black text-white font-black py-5 rounded-[10px] flex items-center justify-center gap-3 shadow-xl shadow-black/20 hover:scale-[1.02] transition-all disabled:opacity-50 uppercase tracking-widest text-[10px]"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP Code'}
                                        {!isLoading && <ArrowRight className="w-5 h-5" />}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
                {errors.general && (
                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-[10px] animate-shake">
                        <p className="text-rose-600 text-[10px] font-black uppercase text-center tracking-wider">{errors.general}</p>
                    </div>
                )}
            </form>

            <div className="mt-2 pt-8 border-black/10 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex flex-col gap-6">
                    <div className="relative flex items-center gap-4">
                        <div className="flex-1 h-px bg-black/10" />
                        <span className="text-[9px] font-black text-black/40">OR SECURE SOCIAL ACCESS</span>
                        <div className="flex-1 h-px bg-black/10" />
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google authentication failed')}
                            useOneTap
                            theme="outline"
                            shape="pill"
                            size="large"
                            text="continue_with"
                        />
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-2">
                        <span>New to NovaMart?</span>
                        <Link href="/auth/register" className="text-black font-black hover:underline uppercase italic">Register Now</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

