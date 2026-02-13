'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaSitemap, FaLink, FaExternalLinkAlt, FaCompass, FaMapSigns } from 'react-icons/fa';
import Link from 'next/link';
import FooterPageLayout from '@/client/components/layout/FooterPageLayout';

const sitemapData = [
    {
        title: "Platform",
        links: [
            { name: "About NovaMart", href: "/about" },
            { name: "Product Catalog", href: "/products" },
            { name: "Verified Brands", href: "/brands" },
            { name: "How it Works", href: "/guides" }
        ]
    },
    {
        title: "Business Functions",
        links: [
            { name: "Manufacturer Portal", href: "/auth/login?role=MANUFACTURER" },
            { name: "Seller Registration", href: "/auth/register?role=SELLER" },
            { name: "Escrow Governance", href: "/guides/escrow" },
            { name: "Bulk Liquidation", href: "/products" }
        ]
    },
    {
        title: "Support Hub",
        links: [
            { name: "Help Center", href: "/support" },
            { name: "Contact Support", href: "/contact" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Privacy Policy", href: "/privacy" }
        ]
    }
];

const sidebarSections = [
    {
        title: "Quick Navigation",
        description: "Need help finding something specific?",
        icon: FaCompass,
        items: [
            { title: "Search Products", description: "Use the top navigation bar to find specific appliances." },
            { title: "Merchant Dashboard", description: "Login to access your specific role tools." }
        ]
    },
    {
        title: "System Status",
        description: "Current platform health.",
        icon: FaMapSigns,
        items: [
            { title: "Network Status: Online", description: "All systems operational across all regions." }
        ]
    }
];

export default function SiteIndexPage() {
    return (
        <FooterPageLayout
            sidebarTitle="Nav Assist"
            sidebarDescription="Sitemap Overview"
            sidebarWelcome="Use this structured index to navigate all dimensions of the NovaMart enterprise hub."
            sidebarSections={sidebarSections}
        >
            <div className="space-y-16 pt-4">
                {/* Hero */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6"
                    >
                        <FaSitemap className="w-2.5 h-2.5" />
                        Platform Index
                    </motion.div>
                    <h1 className="text-5xl font-black text-slate-900 leading-tight italic uppercase tracking-tighter">
                        Global <br />
                        <span className="text-slate-400">Directory</span>
                    </h1>
                </div>

                {/* Sitemap Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {sitemapData.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-6 italic underline underline-offset-8">
                                {section.title}
                            </h3>
                            <ul className="space-y-4">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-[10px] hover:border-slate-900 transition-all shadow-sm"
                                        >
                                            <span className="text-lg font-black text-slate-900 italic uppercase tracking-tight group-hover:translate-x-1 transition-transform">
                                                {link.name}
                                            </span>
                                            <FaExternalLinkAlt className="w-3 h-3 text-slate-200 group-hover:text-slate-900 transition-colors" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Graphic/Note */}
                <div className="p-12 border-2 border-dashed border-slate-200 rounded-[10px] text-center">
                    <p className="text-sm text-slate-400 font-bold italic uppercase tracking-widest">
                        End of Platform Index • v2.0
                    </p>
                </div>
            </div>
        </FooterPageLayout>
    );
}
