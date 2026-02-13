'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaShieldAlt, FaAward, FaBuilding, FaCertificate, FaHandshake } from 'react-icons/fa';
import FooterPageLayout from '@/client/components/layout/FooterPageLayout';

const manufacturers = [
    { name: "ElectraFlow Industries", category: "Washing Machines", verified: true, rating: 4.9 },
    { name: "ThermoCool Dynamics", category: "Refrigerators", verified: true, rating: 4.8 },
    { name: "OptiVision Tech", category: "Smart TVs", verified: true, rating: 4.7 },
    { name: "PureAir Solutions", category: "Air Conditioners", verified: true, rating: 4.9 },
    { name: "HydroBlast Systems", category: "Dishwashers", verified: true, rating: 4.6 }
];

const sidebarSections = [
    {
        title: "Trust Seals",
        description: "Our manufacturers undergo rigorous auditing.",
        icon: FaShieldAlt,
        items: [
            { title: "BIS Certified", description: "Bureau of Indian Standards compliance." },
            { title: "ISO 9001:2015", description: "International Quality Management standards." },
            { title: "Energy Star Rated", description: "Verified energy efficient production." }
        ]
    },
    {
        title: "Dealer Benefits",
        description: "Why source from verified brands?",
        icon: FaAward,
        items: [
            { title: "Direct Warranties", description: "Manufacturer-backed service agreements." },
            { title: "Escrow Safety", description: "Payments secured until goods verified." },
            { title: "Priority Allocation", description: "Exclusive access to new product launches." }
        ]
    }
];

export default function BrandsPage() {
    return (
        <FooterPageLayout
            sidebarTitle="Verification Hub"
            sidebarDescription="Manufacturer Standards"
            sidebarWelcome="All brands on our platform are manually audited for production quality and financial stability."
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
                        <FaCertificate className="w-3 h-3" />
                        Verification Program
                    </motion.div>
                    <h1 className="text-5xl font-black text-foreground leading-tight italic uppercase tracking-tighter">
                        Verified <br />
                        <span className="text-primary">Manufacturer Network</span>
                    </h1>
                    <p className="mt-6 text-lg text-slate-500 font-medium italic max-w-2xl leading-relaxed">
                        NovaMart connects you directly to the source. Our Verified Brand program ensures you only deal with manufacturers who meet our strict 50-point quality audit.
                    </p>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {manufacturers.map((brand, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white border border-slate-100 rounded-[10px] p-6 flex flex-col md:flex-row items-center justify-between shadow-sm hover:border-blue-600 transition-all cursor-default"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-slate-50 rounded-[10px] flex items-center justify-center border border-slate-100 italic font-black text-slate-300">
                                    {brand.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tight">{brand.name}</h3>
                                        {brand.verified && <FaCheckCircle className="text-blue-600 w-4 h-4" />}
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{brand.category}</p>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex gap-8 items-center">
                                <div className="text-right">
                                    <div className="text-sm font-black text-slate-900">{brand.rating} / 5.0</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Trust Score</div>
                                </div>
                                <button className="px-6 py-2 border border-slate-200 rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                    View Catalog
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Info */}
                <div className="bg-slate-900 rounded-[10px] p-12 text-white relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -mr-32 -mb-32" />
                    <div className="max-w-xl relative z-10">
                        <h2 className="text-3xl font-black italic uppercase mb-4 tracking-tighter">The NovaMart Audit</h2>
                        <p className="text-slate-400 font-medium italic leading-relaxed text-sm mb-8">
                            Our audit covers production capacity, quality control protocols, financial solvency, and historical fulfillment accuracy. We don't just list brands; we vouch for them.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <FaBuilding className="w-5 h-5 text-blue-400 mt-1" />
                                <div>
                                    <h4 className="font-bold text-sm">Site Inspection</h4>
                                    <p className="text-[10px] text-slate-500 italic">Physical factory audits every 12 months.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaHandshake className="w-5 h-5 text-blue-400 mt-1" />
                                <div>
                                    <h4 className="font-bold text-sm">Escrow-Ready</h4>
                                    <p className="text-[10px] text-slate-500 italic">Pre-verified financial compliance.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FooterPageLayout>
    );
}
