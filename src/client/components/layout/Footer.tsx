'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PolicyModal } from '../ui/PolicyModal';
import { PolicyKey } from '../../data/sitePolicies';
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
        { name: 'Manufacturer Login', href: '/auth/login?role=MANUFACTURER' },
        { name: 'Dealer Registration', href: '/auth/register?role=DEALER' },
        { name: 'Appliance Verification', href: '/guides/verification' },
        { name: 'Bulk Ordering', href: '/products' },
        { name: 'Escrow Ledger', href: '/guides/escrow' },
    ],
    support: [
        { name: 'Help Center', href: '/support' },
        { name: 'Contact Us', key: 'contact-us' },
        { name: 'Report an Issue', key: 'report-an-issue' },
        { name: 'Dispute Resolution', key: 'dispute-resolution' },
        { name: 'Service SLA', key: 'service-sla' },
    ],
    legal: [
        { name: 'Privacy Policy', key: 'privacy-policy' },
        { name: 'Terms of Service', key: 'terms-of-service' },
        { name: 'Refund Policy', key: 'refund-policy' },
        { name: 'Compliance', key: 'compliance' },
    ]
};

const socialLinks = [
    { icon: Twitter, href: '#' },
    { icon: Facebook, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Youtube, href: '#' },
];

export default function Footer() {
    const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePolicyClick = (key: string) => {
        setActivePolicy(key as PolicyKey);
        setIsModalOpen(true);
    };

    return (
        <footer className="bg-background text-foreground pt-20 pb-0 overflow-hidden relative">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary to-primary" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -ml-48 -mb-48" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-2xl shadow-primary/10 group-hover:scale-105 transition-all duration-500 border border-foreground/[0.03]">
                                <img src="/logo.png" alt="Novamart" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black tracking-tighter text-foreground leading-none">
                                    Novamart
                                </span>
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1">Enterprise Hub</span>
                            </div>
                        </Link>

                        <p className="text-foreground/50 text-sm font-medium leading-relaxed max-w-sm">
                            India's premier B2B2C hub for high-performance home appliances. Connecting verified manufacturers directly to regional dealers with zero-trust escrow governance.
                        </p>

                        <div className="flex items-center gap-4">
                            {socialLinks.map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-xl bg-surface border border-foreground/10 flex items-center justify-center text-foreground/40 hover:bg-primary hover:text-background hover:border-primary transition-all"
                                >
                                    <social.icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-xs font-bold text-foreground/40 uppercase tracking-widest">
                                <Mail className="w-4 h-4 text-primary" />
                                business@novamart.com
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-foreground/40 uppercase tracking-widest">
                                <Phone className="w-4 h-4 text-primary" />
                                +91 1800-NOVAMART
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-foreground/40 uppercase tracking-widest">
                                <MapPin className="w-4 h-4 text-primary" />
                                Mumbai, Maharashtra, India
                            </div>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 md:mb-8">Platform</h3>
                            <ul className="space-y-3 md:space-y-4">
                                {footerLinks.platform.map((link: any) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm font-bold text-foreground/40 hover:text-primary transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 md:mb-8">Business</h3>
                            <ul className="space-y-3 md:space-y-4">
                                {footerLinks.business.map((link: any) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-sm font-bold text-foreground/40 hover:text-primary transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-foreground/70 uppercase tracking-[0.2em] mb-4 md:mb-8">Support</h3>
                            <ul className="space-y-3 md:space-y-4">
                                {footerLinks.support.map((link: any) => (
                                    <li key={link.name}>
                                        {link.href ? (
                                            <Link href={link.href} className="text-sm font-bold text-foreground/40 hover:text-primary transition-colors">
                                                {link.name}
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => handlePolicyClick(link.key)}
                                                className="text-sm font-bold text-foreground/40 hover:text-primary transition-colors text-left"
                                            >
                                                {link.name}
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-foreground/70 uppercase tracking-[0.2em] mb-4 md:mb-8">Legal</h3>
                            <ul className="space-y-3 md:space-y-4">
                                {footerLinks.legal.map((link: any) => (
                                    <li key={link.name}>
                                        <button
                                            onClick={() => handlePolicyClick(link.key)}
                                            className="text-sm font-bold text-foreground/40 hover:text-primary transition-colors text-left"
                                        >
                                            {link.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="py-8 border-t border-foreground/5 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-foreground/5">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-foreground">Escrow Guarded</h4>
                            <p className="text-[10px] text-foreground/40 font-bold">100% Payment Protection</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-foreground/5">
                        <Zap className="w-8 h-8 text-primary" />
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-foreground">Fast Logistics</h4>
                            <p className="text-[10px] text-foreground/40 font-bold">Fragile-Optimized Shipping</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-foreground/5">
                        <Globe className="w-8 h-8 text-primary" />
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-foreground">Global Reach</h4>
                            <p className="text-[10px] text-foreground/40 font-bold">Verified Manufacturer Network</p>
                        </div>
                    </div>
                </div>

                {/* Copyright Bar */}
                <div className="pt-8 pb-2 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-[10px] font-bold text-foreground/20 uppercase tracking-widest text-center md:text-left">
                        <span>© 2026 Novamart B2B2C Connection Platform.</span>
                    </div>
                </div>
            </div>

            <PolicyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                policyKey={activePolicy}
            />
        </footer>
    );
}

