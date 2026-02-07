'use client';

import React from 'react';
import { useProductForm } from '../../../../context/ProductFormContext';
import { FaTag, FaLayerGroup, FaAlignLeft } from 'react-icons/fa';

export default function StepGeneral() {
    const { productData, updateProductData } = useProductForm();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col gap-1 mb-4">
                <h2 className="text-2xl font-black tracking-tight text-[#1E293B]">General Information</h2>
                <p className="text-slate-400 font-bold text-xs">Basic details about your product.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">

                {/* Product Name */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <FaTag className="w-3 h-3 text-[#0F6CBD]" /> Product Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={productData.name}
                        onChange={(e) => updateProductData({ name: e.target.value })}
                        placeholder="e.g. Industrial Smart Controller X500"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
                    />
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <FaLayerGroup className="w-3 h-3 text-[#0F6CBD]" /> Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                        value={productData.category}
                        onChange={(e) => updateProductData({ category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none"
                    >
                        <option value="">Select a Category</option>
                        <option value="Industrial Electronics">Industrial Electronics</option>
                        <option value="Mechanical Parts">Mechanical Parts</option>
                        <option value="Safety Gear">Safety Gear</option>
                        <option value="Raw Materials">Raw Materials</option>
                    </select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <FaAlignLeft className="w-3 h-3 text-[#0F6CBD]" /> Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                        value={productData.description}
                        onChange={(e) => updateProductData({ description: e.target.value })}
                        placeholder="Detailed description of the product features and applications..."
                        rows={6}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300 resize-none"
                    />
                </div>

            </div>
        </div>
    );
}
