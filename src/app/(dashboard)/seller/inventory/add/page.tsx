'use client';

import React, { useState, useEffect } from 'react';
import {
    FaArrowLeft, FaCheckCircle, FaCalculator, FaRocket
} from 'react-icons/fa';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AddProductPage() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');

    // Simulate fetching product details based on ID
    const product = {
        name: 'Washing Machine - Model X200',
        manufacturer: 'LG',
        sku: 'MFG-X200-2023 | Stock SKU: 884-291-WM',
        image: 'https://images.unsplash.com/photo-1626806775351-538af710f40e?q=80&w=100&auto=format&fit=crop',
        basePrice: 20000,
    };

    // State for inputs
    const [region, setRegion] = useState('Mumbai - Maharashtra');
    const [stock, setStock] = useState(12);
    const [retailPrice, setRetailPrice] = useState(23500);
    const [discount, setDiscount] = useState(0);

    // Calculated values
    const sourcingCost = product.basePrice;
    const grossMargin = retailPrice - sourcingCost;
    const marginPercent = ((grossMargin / sourcingCost) * 100).toFixed(1);
    const platformFee = Math.round(retailPrice * 0.02); // 2% fee
    const netProfit = grossMargin - platformFee;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in pl-6">
            {/* Back Link */}
            <Link href="/dealer/sourcing" className="inline-flex items-center gap-2 text-[10px] font-black text-foreground/40 hover:text-primary transition-colors uppercase tracking-[0.2em]">
                <FaArrowLeft className="w-3 h-3" />
                Back to Sourcing Catalog
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Configuration Form */}
                <div className="lg:col-span-7 space-y-10">
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Add Product to My Inventory</h1>
                        <p className="text-sm font-medium text-foreground/40">Configure your listing details and pricing for the local market to go live.</p>
                    </div>

                    {/* Product Highlight Card */}
                    <div className="bg-surface rounded-[20px] p-6 border border-foreground/5 flex items-center gap-6">
                        <div className="w-24 h-24 bg-white rounded-xl p-3 flex items-center justify-center border border-foreground/5 shadow-sm">
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div>
                            <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded-[4px] uppercase tracking-wider mb-2 inline-block">
                                Manufacturer Verified
                            </span>
                            <h3 className="text-xl font-black text-foreground leading-tight tracking-tight">{product.name}</h3>
                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider mt-1.5">{product.sku}</p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-8">

                        {/* Region */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-b border-foreground/5 pb-2">
                                <label className="text-xs font-black text-foreground uppercase tracking-wider">Region / Service Area</label>
                                <FaCheckCircle className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    className="w-full pl-5 pr-12 py-4 rounded-[12px] border border-foreground/10 bg-white focus:ring-0 focus:border-blue-500 outline-none text-sm font-bold transition-all shadow-sm"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <div className="w-6 h-4 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-[2px] opacity-80 shadow-sm border border-black/10"></div>
                                </div>
                            </div>
                        </div>

                        {/* Stock */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-b border-foreground/5 pb-2">
                                <label className="text-xs font-black text-foreground uppercase tracking-wider">Stock Quantity</label>
                                <FaCheckCircle className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                                    className="w-full pl-5 pr-16 py-4 rounded-[12px] border border-foreground/10 bg-white focus:ring-0 focus:border-blue-500 outline-none text-sm font-bold transition-all shadow-sm"
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Units</span>
                            </div>
                            <div className="text-[10px] font-bold text-foreground/40 flex items-center gap-1.5 pl-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-foreground/20"></div> Min 5 units required for active listing.
                            </div>
                        </div>

                        {/* Price & Discount Row */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-foreground uppercase tracking-wider pl-1">Retail Price (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-black text-foreground/40">₹</span>
                                    <input
                                        type="number"
                                        value={retailPrice}
                                        onChange={(e) => setRetailPrice(parseInt(e.target.value) || 0)}
                                        className="w-full pl-10 pr-4 py-4 rounded-[12px] border border-foreground/10 bg-white focus:ring-0 focus:border-blue-500 outline-none text-lg font-black transition-all shadow-sm"
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-foreground/30 pl-1 uppercase tracking-wider">Base Price: ₹{product.basePrice.toLocaleString()}</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-foreground uppercase tracking-wider pl-1">Discount (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                                        className="w-full px-5 py-4 rounded-[12px] border border-foreground/10 bg-white focus:ring-0 focus:border-blue-500 outline-none text-lg font-medium transition-all shadow-sm text-foreground/60"
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-foreground/40">%</span>
                                </div>
                                <p className="text-[10px] font-bold text-foreground/30 pl-1 uppercase tracking-wider">Optional</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column: Calculator */}
                <div className="lg:col-span-5 space-y-6 pt-6">
                    <div className="bg-white rounded-[24px] p-8 border border-foreground/5 shadow-2xl shadow-black/[0.02] sticky top-32">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-[8px] bg-blue-600 flex items-center justify-center text-white">
                                <FaCalculator className="w-3.5 h-3.5" />
                            </div>
                            <h3 className="text-base font-black text-foreground tracking-tight">Profit Calculator</h3>
                        </div>

                        <div className="space-y-5 mb-8">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-foreground/50">Retail Price</span>
                                <span className="font-black text-foreground">₹{retailPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-foreground/50">Sourcing Cost</span>
                                <span className="font-bold text-foreground/40">- ₹{sourcingCost.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-foreground/5 my-2"></div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-foreground/50">Gross Margin</span>
                                <div className="text-right">
                                    <span className="font-black text-emerald-500 block text-base">+ ₹{grossMargin.toLocaleString()}</span>
                                    <span className="text-[10px] font-black text-emerald-600/80 uppercase tracking-wider">{marginPercent}% Return</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-foreground/50">NovaMart Fee (2%)</span>
                                <span className="font-bold text-rose-500">- ₹{platformFee.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Net Profit Box */}
                        <div className="bg-[#EFF6FF] rounded-[16px] p-6 border border-[#BFDBFE] mb-8 relative overflow-hidden">
                            {/* Graph Decoration */}
                            <FaRocket className="absolute top-4 right-4 text-blue-400/20 w-12 h-12 -rotate-12" />

                            <p className="text-[10px] font-black text-[#60A5FA] uppercase tracking-[0.15em] mb-2 relative z-10">Estimated Net Profit</p>
                            <div className="flex items-baseline gap-2 relative z-10">
                                <h2 className="text-4xl font-black text-[#1D4ED8] tracking-tight">₹{netProfit.toLocaleString()}</h2>
                                <span className="text-sm font-bold text-[#60A5FA] mb-1">/ unit</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-baseline mb-8 px-1">
                            <span className="text-[10px] font-black text-foreground/60 uppercase tracking-widest">Final Buyer Price</span>
                            <span className="text-2xl font-black text-foreground tracking-tight">₹{retailPrice.toLocaleString()}</span>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full py-4 bg-[#1D4ED8] text-white rounded-[12px] text-xs font-black uppercase tracking-[0.15em] shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5">
                                <FaRocket className="w-3.5 h-3.5" />
                                Make Product Live
                            </button>
                            <button className="w-full py-4 bg-white border border-foreground/10 text-foreground rounded-[12px] text-xs font-black uppercase tracking-[0.15em] hover:bg-surface hover:border-foreground/20 transition-all shadow-sm">
                                Save as Draft
                            </button>
                        </div>

                        <div className="mt-6 px-2">
                            <p className="text-[10px] text-center text-foreground/30 font-bold leading-relaxed">
                                By listing this product, you agree to NovaMart's <a href="#" className="underline decoration-foreground/20 underline-offset-2 hover:text-foreground/60">Seller Terms & Conditions</a> and logistics policy.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
