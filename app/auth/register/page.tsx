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
        email: '',
        password: '',
        phone: '',
        companyName: '',
        businessName: '',
        gstNumber: '',
        registrationNo: '',
        address: '',
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

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
                            <h2 className="text-3xl font-black text-[#2772A0]">Choose Your Path</h2>
                            <p className="text-[#1E293B]/60 text-sm font-bold uppercase tracking-widest">Select your role in the marketplace</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: 'MANUFACTURER', label: 'Manufacturer', icon: Factory, desc: 'List products & manage distribution' },
                                { id: 'DEALER', label: 'Dealer', icon: Store, desc: 'Source & retail to customers' },
                                { id: 'CUSTOMER', label: 'Customer', icon: User, desc: 'Buy securely with escrow protection' }
                            ].map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => handleRoleSelect(r.id as Role)}
                                    className="p-8 rounded-3xl bg-white/40 border border-[#2772A0]/10 hover:border-[#2772A0] hover:bg-white/60 transition-all group group flex flex-col items-center text-center gap-4"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-[#2772A0]/5 flex items-center justify-center text-[#2772A0] group-hover:bg-[#2772A0] group-hover:text-white transition-all">
                                        <r.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2772A0]">{r.label}</h3>
                                    <p className="text-xs text-[#1E293B]/60 font-medium">{r.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 max-w-md mx-auto">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-[#2772A0]">Basic Information</h2>
                            <p className="text-[#1E293B]/60 text-sm font-bold">Secure your account access</p>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-white/60 border border-[#2772A0]/10 rounded-2xl p-4 focus:outline-none focus:border-[#2772A0] transition-all"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="w-full bg-white/60 border border-[#2772A0]/10 rounded-2xl p-4 focus:outline-none focus:border-[#2772A0] transition-all"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-white/60 border border-[#2772A0]/10 rounded-2xl p-4 focus:outline-none focus:border-[#2772A0] transition-all"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <button
                            onClick={role === 'CUSTOMER' ? nextStep : nextStep}
                            className="w-full bg-[#2772A0] text-[#CCDDEA] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#1E5F86] transition-all"
                        >
                            {role === 'CUSTOMER' ? 'Complete' : 'Next Step'}
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
                        <h2 className="text-3xl font-black text-[#2772A0]">Welcome to Novamart</h2>
                        <p className="text-[#1E293B]/70 font-medium">Your account has been activated. You can now browse products and purchase securely with escrow.</p>
                        <Link href="/dashboard/customer">
                            <button className="w-full bg-[#2772A0] text-[#CCDDEA] font-bold py-4 rounded-2xl transition-all">Go to Dashboard</button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-md mx-auto">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-[#2772A0]">Business Verification</h2>
                            <p className="text-[#1E293B]/60 text-sm font-bold">Mandatory checks for {role?.toLowerCase()}s</p>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder={role === 'MANUFACTURER' ? "Company Name" : "Business Name"}
                                className="w-full bg-white/60 border border-[#2772A0]/10 rounded-2xl p-4 focus:outline-none focus:border-[#2772A0] transition-all"
                                value={role === 'MANUFACTURER' ? formData.companyName : formData.businessName}
                                onChange={e => setFormData({ ...formData, [role === 'MANUFACTURER' ? 'companyName' : 'businessName']: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="GST Number"
                                className="w-full bg-white/60 border border-[#2772A0]/10 rounded-2xl p-4 focus:outline-none focus:border-[#2772A0] transition-all"
                                value={formData.gstNumber}
                                onChange={e => setFormData({ ...formData, gstNumber: e.target.value })}
                            />
                            <textarea
                                placeholder="Business Address"
                                className="w-full bg-white/60 border border-[#2772A0]/10 rounded-2xl p-4 focus:outline-none focus:border-[#2772A0] transition-all h-32"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <button
                            onClick={nextStep}
                            className="w-full bg-[#2772A0] text-[#CCDDEA] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#1E5F86] transition-all"
                        >
                            Finalize Application
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                );
            case 4:
                return (
                    <div className="text-center space-y-6 max-w-md mx-auto">
                        <div className="w-20 h-20 rounded-full bg-[#2772A0]/10 text-[#2772A0] flex items-center justify-center mx-auto">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-[#2772A0]">Application Submitted</h2>
                        <p className="text-[#1E293B]/70 font-medium">Your request is now in <span className="text-[#2772A0] font-bold">UNDER VERIFICATION</span> status. We will notify you once your business details are verified (SLA: 24-48h).</p>
                        <Link href="/">
                            <button className="w-full bg-[#2772A0] text-[#CCDDEA] font-bold py-4 rounded-2xl transition-all">Back to Home</button>
                        </Link>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#CCDDEA] flex flex-col items-center justify-center p-8 pt-32">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 mb-8 shadow-xl shadow-[#2772A0]/10 overflow-hidden border border-[#2772A0]/5">
                <img src="/logo.png" alt="Novamart" className="w-full h-full object-contain" />
            </div>
            {/* Progress Bar */}
            {step < 4 && (
                <div className="w-full max-w-2xl bg-white/20 h-1.5 rounded-full mb-12 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        className="h-full bg-[#2772A0] shadow-lg shadow-[#2772A0]/20"
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
                    className="mt-8 flex items-center gap-2 text-[#2772A0]/60 font-bold hover:text-[#2772A0] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
            )}
        </div>
    );
}
