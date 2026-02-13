'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaFileAlt as FileText, FaShieldAlt as ShieldCheck, FaLock as Lock, FaBalanceScale as Scale, FaExclamationCircle as AlertCircle } from 'react-icons/fa';

export default function TermsPage() {
    const sections = [
        {
            title: "1. Zero-Trust Verification",
            icon: ShieldCheck,
            content: "All participants in the NovaMart platform—including manufacturers, dealers, and customers—must undergo rigorous identity and business verification. We reserves the right to suspend any account that fails periodic security audits."
        },
        {
            title: "2. Ledger Integrity",
            icon: Lock,
            content: "Transactions recorded on the NovaMart proprietary ledger are immutable and serve as the single source of truth for all settlements and dispute resolutions. Tampering with platform data is strictly prohibited and results in immediate termination."
        },
        {
            title: "3. Order Fulfillment & Escrow",
            icon: Scale,
            content: "Payments are held in a secure escrow layer and only released upon successful delivery verification. Manufacturers and Dealers must adhere to the platform's SLA (Service Level Agreement) for shipping and quality assurance."
        },
        {
            title: "4. Compliance & Governing Law",
            icon: AlertCircle,
            content: "Users are responsible for ensuring compliance with localized tax, trade, and consumer protection laws. NovaMart provides the infrastructure for trade but does not act as a direct importer/exporter of record."
        }
    ];

    return (
        <div className="min-h-screen bg-background selection:bg-black/30 pt-24 pb-20 overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-black/10 border border-black/20 text-[10px] font-black tracking-widest text-black mb-6"
                    >
                        <FileText className="w-3 h-3" />
                        Legal Framework
                    </motion.div>
                    <h1 className="text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight italic uppercase">Terms of <span className="text-black/60">Service</span></h1>
                    <p className="text-[#1E293B]/60 font-medium italic">Last Updated: February 5, 2026</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/60 backdrop-blur-2xl border border-black/10 rounded-[10px] p-10 lg:p-16 space-y-12"
                >
                    <p className="text-foreground/70 leading-relaxed font-bold italic">
                        Welcome to NovaMart. By accessing or using our B2B2C governance platform, you agree to be bound by the following terms. These rules ensure a safe, auditable, and transparent environment for global trade.
                    </p>

                    {sections.map((section, i) => (
                        <div key={i} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-[5px] bg-black/5 flex items-center justify-center text-black">
                                    <section.icon className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black text-foreground tracking-wide italic">{section.title}</h2>
                            </div>
                            <p className="text-foreground/40 text-[11px] font-black tracking-widest pl-14 leading-relaxed italic">
                                "{section.content}"
                            </p>
                        </div>
                    ))}

                    <div className="pt-12 border-t border-black/10">
                        <div className="bg-black/5 rounded-[10px] p-8 border border-black/20">
                            <h3 className="text-[10px] font-black text-black tracking-[0.3em] mb-4 italic">Questions?</h3>
                            <p className="text-xs text-foreground/60 font-black tracking-widest leading-relaxed italic">
                                For detailed legal inquiries regarding our governance model, please contact <span className="text-black underline underline-offset-4 cursor-pointer hover:text-black/60 transition-colors italic">legal@novamart.com</span> or consult our help center.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

