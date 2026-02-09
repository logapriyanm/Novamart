'use client';

import React, { useState, useMemo } from 'react';
import { useProductForm } from '../../../../../context/ProductFormContext';
import { FaTag, FaLayerGroup, FaAlignLeft, FaCheckSquare } from 'react-icons/fa';
import { IoIosArrowDropdown } from 'react-icons/io';
import { selectableCategories } from '../../../../../data/categoryData';

export default function StepGeneral() {
    const { productData, updateProductData } = useProductForm();

    // Local state for cascading dropdowns
    const [selectedMainCategory, setSelectedMainCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [customMainCategory, setCustomMainCategory] = useState('');
    const [customSubCategory, setCustomSubCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');

    // Derived states
    const availableSubCategories = useMemo(() => {
        const main = selectableCategories.find(c => c.id === selectedMainCategory);
        return main?.subsections || [];
    }, [selectedMainCategory]);

    const availableLeafCategories = useMemo(() => {
        const sub = availableSubCategories.find(s => s.label === selectedSubCategory);
        return sub?.items || [];
    }, [availableSubCategories, selectedSubCategory]);

    const handleMainCategoryChange = (val: string) => {
        setSelectedMainCategory(val);
        setSelectedSubCategory('');
        setCustomMainCategory('');
        setCustomSubCategory('');
        setCustomCategory('');
        updateProductData({ mainCategory: val, category: '', subCategory: '' });
    };

    const handleSubCategoryChange = (val: string) => {
        setSelectedSubCategory(val);
        setCustomSubCategory('');
        setCustomCategory('');
        updateProductData({ subCategory: val, category: '' });
    };

    const handleLeafCategoryChange = (val: string) => {
        updateProductData({ category: val });
        setCustomCategory('');
    };

    return (
        <div className="w-full space-y-8 animate-fade-in">
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

                {/* Category Selection Section */}
                <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <FaLayerGroup className="w-3 h-3 text-[#0F6CBD]" /> Categorization <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 1. Main Category */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Department</label>
                            <div className="relative">
                                <select
                                    value={selectedMainCategory}
                                    onChange={(e) => handleMainCategoryChange(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none"
                                >
                                    <option value="">Select Department</option>
                                    {selectableCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                                    ))}
                                </select>
                                <IoIosArrowDropdown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                            {selectedMainCategory === 'others' && (
                                <input
                                    type="text"
                                    placeholder="Enter Department Name"
                                    value={customMainCategory}
                                    onChange={(e) => {
                                        setCustomMainCategory(e.target.value);
                                        // We might store this in specifications or just use as placeholder
                                    }}
                                    className="w-full mt-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold focus:outline-none focus:border-[#0F6CBD]"
                                />
                            )}
                        </div>

                        {/* 2. Sub Category (Subsection) */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Sub-Category</label>
                            <div className="relative">
                                <select
                                    value={selectedSubCategory}
                                    onChange={(e) => handleSubCategoryChange(e.target.value)}
                                    disabled={!selectedMainCategory}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                                >
                                    <option value="">Select Sub-Category</option>
                                    {availableSubCategories.map(sub => (
                                        <option key={sub.label} value={sub.label}>{sub.label}</option>
                                    ))}
                                </select>
                                <IoIosArrowDropdown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                            {selectedSubCategory === 'Others' && (
                                <input
                                    type="text"
                                    placeholder="Enter Sub-Category Name"
                                    value={customSubCategory}
                                    onChange={(e) => {
                                        setCustomSubCategory(e.target.value);
                                        updateProductData({ subCategory: e.target.value });
                                    }}
                                    className="w-full mt-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold focus:outline-none focus:border-[#0F6CBD]"
                                />
                            )}
                        </div>

                        {/* 3. Product Type (Leaf Item) - saved as 'category' */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Product Type</label>
                            <div className="relative">
                                <select
                                    value={productData.category}
                                    onChange={(e) => handleLeafCategoryChange(e.target.value)}
                                    disabled={!selectedSubCategory}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                                >
                                    <option value="">Select Product Type</option>
                                    {availableLeafCategories.map(item => (
                                        <option key={item.href} value={item.href.split('/').pop()}>{item.name}</option>
                                    ))}
                                </select>
                                <IoIosArrowDropdown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                            {(productData.category === 'others' || productData.category.includes('others')) && (
                                <input
                                    type="text"
                                    placeholder="Enter Product Type Name"
                                    value={customCategory}
                                    onChange={(e) => {
                                        setCustomCategory(e.target.value);
                                        // Still keep category as 'others' for filtering but store custom in name if needed?
                                        // Or just override category. Let's override category for now.
                                        updateProductData({ category: e.target.value });
                                    }}
                                    className="w-full mt-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-bold focus:outline-none focus:border-[#0F6CBD]"
                                />
                            )}
                        </div>
                    </div>
                    {productData.category && !customCategory && (
                        <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                            <FaCheckSquare className="w-3 h-3" />
                            Selected: {availableLeafCategories.find(i => i.href.split('/').pop() === productData.category)?.name}
                        </div>
                    )}
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

                {/* Pricing & MOQ Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <span className="text-emerald-600">₹</span> Base Unit Price <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={productData.basePrice}
                            onChange={(e) => updateProductData({ basePrice: e.target.value })}
                            placeholder="0.00"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <FaLayerGroup className="w-3 h-3 text-amber-500" /> MOQ (Min Order Qty) <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={productData.moq}
                            onChange={(e) => updateProductData({ moq: e.target.value })}
                            placeholder="1"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
