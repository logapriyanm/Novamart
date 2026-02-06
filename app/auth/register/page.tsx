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
    FaCheckCircle as CheckCircle2
} from 'react-icons/fa';
import Link from 'next/link';

type Role = 'MANUFACTURER' | 'DEALER' | 'CUSTOMER';

export default function Register({ initialRole }: { initialRole?: Role | null }) {
    const [step, setStep] = useState(initialRole ? 2 : 1);
    const [role, setRole] = useState<Role | null>(initialRole || null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        otp: '',
        companyName: '',
        businessName: '',
        gstNumber: '',
        address: '',
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const [otpSent, setOtpSent] = useState(false);

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
        nextStep();
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
                                    placeholder="Full Name / Primary Contact"
                                    className="w-full bg-white/60 border border-[#10367D]/10 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#10367D] transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                                <input
                                    type="email"
                                    placeholder="Corporate/Personal Email"
                                    className="w-full bg-white/60 border border-[#10367D]/10 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#10367D] transition-all"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                                <div className="flex gap-4">
                                    <input
                                        type="tel"
                                        placeholder="Mobile Number"
                                        className="flex-1 bg-white/60 border border-[#10367D]/10 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#10367D] transition-all"
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
                            disabled={!formData.name || !formData.email || !formData.phone || (otpSent && !formData.otp)}
                            className="w-full bg-[#10367D] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.02] uppercase tracking-widest text-sm disabled:opacity-50"
                        >
                            {role === 'CUSTOMER' ? 'Finalize Profile' : 'Business Details'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
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
                        <Link href="/dashboard/customer">
                            <button className="w-full bg-[#10367D] text-white font-bold py-4 rounded-2xl transition-all">Go to Dashboard</button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-md mx-auto">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-[#10367D]">Business Verification</h2>
                            <p className="text-[#1E293B]/60 text-sm font-bold">Mandatory checks for {role?.toLowerCase()}s</p>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder={role === 'MANUFACTURER' ? "Company Name" : "Business Name"}
                                className="w-full bg-white/60 border border-[#10367D]/10 rounded-2xl p-4 focus:outline-none focus:border-[#10367D] transition-all"
                                value={role === 'MANUFACTURER' ? formData.companyName : formData.businessName}
                                onChange={e => setFormData({ ...formData, [role === 'MANUFACTURER' ? 'companyName' : 'businessName']: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="GST Number"
                                className="w-full bg-white/60 border border-[#10367D]/10 rounded-2xl p-4 focus:outline-none focus:border-[#10367D] transition-all"
                                value={formData.gstNumber}
                                onChange={e => setFormData({ ...formData, gstNumber: e.target.value })}
                            />
                            <textarea
                                placeholder="Business Address"
                                className="w-full bg-white/60 border border-[#10367D]/10 rounded-2xl p-4 focus:outline-none focus:border-[#10367D] transition-all h-32"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <button
                            onClick={nextStep}
                            className="w-full bg-[#10367D] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#1E5F86] transition-all"
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
                            <button className="w-full bg-[#10367D] text-white font-bold py-4 rounded-2xl transition-all">Back to Home</button>
                        </Link>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#EBEBEB] flex flex-col items-center justify-center p-8 pt-32">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 mb-8 shadow-xl shadow-[#10367D]/10 overflow-hidden border border-[#10367D]/5">
                <img src="/logo.png" alt="Novamart" className="w-full h-full object-contain" />
            </div>
            {/* Progress Bar */}
            {step < 4 && (
                <div className="w-full max-w-2xl bg-white/20 h-1.5 rounded-full mb-12 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        className="h-full bg-[#10367D] shadow-lg shadow-[#10367D]/20"
                    />
                </div>
            )}

            <main className="w-full max-w-4xl">
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
                    className="mt-8 flex items-center gap-2 text-[#10367D]/60 font-bold hover:text-[#10367D] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
            )}
        </div>
    );
}

