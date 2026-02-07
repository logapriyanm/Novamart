'use client';

import React, { useState, useEffect } from 'react';
import {
    FaArrowLeft, FaCheckCircle, FaCalculator, FaRocket,
    FaInfoCircle, FaMapMarkerAlt, FaBox
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
        <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
            {/* Back Link */}
            <Link href="/dealer/source" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                <FaArrowLeft className="w-3 h-3" />
                Back to Sourcing Catalog
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Configuration Form */}
                <div className="lg:col-span-7 space-y-8">
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight">Add Product to My Inventory</h1>
                        <p className="text-sm font-medium text-muted-foreground mt-1">Configure your listing details and pricing for the local market to go live.</p>
                    </div>

                    {/* Product Highlight Card */}
                    <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 flex items-center gap-6">
                        <div className="w-20 h-20 bg-white rounded-xl p-2 flex items-center justify-center border border-border/50">
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div>
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">
                                Manufacturer Verified
                            </span>
                            <h3 className="text-lg font-black text-foreground leading-tight">{product.name}</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{product.sku}</p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6 bg-background rounded-3xl p-8 border border-border/50 shadow-sm">

                        {/* Region */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-foreground uppercase tracking-widest">Region / Service Area</label>
                                <FaCheckCircle className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaMapMarkerAlt className="text-muted-foreground w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-bold transition-all"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg" alt="IN" className="w-5 h-auto rounded-sm opacity-50" />
                                </div>
                            </div>
                        </div>

                        {/* Stock */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-foreground uppercase tracking-widest">Stock Quantity</label>
                                <FaCheckCircle className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-bold transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">Units</span>
                            </div>
                            <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                                <FaInfoCircle className="w-3 h-3" /> Min 5 units required for active listing.
                            </p>
                        </div>

                        {/* Price & Discount Row */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-foreground uppercase tracking-widest">Retail Price (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">₹</span>
                                    <input
                                        type="number"
                                        value={retailPrice}
                                        onChange={(e) => setRetailPrice(parseInt(e.target.value) || 0)}
                                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-bold transition-all"
                                    />
                                </div>
                                <p className="text-[10px] font-medium text-muted-foreground">Base Price: ₹{product.basePrice.toLocaleString()}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-foreground uppercase tracking-widest">Discount (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-bold transition-all"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">%</span>
                                </div>
                                <p className="text-[10px] font-medium text-muted-foreground">Optional</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column: Calculator */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-background rounded-3xl p-8 border border-border/50 shadow-lg shadow-primary/5 sticky top-24">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <FaCalculator className="w-4 h-4" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Profit Calculator</h3>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-muted-foreground">Retail Price</span>
                                <span className="font-bold text-foreground">₹{retailPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-muted-foreground">Sourcing Cost</span>
                                <span className="font-bold text-foreground">- ₹{sourcingCost.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-border/50 my-2"></div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-muted-foreground">Gross Margin</span>
                                <div className="text-right">
                                    <span className="font-bold text-emerald-600 block">+ ₹{grossMargin.toLocaleString()}</span>
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{marginPercent}% Return</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-muted-foreground">NovaMart Fee (2%)</span>
                                <span className="font-bold text-rose-500">- ₹{platformFee.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Net Profit Box */}
                        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-6 relative overflow-hidden group">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-bl-full opacity-50 -mr-4 -mt-4"></div>

                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 relative z-10">Estimated Net Profit</p>
                            <div className="flex items-baseline gap-1 relative z-10">
                                <h2 className="text-3xl font-black text-blue-700">₹{netProfit.toLocaleString()}</h2>
                                <span className="text-xs font-bold text-blue-400">/ unit</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-8">
                            <span className="text-xs font-bold text-foreground uppercase tracking-widest">Final Buyer Price</span>
                            <span className="text-xl font-black text-foreground">₹{retailPrice.toLocaleString()}</span>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full py-4 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                <FaRocket className="w-4 h-4" />
                                Make Product Live
                            </button>
                            <button className="w-full py-4 bg-background border border-border text-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted transition-all">
                                Save as Draft
                            </button>
                        </div>

                        <p className="text-[10px] text-center text-muted-foreground mt-6 leading-relaxed">
                            By listing this product, you agree to NovaMart's <a href="#" className="underline">Seller Terms & Conditions</a> and logistics policy.
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}
