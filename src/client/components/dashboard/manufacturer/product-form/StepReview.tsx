'use client';

import React, { useState } from 'react';
import {
    FaChevronDown, FaCheckCircle,
    FaDollarSign, FaBox, FaImages, FaShieldAlt,
    FaInfoCircle, FaEdit
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductForm } from '../../../../context/ProductFormContext';

export default function StepReview() {
    const { productData } = useProductForm();
    const [openSection, setOpenSection] = useState<string>('Basic Details');

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? '' : section);
    }

    const sections = [
        {
            id: 'Basic Details',
            icon: FaInfoCircle,
            content: (
                <div className="p-6 bg-slate-50/50 space-y-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</p>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                            {productData.description || 'No description provided.'}
                        </p>
                    </div>
                    <div className="flex gap-12">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Brand</p>
                            <p className="text-xs font-bold text-[#1E293B]">My Brand (Manufacturer)</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
                            <p className="text-xs font-bold text-[#1E293B]">{productData.category || 'Uncategorized'}</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'Technical Specifications',
            icon: FaEdit,
            content: (
                <div className="p-6 bg-slate-50/50">
                    {Object.keys(productData.specifications).length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(productData.specifications).map(([key, value]) => (
                                <div key={key}>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{key}</p>
                                    <p className="text-xs font-bold text-[#1E293B]">{String(value)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">No specifications added.</p>
                    )}
                </div>
            )
        },
        {
            id: 'Pricing & Wholesale',
            icon: FaDollarSign,
            content: (
                <div className="p-6 bg-slate-50/50 flex gap-12">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Base Price</p>
                        <p className="text-xs font-bold text-[#1E293B]">${productData.basePrice || '0.00'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">MOQ</p>
                        <p className="text-xs font-bold text-[#1E293B]">{productData.moq || '1'} Units</p>
                    </div>
                </div>
            )
        },
        {
            id: 'Media & 360 View',
            icon: FaImages,
            content: (
                <div className="p-6 bg-slate-50/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Images ({productData.images.length})</p>
                    <div className="flex gap-2">
                        {productData.images.length > 0 ? productData.images.map((img, idx) => (
                            <img key={idx} src={img} alt={`Product ${idx}`} className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                        )) : <span className="text-xs text-slate-400 italic">No images uploaded.</span>}
                    </div>
                </div>
            )
        },
        { id: 'Compliance Documents', icon: FaShieldAlt, content: null },
    ];

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div className="flex flex-col gap-1 mb-4">
                <div className="flex justify-between items-end border-b border-primary/10 pb-4">
                    <h2 className="text-2xl font-black tracking-tight text-[#1E293B]">Review Product Details</h2>
                    <span className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest">Step 6 of 6</span>
                </div>
                <p className="text-slate-400 font-bold text-xs mt-2">Final check before admin approval and marketplace listing.</p>
            </div>

            {/* Product Snapshot Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-32 h-32 bg-slate-50 rounded-xl border border-slate-100 p-2 shrink-0 overflow-hidden">
                    {productData.images[0] ? (
                        <img src={productData.images[0]} alt="Product Preview" className="w-full h-full object-contain" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <FaBox className="w-8 h-8" />
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    <span className="bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded">Draft Status</span>
                    <h3 className="text-xl font-black text-[#1E293B]">{productData.name || 'Untitled Product'}</h3>
                    <p className="text-xs font-bold text-slate-500">Category: <span className="text-[#1E293B]">{productData.category || 'N/A'}</span></p>
                    <div className="pt-2">
                        <span className="text-2xl font-black text-[#1E293B]">${productData.basePrice || '0.00'}</span>
                        <span className="text-[10px] font-bold text-slate-400 ml-1">/ unit (Base)</span>
                    </div>
                </div>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-4">
                {sections.map((section) => (
                    <div key={section.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${openSection === section.id ? 'bg-[#0F6CBD] text-white' : 'bg-blue-50 text-[#0F6CBD]'}`}>
                                    <section.icon className="w-4 h-4" />
                                </div>
                                <span className={`text-sm font-black ${openSection === section.id ? 'text-[#0F6CBD]' : 'text-[#1E293B]'}`}>{section.id}</span>
                            </div>
                            <FaChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${openSection === section.id ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {openSection === section.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {section.content || (
                                        <div className="p-6 bg-slate-50/50 text-center text-xs font-bold text-slate-400 py-12">
                                            {section.id} details preview would appear here.
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 rounded-2xl p-6 flex gap-4 border-l-4 border-[#0F6CBD]">
                <FaInfoCircle className="w-5 h-5 text-[#0F6CBD] shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-xs font-black text-[#0F6CBD] mb-1">Review Timeline Notice</h4>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                        Your product will be reviewed by the NovaMart Admin team within 24-48 hours. You will receive an email notification once your product is approved and live on the marketplace.
                    </p>
                </div>
            </div>

        </div>
    );
}
