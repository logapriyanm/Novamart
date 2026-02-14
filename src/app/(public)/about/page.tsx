'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaBullseye as Target, FaEye as Eye, FaShieldAlt as Shield, FaUsers as Users, FaGlobe as Globe, FaBolt as Zap, FaHistory, FaRocket, FaHandshake } from 'react-icons/fa';
import FooterPageLayout from '@/client/components/layout/FooterPageLayout';

const values = [
    {
        title: "Trust First",
        description: "Zero-trust verification for every manufacturer and dealer in our network.",
        icon: Shield,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        title: "Unified Platform",
        description: "Seamless synchronization from factory floor to retail storefront.",
        icon: Zap,
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
    {
        title: "Global Reach",
        description: "Expanding market access for localized businesses through digital transformation.",
        icon: Globe,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        title: "People Centric",
        description: "Building tools that empower human decision-making and sustainable growth.",
        icon: Users,
        color: "text-[#067FF9]",
        bg: "bg-[#067FF9]/10"
    }
];

const sidebarSections = [
    {
        title: "Impact Metrics",
        description: "Our growth is measured by the success of our partners.",
        icon: FaRocket,
        items: [
            { title: "250+ Verified Manufacturers", description: "Direct supply chain relationships." },
            { title: "5000+ Active Dealers", description: "Across 14 regional hubs." },
            { title: "₹100Cr+ Escrow Secured", description: "Guaranteed transaction safety." }
        ]
    },
    {
        title: "Corporate Vision",
        description: "Defining the standard for industrial B2B trade.",
        icon: FaHistory,
        items: [
            { title: "Zero-Trust Protocol", description: "No transaction without verification." },
            { title: "Direct-to-Dealer", description: "Reducing friction in asset allocation." },
            { title: "Compliance First", description: "Fully GST and BIS integrated ecosystem." }
        ]
    },
    {
        title: "Join the Network",
        description: "Become a part of India's fastest growing hub.",
        icon: FaHandshake,
        items: [
            { title: "Manufacturer Onboarding", description: "Get your factory verified today." },
            { title: "Dealer Expansion", description: "Access exclusive regional inventory." }
        ]
    }
];

export default function AboutPage() {
    return (
        <FooterPageLayout
            sidebarTitle="Corporate Hub"
            sidebarDescription="NovaMart Insights"
            sidebarWelcome="Welcome to the core of our platform. Here we define our standards for globalized industrial commerce."
            sidebarSections={sidebarSections}
        >
            <div className="space-y-16 sm:space-y-24 pt-4">
                {/* Hero Section */}
                <div className="text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-black/10 border border-black/20 text-sm font-black tracking-widest text-black mb-6"
                    >
                        <Target className="w-3 h-3" />
                        Our Mission
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-5xl lg:text-7xl font-black text-foreground leading-[1.1] tracking-tight mb-8 italic uppercase"
                    >
                        Revolutionizing <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-foreground/60">Supply Chain Integrity</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl text-lg text-foreground/60 font-medium italic leading-relaxed"
                    >
                        NovaMart is the world's first B2B2C connection platform built on a zero-trust governance model,
                        ensuring that every transaction from manufacturer to consumer is audited, secure, and transparent.
                    </motion.p>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white border border-slate-100 rounded-[10px] p-6 xs:p-10 lg:p-12 shadow-sm"
                    >
                        <div className="w-16 h-16 rounded-[10px] bg-slate-900 flex items-center justify-center text-white mb-8 shadow-2xl shadow-black/20">
                            <Target className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-foreground mb-6 italic uppercase underline-offset-8">The Vision</h2>
                        <p className="text-foreground/70 leading-relaxed font-medium mb-8 italic text-lg">
                            We envision a global marketplace where friction is eliminated through intelligent automation and verified trust. By bridging the gap between factory-floor precision and retail-shelf convenience, we empower businesses of all sizes to scale without borders.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white border border-slate-100 rounded-[10px] p-6 xs:p-10 lg:p-12 shadow-sm"
                    >
                        <div className="w-16 h-16 rounded-[10px] bg-slate-50 flex items-center justify-center text-slate-900 mb-8 border border-slate-200">
                            <Eye className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-foreground mb-6 italic uppercase">Transparency Matters</h2>
                        <p className="text-foreground/70 leading-relaxed font-medium italic text-lg">
                            Our proprietary Ledger Integrity Protocol ensures that every signal—from consumer intent to factory fulfillment—is recorded and verified. We don't just facilitate trade; we provide the governance layer for the future of commerce.
                        </p>
                    </motion.div>
                </div>

                {/* Values Section */}
                <div>
                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-foreground mb-4 italic uppercase">Core Values</h2>
                        <p className="text-sm font-bold text-black tracking-[0.3em]">The Pillars of our Network</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {values.map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-[10px] border border-slate-100 group hover:border-slate-900 transition-all shadow-sm"
                            >
                                <div className={`w-12 h-12 rounded-[10px] ${value.bg} ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <value.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-foreground mb-3 uppercase italic tracking-tighter">{value.title}</h3>
                                <p className="text-sm text-foreground/60 font-medium leading-relaxed italic">
                                    "{value.description}"
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-slate-900 rounded-[10px] p-8 xs:p-12 lg:p-16 text-center relative overflow-hidden shadow-2xl shadow-black/40"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -mr-32 -mt-32" />
                    <h2 className="text-2xl sm:text-4xl font-black text-white mb-8 relative z-10 leading-tight italic uppercase">Ready to build the <br /> future of trade?</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <button className="px-10 py-5 bg-white text-slate-900 font-black text-sm rounded-[10px] hover:scale-105 transition-all shadow-xl">
                            Join the Network
                        </button>
                        <button className="px-10 py-5 bg-white/10 text-white font-black text-sm rounded-[10px] border border-white/20 hover:bg-white/20 transition-all backdrop-blur-md">
                            Contact Us
                        </button>
                    </div>
                </motion.div>
            </div>
        </FooterPageLayout>
    );
}

