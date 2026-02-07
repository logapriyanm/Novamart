'use client';

import React, { useState } from 'react';
import {
    FaSearch, FaFilter, FaShoppingCart, FaLock,
    FaCheckCircle, FaInfoCircle, FaSortAmountDown, FaPlus
} from 'react-icons/fa';
import Link from 'next/link';

// Mock Data matching Image 3
const sourcingProducts = [
    {
        id: 1,
        name: 'LG NanoCell Series 55" 4K Smart TV',
        manufacturer: 'LG',
        manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/LG_logo_%282015%29.svg/2560px-LG_logo_%282015%29.svg.png',
        image: 'https://images.unsplash.com/photo-1593784991095-a20506948430?q=80&w=100&auto=format&fit=crop', // TV
        basePrice: '₹45,000',
        moq: 5,
        status: 'approved', // 'approved', 'restricted'
        category: 'Electronics'
    },
    {
        id: 2,
        name: 'LG AI DD 9kg Front Load Washer',
        manufacturer: 'LG',
        manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/LG_logo_%282015%29.svg/2560px-LG_logo_%282015%29.svg.png',
        image: 'https://images.unsplash.com/photo-1626806775351-538af710f40e?q=80&w=100&auto=format&fit=crop', // Washer
        basePrice: '₹32,500',
        moq: 3,
        status: 'approved',
        category: 'Home Appliances'
    },
    {
        id: 3,
        name: 'Samsung Galaxy S24 Ultra (512GB)',
        manufacturer: 'Samsung',
        manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/Thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png',
        image: 'https://images.unsplash.com/photo-1610945745322-959585527010?q=80&w=100&auto=format&fit=crop', // Phone
        basePrice: '₹1,29,000',
        moq: 10,
        status: 'restricted',
        category: 'Mobile Phones'
    },
    {
        id: 4,
        name: 'iPad Pro 11-inch (M4 Chip) 256GB',
        manufacturer: 'Apple',
        manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=100&auto=format&fit=crop', // iPad
        basePrice: '₹99,900',
        moq: 2,
        status: 'approved',
        category: 'Tablets' // Mapped manually
    },
    {
        id: 5,
        name: 'Sony PlayStation 5 Slim Digital Edition',
        manufacturer: 'Sony',
        manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/2560px-Sony_logo.svg.png',
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=100&auto=format&fit=crop', // PS5
        basePrice: '₹44,900',
        moq: 10,
        status: 'approved',
        category: 'Gaming'
    },
    {
        id: 6,
        name: 'Dyson Purifier Cool Gen1 (White)',
        manufacturer: 'Dyson',
        manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Dyson_logo.svg/2560px-Dyson_logo.svg.png',
        image: 'https://images.unsplash.com/photo-1585771724684-382054863d61?q=80&w=100&auto=format&fit=crop', // Dyson Fan
        basePrice: '₹33,900',
        moq: 5,
        status: 'restricted',
        category: 'Home Appliances'
    },
    {
        id: 7,
        name: 'MacBook Pro 14" (M3 Chip) 16GB RAM',
        manufacturer: 'Apple',
        manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=100&auto=format&fit=crop', // Macbook
        basePrice: '₹1,69,900',
        moq: 1,
        status: 'approved',
        category: 'Laptops'
    },
    {
        id: 8,
        name: 'Sony WH-1000XM5 Wireless Headphones',
        manufacturer: 'Sony',
        manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/2560px-Sony_logo.svg.png',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=100&auto=format&fit=crop', // Headphones
        basePrice: '₹24,990',
        moq: 12,
        status: 'approved',
        category: 'Accessories'
    }
];

const categories = ['All Categories', 'Electronics', 'Home Appliances', 'Mobile Phones', 'Laptops', 'Accessories', 'Kitchen'];

export default function SourcingCatalog() {
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight">Sourcing Catalog</h1>
                    <p className="text-sm font-medium text-muted-foreground mt-1 text-wrap max-w-3xl">
                        Discover and request manufacturer-approved products. Pricing and specifications are strictly managed by the brand owners.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === cat
                                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                        : 'bg-background border border-border text-foreground hover:bg-muted'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Filter Utilities */}
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-foreground hover:bg-muted transition-colors">
                            <FaFilter className="w-3 h-3 text-muted-foreground" />
                            Filters
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-foreground hover:bg-muted transition-colors">
                            Sort: Popular
                            <FaSortAmountDown className="w-3 h-3 text-muted-foreground" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sourcingProducts.map((product) => (
                    <div key={product.id} className="bg-background rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all hover:-translate-y-1">
                        {/* Image Section */}
                        <div className="relative h-48 bg-muted/30 p-6 flex items-center justify-center overflow-hidden">
                            {/* Badge */}
                            <div className="absolute top-3 right-3 z-10">
                                {product.status === 'approved' ? (
                                    <span className="bg-background/90 backdrop-blur-sm border border-border text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider text-foreground">
                                        Approved
                                    </span>
                                ) : (
                                    <span className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                        Access Restricted
                                    </span>
                                )}
                            </div>

                            <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                        </div>

                        {/* Content Section */}
                        <div className="p-5 flex-1 flex flex-col">
                            {/* Manufacturer */}
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Manufacturer: {product.manufacturer}</span>
                                <FaCheckCircle className="w-3 h-3 text-emerald-500" />
                            </div>

                            {/* Title */}
                            <h3 className="text-sm font-black text-foreground leading-snug mb-4 line-clamp-2 min-h-[2.5em]">
                                {product.name}
                                <FaInfoCircle className="inline-block w-3 h-3 text-muted-foreground ml-2 align-middle cursor-help opacity-50 hover:opacity-100" />
                            </h3>

                            {/* Price / MOQ */}
                            <div className="flex justify-between items-end mt-auto mb-4 text-xs">
                                <div>
                                    <p className="text-[10px] text-muted-foreground">Base Price</p>
                                    <p className={`font-black ${product.status === 'restricted' ? 'blur-sm select-none opacity-50' : 'text-foreground'}`}>
                                        {product.basePrice}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-muted-foreground">MOQ</p>
                                    <p className="font-bold text-foreground">{product.moq} units</p>
                                </div>
                            </div>

                            {/* Action Button */}
                            {product.status === 'approved' ? (
                                <Link
                                    href={`/dealer/inventory/add?id=${product.id}`} // Route to our new Add Product Page
                                    className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                                >
                                    <FaShoppingCart className="w-3 h-3" />
                                    Add to My Inventory
                                </Link>
                            ) : (
                                <button className="w-full py-2.5 bg-muted text-muted-foreground rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-muted/80 transition-all cursor-not-allowed">
                                    <FaLock className="w-3 h-3" />
                                    Request Access
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Ensure Link is imported at top
