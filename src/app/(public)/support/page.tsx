'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch,
    FaShoppingCart,
    FaStore,
    FaIndustry,
    FaChevronDown,
    FaChevronRight,
    FaComments,
    FaTicketAlt,
    FaTruck,
    FaMoneyBillWave,
    FaChartLine,
    FaBullhorn,
    FaShieldAlt
} from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// FAQ Data
const faqs = [
    {
        question: "How secure is the NovaMart Escrow service?",
        answer: "Our escrow service uses military-grade encryption and multi-sig verification. Funds are only released once both parties confirm delivery and inspection of goods. We partner with top-tier financial institutions to ensure your capital is safe throughout the transaction."
    },
    {
        question: "What are the requirements for Account Verification?",
        answer: "To ensure a trusted marketplace, we require valid business registration documents (GST/PAN), proof of address, and active bank account details. Verification typically takes 24-48 hours once all documents are submitted."
    },
    {
        question: "How do I track bulk shipments from a manufacturer?",
        answer: "Once your order is dispatched, you can track it in real-time via the 'My Orders' section. for bulk shipments, we provide detailed logistics milestones including manufacturing completion, dispatch, transit hubs, and final delivery estimation."
    },
    {
        question: "Can I change my role from Buyer to Seller?",
        answer: "Yes, you can upgrade your account. Navigate to your Profile Settings and select 'Upgrade to Seller'. You will need to submit additional business documentation and pass our seller verification process."
    }
];

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const router = useRouter();

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen ">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-100 pt-32 pb-20 px-6 text-center">
                <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        How can we help you today?
                    </h1>

                    <div className="relative max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <FaSearch className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[10px] text-lg font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm hover:shadow-md"
                            placeholder="Search for articles, guides, and more..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground font-medium">
                        <span>Popular:</span>
                        {['Escrow process', 'Shipping logistics', 'Verification'].map((tag, i) => (
                            <button key={i} className="text-primary hover:underline px-1">{tag}{i < 2 ? ',' : ''}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Role Selection Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Select Your Journey</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Buyer Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-600/5 group cursor-pointer"
                    >
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[10px] flex items-center justify-center mb-6 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FaShoppingCart />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-3">I am a Buyer</h3>
                        <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                            Manage your personal or business purchases, track escrow payments, and handle returns.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                { icon: FaShieldAlt, text: 'Understanding Escrow' },
                                { icon: FaTruck, text: 'Track Your Order' },
                                { icon: MdOutlineProductionQuantityLimits, text: 'Refund Policy' },
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                    <item.icon className="text-slate-400" /> {item.text}
                                </li>
                            ))}
                        </ul>
                        <button className="text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                            View all buyer topics <FaChevronRight />
                        </button>
                    </motion.div>

                    {/* Seller Card */}
                    <Link href="/seller/support" className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-600/5 group cursor-pointer">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[10px] flex items-center justify-center mb-6 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FaStore /> {/* Using FaStore as 'Store' was not imported */}
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-3">I am a Seller</h3>
                        <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                            Need help with sourcing, bulk orders, or negotiations? Access dedicated support for sellers.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                { icon: MdOutlineProductionQuantityLimits, text: 'Inventory Management' },
                                { icon: FaChartLine, text: 'Sales Analytics' },
                                { icon: FaBullhorn, text: 'Marketing Tools' },
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                    <item.icon className="text-slate-400" /> {item.text}
                                </li>
                            ))}
                        </ul>
                        <span className="text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                            View all seller topics <FaChevronRight />
                        </span>
                    </Link>

                    {/* Manufacturer Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-600/5 group cursor-pointer"
                    >
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[10px] flex items-center justify-center mb-6 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FaIndustry />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-3">I am a Manufacturer</h3>
                        <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                            Coordinate production cycles, bulk distribution, and logistics at scale.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                { icon: FaIndustry, text: 'Production Tracking' },
                                { icon: FaTruck, text: 'Bulk Distribution' },
                                { icon: FaShieldAlt, text: 'Certifications' },
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                    <item.icon className="text-slate-400" /> {item.text}
                                </li>
                            ))}
                        </ul>
                        <button className="text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                            View all manufacturer topics <FaChevronRight />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-200/50">
                <div className="text-center mb-16">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                            >
                                <span className="text-sm font-bold text-slate-800">{faq.question}</span>
                                <FaChevronDown
                                    className={`text-slate-400 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <AnimatePresence>
                                {openFaqIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="p-6 pt-0 text-sm leading-relaxed text-slate-500 border-t border-slate-50">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">
                        See all 50+ FAQs
                    </button>
                </div>
            </div>

            {/* CTA Banner */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="bg-[#1051fa] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-600/30">
                    {/* Background Pattern */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] rounded-full bg-white blur-3xl" />
                        <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] rounded-full bg-white blur-3xl" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Still need help?</h2>
                        <p className="text-blue-100 font-medium mb-10 max-w-xl mx-auto">
                            Our support team is available 24/7 to assist with your marketplace journey. Reach out via chat or ticket.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => {/* Open Chat Logic */ }}
                                className="px-8 py-4 bg-white text-blue-600 rounded-[10px] text-xs font-black uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all flex items-center gap-3"
                            >
                                <FaComments className="text-lg" /> Live Chat
                            </button>
                            <Link
                                href="/contact"
                                className="px-8 py-4 bg-blue-700/50 text-white border border-blue-400/30 rounded-[10px] text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-3 backdrop-blur-md"
                            >
                                <FaTicketAlt className="text-lg" /> Submit Ticket
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
