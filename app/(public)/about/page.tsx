'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Shield, Users, Globe, Zap } from 'lucide-react';

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
        color: "text-[#2772A0]",
        bg: "bg-[#2772A0]/10"
    }
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#2772A0]/30 overflow-hidden pt-24 pb-20">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2772A0]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2772A0]/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2772A0]/10 border border-[#2772A0]/20 text-[10px] font-black uppercase tracking-widest text-[#2772A0] mb-6"
                    >
                        <Target className="w-3 h-3" />
                        Our Mission
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-black text-[#1E293B] leading-[1.1] tracking-tight mb-8"
                    >
                        Revolutionizing <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2772A0] to-[#1E5F86]">Supply Chain Integrity</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg text-[#1E293B]/60 font-medium"
                    >
                        Novamart is the world's first B2B2C connection platform built on a zero-trust governance model,
                        ensuring that every transaction from manufacturer to consumer is audited, secure, and transparent.
                    </motion.p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/40 backdrop-blur-xl border border-[#2772A0]/10 rounded-[3rem] p-10 lg:p-16"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-[#2772A0] flex items-center justify-center text-white mb-8 shadow-2xl shadow-[#2772A0]/20">
                            <Target className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-[#1E293B] mb-6">The Vision</h2>
                        <p className="text-[#1E293B]/70 leading-relaxed font-medium mb-8">
                            We envision a global marketplace where friction is eliminated through intelligent automation and verified trust. By bridging the gap between factory-floor precision and retail-shelf convenience, we empower businesses of all sizes to scale without borders.
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            {[
                                { label: "Network Growth", value: "250%" },
                                { label: "Audit Success", value: "99.9%" }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-4xl font-black text-[#2772A0]">{stat.value}</span>
                                    <span className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-widest">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/40 backdrop-blur-xl border border-[#2772A0]/10 rounded-[3rem] p-10 lg:p-16 flex flex-col justify-center"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-[#2772A0]/5 flex items-center justify-center text-[#2772A0] mb-8 border border-[#2772A0]/10">
                            <Eye className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-[#1E293B] mb-6">Transparency Matters</h2>
                        <p className="text-[#1E293B]/70 leading-relaxed font-medium">
                            Our proprietary Ledger Integrity Protocol ensures that every signal—from consumer intent to factory fulfillment—is recorded and verified. We don't just facilitate trade; we provide the governance layer for the future of commerce.
                        </p>
                    </motion.div>
                </div>

                {/* Values Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-[#1E293B] mb-4">Core Values</h2>
                    <p className="text-[10px] font-bold text-[#2772A0] uppercase tracking-[0.3em]">The Pillars of our Network</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                    {values.map((value, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white/60 p-8 rounded-[2.5rem] border border-[#2772A0]/5 group hover:border-[#2772A0]/20 transition-all"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${value.bg} ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <value.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-[#1E293B] mb-3">{value.title}</h3>
                            <p className="text-sm text-[#1E293B]/60 font-medium leading-relaxed italic">
                                "{value.description}"
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-[#2772A0] rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-[#2772A0]/40"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent)]" />
                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 relative z-10 leading-tight">Ready to build the <br /> future of trade?</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <button className="px-10 py-5 bg-white text-[#2772A0] font-black text-sm rounded-2xl hover:scale-105 transition-all shadow-xl uppercase tracking-widest">
                            Join the Network
                        </button>
                        <button className="px-10 py-5 bg-white/10 text-white font-black text-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all uppercase tracking-widest backdrop-blur-md">
                            Contact Us
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
