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
        { name: 'About NovaMart', href: '/about' },
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
    { icon: Twitter, href: '#', label: 'Follow us on Twitter' },
    { icon: Facebook, href: '#', label: 'Fan us on Facebook' },
    { icon: Linkedin, href: '#', label: 'Connect with us on LinkedIn' },
    { icon: Youtube, href: '#', label: 'Subscribe to our YouTube channel' },
];

export default function Footer() {
    const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePolicyClick = (key: string) => {
        setActivePolicy(key as PolicyKey);
        setIsModalOpen(true);
    };

    return (
        <footer className="bg-background text-foreground pt-12 md:pt-20 pb-0 overflow-hidden relative">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary to-primary" />
            <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary/5 blur-[80px] md:blur-[120px] rounded-full -mr-32 -mt-32 md:-mr-48 md:-mt-48" />
            <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-primary/5 blur-[80px] md:blur-[120px] rounded-full -ml-32 -mb-32 md:-ml-48 md:-mb-48" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-8 mb-12 md:mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2.5 shadow-xl shadow-black/5 group-hover:scale-105 transition-all duration-500 border border-foreground/[0.03]">
                                <img src="/assets/Novamart.png" alt="NovaMart" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black tracking-tighter text-black leading-none uppercase italic">
                                    NovaMart
                                </span>
                                <span className="text-[10px] font-black text-black uppercase tracking-[0.3em] mt-1 italic">Enterprise Hub</span>
                            </div>
                        </Link>

                        <p className="text-foreground/50 text-sm font-medium leading-relaxed max-w-sm">
                            India's premier B2B2C hub for high-performance home appliances. Connecting verified manufacturers directly to regional dealers with zero-trust escrow governance.
                        </p>

                        <div className="flex items-center gap-4" aria-label="Social media links">
                            {socialLinks.map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-[10px] bg-surface border border-foreground/10 flex items-center justify-center text-foreground/40 hover:bg-black hover:text-background hover:border-black transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[10px] font-black text-foreground/40 uppercase tracking-widest italic">
                                <Mail className="w-4 h-4 text-black" />
                                business@novamart.com
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-black text-foreground/40 uppercase tracking-widest italic">
                                <Phone className="w-4 h-4 text-black" />
                                +91 1800-NOVAMART
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-black text-foreground/40 uppercase tracking-widest italic">
                                <MapPin className="w-4 h-4 text-black" />
                                Mumbai, Maharashtra, India
                            </div>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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
                            <h3 className="text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 md:mb-8 italic underline underline-offset-4">Legal</h3>
                            <ul className="space-y-3 md:space-y-4">
                                {footerLinks.legal.map((link: any) => (
                                    <li key={link.name}>
                                        <button
                                            onClick={() => handlePolicyClick(link.key)}
                                            className="text-[11px] font-black text-foreground/40 hover:text-black transition-colors text-left uppercase tracking-widest italic"
                                        >
                                            {link.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="py-8 border-t border-foreground/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                    <div className="flex items-center gap-4 p-4 rounded-[10px] bg-surface border border-foreground/5 shadow-xl shadow-black/5">
                        <ShieldCheck className="w-8 h-8 text-black shrink-0" />
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-black italic">Escrow Guarded</h4>
                            <p className="text-[10px] text-foreground/40 font-bold italic">100% Payment Protection</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-[10px] bg-surface border border-foreground/5 shadow-xl shadow-black/5">
                        <Zap className="w-8 h-8 text-black shrink-0" />
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-black italic">Fast Logistics</h4>
                            <p className="text-[10px] text-foreground/40 font-bold italic">Fragile-Optimized Shipping</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-[10px] bg-surface border border-foreground/5 shadow-xl shadow-black/5 sm:col-span-2 md:col-span-1">
                        <Globe className="w-8 h-8 text-black shrink-0" />
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-black italic">Global Reach</h4>
                            <p className="text-[10px] text-foreground/40 font-bold italic">Verified Manufacturer Network</p>
                        </div>
                    </div>
                </div>

                {/* Copyright Bar */}
                <div className="pt-8 pb-2 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-[10px] font-bold text-foreground/20 uppercase tracking-widest text-center md:text-left">
                        <span>© 2026 NovaMart B2B2C Connection Platform.</span>
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

