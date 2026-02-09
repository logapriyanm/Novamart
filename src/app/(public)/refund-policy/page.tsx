'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaSyncAlt as RefreshCcw, FaTruck as Truck, FaUndo as CornerUpLeft, FaClock as Clock, FaExclamationTriangle as AlertTriangle } from 'react-icons/fa';

export default function RefundPolicyPage() {
    const steps = [
        { icon: AlertTriangle, text: "Report issue within 24h of unboxing" },
        { icon: Truck, text: "Wait for Manufacturer/Dealer inspection" },
        { icon: Clock, text: "Escrow release or refund within 72h" }
    ];

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-rose-500/10 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest text-rose-600 mb-6"
                    >
                        <RefreshCcw className="w-3 h-3" />
                        Post-Trade Policies
                    </motion.div>
                    <h1 className="text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight italic uppercase">Refund & <span className="text-rose-500">Return</span></h1>
                    <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.2em] max-w-2xl mx-auto italic">
                        Ensuring transactional justice through fair and auditable return mechanisms.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-12 bg-white/60 backdrop-blur-2xl border border-black/10 rounded-[10px] p-10 lg:p-16"
                    >
                        <h2 className="text-3xl font-black text-foreground mb-8 uppercase tracking-tighter italic">The Returns Framework</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-[5px] bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                        <CornerUpLeft className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-widest italic">Eligible Returns</h3>
                                </div>
                                <ul className="space-y-4 text-sm text-foreground/60 font-bold ml-14 italic">
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Damaged or defective goods
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Incorrect model/specifications
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Fraudulent order signals
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-[5px] bg-orange-500/10 flex items-center justify-center text-orange-600">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-widest italic">Policy Exceptions</h3>
                                </div>
                                <ul className="space-y-4 text-sm text-foreground/40 font-black uppercase tracking-widest ml-14 italic">
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        Change of mind after shipment
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        Custom-manufactured bulk lots
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        Products without valid unboxing videos
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-12 bg-black p-10 lg:p-14 rounded-[10px] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-black/40"
                    >
                        <div className="max-w-md">
                            <h2 className="text-2xl font-black uppercase tracking-widest mb-4 italic">Refund Methodology</h2>
                            <p className="text-sm opacity-80 leading-relaxed font-bold italic">
                                Once a return is approved by the governance panel, the funds held in escrow are instantly reversed to the original payment source minus transactional fees.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 w-full md:w-auto">
                            {steps.map((step, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-[5px] border border-white/20 whitespace-nowrap backdrop-blur-md">
                                    <step.icon className="w-4 h-4 opacity-60" />
                                    <span className="text-xs font-black uppercase tracking-wider">{step.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

