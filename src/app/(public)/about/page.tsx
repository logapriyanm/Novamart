'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaBullseye as Target, FaEye as Eye, FaShieldAlt as Shield, FaUsers as Users, FaGlobe as Globe, FaBolt as Zap } from 'react-icons/fa';

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
        color: "text-[#10367D]",
        bg: "bg-[#10367D]/10"
    }
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-black/30 overflow-hidden pt-24 pb-20">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-black/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-black/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-black/10 border border-black/20 text-[10px] font-black uppercase tracking-widest text-black mb-6"
                    >
                        <Target className="w-3 h-3" />
                        Our Mission
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-black text-foreground leading-[1.1] tracking-tight mb-8 italic uppercase"
                    >
                        Revolutionizing <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-foreground/60">Supply Chain Integrity</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg text-foreground/60 font-medium italic"
                    >
                        NovaMart is the world's first B2B2C connection platform built on a zero-trust governance model,
                        ensuring that every transaction from manufacturer to consumer is audited, secure, and transparent.
                    </motion.p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/40 backdrop-blur-xl border border-black/10 rounded-[10px] p-10 lg:p-16"
                    >
                        <div className="w-16 h-16 rounded-[5px] bg-black flex items-center justify-center text-white mb-8 shadow-2xl shadow-black/20">
                            <Target className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-foreground mb-6 italic uppercase underline-offset-8">The Vision</h2>
                        <p className="text-foreground/70 leading-relaxed font-medium mb-8">
                            We envision a global marketplace where friction is eliminated through intelligent automation and verified trust. By bridging the gap between factory-floor precision and retail-shelf convenience, we empower businesses of all sizes to scale without borders.
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            {[
                                { label: "Network Growth", value: "250%" },
                                { label: "Audit Success", value: "99.9%" }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-4xl font-black text-black">{stat.value}</span>
                                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/40 backdrop-blur-xl border border-black/10 rounded-[10px] p-10 lg:p-16 flex flex-col justify-center"
                    >
                        <div className="w-16 h-16 rounded-[5px] bg-black/5 flex items-center justify-center text-black mb-8 border border-black/10">
                            <Eye className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-foreground mb-6 italic uppercase">Transparency Matters</h2>
                        <p className="text-foreground/70 leading-relaxed font-medium">
                            Our proprietary Ledger Integrity Protocol ensures that every signal—from consumer intent to factory fulfillment—is recorded and verified. We don't just facilitate trade; we provide the governance layer for the future of commerce.
                        </p>
                    </motion.div>
                </div>

                {/* Values Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-foreground mb-4 italic uppercase">Core Values</h2>
                    <p className="text-[10px] font-bold text-black uppercase tracking-[0.3em]">The Pillars of our Network</p>
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
                            className="bg-white/60 p-8 rounded-[10px] border border-black/5 group hover:border-black/20 transition-all"
                        >
                            <div className={`w-12 h-12 rounded-[5px] ${value.bg} ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <value.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-foreground mb-3 uppercase italic tracking-tighter">{value.title}</h3>
                            <p className="text-sm text-foreground/60 font-medium leading-relaxed italic">
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
                    className="bg-black rounded-[10px] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-black/40"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent)]" />
                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 relative z-10 leading-tight italic uppercase">Ready to build the <br /> future of trade?</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <button className="px-10 py-5 bg-white text-black font-black text-sm rounded-[5px] hover:scale-105 transition-all shadow-xl uppercase tracking-widest">
                            Join the Network
                        </button>
                        <button className="px-10 py-5 bg-white/10 text-white font-black text-sm rounded-[5px] border border-white/20 hover:bg-white/20 transition-all uppercase tracking-widest backdrop-blur-md">
                            Contact Us
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

