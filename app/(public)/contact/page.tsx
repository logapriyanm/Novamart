'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Send, Globe, Github, Twitter } from 'lucide-react';

const contactMethods = [
    {
        icon: Mail,
        title: "Email Support",
        value: "support@novamart.com",
        description: "Standard inquiries within 24h",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        icon: MessageSquare,
        title: "Live Chat",
        value: "Dashboard Messenger",
        description: "Instant help for active users",
        color: "text-[#2772A0]",
        bg: "bg-[#2772A0]/10"
    },
    {
        icon: Phone,
        title: "Global Hotline",
        value: "+1 (800) NOVAMART",
        description: "Mon-Fri, 9am - 6pm EST",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    }
];

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20 overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2772A0]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2772A0]/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2772A0]/10 border border-[#2772A0]/20 text-[10px] font-black uppercase tracking-widest text-[#2772A0] mb-6"
                    >
                        <Globe className="w-3 h-3" />
                        Global Support
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-black text-[#1E293B] mb-6 tracking-tight leading-tight"
                    >
                        Let's Talk <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2772A0] to-[#1E5F86]">Growth</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg text-[#1E293B]/60 font-medium italic"
                    >
                        Have questions about our zero-trust platform? Our specialists are ready to help you navigate the future of commerce.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                            {contactMethods.map((method, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-[#2772A0]/10 group hover:border-[#2772A0]/30 transition-all"
                                >
                                    <div className={`w-12 h-12 rounded-2xl ${method.bg} ${method.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <method.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-wider mb-2">{method.title}</h3>
                                    <p className="text-lg font-black text-[#2772A0] mb-2">{method.value}</p>
                                    <p className="text-xs text-[#1E293B]/40 font-bold">{method.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="bg-[#2772A0] p-10 rounded-[2.5rem] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
                            <h3 className="text-sm font-black uppercase tracking-widest mb-8 relative z-10 opacity-70">Follow Progress</h3>
                            <div className="flex gap-4 relative z-10">
                                {[Twitter, Github, Globe].map((Icon, i) => (
                                    <button key={i} className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-[#2772A0] transition-all">
                                        <Icon className="w-6 h-6" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-7 bg-white/80 backdrop-blur-2xl p-10 lg:p-14 rounded-[3.5rem] border border-[#2772A0]/10 shadow-2xl shadow-[#2772A0]/5"
                    >
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#2772A0]/60 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full bg-white/40 border border-[#2772A0]/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#2772A0]/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#2772A0]/60 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@company.com"
                                        className="w-full bg-white/40 border border-[#2772A0]/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#2772A0]/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[#2772A0]/60 uppercase tracking-widest ml-1">Subject</label>
                                <select className="w-full bg-white/40 border border-[#2772A0]/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#2772A0]/50 transition-all appearance-none">
                                    <option>Partnership Inquiry</option>
                                    <option>Support Request</option>
                                    <option>Manufacturer Verification</option>
                                    <option>Dealer Application</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[#2772A0]/60 uppercase tracking-widest ml-1">Your Message</label>
                                <textarea
                                    rows={5}
                                    placeholder="How can our specialists assist you today?"
                                    className="w-full bg-white/40 border border-[#2772A0]/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#2772A0]/50 transition-all"
                                ></textarea>
                            </div>

                            <button className="w-full py-5 bg-[#2772A0] text-white font-black text-sm rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#2772A0]/20 flex items-center justify-center gap-3 uppercase tracking-widest">
                                <Send className="w-4 h-4" />
                                Deploy Inquiry
                            </button>
                        </form>

                        <div className="mt-12 flex items-center gap-4 text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-widest justify-center">
                            <MapPin className="w-3 h-3" />
                            Global HQ: One Trade Center, Tokyo, Japan
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
