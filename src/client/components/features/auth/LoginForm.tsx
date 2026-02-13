'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaEnvelope as Mail,
    FaLock as Lock,
    FaPhoneAlt as Phone,
    FaArrowRight as ArrowRight,
    FaMobileAlt as Smartphone,

    FaKey,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { PolicyModal } from '../../ui/PolicyModal';
import Loader from '../../ui/Loader';
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
            else if (role === 'SELLER') router.replace('/seller/dashboard');
            else router.replace('/');
        }
    }, [isAuthenticated, authLoading, user, router]);
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
    const [authMode, setAuthMode] = useState<'otp' | 'password'>('password');
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
        otp: ''
    });
    const [showTermsModal, setShowTermsModal] = useState(false);

    // ... existing login logic ...

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

        if (!agreedToTerms) newErrors.general = 'You must agree to the Terms and Conditions to continue.';

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
            // Check if it's a network error
            const errorMessage = error?.message || '';
            const isNetworkError = errorMessage.includes('Network error') ||
                errorMessage.includes('Failed to fetch') ||
                errorMessage.includes('ERR_CONNECTION_REFUSED') ||
                errorMessage.includes('connection refused') ||
                error?.isNetworkError ||
                error?.status === 0 ||
                error?.name === 'TypeError' && errorMessage.includes('fetch');

            if (isNetworkError) {
                // Show user-friendly network error message
                setErrors({ general: 'Unable to connect to server. Please ensure the backend is running.' });
            } else if (error.details && typeof error.details === 'object') {
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
        <div className="w-full ">
            <div className="mb-10 text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Continue your journey with NovaMart
                </h2>
                <p className="text-gray-500">
                    Access your personalized commerce dashboard.
                </p>
            </div>

            {/* Method Switcher */}
            <div className="flex bg-gray-100 p-1.5 rounded-[10px] mb-8">
                <button
                    onClick={() => { setLoginMethod('phone'); setOtpSent(false); }}
                    className={`flex-1 py-2.5 rounded-[10px] text-xs font-semibold transition-all ${loginMethod === 'phone' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Phone
                </button>
                <button
                    onClick={() => { setLoginMethod('email'); setOtpSent(false); setAuthMode('password'); }}
                    className={`flex-1 py-2.5 rounded-[10px] text-xs font-semibold transition-all ${loginMethod === 'email' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Email
                </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">
                        {loginMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {loginMethod === 'phone' ? <Phone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                        </div>
                        <input
                            type="text"
                            name="identifier"
                            autoComplete={loginMethod === 'phone' ? "tel" : "email"}
                            placeholder={loginMethod === 'phone' ? "Enter your mobile number" : "name@company.com"}
                            className={`w-full bg-white border ${errors.identifier ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'} rounded-[10px] py-3 pl-12 pr-4 text-sm transition-all focus:ring-1 focus:outline-none placeholder:text-gray-400 text-gray-900`}
                            value={formData.identifier}
                            onChange={e => {
                                let value = e.target.value;
                                if (loginMethod === 'phone') {
                                    value = value.replace(/\D/g, '').slice(0, 10);
                                }
                                setFormData({ ...formData, identifier: value });
                                if (errors.identifier) setErrors({ ...errors, identifier: undefined });
                            }}
                        />
                        {errors.identifier && <p className="text-red-500 text-xs mt-1 ml-1">{errors.identifier}</p>}
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
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-700">Secure Password</label>
                                    <Link href="/auth/forgot-password">
                                        <button type="button" className="text-xs font-semibold text-primary hover:text-primary/80">Forgot Password?</button>
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className={`w-full bg-white border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'} rounded-[10px] py-3 pl-12 pr-12 text-sm transition-all focus:ring-1 focus:outline-none text-gray-900`}
                                        value={formData.password}
                                        onChange={e => {
                                            setFormData({ ...formData, password: e.target.value });
                                            if (errors.password) setErrors({ ...errors, password: undefined });
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                                    </button>
                                    {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                                </div>
                            </div>

                            {loginMethod === 'phone' && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setAuthMode('otp')}
                                        className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1.5"
                                    >
                                        <Smartphone className="w-3 h-3" />
                                        Login via OTP
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="terms-and-conditions"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="terms-and-conditions" className="text-xs text-gray-500">
                                    I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className="text-primary hover:underline">Terms and Conditions</button>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !formData.identifier || !formData.password || !agreedToTerms}
                                className="w-full bg-primary text-white font-bold py-3.5 rounded-[10px] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                {isLoading ? <Loader size="sm" variant="white" /> : 'Enter Secure Portal'}
                                {!isLoading && <ArrowRight className="w-4 h-4" />}
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
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 block">One-Time Password</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <Smartphone className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="0 0 0 0 0 0"
                                                className="w-full bg-white border border-gray-200 focus:border-primary focus:ring-primary rounded-[10px] py-3 pl-12 pr-4 text-sm tracking-[0.5em] font-bold transition-all focus:ring-1 focus:outline-none text-gray-900"
                                                value={formData.otp}
                                                onChange={e => setFormData({ ...formData, otp: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="terms-and-conditions-otp"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="terms-and-conditions-otp" className="text-xs text-gray-500">
                                            I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className="text-primary hover:underline">Terms and Conditions</button>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || !agreedToTerms}
                                        className="w-full bg-primary text-white font-bold py-3.5 rounded-[10px] flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.01] transition-all text-sm"
                                    >
                                        {isLoading ? <Loader size="sm" variant="white" /> : 'Log In Securely'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setAuthMode('password')}
                                            className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1.5"
                                        >
                                            <FaKey className="w-3 h-3" />
                                            Use Password
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={!formData.identifier || isLoading}
                                        className="w-full bg-primary/10 text-primary font-bold py-3.5 rounded-[10px] flex items-center justify-center gap-2 hover:bg-primary/20 transition-all disabled:opacity-50 text-sm"
                                    >
                                        {isLoading ? <Loader size="sm" variant="primary" /> : 'Send OTP Code'}
                                        {!isLoading && <ArrowRight className="w-4 h-4" />}
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

            <div className="mt-8">
                <div className="relative flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">OR SECURE SOCIAL ACCESS</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="flex justify-center mb-6 ">
                    <div className="w-full border-[1px] border-gray-200 rounded-[10px]">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google authentication failed')}
                            useOneTap
                            theme="outline"
                            shape="rectangular"
                            size="large"
                            text="continue_with"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-gray-500">New to NovaMart?</span>
                    <Link href="/auth/register" className="text-primary font-bold hover:underline">Register Now</Link>
                </div>
            </div>
            {/* Terms Modal */}
            <PolicyModal
                isOpen={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                policyKey="terms-of-service"
            />
        </div>
    );
}

