'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaSync, FaCalendarAlt, FaHistory, FaUserShield, FaExclamationTriangle, FaCheckDouble } from 'react-icons/fa';
import FooterPageLayout from '@/client/components/layout/FooterPageLayout';

const protocols = [
    {
        title: "Secure Hold",
        description: "When a dealer places an order, capital is instantly frozen in the NovaMart Layer-1 Escrow. The manufacturer is notified only after capital verification.",
        icon: FaLock
    },
    {
        title: "Verification Trigger",
        description: "The escrow remains active through the shipping cycle. Logic triggers are only unlocked upon digital confirmation of delivery and quality audit.",
        icon: FaCheckDouble
    },
    {
        title: "Dispute Mediation",
        description: "In case of variance (damaged goods/wrong specs), capital remains locked. NovaMart mediators review evidence before any release.",
        icon: FaExclamationTriangle
    }
];

const sidebarSections = [
    {
        title: "Release Timelines",
        description: "Standard industrial payment cycles.",
        icon: FaCalendarAlt,
        items: [
            { title: "T+1 Day", description: "Delivery success confirmation." },
            { title: "T+3 Days", description: "Manufacturer payment release." },
            { title: "Instant", description: "Refund upon verified cancellation." }
        ]
    },
    {
        title: "Governance Model",
        description: "Automated trust parameters.",
        icon: FaUserShield,
        items: [
            { title: "99.9% Integrity", description: "Zero-loss record for audited deals." },
            { title: "Smart Contracts", description: "Code-driven transaction finalization." }
        ]
    }
];

export default function EscrowLedgerPage() {
    return (
        <FooterPageLayout
            sidebarTitle="Security Hub"
            sidebarDescription="Escrow Governance"
            sidebarWelcome="The NovaMart Escrow Ledger is the world's most robust payment protection layer for large-scale appliance trade."
            sidebarSections={sidebarSections}
        >
            <div className="space-y-16 pt-4">
                {/* Hero */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-emerald-600/10 border border-emerald-600/20 text-sm font-black uppercase tracking-widest text-emerald-600 mb-6"
                    >
                        <FaShieldAlt className="w-2.5 h-2.5" />
                        Financial Integrity
                    </motion.div>
                    <h1 className="text-5xl font-black text-slate-900 leading-tight italic uppercase tracking-tighter">
                        Escrow <br />
                        <span className="text-emerald-600">Ledger Protocol</span>
                    </h1>
                    <p className="mt-6 text-lg text-slate-500 font-medium italic max-w-2xl leading-relaxed">
                        We have eliminated the risk of non-payment and non-delivery. Our Escrow Ledger ensures that manufacturers are paid for quality and dealers receive what they ordered.
                    </p>
                </div>

                {/* Protocols Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {protocols.map((protocol, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-slate-100 rounded-[10px] p-8 flex items-start gap-8 shadow-sm group hover:border-emerald-600 transition-all"
                        >
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-[10px] flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-all">
                                <protocol.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tight mb-3">
                                    {protocol.title}
                                </h3>
                                <p className="text-slate-500 font-medium italic leading-relaxed">
                                    {protocol.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Large Security Note */}
                <div className="bg-slate-900 rounded-[10px] p-12 text-white flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-600/10 blur-[100px] rounded-full -ml-32 -mt-32" />
                    <FaSync className="w-12 h-12 text-emerald-400 mb-6 animate-spin-slow" />
                    <h2 className="text-3xl font-black italic uppercase mb-4 relative z-10">Synced Capital Management</h2>
                    <p className="text-slate-400 max-w-lg font-medium italic leading-relaxed text-sm relative z-10">
                        Our ledger synchronizes with logistics updates in real-time. The moment a shipment is signed for, the payment clock starts ticking, ensuring no manufacturer is left waiting for capital release.
                    </p>
                </div>
            </div>
        </FooterPageLayout>
    );
}
