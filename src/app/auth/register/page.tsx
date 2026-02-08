'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaIndustry as Factory,
    FaStore as Store,
    FaUser as User,
    FaArrowRight as ArrowRight,
    FaArrowLeft as ArrowLeft,
    FaShieldAlt as ShieldCheck,
    FaCheckCircle as CheckCircle2,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '../../../client/hooks/useAuth';
import { useSnackbar } from '../../../client/context/SnackbarContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api/client';
import { FaSpinner as Loader2 } from 'react-icons/fa';

type Role = 'MANUFACTURER' | 'DEALER' | 'CUSTOMER';

export default function Register({ initialRole }: { initialRole?: Role | null }) {
    const router = useRouter();
    const { login } = useAuth();
    const { showSnackbar } = useSnackbar();
    const [step, setStep] = useState(initialRole ? 2 : 1);
    const [role, setRole] = useState<Role | null>(initialRole || null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        otp: '',
        companyName: '',
        businessName: '',
        gstNumber: '',
        address: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const nextStep = async () => {
        setErrors({});
        if (step === 2) {
            // Validate Basic Details
            if (!formData.name) { setErrors({ name: 'Name is required' }); return; }
            if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setErrors({ email: 'Invalid email' }); return; }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!formData.password) {
                setErrors({ password: 'Password is required' });
                return;
            }
            if (!passwordRegex.test(formData.password)) {
                setErrors({ password: 'Must be 8+ chars with Upper, Lower, and Number' });
                return;
            }
            if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
                setErrors({ phone: 'Invalid Indian phone number (10 digits)' });
                return;
            }

            if (role === 'CUSTOMER') {
                await handleFinalizeRegistration();
            } else {
                setStep(s => s + 1);
            }
        } else if (step === 3) {
            // Validate Business Details
            if (role === 'DEALER' && !formData.businessName) { setErrors({ businessName: 'Business name is required' }); return; }
            if (role === 'MANUFACTURER' && !formData.companyName) { setErrors({ companyName: 'Company name is required' }); return; }
            if (!formData.gstNumber) { setErrors({ gstNumber: 'GST is required' }); return; }
            if (!formData.address) { setErrors({ address: 'Address is required' }); return; }

            await handleFinalizeRegistration();
        } else {
            setStep(s => s + 1);
        }
    };

    const prevStep = () => setStep(s => s - 1);

    const [otpSent, setOtpSent] = useState(false);

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleFinalizeRegistration = async () => {
        setIsLoading(true);
        try {
            const payload = {
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: role,
                name: formData.name,
                businessName: formData.businessName,
                companyName: formData.companyName,
                registrationNo: formData.gstNumber, // Using GST as fallback for registrationNo if not separate
                gstNumber: formData.gstNumber,
                factoryAddress: formData.address,
                businessAddress: formData.address,
                bankDetails: {} // Placeholder
            };

            const res = await apiClient.post<any>('/auth/register', payload);

            if (role === 'CUSTOMER') {
                if (res.token) {
                    apiClient.setToken(res.token);
                    // Force a session refresh
                    window.location.href = '/customer/profile';
                    return;
                }
            }

            setStep(s => s + 1);
        } catch (error: any) {
            console.error('Registration Error:', error);
            if (error.message === 'DUPLICATE_ENTRY' || error.error === 'DUPLICATE_ENTRY') {
                showSnackbar('Account already exists with this Email or Phone', 'error');
                if (error.details) {
                    const fieldErrors: Record<string, string> = {};
                    Object.keys(error.details).forEach(field => {
                        fieldErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} already registered`;
                    });
                    setErrors(fieldErrors);
                }
            } else if (error.details && typeof error.details === 'object') {
                const backendErrors: Record<string, string> = {};
                Object.entries(error.details).forEach(([field, code]) => {
                    switch (code) {
                        case 'WEAK_PASSWORD': backendErrors[field] = 'Password too weak: Add Upper/Lower/Number'; break;
                        case 'INVALID_EMAIL': backendErrors[field] = 'Please use a valid email address'; break;
                        case 'INVALID_PHONE': backendErrors[field] = 'Invalid mobile number format'; break;
                        case 'NAME_REQUIRED': backendErrors[field] = 'Display name is required'; break;
                        case 'GST_REQUIRED': backendErrors[field] = 'Valid GST number is required for B2B'; break;
                        default: backendErrors[field] = typeof code === 'string' ? (code as string).replace(/_/g, ' ') : 'Required';
                    }
                });
                setErrors(backendErrors);
                // If there are field errors but we are on step 3 and they are step 2 errors, go back
                if (step === 3 && (backendErrors.email || backendErrors.password || backendErrors.phone)) {
                    setStep(2);
                    showSnackbar('Please fix the errors in Step 2', 'error');
                }
            } else {
                const msg = error.message || 'Registration failed. Please try again.';
                setErrors({ general: msg });
                showSnackbar(msg, 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-[#10367D]">Choose Your Identity</h2>
                            <p className="text-[#1E293B]/60 text-[10px] font-bold uppercase tracking-[0.2em]">Select your role in the Novamart Ecosystem</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { id: 'MANUFACTURER', label: 'Manufacturer', icon: Factory, desc: 'List direct inventory & manage bulk' },
                                { id: 'DEALER', label: 'Dealer', icon: Store, desc: 'Quality source & retail to patrons' },
                                { id: 'CUSTOMER', label: 'Individual', icon: User, desc: 'Elite access with escrow safety' }
                            ].map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => handleRoleSelect(r.id as Role)}
                                    className="p-8 rounded-[2.5rem] bg-white border border-[#10367D]/5 hover:border-[#10367D] hover:shadow-xl hover:shadow-[#10367D]/10 transition-all group flex flex-col items-center text-center gap-6"
                                >
                                    <div className="w-20 h-20 rounded-3xl bg-[#10367D]/5 flex items-center justify-center text-[#10367D] group-hover:bg-[#10367D] group-hover:text-white transition-all">
                                        <r.icon className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[#1E293B] mb-2">{r.label}</h3>
                                        <p className="text-xs text-slate-400 font-bold">{r.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-8 max-w-lg mx-auto">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-[#10367D]">Fast Onboarding</h2>
                            <p className="text-[#1E293B]/60 text-[10px] font-bold uppercase tracking-widest italic tracking-tight">Enter your official details to proceed</p>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    placeholder=" Name"
                                    className={`w-full bg-white/60 border ${errors.name ? 'border-rose-500' : 'border-[#10367D]/10'} rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#10367D] transition-all`}
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                                {errors.name && <p className="text-rose-500 text-[9px] font-black uppercase mt-1 ml-1">{errors.name}</p>}
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className={`w-full bg-white/60 border ${errors.email ? 'border-rose-500' : 'border-[#10367D]/10'} rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#10367D] transition-all`}
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                                {errors.email && <p className="text-rose-500 text-[9px] font-black uppercase mt-1 ml-1">{errors.email}</p>}
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password "
                                        className={`w-full bg-white/60 border ${errors.password ? 'border-rose-500' : 'border-[#10367D]/10'} rounded-2xl p-5 pr-12 text-sm font-bold focus:outline-none focus:border-[#10367D] transition-all`}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#10367D]/40 hover:text-[#10367D] transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-rose-500 text-[9px] font-black uppercase mt-1 ml-1">{errors.password}</p>}
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-4">
                                        <input
                                            type="tel"
                                            placeholder="Mobile Number"
                                            className={`flex-1 bg-white/60 border ${errors.phone ? 'border-rose-500' : 'border-[#10367D]/10'} rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#10367D] transition-all`}
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                        {!otpSent && (
                                            <button
                                                onClick={() => setOtpSent(true)}
                                                className="px-6 bg-[#10367D] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1E5F86] transition-all"
                                            >
                                                Get OTP
                                            </button>
                                        )}
                                    </div>
                                    {errors.phone && <p className="text-rose-500 text-[9px] font-black uppercase mt-1 ml-1">{errors.phone}</p>}
                                </div>
                                {otpSent && (
                                    <input
                                        type="text"
                                        placeholder="0 0 0 0 0 0"
                                        className="w-full bg-white border-2 border-[#10367D] rounded-2xl p-5 text-center text-sm font-black tracking-[1em] focus:outline-none"
                                        value={formData.otp}
                                        onChange={e => setFormData({ ...formData, otp: e.target.value })}
                                    />
                                )}
                            </div>
                        </div>
                        <button
                            onClick={nextStep}
                            disabled={isLoading}
                            className="w-full bg-[#10367D] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.02] uppercase tracking-widest text-sm disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    {role === 'CUSTOMER' ? 'Finalize Profile' : 'Business Details'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                        {errors.general && <p className="text-rose-500 text-[10px] font-black uppercase text-center mt-4 bg-rose-50 p-4 rounded-xl border border-rose-100">{errors.general}</p>}
                    </div>
                );
            case 3:
                return role === 'CUSTOMER' ? (
                    <div className="text-center space-y-6 max-w-md mx-auto">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-[#10367D]">Welcome to Novamart</h2>
                        <p className="text-[#1E293B]/70 font-medium">Your account has been activated. You can now browse products and purchase securely with escrow.</p>
                        <Link href="/profile">
                            <button className="w-full bg-[#10367D] text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs">Go to Profile</button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6 max-md mx-auto">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-[#10367D]">Business Verification</h2>
                            <p className="text-[#1E293B]/60 text-sm font-bold uppercase tracking-widest italic">Mandatory checks for {role?.toLowerCase()}s</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <input
                                    type="text"
                                    placeholder={role === 'MANUFACTURER' ? "Company Name" : "Business Name"}
                                    className={`w-full bg-white/60 border ${errors.companyName || errors.businessName ? 'border-rose-500' : 'border-[#10367D]/10'} rounded-2xl p-4 font-bold focus:outline-none focus:border-[#10367D] transition-all text-sm`}
                                    value={role === 'MANUFACTURER' ? formData.companyName : formData.businessName}
                                    onChange={e => setFormData({ ...formData, [role === 'MANUFACTURER' ? 'companyName' : 'businessName']: e.target.value })}
                                />
                                {(errors.companyName || errors.businessName) && <p className="text-rose-500 text-[9px] font-black uppercase mt-1 ml-1">{errors.companyName || errors.businessName}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <input
                                    type="text"
                                    placeholder="GST Number"
                                    className={`w-full bg-white/60 border ${errors.gstNumber ? 'border-rose-500' : 'border-[#10367D]/10'} rounded-2xl p-4 font-bold focus:outline-none focus:border-[#10367D] transition-all text-sm`}
                                    value={formData.gstNumber}
                                    onChange={e => setFormData({ ...formData, gstNumber: e.target.value })}
                                />
                                {errors.gstNumber && <p className="text-rose-500 text-[9px] font-black uppercase mt-1 ml-1">{errors.gstNumber}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <textarea
                                    placeholder="Business Address"
                                    className={`w-full bg-white/60 border ${errors.address ? 'border-rose-500' : 'border-[#10367D]/10'} rounded-2xl p-4 font-bold focus:outline-none focus:border-[#10367D] transition-all h-32 text-sm`}
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                                {errors.address && <p className="text-rose-500 text-[9px] font-black uppercase mt-1 ml-1">{errors.address}</p>}
                            </div>
                        </div>
                        <button
                            onClick={nextStep}
                            className="w-full bg-[#10367D] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#1E5F86] transition-all uppercase tracking-widest text-xs"
                        >
                            Finalize Application
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                );
            case 4:
                return (
                    <div className="text-center space-y-6 max-w-md mx-auto">
                        <div className="w-20 h-20 rounded-full bg-[#10367D]/10 text-[#10367D] flex items-center justify-center mx-auto">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-[#10367D]">Application Submitted</h2>
                        <p className="text-[#1E293B]/70 font-medium">Your request is now in <span className="text-[#10367D] font-bold">UNDER VERIFICATION</span> status. We will notify you once your business details are verified (SLA: 24-48h).</p>
                        <Link href="/">
                            <button className="w-full bg-[#10367D] text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs">Back to Home</button>
                        </Link>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#EBEBEB] flex flex-col items-center justify-center p-4 md:p-8 pt-24 md:pt-32 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#10367D]/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#10367D]/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center p-2 mb-6 md:mb-8 shadow-xl shadow-[#10367D]/10 overflow-hidden border border-[#10367D]/5 relative z-10">
                <img src="/logo.png" alt="Novamart" className="w-full h-full object-contain" />
            </div>

            {/* Progress Bar */}
            {step < 4 && (
                <div className="w-full max-w-xl md:max-w-2xl bg-white/40 h-1.5 rounded-full mb-8 md:mb-12 overflow-hidden relative z-10">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        className="h-full bg-[#10367D] shadow-lg shadow-[#10367D]/20"
                    />
                </div>
            )}

            <main className="w-full max-w-4xl relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {step > 1 && step < 4 && (
                <button
                    onClick={prevStep}
                    className="mt-6 md:mt-8 flex items-center gap-2 text-[#10367D]/60 font-bold hover:text-[#10367D] transition-colors relative z-10 uppercase tracking-widest text-[10px]"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
            )}
        </div>
    );
}

