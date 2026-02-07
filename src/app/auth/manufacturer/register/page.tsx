'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaIndustry,
    FaFileUpload,
    FaCheckCircle,
    FaArrowRight,
    FaArrowLeft,
    FaIdCard,
    FaMapMarkerAlt,
    FaEnvelopeOpenText,
    FaShieldAlt
} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ManufacturerRegistration() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const steps = [
        { id: 1, title: 'Entity Details', icon: FaIndustry },
        { id: 2, title: 'Verification Docs', icon: FaFileUpload },
        { id: 3, title: 'Identity Handshake', icon: FaIdCard },
    ];

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsComplete(true);
        }, 2000);
    };

    if (isComplete) {
        return (
            <div className="min-h-screen bg-[#1E293B] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl"
                >
                    <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-emerald-500/20">
                        <FaCheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-[#1E293B] mb-4">Protocol Initiated</h2>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed mb-10">
                        Your entity details have been submitted to the <span className="text-[#10367D] font-bold">Platform Governor</span>.
                        Verification typically takes 24-48 hours.
                    </p>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                        <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100">Pending Verification</span>
                    </div>
                    <Link href="/" className="inline-block w-full py-4 bg-[#10367D] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">
                        Return to Public Terminal
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EBEBEB] flex flex-col lg:flex-row shadow-2xl overflow-hidden">
            {/* Left Side: context */}
            <div className="lg:w-1/3 bg-[#1E293B] p-12 lg:p-20 flex flex-col justify-between text-white relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#10367D]/20 to-transparent" />
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 mb-16 group">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#10367D] font-black shadow-lg">N</div>
                        <span className="text-2xl font-black tracking-tight group-hover:text-blue-400 transition-colors">NovaMart</span>
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight mb-6">Supply-Side <br /><span className="text-[#10367D]">Authority</span></h1>
                    <p className="text-slate-400 font-medium leading-relaxed">
                        Join the ecosystem as a verified bulk producer. Maintain quality, supply dealers, and scale your production.
                    </p>
                </div>

                <div className="relative z-10 space-y-8">
                    {steps.map((s) => (
                        <div key={s.id} className={`flex items-center gap-4 transition-all ${step === s.id ? 'opacity-100 translate-x-2' : 'opacity-40'}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${step >= s.id ? 'bg-[#10367D] text-white' : 'bg-white/10 text-white'}`}>
                                {step > s.id ? <FaCheckCircle /> : s.id}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{s.title}</span>
                        </div>
                    ))}
                </div>

                <div className="relative z-10 pt-12 border-t border-white/5 flex items-center gap-4">
                    <FaShieldAlt className="text-[#10367D] w-6 h-6" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Governance Protocol</p>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">ISO 27001 Compliant Ingestion</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 bg-white p-12 lg:p-24 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">Entity Information</h2>
                                    <p className="text-slate-400 font-medium text-sm mt-2">Legal business details for platform onboarding.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Registered Name</label>
                                        <input type="text" placeholder="e.g. Mega-Mart Manufacturing Inc." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GST Identification Number</label>
                                        <input type="text" placeholder="27AAECM1234F1Z5" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Factory/Office Address</label>
                                        <textarea rows={3} placeholder="Plot 22, Industrial Estate, Phase 4..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30" />
                                    </div>
                                </div>

                                <button onClick={handleNext} className="w-full md:w-auto px-12 py-5 bg-[#10367D] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center justify-center gap-3">
                                    Continue to Compliance
                                    <FaArrowRight className="w-3 h-3" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">Compliance Documents</h2>
                                    <p className="text-slate-400 font-medium text-sm mt-2">Required for industrial audit and verification.</p>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { label: 'GST Certificate', icon: FaFileUpload },
                                        { label: 'Factory License / Reg Certificate', icon: FaIndustry },
                                        { label: 'Corporate PAN Card', icon: FaIdCard },
                                    ].map((doc, i) => (
                                        <div key={i} className="group p-8 border-2 border-dashed border-slate-100 rounded-[2.5rem] hover:border-[#10367D]/20 transition-all cursor-pointer bg-slate-50/50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#10367D] shadow-sm">
                                                        <doc.icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-[#1E293B]">{doc.label}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">PDF or Scanned Copy (Max 5MB)</p>
                                                    </div>
                                                </div>
                                                <button className="px-6 py-3 bg-white border border-slate-200 text-[#1E293B] text-[10px] font-black uppercase tracking-widest rounded-xl group-hover:bg-[#10367D] group-hover:text-white group-hover:border-[#10367D] transition-all">
                                                    Upload
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4">
                                    <button onClick={handleBack} className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:text-[#1E293B] transition-all">
                                        <FaArrowLeft className="w-4 h-4" />
                                    </button>
                                    <button onClick={handleNext} className="flex-1 py-5 bg-[#10367D] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center justify-center gap-3">
                                        Proceed to Identity Verification
                                        <FaArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">Identity Handshake</h2>
                                    <p className="text-slate-400 font-medium text-sm mt-2">Verifying the authorized signatory for the entity.</p>
                                </div>

                                <div className="p-10 bg-[#1E293B] rounded-[3rem] text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#10367D]/20 blur-2xl rounded-full" />
                                    <div className="relative z-10 flex items-center gap-6 mb-8 text-blue-400">
                                        <FaEnvelopeOpenText className="w-10 h-10" />
                                        <h3 className="text-lg font-black tracking-tight">Contact Verification</h3>
                                    </div>
                                    <p className="text-xs font-medium text-slate-400 leading-relaxed mb-8">
                                        We will send a high-security OTP to your registered corporate email and mobile to bind your identity to this Manufacturer profile.
                                    </p>
                                    <div className="space-y-4">
                                        <input type="email" placeholder="signatory@company.com" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-blue-400/30 text-white placeholder:text-slate-500" />
                                        <div className="flex gap-4">
                                            <input type="text" placeholder="OTP Code" className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-blue-400/30 text-white" />
                                            <button className="px-6 py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">Send OTP</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button onClick={handleBack} className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:text-[#1E293B] transition-all">
                                        <FaArrowLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Processing Handshake...' : 'Finalize Registration Protocol'}
                                        <FaCheckCircle className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="pt-6 border-t border-slate-50 text-center">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        By clicking finalize, you agree to NovaMart's Industrial Terms of Supply & Quality Governance.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

