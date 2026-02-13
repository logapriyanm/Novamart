'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaBox, FaTruck, FaShoppingCart, FaShieldAlt, FaQuestionCircle, FaUserCheck, FaBriefcase } from 'react-icons/fa';
import FooterPageLayout from '@/client/components/layout/FooterPageLayout';

const steps = [
    {
        title: "Manufacturer Listing",
        description: "Verified manufacturers list their inventory with technical specifications and bulk pricing tiers.",
        icon: FaBox,
        color: "bg-slate-900",
        text: "text-white"
    },
    {
        title: "Dealer Sourcing",
        description: "Regional dealers browse catalogs and place bulk orders or request custom allocations.",
        icon: FaBriefcase,
        color: "bg-primary",
        text: "text-primary-foreground"
    },
    {
        title: "Escrow Protection",
        description: "Payment is secured in NovaMart's zero-trust escrow layer until delivery is confirmed.",
        icon: FaShieldAlt,
        color: "bg-emerald-600",
        text: "text-white"
    },
    {
        title: "Distribution",
        description: "Verified logistics partners move goods from factory to dealer showrooms.",
        icon: FaTruck,
        color: "bg-amber-600",
        text: "text-white"
    },
    {
        title: "Customer Sale",
        description: "Retail customers purchase from localized dealers with manufacturer-backed direct warranties.",
        icon: FaShoppingCart,
        color: "bg-foreground",
        text: "text-secondary"
    }
];

const sidebarSections = [
    {
        title: "Quick FAQ",
        description: "Common questions about the connection cycle.",
        icon: FaQuestionCircle,
        items: [
            { title: "Who can join?", description: "Registered manufacturers and GST-compliant dealers." },
            { title: "Escrow duration?", description: "Funds released T+3 days after delivery confirmation." },
            { title: "Logistics?", description: "Managed via NovaMart's fragile-optimized network." }
        ]
    },
    {
        title: "User Roles",
        description: "How the platform adapts to you.",
        icon: FaUserCheck,
        items: [
            { title: "Manufacturers", description: "Direct supply-chain dashboard." },
            { title: "Dealers", description: "Inventory and retail management tools." },
            { title: "Customers", description: "Verified retail marketplace." }
        ]
    }
];

export default function HowItWorksPage() {
    return (
        <FooterPageLayout
            sidebarTitle="Guide Index"
            sidebarDescription="Platform Workflows"
            sidebarWelcome="NovaMart is more than a marketplace; it's a governance layer for synchronized industrial trade."
            sidebarSections={sidebarSections}
        >
            <div className="space-y-16 pt-4">
                {/* Hero */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary mb-6"
                    >
                        <FaPlay className="w-2.5 h-2.5" />
                        Platform Workflow
                    </motion.div>
                    <h1 className="text-5xl font-black text-foreground leading-tight italic uppercase tracking-tighter">
                        The Hub <br />
                        <span className="text-primary">Sync Mechanism</span>
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground font-medium italic max-w-2xl leading-relaxed">
                        NovaMart orchestrates a seamless flow between production and consumption. Our platform ensures that visibility, trust, and capital are synchronized at every step.
                    </p>
                </div>

                {/* Steps List */}
                <div className="space-y-6">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-border rounded-[10px] p-8 flex items-start gap-8 shadow-sm group hover:border-foreground transition-all"
                        >
                            <div className="flex flex-col items-center shrink-0">
                                <div className={`w-14 h-14 ${step.color} ${step.text} rounded-[10px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <step.icon className="w-6 h-6" />
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="w-px h-12 bg-border mt-4" />
                                )}
                            </div>
                            <div className="pt-2">
                                <h3 className="text-xl font-black text-foreground italic uppercase tracking-tight mb-2">
                                    Step 0{i + 1}: {step.title}
                                </h3>
                                <p className="text-muted-foreground font-medium italic leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Final CTA/Note */}
                <div className="bg-primary rounded-[10px] p-12 text-primary-foreground text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32" />
                    <h2 className="text-3xl font-black italic uppercase mb-6 relative z-10">Start Transacting Securely</h2>
                    <button className="px-10 py-5 bg-white text-primary font-black text-sm rounded-[10px] hover:scale-105 transition-all shadow-xl uppercase tracking-widest relative z-10">
                        Register Your Business
                    </button>
                </div>
            </div>
        </FooterPageLayout>
    );
}
