'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaLock,
    FaShieldAlt,
    FaCreditCard,
    FaUniversity,
    FaTruck,
    FaCheckCircle,
    FaArrowLeft,
    FaArrowRight,
    FaInfoCircle,
    FaGlobeAmericas
} from 'react-icons/fa';
import Link from 'next/link';

export default function B2CCheckoutTerminal() {
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setStep(3);
            setIsProcessing(false);
        }, 2500);
    };

    if (step === 3) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-[3.5rem] p-12 text-center shadow-2xl border border-slate-100"
                >
                    <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-10 shadow-xl shadow-emerald-500/20">
                        <FaCheckCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-black text-[#1E293B] mb-4 italic">Funds Secured</h2>
                    <p className="text-sm font-medium text-slate-400 mb-10 leading-relaxed uppercase">
                        Payment of <span className="text-[#10367D] font-black">₹42,200</span> has been moved to <span className="bg-blue-50 text-[#10367D] px-2 py-0.5 rounded italic">NovaEscrow</span>. Funds will be released to the dealer upon delivery verification.
                    </p>
                    <Link href="/" className="inline-block w-full py-5 bg-[#10367D] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#10367D]/20">
                        Back to Marketplace
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 bg-slate-50/50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-[#1E293B] tracking-tight">NovaPay <span className="text-[#10367D]">Terminal</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Zone 2: B2C Digital Economy • High-Trust Escrow Secure</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4 py-2 px-6 bg-white rounded-full border border-slate-100 shadow-sm">
                        <FaLock className="text-emerald-500 w-3 h-3" />
                        <span className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest italic">AES-256 Encrypted Tunnel</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Checkout Flow */}
                    <div className="lg:col-span-8 space-y-8">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm space-y-10">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-6">1. Fulfillment Logistics</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Recipient Name</label>
                                            <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:outline-none focus:border-[#10367D]/30" placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact Nexus</label>
                                            <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:outline-none focus:border-[#10367D]/30" placeholder="+91 XXXX-XXXX" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Complete Address Structure</label>
                                        <textarea className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:outline-none focus:border-[#10367D]/30" rows={3} placeholder="Flat/Plot, Building, Street, Area..." />
                                    </div>
                                </div>
                                <button onClick={() => setStep(2)} className="w-full py-6 bg-[#10367D] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#10367D]/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-4">
                                    Proceed to Sovereign Payment
                                    <FaArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm space-y-10">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">2. Digital Payment Protocol</h3>
                                        <button onClick={() => setStep(1)} className="text-[10px] font-black text-[#10367D] uppercase tracking-widest flex items-center gap-2">
                                            <FaArrowLeft className="w-3 h-3" /> Edit Info
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { id: 'upi', name: 'Instant UPI', d: 'GPay, PhonePe, Paytm', icon: FaGlobeAmericas },
                                            { id: 'card', name: 'Credit/Debit Card', d: 'Visa, Master, Amex', icon: FaCreditCard },
                                            { id: 'bank', name: 'Net Banking', d: 'Secure Bank Gateway', icon: FaUniversity },
                                            { id: 'cod', name: 'COD Protocol', d: 'Cash on Delivery (Verified Only)', icon: FaTruck },
                                        ].map((m) => (
                                            <div
                                                key={m.id}
                                                onClick={() => setPaymentMethod(m.id)}
                                                className={`p-8 bg-slate-50 border-2 rounded-[2.5rem] transition-all cursor-pointer group relative overflow-hidden ${paymentMethod === m.id ? 'border-[#10367D] bg-blue-50/50' : 'border-slate-100 hover:border-[#10367D]/20'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-6 relative z-10">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${paymentMethod === m.id ? 'bg-[#10367D] text-white' : 'bg-white text-slate-300 group-hover:text-[#10367D]'
                                                        }`}>
                                                        <m.icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-[#1E293B] uppercase tracking-tight">{m.name}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 leading-tight">{m.d}</p>
                                                    </div>
                                                </div>
                                                {paymentMethod === m.id && <div className="absolute top-4 right-4 text-[#10367D]"><FaCheckCircle className="w-5 h-5" /></div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-10 bg-[#1E293B] rounded-[3rem] text-white flex items-center gap-8 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#10367D]/20 blur-2xl rounded-full" />
                                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center text-blue-400 shrink-0">
                                        <FaShieldAlt className="w-8 h-8" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                        NovaMart <span className="text-white font-black italic">Escrow Guarantee</span>: Funds are not released to the dealer until you confirm delivery or the 48h audit window closes.
                                    </p>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={!paymentMethod || isProcessing}
                                    className="w-full py-6 bg-[#10367D] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-[#10367D]/30 hover:scale-[1.02] disabled:opacity-50 transition-all flex items-center justify-center gap-4"
                                >
                                    {isProcessing ? 'Processing Transaction Core...' : 'Initialize NovaPay Secure'}
                                    <FaLock className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-4 h-fit sticky top-28 space-y-8">
                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-10 border-b border-slate-50 bg-slate-50/50">
                                <h3 className="text-[10px] font-black text-[#1E293B] uppercase tracking-[0.2em] italic">Settlement Overview</h3>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#1E293B] border border-slate-100 shadow-sm italic font-black text-xs">AC</div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-[#1E293B] uppercase truncate">Ultra-Quiet AC 2.0</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Dealer: LuxeHome Ltd.</p>
                                    </div>
                                    <p className="text-xs font-black text-[#1E293B]">₹42,200</p>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Basket Subtotal</span>
                                        <span>₹35,762</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Taxation (GST 18%)</span>
                                        <span>+ ₹6,437</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                        <span>Protocal Delivery</span>
                                        <span>FREE</span>
                                    </div>
                                    <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1E293B]">Total Net</p>
                                        <p className="text-2xl font-black text-[#10367D]">₹42,200</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-amber-50 border border-amber-100 rounded-[2.5rem] flex items-center gap-4">
                            <FaInfoCircle className="text-amber-500 w-6 h-6 shrink-0" />
                            <p className="text-[9px] font-bold text-amber-700 uppercase leading-tight tracking-widest">
                                Refund Protocol: 100% Return processed to original source if cancelled before dispatch.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

