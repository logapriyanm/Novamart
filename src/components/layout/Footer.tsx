'use client';

import React from 'react';
import Link from 'next/link';
import {
    FaFacebook as Facebook,
    FaTwitter as Twitter,
    FaLinkedin as Linkedin,
    FaYoutube as Youtube,
    FaShieldAlt as ShieldCheck,
    FaGlobe as Globe,
    FaBolt as Zap,
    FaHeart as Heart,
    FaEnvelope as Mail,
    FaPhoneAlt as Phone,
    FaMapMarkerAlt as MapPin
} from 'react-icons/fa';

const footerLinks = {
    platform: [
        { name: 'About Novamart', href: '/about' },
        { name: 'Categories', href: '/categories' },
        { name: 'Verified Brands', href: '/brands' },
        { name: 'How it Works', href: '/guides' },
        { name: 'Sitemap', href: '/sitemap' },
    ],
    business: [
        { name: 'Manufacturer Login', href: '/auth/login' },
        { name: 'Dealer Registration', href: '/auth/register/dealer' },
        { name: 'Appliance Verification', href: '/guides/verification' },
        { name: 'Bulk Ordering', href: '/products' },
        { name: 'Escrow Ledger', href: '/guides/escrow' },
    ],
    support: [
        { name: 'Help Center', href: '/contact' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Report an Issue', href: '/contact' },
        { name: 'Dispute Resolution', href: '/guides/disputes' },
        { name: 'Service SLA', href: '/terms' },
    ],
    legal: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Refund Policy', href: '/refund-policy' },
        { name: 'Compliance', href: '/terms' },
    ]
};

const socialLinks = [
    { icon: Twitter, href: '#' },
    { icon: Facebook, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Youtube, href: '#' },
];

export default function Footer() {
    return (
        <footer className="bg-[#101827] text-white pt-20 pb-10 overflow-hidden relative">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2772A0] via-[#2772A0] to-[#2772A0]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#2772A0]/5 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2772A0]/5 blur-[120px] rounded-full -ml-48 -mb-48" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2.5 shadow-xl shadow-white/5 group-hover:scale-110 transition-transform">
                                <img src="/logo.png" alt="Novamart" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-3xl font-black tracking-tighter">
                                Novamart<span className="text-[#2772A0] text-[10px] align-top ml-1">®</span>
                            </span>
                        </Link>

                        <p className="text-white/50 text-sm font-medium leading-relaxed max-w-sm">
                            India's premier B2B2C hub for high-performance home appliances. Connecting verified manufacturers directly to regional dealers with zero-trust escrow governance.
                        </p>

                        <div className="flex items-center gap-4">
                            {socialLinks.map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-[#2772A0] hover:text-white hover:border-[#2772A0] transition-all"
                                >
                                    <social.icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>

                        {/* Contact Info Pills */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-xs font-bold text-white/40 uppercase tracking-widest">
                                <Mail className="w-4 h-4 text-[#2772A0]" />
                                business@novamart.com
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-white/40 uppercase tracking-widest">
                                <Phone className="w-4 h-4 text-[#2772A0]" />
                                +91 1800-NOVAMART
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-white/40 uppercase tracking-widest">
                                <MapPin className="w-4 h-4 text-[#2772A0]" />
                                Mumbai, Maharashtra, India
                            </div>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xs font-black text-[#2772A0] uppercase tracking-[0.2em] mb-8">Platform</h3>
                            <ul className="space-y-4">
                                {footerLinks.platform.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm font-bold text-white/40 hover:text-white transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-[#2772A0] uppercase tracking-[0.2em] mb-8">Business</h3>
                            <ul className="space-y-4">
                                {footerLinks.business.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm font-bold text-white/40 hover:text-white transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-white/70 uppercase tracking-[0.2em] mb-8">Support</h3>
                            <ul className="space-y-4">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm font-bold text-white/40 hover:text-white transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-white/70 uppercase tracking-[0.2em] mb-8">Legal</h3>
                            <ul className="space-y-4">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm font-bold text-white/40 hover:text-white transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Trust Indicators Bar */}
                <div className="py-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <ShieldCheck className="w-8 h-8 text-[#2772A0]" />
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-white">Escrow Guarded</h4>
                            <p className="text-[10px] text-white/40 font-bold">100% Payment Protection</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <Zap className="w-8 h-8 text-[#2772A0]" />
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-white">Fast Logistics</h4>
                            <p className="text-[10px] text-white/40 font-bold">Fragile-Optimized Shipping</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <Globe className="w-8 h-8 text-[#2772A0]" />
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-white">Global Reach</h4>
                            <p className="text-[10px] text-white/40 font-bold">Verified Manufacturer Network</p>
                        </div>
                    </div>
                </div>

                {/* Copyright Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-widest text-center md:text-left">
                        <span>© 2026 Novamart B2B2C Connection Platform.</span>
                        <span className="hidden md:inline">|</span>
                        <span>Built for Industrial Excellence in Mumbai, India</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                            Secure Transact
                            <div className="w-1 h-1 bg-[#2772A0] rounded-full animate-pulse" />
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                        Made with <Heart className="w-3 h-3 text-[#2772A0] fill-current mx-1 inline" /> for Bharat
                    </div>
                </div>
            </div>
        </footer>
    );
}
