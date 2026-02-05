'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Search } from 'lucide-react';

export default function PrivacyPage() {
    const pillars = [
        {
            title: "Data Isolation",
            description: "User profiles are kept strictly isolated from transactional ledgers to ensure maximum privacy and targeted governance.",
            icon: Lock
        },
        {
            title: "Encryption at Rest",
            description: "All sensitive data—from bank details to legal IDs—is encrypted using industry-standard AES-256 protocols.",
            icon: Shield
        },
        {
            title: "Usage Transparency",
            description: "We only record signals necessary for auditing trade integrity. We never monetize or sell user behavioral data.",
            icon: Eye
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20 overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2772A0]/10 border border-[#2772A0]/20 text-[10px] font-black uppercase tracking-widest text-[#2772A0] mb-6"
                    >
                        <Shield className="w-3 h-3" />
                        Privacy Safeguards
                    </motion.div>
                    <h1 className="text-5xl lg:text-6xl font-black text-[#1E293B] mb-6 tracking-tight">Privacy <span className="text-[#2772A0]">Commitment</span></h1>
                    <p className="text-[#1E293B]/60 font-medium leading-relaxed max-w-2xl mx-auto">
                        Your trust is our most valuable asset. Our privacy framework is designed to protect your identity while maintaining a perfectly auditable trade environment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {pillars.map((pillar, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/60 p-8 rounded-[2.5rem] border border-[#2772A0]/5 flex flex-col items-center text-center group hover:border-[#2772A0]/20 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[#2772A0]/5 text-[#2772A0] flex items-center justify-center mb-6 group-hover:bg-[#2772A0] group-hover:text-white transition-all">
                                <pillar.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-wider mb-2">{pillar.title}</h3>
                            <p className="text-[11px] text-[#1E293B]/60 font-bold leading-relaxed">{pillar.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/40 backdrop-blur-3xl border border-[#2772A0]/10 rounded-[3rem] p-10 lg:p-16 space-y-12"
                >
                    <div className="flex gap-6 items-start">
                        <Database className="w-8 h-8 text-[#2772A0] shrink-0" />
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-[#1E293B] uppercase tracking-tight">Information We Collect</h2>
                            <p className="text-sm text-[#1E293B]/60 font-medium leading-relaxed">
                                We collect information strictly required for **KYC (Know Your Customer)** and **KYB (Know Your Business)** verification, as well as transactional logs for auditability. This includes legal names, registration certificate data, and location-based trade signals.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6 items-start pt-12 border-t border-[#2772A0]/10">
                        <Search className="w-8 h-8 text-[#2772A0] shrink-0" />
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-[#1E293B] uppercase tracking-tight">Your Rights</h2>
                            <p className="text-sm text-[#1E293B]/60 font-medium leading-relaxed">
                                Under our governance model, you have the right to audit your own data records and request account closure. However, transactional ledgers relating to financial settlements must be retained for auditing periods required by international trade law.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
