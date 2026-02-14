'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaStore,
    FaFileUpload,
    FaCheckCircle,
    FaArrowRight,
    FaArrowLeft,
    FaIdCard,
    FaMapMarkerAlt,
    FaEnvelopeOpenText,
    FaShieldAlt,
    FaUniversity
} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SellerRegistration() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const steps = [
        { id: 1, title: 'Retail Profile', icon: FaStore },
        { id: 2, title: 'KYC & GST', icon: FaFileUpload },
        { id: 3, title: 'Bank Handshake', icon: FaUniversity },
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
                    className="max-w-md w-full bg-white rounded-[10px] p-12 text-center shadow-2xl"
                >
                    <div className="w-20 h-20 bg-emerald-500 rounded-[10px] flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-emerald-500/20">
                        <FaCheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-[#1E293B] mb-4">Registration Lodged</h2>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed mb-10">
                        Your retail credentials have been submitted for <span className="text-[#067FF9] font-bold">Admin Audit</span>.
                        Verification ensures a safe marketplace for all customers.
                    </p>
                    <div className="p-6 bg-slate-50 rounded-[10px] border border-slate-100 mb-10">
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Account Protocol State</p>
                        <span className="text-xs font-black text-[#067FF9] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Audit Pending</span>
                    </div>
                    <Link href="/" className="inline-block w-full py-4 bg-[#067FF9] text-white rounded-[10px] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">
                        Exit to Terminal
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EBEBEB] flex flex-col lg:flex-row shadow-2xl overflow-hidden">
            {/* Left Side: Context */}
            <div className="lg:w-1/3 bg-[#1E293B] p-12 lg:p-20 flex flex-col justify-between text-white relative">
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[#067FF9]/10 to-transparent" />
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 mb-16 group">
                        <div className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center text-[#067FF9] font-black shadow-lg">N</div>
                        <span className="text-2xl font-black tracking-tight group-hover:text-blue-400 transition-colors">NovaMart</span>
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight mb-6">Retail <br /><span className="text-[#067FF9]">Partnership</span></h1>
                    <p className="text-slate-400 font-medium leading-relaxed">
                        Join the platform's verified distribution network. Connect supply from manufacturers directly to end-customers.
                    </p>
                </div>

                <div className="relative z-10 space-y-8">
                    {steps.map((s) => (
                        <div key={s.id} className={`flex items-center gap-4 transition-all ${step === s.id ? 'opacity-100 translate-x-2' : 'opacity-40'}`}>
                            <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center font-black text-xs ${step >= s.id ? 'bg-[#067FF9] text-white' : 'bg-white/10 text-white'}`}>
                                {step > s.id ? <FaCheckCircle /> : s.id}
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest">{s.title}</span>
                        </div>
                    ))}
                </div>

                <div className="relative z-10 pt-12 border-t border-white/5 flex items-center gap-4">
                    <FaShieldAlt className="text-[#067FF9] w-6 h-6" />
                    <div>
                        <p className="text-sm font-black uppercase tracking-widest text-slate-500">Marketplace Integrity</p>
                        <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Verified Seller Enrollment</p>
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
                                    <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">Retail Profile</h2>
                                    <p className="text-slate-400 font-medium text-sm mt-2">Core details for your store or distribution business.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Trade/Business Name</label>
                                        <input type="text" placeholder="e.g. Apex Electronics Retails" className="w-full bg-slate-50 border border-slate-100 rounded-[10px] py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#067FF9]/30" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Shop/Warehouse GSTIN</label>
                                        <input type="text" placeholder="27AAECM1234F1Z5" className="w-full bg-slate-50 border border-slate-100 rounded-[10px] py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#067FF9]/30" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Physical Store/Warehouse Address</label>
                                        <textarea rows={3} placeholder="Building 45, Market Street, Sector 12..." className="w-full bg-slate-50 border border-slate-100 rounded-[10px] py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#067FF9]/30" />
                                    </div>
                                </div>

                                <button onClick={handleNext} className="w-full md:w-auto px-12 py-5 bg-[#067FF9] text-white rounded-[10px] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#067FF9]/20 hover:scale-105 transition-all flex items-center justify-center gap-3">
                                    Next: Documentation
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
                                    <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">Trust Verification</h2>
                                    <p className="text-slate-400 font-medium text-sm mt-2">Compliance artifacts required for marketplace approval.</p>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { label: 'GST Registration Certificate', icon: FaFileUpload },
                                        { label: 'Shop & Establishment License', icon: FaMapMarkerAlt },
                                        { label: 'Authorized Signatory Aadhaar/PAN', icon: FaIdCard },
                                    ].map((doc, i) => (
                                        <div key={i} className="group p-8 border-2 border-dashed border-slate-100 rounded-[10px] hover:border-[#067FF9]/20 transition-all cursor-pointer bg-slate-50/50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 rounded-[10px] bg-white border border-slate-100 flex items-center justify-center text-[#067FF9] shadow-sm">
                                                        <doc.icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-[#1E293B]">{doc.label}</h4>
                                                        <p className="text-sm font-bold text-slate-400 uppercase mt-1">Image or PDF (Max 4MB)</p>
                                                    </div>
                                                </div>
                                                <button className="px-6 py-3 bg-white border border-slate-200 text-[#1E293B] text-sm font-black uppercase tracking-widest rounded-[10px] group-hover:bg-[#067FF9] group-hover:text-white group-hover:border-[#067FF9] transition-all">
                                                    Attach
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4">
                                    <button onClick={handleBack} className="p-5 bg-slate-50 text-slate-400 rounded-[10px] hover:text-[#1E293B] transition-all">
                                        <FaArrowLeft className="w-4 h-4" />
                                    </button>
                                    <button onClick={handleNext} className="flex-1 py-5 bg-[#067FF9] text-white rounded-[10px] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#067FF9]/20 hover:scale-105 transition-all flex items-center justify-center gap-3">
                                        Continue to Settlements
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
                                    <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">Bank Handshake</h2>
                                    <p className="text-slate-400 font-medium text-sm mt-2">Required for retail payout settlements and escrow handling.</p>
                                </div>

                                <div className="p-10 bg-[#1E293B] rounded-[10px] text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#067FF9]/20 blur-2xl rounded-full" />
                                    <div className="relative z-10 flex items-center gap-6 mb-8 text-blue-400">
                                        <FaUniversity className="w-10 h-10" />
                                        <h3 className="text-lg font-black tracking-tight">Financial Payouts</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input type="text" placeholder="Account Holder Name" className="w-full bg-white/5 border border-white/10 rounded-[10px] py-4 px-6 text-sm font-medium focus:outline-none focus:border-blue-400/30 text-white placeholder:text-slate-500" />
                                            <input type="text" placeholder="Bank IFSC Code" className="w-full bg-white/5 border border-white/10 rounded-[10px] py-4 px-6 text-sm font-medium focus:outline-none focus:border-blue-400/30 text-white placeholder:text-slate-500" />
                                        </div>
                                        <input type="text" placeholder="Primary Business Account Number" className="w-full bg-white/5 border border-white/10 rounded-[10px] py-4 px-6 text-sm font-medium focus:outline-none focus:border-blue-400/30 text-white placeholder:text-slate-500" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button onClick={handleBack} className="p-5 bg-slate-50 text-slate-400 rounded-[10px] hover:text-[#1E293B] transition-all">
                                        <FaArrowLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="flex-1 py-5 bg-emerald-600 text-white rounded-[10px] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Verifying Protocol...' : 'Finalize Seller Onboarding'}
                                        <FaCheckCircle className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="pt-6 border-t border-slate-50 text-center">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        By onboarding, you agree to NovaMart's Service Level Agreements (SLA) & Retail Governance.
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

