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
    FaEyeSlash,
    FaCheck
} from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/client/hooks/useAuth';
// import { useSnackbar } from '@/client/context/SnackbarContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import Loader from '@/client/components/ui/Loader';
import { PolicyModal } from '@/client/components/ui/PolicyModal';
import { GoogleLogin } from '@react-oauth/google';

type Role = 'MANUFACTURER' | 'SELLER' | 'CUSTOMER';


export default function Register({ searchParams, initialRole: propRole }: { searchParams?: Promise<{ role?: string }>, initialRole?: string }) {
    const params = searchParams ? React.use(searchParams) : undefined;
    const router = useRouter();
    const { login, loginWithGoogle, isAuthenticated, isLoading: authLoading } = useAuth();
    // const { showSnackbar } = useSnackbar();

    const initialRole = (propRole || params?.role)?.toUpperCase() as Role | undefined;
    const isValidRole = ['MANUFACTURER', 'SELLER', 'CUSTOMER'].includes(initialRole || '');

    React.useEffect(() => {
        if (isAuthenticated && !authLoading) {
            router.replace('/');
        }
    }, [isAuthenticated, authLoading, router]);

    const [step, setStep] = useState(isValidRole ? 2 : 1);
    const [role, setRole] = useState<Role | null>(isValidRole ? initialRole! : null);
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
        agreedToTerms: false,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showTermsModal, setShowTermsModal] = useState(false);

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
            if (!formData.agreedToTerms) {
                setErrors({ general: 'You must agree to the Terms and Conditions to continue.' });
                return;
            }

            if (role === 'CUSTOMER') {
                await handleFinalizeRegistration();
            } else {
                setStep(s => s + 1);
            }
        } else if (step === 3) {
            // Validate Business Details
            if (role === 'SELLER' && !formData.businessName) { setErrors({ businessName: 'Business name is required' }); return; }
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

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            if (credentialResponse.credential) {
                await loginWithGoogle(credentialResponse.credential);
            }
        } catch (error: any) {
            toast.error(error.message || 'Google Login Failed');
        }
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
                    window.location.href = '/profile';
                    return;
                }
            }

            setStep(s => s + 1);
        } catch (error: any) {
            console.error('Registration Error:', error);
            if (error.message === 'DUPLICATE_ENTRY' || error.error === 'DUPLICATE_ENTRY') {
                toast.error('Account already exists with this Email or Phone');
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
                    toast.error('Please fix the errors in Step 2');
                }
            } else {
                const msg = error.message || 'Registration failed. Please try again.';
                setErrors({ general: msg });
                toast.error(msg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-left space-y-2">
                            <h2 className="text-2xl font-bold italic text-gray-900">Choose your account type</h2>
                            <p className="text-sm text-gray-500">Select how you want to operate within the NovaMart Ecosystem</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { id: 'MANUFACTURER', label: 'Manufacturer', icon: Factory, desc: 'List direct inventory & manage bulk orders' },
                                { id: 'SELLER', label: 'Seller', icon: Store, desc: 'Source products & reach retail customers' },
                                { id: 'CUSTOMER', label: 'Individual Buyer', icon: User, desc: 'Shop securely with escrow protection' }
                            ].map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => handleRoleSelect(r.id as Role)}
                                    className="p-4 rounded-[10px] bg-white border border-gray-100 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group flex items-center gap-4 text-left w-full"
                                >
                                    <div className="w-12 h-12 rounded-[10px] bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-all shrink-0">
                                        <r.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">{r.label}</h3>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{r.desc}</p>
                                    </div>
                                    <div className="ml-auto flex items-center justify-center w-6 h-6 rounded-full border border-gray-200 group-hover:border-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-left space-y-2">
                            <h2 className="text-2xl font-bold italic text-gray-900">Basic Information</h2>
                            <p className="text-sm text-gray-500">Enter your personal details to get started</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-4">
                                {/* Row 1: Name and Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className={`w-full bg-white border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'} rounded-[10px] px-4 py-3 text-sm transition-all focus:ring-1 focus:outline-none`}
                                            value={formData.name}
                                            onChange={e => {
                                                const value = e.target.value;
                                                if (/^[a-zA-Z\s]*$/.test(value)) {
                                                    setFormData({ ...formData, name: value });
                                                }
                                            }}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="name@company.com"
                                            className={`w-full bg-white border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'} rounded-[10px] px-4 py-3 text-sm transition-all focus:ring-1 focus:outline-none`}
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Row 2: Secure Password */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Secure Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Min. 8 chars"
                                            className={`w-full bg-white border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'} rounded-[10px] px-4 py-3 pr-12 text-sm transition-all focus:ring-1 focus:outline-none`}
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>

                                {/* Row 3: Phone Number (+ OTP Row 4 if sent) */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Phone Number</label>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-3">
                                            <input
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                className={`flex-1 bg-white border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'} rounded-[10px] px-4 py-3 text-sm transition-all focus:ring-1 focus:outline-none`}
                                                value={formData.phone}
                                                onChange={e => {
                                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                    setFormData({ ...formData, phone: value });
                                                }}
                                            />
                                            {!otpSent && (
                                                <button
                                                    onClick={() => setOtpSent(true)}
                                                    className="px-4 bg-gray-900 text-white rounded-[10px] text-xs font-bold uppercase tracking-wide hover:bg-black transition-all whitespace-nowrap"
                                                >
                                                    Get OTP
                                                </button>
                                            )}
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-xs ml-1">{errors.phone}</p>}
                                    </div>
                                    {otpSent && (
                                        <input
                                            type="text"
                                            placeholder="0 0 0 0 0 0"
                                            maxLength={6}
                                            className="w-full bg-white border border-gray-200 focus:border-primary focus:ring-primary rounded-lg px-4 py-3 text-center text-lg font-bold tracking-[0.5em] transition-all focus:ring-1 focus:outline-none mt-2"
                                            value={formData.otp}
                                            onChange={e => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                setFormData({ ...formData, otp: value });
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="terms-and-conditions-register"
                                    checked={formData.agreedToTerms}
                                    onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="terms-and-conditions-register" className="text-xs text-gray-500">
                                    I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className="text-primary hover:underline font-semibold">Terms and Conditions</button>
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={nextStep}
                            disabled={isLoading || !formData.agreedToTerms}
                            className="w-full bg-gray-900 text-white font-bold py-3 rounded-[10px] flex items-center justify-center gap-2 hover:bg-black hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider mt-6"
                        >
                            {isLoading ? <Loader size="sm" variant="white" /> : (
                                <>
                                    {role === 'CUSTOMER' ? 'Create Account' : 'Continue'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                    </div>
                );
            case 3:
                return role === 'CUSTOMER' ? (
                    <div className="text-center space-y-6">
                        <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl font-bold text-primary">Welcome to NovaMart</h2>
                            <p className="text-gray-500 font-medium">Your account has been activated. You can now browse products and purchase securely with escrow.</p>
                        </div>
                        <Link href="/profile" className="block w-full">
                            <button className="w-full bg-primary text-white font-bold py-4 rounded-[10px] transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 uppercase tracking-widest text-xs">
                                Go to Profile
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-left space-y-2">
                            <h2 className="text-2xl font-bold italic text-gray-900">Business Details</h2>
                            <p className="text-sm text-gray-500">Mandatory verification for {role?.toLowerCase()}s</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">
                                    {role === 'MANUFACTURER' ? "Company Registered Name" : "Business Name"}
                                </label>
                                <input
                                    type="text"
                                    placeholder={role === 'MANUFACTURER' ? "e.g. Acme Industries Pvt Ltd" : "e.g. Royal Traders"}
                                    className={`w-full bg-white border ${errors.companyName || errors.businessName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'} rounded-[10px] px-4 py-3 text-sm font-medium transition-all focus:ring-1 focus:outline-none`}
                                    value={role === 'MANUFACTURER' ? formData.companyName : formData.businessName}
                                    onChange={e => setFormData({ ...formData, [role === 'MANUFACTURER' ? 'companyName' : 'businessName']: e.target.value })}
                                />
                                {(errors.companyName || errors.businessName) && <p className="text-red-500 text-xs mt-1 ml-1">{errors.companyName || errors.businessName}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">GSTIN Number</label>
                                <input
                                    type="text"
                                    placeholder="22AAAAA0000A1Z5"
                                    className={`w-full bg-white border ${errors.gstNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'} rounded-[10px] px-4 py-3 text-sm font-medium transition-all focus:ring-1 focus:outline-none uppercase`}
                                    value={formData.gstNumber}
                                    onChange={e => setFormData({ ...formData, gstNumber: e.target.value })}
                                />
                                {errors.gstNumber && <p className="text-red-500 text-xs mt-1 ml-1">{errors.gstNumber}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">Registered Address</label>
                                <textarea
                                    placeholder="Enter full business address"
                                    className={`w-full bg-white border ${errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary'} rounded-[10px] px-4 py-3 text-sm font-medium transition-all focus:ring-1 focus:outline-none h-32 resize-none`}
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                                {errors.address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.address}</p>}
                            </div>
                        </div>

                        <button
                            onClick={nextStep}
                            className="w-full bg-gray-900 text-white font-bold py-3 rounded-[10px] flex items-center justify-center gap-2  hover:bg-black hover:scale-[1.02] transition-all uppercase tracking-wider text-sm mt-6"
                        >
                            Finalize Application
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                );
            case 4:
                return (
                    <div className="text-center space-y-6">
                        <div className="w-24 h-24 rounded-full bg-blue-50 text-primary flex items-center justify-center mx-auto">
                            <ShieldCheck className="w-12 h-12" />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl font-bold text-primary">Application Submitted</h2>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                Your request is now in <span className="text-primary font-bold">UNDER VERIFICATION</span> status. We will notify you once your business details are verified (SLA: 24-48h).
                            </p>
                        </div>
                        <Link href="/" className="block w-full">
                            <button className="w-full bg-primary text-white font-bold py-4 rounded-[10px] transition-all hover:bg-primary/90 uppercase tracking-widest text-xs">
                                Back to Home
                            </button>
                        </Link>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen w-full flex overflow-hidden">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black via-gray-900 to-black relative items-center justify-center p-12 overflow-hidden">
                {/* Glass Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-transparent backdrop-blur-3xl"></div>

                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 w-full max-w-lg text-white">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-white rounded-full border border-white/20 flex items-center justify-center shadow-lg shadow-white/20">
                            <img src="/assets/Novamart.png" alt="NovaMart" className="w-8 h-8 object-contain" />
                        </div>
                        <span className="text-xl font-bold italic tracking-tight text-white drop-shadow-lg">NOVAMART</span>
                    </div>

                    <h1 className="text-5xl font-bold leading-tight mb-8 text-white drop-shadow-2xl">
                        Connecting the global Supply Chain marketplace.
                    </h1>

                    <p className="text-lg text-gray-200 leading-relaxed mb-12 drop-shadow-lg">
                        Join over 50,000+ businesses expanding their reach through NovaMart's seamless B2B and B2C ecosystem.
                    </p>

                    {/* Testimonial / Social Proof */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-12 shadow-2xl">
                        <p className="text-gray-100 italic mb-4 drop-shadow">"NovaMart transformed how we source materials. The verification process gives us 100% confidence in our partners."</p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 shadow-lg"></div>
                            <div className="text-sm">
                                <div className="font-semibold text-white drop-shadow">Rahul Mehta</div>
                                <div className="text-gray-300 drop-shadow">Director, Mehta Textiles</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                    </div>
                </div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="w-full lg:w-1/2 bg-white p-6 xs:p-10 sm:p-12 lg:p-24 relative shadow-2xl z-10 overflow-y-auto">
                {/* Mobile Back to Home Navigation */}
                <div className="lg:hidden absolute top-6 left-6 flex items-center gap-3 z-20">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 p-1 rounded-full border border-black flex items-center justify-center bg-white shadow-sm">
                            <img src="/assets/Novamart.png" alt="Novamart" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xs font-black text-foreground tracking-tighter italic">NovaMart</span>
                    </Link>
                </div>

                <div className="min-h-full w-full flex flex-col items-center justify-center">
                    <div className="w-full max-w-md space-y-8 mt-12 lg:mt-0">
                        {/* Form Container Box */}
                        <div className="w-full border-[1px] border-gray-200 rounded-[10px] p-6">
                            {/* Progress Bar */}
                            {step < 4 && (
                                <div className="w-full mb-8">
                                    <div className="relative flex items-center justify-between z-0">
                                        {/* Background Line */}
                                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>

                                        {/* Active Line (Progress) */}
                                        <div
                                            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300"
                                            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                                        ></div>

                                        {/* Steps */}
                                        {['Role', 'Basic', 'Business'].map((label, index) => {
                                            const stepNum = index + 1;
                                            const isActive = step >= stepNum;
                                            const isCompleted = step > stepNum;

                                            return (
                                                <div key={label} className="flex flex-col items-center gap-2 bg-white text black px-2">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${isActive
                                                        ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20'
                                                        : 'bg-white border-gray-200 text-gray-400'
                                                        }`}>
                                                        {isCompleted ? <FaCheck className="w-3 h-3" /> : stepNum}
                                                    </div>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-gray-400'
                                                        }`}>
                                                        {label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="w-full relative z-10">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {renderStep()}
                                    </motion.div>
                                </AnimatePresence>

                                {step > 1 && step < 4 && (
                                    <button
                                        onClick={prevStep}
                                        className="mt-6 flex items-center gap-2 text-gray-400 font-semibold hover:text-gray-900 transition-colors text-xs uppercase tracking-wide"
                                    >
                                        <ArrowLeft className="w-3 h-3" />
                                        Back
                                    </button>
                                )}

                                <div className="mt-3">


                                    <div className="flex justify-center mb-6 ">
                                        <div className="w-full flex items-center justify-center rounded-[10px]">
                                            <GoogleLogin
                                                onSuccess={handleGoogleSuccess}
                                                onError={() => toast.error('Google authentication failed')}
                                                useOneTap
                                                theme="outline"
                                                shape="rectangular"
                                                size="large"
                                                text="continue_with"
                                                width="650"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-0  text-center">
                                        <p className="text-sm text-gray-500">
                                            Already have an account?{' '}
                                            <Link href="/auth/login" className="text-primary font-bold hover:underline">
                                                Login Now
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms Modal */}
                    <PolicyModal
                        isOpen={showTermsModal}
                        onClose={() => setShowTermsModal(false)}
                        policyKey={role ? `terms-${role.toLowerCase()}` as any : "terms-of-service"}
                    />
                </div>
            </div>
        </div>
    );
}
