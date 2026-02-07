'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPlus,
    FaArrowLeft,
    FaCheckCircle,
    FaArrowRight,
    FaBox,
    FaTag,
    FaPalette,
    FaWarehouse,
    FaShieldAlt,
    FaInfoCircle,
    FaIndustry
} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddBulkProduct() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            router.push('/manufacturer/inventory');
        }, 2000);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/manufacturer/inventory" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Inventory
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Initialize <span className="text-[#10367D]">Supply</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Bulk Product Ingestion Terminal</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Left: Form Area */}
                <div className="xl:col-span-8 bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm">
                    <div className="mb-12 flex items-center gap-8 border-b border-slate-50 pb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`flex items-center gap-3 ${step === i ? 'opacity-100' : 'opacity-30'}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${step >= i ? 'bg-[#10367D] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {i}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                                    {i === 1 ? 'Specifications' : i === 2 ? 'Bulk Slabs' : 'Quality Audit'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="p1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Signature Name</label>
                                        <input type="text" placeholder="e.g. Inverter AC 2.0 Ton" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Catalog Category</label>
                                        <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30 appearance-none">
                                            <option>Home Appliances</option>
                                            <option>Industrial Kitchen</option>
                                            <option>Smart Climate</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tax Classification (GST Slab)</label>
                                        <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30 appearance-none">
                                            <option>5% (Basic Essentials)</option>
                                            <option>12% (Standard Goods)</option>
                                            <option>18% (Capital Goods)</option>
                                            <option>28% (Luxury Items)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Manufacturing Certifications</label>
                                        <input type="text" placeholder="ISO 9001, BEE 5-Star, etc." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Technical Specifications (Immutable After Approval)</label>
                                        <textarea rows={4} placeholder="List all technical parameters, material composition, and industrial standards..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30" />
                                    </div>
                                </div>
                                <button onClick={handleNext} className="px-12 py-5 bg-[#10367D] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center justify-center gap-3">
                                    Continue to Bulk Logistics
                                    <FaArrowRight className="w-3 h-3" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="p2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Wholesale Price (Per Unit)</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-[#1E293B]">₹</span>
                                            <input type="text" placeholder="34,500" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-black focus:outline-none focus:border-[#10367D]/30" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Minimum Order Quantity (MOQ)</label>
                                        <input type="number" placeholder="10" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:outline-none focus:border-[#10367D]/30" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Packaging & Handling Specs</label>
                                        <input type="text" placeholder="Wooden Crate, Corrugated Box, Net Weight 42KG..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30" />
                                    </div>
                                    <div className="md:col-span-2 p-8 bg-blue-50/50 rounded-[2.5rem] border border-[#10367D]/10 space-y-6">
                                        <h4 className="text-[10px] font-black text-[#10367D] uppercase tracking-[0.2em] flex items-center gap-2">
                                            <FaTag /> Bulk Sourcing Rewards (Estimated)
                                        </h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            {[10, 50, 100].map(s => (
                                                <div key={s} className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col items-center">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase mb-2">{'>'} {s} Units</span>
                                                    <span className="text-xs font-black text-[#1E293B] italic">Custom Quote</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button onClick={handleBack} className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:text-[#1E293B] transition-all">
                                        <FaArrowLeft className="w-4 h-4" />
                                    </button>
                                    <button onClick={handleNext} className="flex-1 py-5 bg-[#10367D] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center justify-center gap-3">
                                        Final Verification
                                        <FaArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="p3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div className="p-10 bg-[#1E293B] rounded-[3rem] text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#10367D]/20 blur-2xl rounded-full" />
                                    <h3 className="text-xl font-black mb-10 flex items-center gap-3">
                                        <FaShieldAlt className="text-[#10367D]" />
                                        Compliance Handshake
                                    </h3>
                                    <div className="space-y-6 text-sm font-medium text-slate-400">
                                        <div className="flex items-start gap-4">
                                            <FaCheckCircle className="text-emerald-500 mt-1" />
                                            <p>I confirm that the technical specifications provided match the manufacturing license standards.</p>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <FaCheckCircle className="text-emerald-500 mt-1" />
                                            <p>I understand that once approved, these specs cannot be modified without a re-governance audit.</p>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <FaCheckCircle className="text-emerald-500 mt-1" />
                                            <p>I acknowledge that this listing is strictly for bulk-supply to verified dealers.</p>
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
                                        {isSubmitting ? 'Protocol Initiating...' : 'Submit to Governor Audit'}
                                        <FaPlus className="w-3 h-3" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Info/Policy Sidebar */}
                <div className="xl:col-span-4 space-y-8 text-[#1E293B]">
                    <div className="p-10 bg-blue-50 rounded-[3rem] border border-[#10367D]/10 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#10367D] text-white flex items-center justify-center shadow-lg shadow-[#10367D]/20">
                            <FaInfoCircle className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black tracking-tight">Supply Governance</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                            "Transparency is the engine of ecosystem growth. Every product initialized here is a promise of quality to your dealer network."
                        </p>
                        <ul className="space-y-4 pt-4">
                            {[
                                { t: 'No Retail Pricing', d: 'Retail pricing is controlled by dealers.' },
                                { t: 'Static Specs', d: 'Approved specs are immutable.' },
                                { t: 'MOQ Enforcement', d: 'System prevents sub-MOQ orders.' },
                            ].map((p, i) => (
                                <li key={i} className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#10367D]">{p.t}</span>
                                    <span className="text-[10px] font-bold text-slate-400 mt-1">{p.d}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 flex items-center gap-6">
                        <FaIndustry className="text-slate-200 w-12 h-12" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Manufacturer</p>
                            <p className="text-xs font-black text-[#1E293B]">MFG-NS-2026-X8801</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

