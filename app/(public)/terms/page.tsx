'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Lock, Scale, AlertCircle } from 'lucide-react';

export default function TermsPage() {
    const sections = [
        {
            title: "1. Zero-Trust Verification",
            icon: ShieldCheck,
            content: "All participants in the Novamart platform—including manufacturers, dealers, and customers—must undergo rigorous identity and business verification. We reserves the right to suspend any account that fails periodic security audits."
        },
        {
            title: "2. Ledger Integrity",
            icon: Lock,
            content: "Transactions recorded on the Novamart proprietary ledger are immutable and serve as the single source of truth for all settlements and dispute resolutions. Tampering with platform data is strictly prohibited and results in immediate termination."
        },
        {
            title: "3. Order Fulfillment & Escrow",
            icon: Scale,
            content: "Payments are held in a secure escrow layer and only released upon successful delivery verification. Manufacturers and Dealers must adhere to the platform's SLA (Service Level Agreement) for shipping and quality assurance."
        },
        {
            title: "4. Compliance & Governing Law",
            icon: AlertCircle,
            content: "Users are responsible for ensuring compliance with localized tax, trade, and consumer protection laws. Novamart provides the infrastructure for trade but does not act as a direct importer/exporter of record."
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#2772A0]/30 pt-24 pb-20 overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2772A0]/10 border border-[#2772A0]/20 text-[10px] font-black uppercase tracking-widest text-[#2772A0] mb-6"
                    >
                        <FileText className="w-3 h-3" />
                        Legal Framework
                    </motion.div>
                    <h1 className="text-5xl lg:text-6xl font-black text-[#1E293B] mb-6 tracking-tight">Terms of <span className="text-[#2772A0]">Service</span></h1>
                    <p className="text-[#1E293B]/60 font-medium italic">Last Updated: February 5, 2026</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/60 backdrop-blur-2xl border border-[#2772A0]/10 rounded-[3rem] p-10 lg:p-16 space-y-12"
                >
                    <p className="text-[#1E293B]/70 leading-relaxed font-bold">
                        Welcome to Novamart. By accessing or using our B2B2C governance platform, you agree to be bound by the following terms. These rules ensure a safe, auditable, and transparent environment for global trade.
                    </p>

                    {sections.map((section, i) => (
                        <div key={i} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#2772A0]/5 flex items-center justify-center text-[#2772A0]">
                                    <section.icon className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-[#1E293B] uppercase tracking-wide">{section.title}</h2>
                            </div>
                            <p className="text-[#1E293B]/60 font-medium leading-relaxed pl-14 italic">
                                "{section.content}"
                            </p>
                        </div>
                    ))}

                    <div className="pt-12 border-t border-[#2772A0]/10">
                        <div className="bg-[#2772A0]/5 rounded-3xl p-8 border border-[#2772A0]/20">
                            <h3 className="text-sm font-black text-[#2772A0] uppercase tracking-widest mb-4">Questions?</h3>
                            <p className="text-xs text-[#1E293B]/60 font-bold leading-relaxed">
                                For detailed legal inquiries regarding our governance model, please contact <span className="text-[#2772A0] underline underline-offset-4 cursor-pointer">legal@novamart.com</span> or consult our help center.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
