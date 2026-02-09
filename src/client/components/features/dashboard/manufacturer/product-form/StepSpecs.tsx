'use client';

import React, { useState } from 'react';
import {
    FaRulerCombined, FaBolt, FaPlus, FaTrash,
    FaLightbulb, FaCheckSquare, FaLayerGroup,
    FaInfoCircle
} from 'react-icons/fa';
import { IoIosArrowDropdown } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductForm } from '../../../../../context/ProductFormContext';
import { useSnackbar } from '@/client/context/SnackbarContext';

export default function StepSpecs() {
    const { productData, updateProductData } = useProductForm();
    const { showSnackbar } = useSnackbar();
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const [isUploading, setIsUploading] = useState(false);

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
                            <div className="relative">
                                <select
                                    value={productData.powerConsumption || ''}
                                    onChange={(e) => updateProductData({ powerConsumption: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all appearance-none"
                                >
                                    <option value="">Select Power</option>
                                    <option value="Less than 1000W">Less than 1000W</option>
                                    <option value="1000W - 1500W">1000W - 1500W</option>
                                    <option value="1500W - 2000W">1500W - 2000W</option>
                                    <option value="Above 2000W">Above 2000W</option>
                                    <option value="Battery Operated">Battery Operated</option>
                                </select>
                                <IoIosArrowDropdown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
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
                            <div className="relative">
                                <select
                                    value={productData.energyRating || ''}
                                    onChange={(e) => updateProductData({ energyRating: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all appearance-none"
                                >
                                    <option value="">Select Rating</option>
                                    <option value="5 Star">5 Star</option>
                                    <option value="4 Star">4 Star</option>
                                    <option value="3 Star">3 Star</option>
                                    <option value="2 Star">2 Star</option>
                                    <option value="1 Star">1 Star</option>
                                </select>
                                <IoIosArrowDropdown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Installation Type */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Installation Type</label>
                            <div className="relative">
                                <select
                                    value={productData.installationType || ''}
                                    onChange={(e) => updateProductData({ installationType: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all appearance-none"
                                >
                                    <option value="">Select Type</option>
                                    <option value="Freestanding">Freestanding</option>
                                    <option value="Built-in">Built-in</option>
                                    <option value="Wall Mounted">Wall Mounted</option>
                                    <option value="Table Top">Table Top</option>
                                </select>
                                <IoIosArrowDropdown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Usage Type */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Usage Type</label>
                            <div className="relative">
                                <select
                                    value={productData.usageType || ''}
                                    onChange={(e) => updateProductData({ usageType: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all appearance-none"
                                >
                                    <option value="">Select Usage</option>
                                    <option value="Home">Home</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Industrial">Industrial</option>
                                </select>
                                <IoIosArrowDropdown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Warranty */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Warranty</label>
                            <div className="relative">
                                <select
                                    value={productData.warranty || ''}
                                    onChange={(e) => updateProductData({ warranty: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all appearance-none"
                                >
                                    <option value="">Select Period</option>
                                    <option value="1 Year">1 Year</option>
                                    <option value="2 Years">2 Years</option>
                                    <option value="3 Years+">3 Years+</option>
                                    <option value="Compressor Warranty">Compressor Warranty</option>
                                    <option value="No Warranty">No Warranty</option>
                                </select>
                                <IoIosArrowDropdown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
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

            {/* Right Column: Tips & Media */}
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

                {/* Media Section (Unified) */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-black text-[#1E293B] mb-4">Product Media</h3>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {productData.images && productData.images.map((img: string, index: number) => (
                            <div key={index} className={`relative group aspect-square rounded-xl overflow-hidden border bg-white ${index === 0 ? 'border-[#0F6CBD]' : 'border-slate-100'}`}>
                                {index === 0 && (
                                    <span className="absolute top-1 left-1 bg-[#0F6CBD] text-white text-[6px] font-black px-1.5 py-0.5 rounded shadow-sm z-10 uppercase tracking-wider">Cover</span>
                                )}
                                <img src={img} alt={`Product ${index}`} className="w-full h-full object-contain p-1" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                    <button
                                        onClick={() => {
                                            const newImages = productData.images.filter((_, i) => i !== index);
                                            updateProductData({ images: newImages });
                                        }}
                                        className="p-1.5 bg-white text-rose-500 rounded-full hover:bg-rose-50"
                                    >
                                        <FaTrash className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add Button */}
                        <div className="relative group">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                disabled={isUploading}
                                onChange={async (e) => {
                                    const files = e.target.files;
                                    if (!files || files.length === 0) return;

                                    setIsUploading(true);
                                    const formData = new FormData();
                                    Array.from(files).forEach(file => {
                                        formData.append('images', file);
                                    });

                                    try {
                                        const res = await import('@/lib/api/client').then(m => m.apiClient.upload('/media/upload', formData)) as { urls: string[] };

                                        if (res && res.urls) {
                                            updateProductData({
                                                images: [...(productData.images || []), ...res.urls]
                                            });
                                            showSnackbar(`Successfully uploaded ${res.urls.length} image(s)`, 'success');
                                        }
                                    } catch (error: any) {
                                        console.error('Upload failed:', error);
                                        showSnackbar(`Failed to upload images: ${error.message || 'Unknown error'}`, 'error');
                                    } finally {
                                        setIsUploading(false);
                                    }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                            />
                            <div className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${isUploading ? 'bg-slate-50 border-blue-200 text-blue-400' : 'border-slate-200 text-slate-300 group-hover:text-[#0F6CBD] group-hover:border-[#0F6CBD] group-hover:bg-slate-50'}`}>
                                {isUploading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0F6CBD]"></div>
                                ) : (
                                    <>
                                        <FaPlus className="w-4 h-4" />
                                        <span className="text-[8px] font-black uppercase mt-1">Add</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium text-center">Upload at least 3 images.</p>
                </div>
            </div>
        </div>
    );
}
