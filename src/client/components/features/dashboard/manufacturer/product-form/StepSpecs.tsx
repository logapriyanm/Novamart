'use client';

import React, { useState } from 'react';
import {
    FaRulerCombined, FaBolt, FaPlus, FaTrash,
    FaLightbulb, FaCheckSquare, FaLayerGroup,
    FaInfoCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductForm } from '../../../../../context/ProductFormContext';

export default function StepSpecs() {
    const { productData, updateProductData } = useProductForm();
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');

    const addSpec = () => {
        if (newKey && newValue) {
            updateProductData({
                specifications: {
                    ...productData.specifications,
                    [newKey]: newValue
                }
            });
            setNewKey('');
            setNewValue('');
        }
    };

    const removeSpec = (key: string) => {
        const newSpecs = { ...productData.specifications };
        delete newSpecs[key];
        updateProductData({ specifications: newSpecs });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            {/* Left Column: Specs Form */}
            <div className="flex-1 space-y-8">

                <div className="max-w-3xl">
                    <h2 className="text-3xl font-black tracking-tight text-[#1E293B]">Technical Specifications</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Provide precise technical data to help buyers find your products through filtered searches and technical comparisons.</p>
                </div>

                {/* Structured Specifications (New) */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-[#0F6CBD] text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <FaBolt className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-black text-[#1E293B]">Key Specifications</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Power Consumption */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Power Consumption</label>
                            <select
                                value={productData.powerConsumption || ''}
                                onChange={(e) => updateProductData({ powerConsumption: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all"
                            >
                                <option value="">Select Power</option>
                                <option value="Less than 1000W">Less than 1000W</option>
                                <option value="1000W - 1500W">1000W - 1500W</option>
                                <option value="1500W - 2000W">1500W - 2000W</option>
                                <option value="Above 2000W">Above 2000W</option>
                                <option value="Battery Operated">Battery Operated</option>
                            </select>
                        </div>

                        {/* Capacity */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity</label>
                            <input
                                type="text"
                                placeholder="e.g. 250L or 7kg"
                                value={productData.capacity || ''}
                                onChange={(e) => updateProductData({ capacity: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all"
                            />
                        </div>

                        {/* Energy Rating */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Energy Rating</label>
                            <select
                                value={productData.energyRating || ''}
                                onChange={(e) => updateProductData({ energyRating: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all"
                            >
                                <option value="">Select Rating</option>
                                <option value="5 Star">5 Star</option>
                                <option value="4 Star">4 Star</option>
                                <option value="3 Star">3 Star</option>
                                <option value="2 Star">2 Star</option>
                                <option value="1 Star">1 Star</option>
                            </select>
                        </div>

                        {/* Installation Type */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Installation Type</label>
                            <select
                                value={productData.installationType || ''}
                                onChange={(e) => updateProductData({ installationType: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all"
                            >
                                <option value="">Select Type</option>
                                <option value="Freestanding">Freestanding</option>
                                <option value="Built-in">Built-in</option>
                                <option value="Wall Mounted">Wall Mounted</option>
                                <option value="Table Top">Table Top</option>
                            </select>
                        </div>

                        {/* Usage Type */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Usage Type</label>
                            <select
                                value={productData.usageType || ''}
                                onChange={(e) => updateProductData({ usageType: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all"
                            >
                                <option value="">Select Usage</option>
                                <option value="Home">Home</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Industrial">Industrial</option>
                            </select>
                        </div>

                        {/* Warranty */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Warranty</label>
                            <select
                                value={productData.warranty || ''}
                                onChange={(e) => updateProductData({ warranty: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all"
                            >
                                <option value="">Select Period</option>
                                <option value="1 Year">1 Year</option>
                                <option value="2 Years">2 Years</option>
                                <option value="3 Years+">3 Years+</option>
                                <option value="Compressor Warranty">Compressor Warranty</option>
                                <option value="No Warranty">No Warranty</option>
                            </select>
                        </div>
                    </div>

                    {/* Smart Feature Toggle */}
                    <div className="mt-8 p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200 cursor-pointer hover:border-[#0F6CBD] transition-all" onClick={() => updateProductData({ isSmart: !productData.isSmart })}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${productData.isSmart ? 'bg-[#0F6CBD] text-white' : 'bg-slate-200 text-slate-400'}`}>
                                <FaLightbulb className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-[#1E293B]">Smart / IoT Enabled</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Does this product support WiFi/App?</p>
                            </div>
                        </div>
                        <div className={`w-6 h-6 rounded border transition-colors flex items-center justify-center ${productData.isSmart ? 'bg-[#0F6CBD] border-[#0F6CBD]' : 'border-slate-300'}`}>
                            {productData.isSmart && <FaCheckSquare className="text-white w-4 h-4" />}
                        </div>
                    </div>
                </div>

                {/* Attributes Section (Generic) */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#0F6CBD] text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <FaRulerCombined className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-black text-[#1E293B]">Product Attributes</h3>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Existing Specs */}
                        {Object.entries(productData.specifications).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attribute Name</label>
                                    <input type="text" value={key} readOnly className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none opacity-70" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={String(value)} readOnly className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none" />
                                        <button onClick={() => removeSpec(key)} className="p-3 text-slate-400 hover:text-rose-500 transition-colors"><FaTrash className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add New Spec */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Attribute Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Weight, Material, Voltage"
                                    value={newKey}
                                    onChange={(e) => setNewKey(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g. 1.5kg, Aluminum, 220V"
                                        value={newValue}
                                        onChange={(e) => setNewValue(e.target.value)}
                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD]"
                                    />
                                    <button
                                        onClick={addSpec}
                                        disabled={!newKey || !newValue}
                                        className="p-3 bg-[#0F6CBD] text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-[#0F6CBD]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <FaPlus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Tips */}
            <div className="w-full lg:w-80 space-y-6">
                <div className="bg-blue-50 rounded-[2rem] p-6 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                        <FaLightbulb className="w-3 h-3 text-[#0F6CBD]" />
                        <span className="text-[9px] font-black text-[#0F6CBD] uppercase tracking-widest">Pro Tip</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                        Detailed specifications improve search capability by 45%. Include units where applicable (e.g. "Weight: 2.5kg" instead of just "2.5").
                    </p>
                </div>
            </div>
        </div>
    );
}
