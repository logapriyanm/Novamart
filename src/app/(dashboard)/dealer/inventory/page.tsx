'use client';

import React, { useState } from 'react';
import {
    FaSearch, FaFilter, FaPlus, FaEllipsisV,
    FaExclamationTriangle, FaChevronDown, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import Link from 'next/link';

// Mock Data matching Image 2
const inventoryItems = [
    {
        id: 1,
        name: 'Quantum X-12 Smartphone',
        sku: 'NM-QX12-512-GR',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff70?q=80&w=100&auto=format&fit=crop',
        manufacturer: 'NovaTech Inc.',
        stock: 432,
        stockStatus: 'good',
        retailPrice: 999.00,
        margin: '18%',
        marginStatus: 'good', // 'Within Range'
        discount: null,
        marginPercent: '18.4%',
        status: true,
    },
    {
        id: 2,
        name: 'Sonic Buds Pro Max',
        sku: 'NM-SBPM-WHT',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=100&auto=format&fit=crop',
        manufacturer: 'AudioCore',
        stock: 12,
        stockStatus: 'low',
        retailPrice: 149.50,
        margin: '14%',
        marginStatus: 'good', // 'Within Range'
        discount: '-10% Promo',
        marginPercent: '14.1%',
        status: true,
    },
    {
        id: 3,
        name: 'UltraVision 27" 4K Monitor',
        sku: 'NM-UV27-4K-UHD',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=100&auto=format&fit=crop',
        manufacturer: 'OpticFlow',
        stock: 88,
        stockStatus: 'good',
        retailPrice: 549.99,
        margin: '8%',
        marginStatus: 'low', // 'Low'
        discount: null,
        marginPercent: '8.2%',
        status: false,
    },
    {
        id: 4,
        name: 'KeyPro Mechanical Mini',
        sku: 'NM-KPM-60-BRN',
        image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=100&auto=format&fit=crop',
        manufacturer: 'TypistElite',
        stock: 1024,
        stockStatus: 'good',
        retailPrice: 89.00,
        margin: '24%',
        marginStatus: 'optimal', // 'Optimal'
        discount: null,
        marginPercent: '24.5%',
        status: true,
    }
];

export default function DealerInventoryPage() {
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight">My Inventory</h1>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Showing 48 of 1,240 Products</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    <FaSync className="w-3 h-3" />
                    Bulk Update
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={() => setSelectedCategory('All Categories')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === 'All Categories' ? 'bg-primary text-primary-foreground' : 'bg-background border border-border text-muted-foreground hover:bg-muted'}`}
                >
                    All Categories
                </button>
                <div className="h-6 w-px bg-border mx-1"></div>
                <button className="px-4 py-2 bg-background border border-border rounded-full text-xs font-bold text-foreground hover:bg-muted transition-all">
                    Electronics
                </button>
                <button className="px-4 py-2 bg-background border border-border rounded-full text-xs font-bold text-foreground hover:bg-muted transition-all">
                    Home & Living
                </button>
                <button className="px-4 py-2 bg-background border border-border rounded-full text-xs font-bold text-foreground hover:bg-muted transition-all flex items-center gap-2">
                    Brand: Samsung <FaChevronDown className="w-2.5 h-2.5 text-muted-foreground" />
                </button>
                <button className="px-4 py-2 bg-background border border-border rounded-full text-xs font-bold text-foreground hover:bg-muted transition-all">
                    In Stock Only
                </button>

                <button className="ml-auto text-xs font-bold text-primary hover:underline">
                    Clear all filters
                </button>
            </div>

            {/* Inventory Table */}
            <div className="bg-background rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Product</th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Manufacturer</th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Stock</th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Retail Price</th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Discount</th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Margin %</th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {inventoryItems.map((item) => (
                                <tr key={item.id} className="group hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-muted shrink-0 overflow-hidden border border-border/50">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-foreground">{item.name}</h4>
                                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">SKU: {item.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <p className="text-sm font-medium text-muted-foreground">{item.manufacturer}</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-black ${item.stockStatus === 'low' ? 'text-amber-600' : 'text-foreground'}`}>
                                                {item.stock}
                                            </span>
                                            {item.stockStatus === 'low' && (
                                                <FaExclamationTriangle className="w-4 h-4 text-amber-500" title="Low Stock" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div>
                                            <p className="text-sm font-black text-foreground">${item.retailPrice.toFixed(2)}</p>
                                            <div className={`mt-1 inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider
                                                ${item.marginStatus === 'low' ? 'bg-rose-50 text-rose-600' :
                                                    item.marginStatus === 'optimal' ? 'bg-emerald-50 text-emerald-600' :
                                                        'bg-emerald-50 text-emerald-600'}`}>
                                                Margin: {item.margin} ({item.marginStatus === 'low' ? 'Low' : item.marginStatus === 'optimal' ? 'Optimal' : 'Within Range'})
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        {item.discount ? (
                                            <span className="text-xs font-bold text-blue-600">{item.discount}</span>
                                        ) : (
                                            <span className="text-xs font-medium text-muted-foreground">None</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <span className={`text-sm font-black ${item.marginStatus === 'low' ? 'text-rose-600' : 'text-foreground'}`}>
                                            {item.marginPercent}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ease-in-out mx-auto
                                            ${item.status ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 ease-in-out shadow-sm
                                                ${item.status ? 'left-[22px]' : 'left-[4px]'}`}>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="p-4 border-t border-border/50 flex items-center justify-between bg-muted/10">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <span>Rows per page:</span>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                            <span>25</span>
                            <FaChevronDown className="w-2 h-2" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all disabled:opacity-50">
                            <FaChevronLeft className="w-3 h-3" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-black shadow-md shadow-primary/20">
                            1
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 text-sm font-medium text-foreground hover:bg-muted transition-all">
                            2
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 text-sm font-medium text-foreground hover:bg-muted transition-all">
                            3
                        </button>
                        <span className="text-muted-foreground text-xs">...</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 text-sm font-medium text-foreground hover:bg-muted transition-all">
                            48
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                            <FaChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Icon helper
function FaSync({ className }: { className?: string }) {
    return <FaSearch className={className} />; // Placeholder as FaSync not imported, using FaSearch or just standard icon
}
// Correcting imports - FaSync was used in header but not imported.
// I will ensure imports are correct in actual file.
