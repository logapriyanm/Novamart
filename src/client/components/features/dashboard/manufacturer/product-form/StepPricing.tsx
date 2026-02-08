'use client';

import React, { useState, useEffect } from 'react';
import {
    FaDollarSign, FaBoxOpen, FaTruck, FaPlus,
    FaTrash, FaInfoCircle, FaChartPie, FaLightbulb
} from 'react-icons/fa';
import { useProductForm } from '../../../../../context/ProductFormContext';

export default function StepPricing() {
    const { productData, updateProductData } = useProductForm();
    const [tiers, setTiers] = useState<any[]>(productData.tierPricing || [
        { min: 100, max: 500, discount: 5, price: 0.00 },
        { min: 501, max: 'Max', discount: 10, price: 0.00 },
    ]);

    // specific effect to sync tiers to context
    useEffect(() => {
        updateProductData({ tierPricing: tiers });
    }, [tiers]);

    const handleTierChange = (index: number, field: string, value: any) => {
        const newTiers = [...tiers];
        newTiers[index] = { ...newTiers[index], [field]: value };
        // Recalculate price if basePrice changes or discount changes
        // simple logic: price = basePrice * (1 - discount/100)
        // taking basePrice from productData
        if (field === 'discount' && productData.basePrice) {
            const base = parseFloat(productData.basePrice);
            const discount = parseFloat(value) || 0;
            newTiers[index].price = base * (1 - discount / 100);
        }
        setTiers(newTiers);
    };

    const addTier = () => {
        setTiers([...tiers, { min: 0, max: 0, discount: 0, price: 0 }]);
    };

    const removeTier = (index: number) => {
        const newTiers = tiers.filter((_, i) => i !== index);
        setTiers(newTiers);
    };

    const handleBasePriceChange = (value: string) => {
        updateProductData({ basePrice: value });
        // Update tier prices
        const base = parseFloat(value) || 0;
        const newTiers = tiers.map(t => ({
            ...t,
            price: base * (1 - (t.discount || 0) / 100)
        }));
        setTiers(newTiers);
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            {/* Left Column: Pricing Forms */}
            <div className="flex-1 space-y-6">

                <div className="max-w-3xl mb-2">
                    <h2 className="text-2xl font-black tracking-tight text-[#1E293B]">Pricing & Minimum Order Quantities</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Configure your wholesale pricing structure and production capabilities.</p>
                </div>

                {/* Pricing Controls */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <FaDollarSign className="w-5 h-5 text-[#0F6CBD]" />
                        <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Pricing Controls</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Manufacturer Price (per unit)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={productData.basePrice}
                                    onChange={(e) => handleBasePriceChange(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-4 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all"
                                />
                            </div>
                            <p className="text-[9px] font-bold text-slate-400">The amount you receive before platform fees.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                Recommended Retail Price (MSRP) <FaInfoCircle className="w-3 h-3 text-slate-300" />
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={productData.msrp || ''}
                                    onChange={(e) => updateProductData({ msrp: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-4 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all"
                                />
                            </div>
                            <p className="text-[9px] font-bold text-slate-400">The price suggest for end customers.</p>
                        </div>
                    </div>
                </div>

                {/* Order Quantities */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <FaBoxOpen className="w-5 h-5 text-[#0F6CBD]" />
                        <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Order Quantities (MOQ)</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minimum Order Quantity (MOQ)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="50"
                                    value={productData.moq}
                                    onChange={(e) => updateProductData({ moq: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-4 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">units</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maximum per Dealer</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="5000"
                                    value={productData.maxQuantity || ''}
                                    onChange={(e) => updateProductData({ maxQuantity: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-4 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">units</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wholesale Tier Pricing */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <FaChartPie className="w-5 h-5 text-[#0F6CBD]" />
                            <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Wholesale Tier Pricing</h3>
                        </div>
                        <button onClick={addTier} className="text-[10px] font-black text-[#0F6CBD] uppercase tracking-widest flex items-center gap-1 hover:underline">
                            <FaPlus className="w-3 h-3" /> Add Tier
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Headers */}
                        <div className="grid grid-cols-12 gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            <div className="col-span-4">Volume Range (Units)</div>
                            <div className="col-span-3">Discount %</div>
                            <div className="col-span-4">Effective Unit Price</div>
                            <div className="col-span-1"></div>
                        </div>

                        {/* Rows */}
                        {tiers.map((tier, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-4 flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={tier.min}
                                        onChange={(e) => handleTierChange(index, 'min', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-[#1E293B] text-center"
                                    />
                                    <span className="text-slate-400">-</span>
                                    <input
                                        type="text"
                                        value={tier.max}
                                        onChange={(e) => handleTierChange(index, 'max', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-[#1E293B] text-center"
                                    />
                                </div>
                                <div className="col-span-3 relative">
                                    <input
                                        type="number"
                                        value={tier.discount}
                                        onChange={(e) => handleTierChange(index, 'discount', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-6 py-2 text-xs font-bold text-[#1E293B]"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">%</span>
                                </div>
                                <div className="col-span-4 font-bold text-[#1E293B] text-xs pl-2">
                                    $ {Number(tier.price).toFixed(2)}
                                </div>
                                <div className="col-span-1 text-right">
                                    <button onClick={() => removeTier(index)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                        <FaTrash className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lead Time & Logistics */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <FaTruck className="w-5 h-5 text-[#0F6CBD]" />
                        <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Lead Time & Logistics</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Production Lead Time</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="14"
                                    value={productData.leadTime || ''}
                                    onChange={(e) => updateProductData({ leadTime: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-4 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">days</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Availability</label>
                            <select
                                value={productData.availability || 'In Stock'}
                                onChange={(e) => updateProductData({ availability: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#0F6CBD] transition-all appearance-none cursor-pointer"
                            >
                                <option>In Stock (Ready to Ship)</option>
                                <option>Made to Order</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Column: Sidebar (Keep static calculation for now unless dynamic needed) */}
            <div className="w-full lg:w-96 space-y-6">
                {/* Profit & Margin Helper - Could make dynamic later based on context */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <FaChartPie className="w-4 h-4 text-[#0F6CBD]" />
                        <h3 className="text-sm font-black text-[#1E293B]">Profit & Margin Helper</h3>
                    </div>

                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Margin Estimate</span>
                        <span className="text-xs font-black text-emerald-600">42%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                        <div className="h-full bg-[#0F6CBD] w-[42%] rounded-full" />
                    </div>

                    <div className="space-y-3 mb-8">
                        <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#0F6CBD]" />
                                <span className="text-slate-600 font-bold">Manufacturer Net</span>
                            </div>
                            <span className="font-black text-[#1E293B]">$ {productData.basePrice || '0.00'}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-400" />
                                <span className="text-slate-600 font-bold">NovaMart Fee (5%)</span>
                            </div>
                            <span className="font-black text-[#1E293B]">$ {(parseFloat(productData.basePrice || '0') * 0.05).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
