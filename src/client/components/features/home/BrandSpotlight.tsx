'use client';

import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

const BRANDS = [
    {
        name: 'Samsung',
        description: 'AI-Powered Home Living',
        image: 'https://images.unsplash.com/photo-1610433572201-fa95154c6945?q=80&w=800', // Smart TV / Appliance
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
        color: 'bg-blue-900',
        textColor: 'text-blue-900',
        link: '/products?brands=Samsung'
    },
    {
        name: 'LG',
        description: 'Life\'s Good with OLED',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f32721?q=80&w=800', // Washing machine
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg',
        color: 'bg-[#C5004D]',
        textColor: 'text-[#C5004D]',
        link: '/products?brands=LG'
    },
    {
        name: 'Sony',
        description: 'Premium Audio Experience',
        image: 'https://images.unsplash.com/photo-1615615228002-890bb61c6e10?q=80&w=800', // Headphones
        logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg',
        color: 'bg-black',
        textColor: 'text-black',
        link: '/products?brands=Sony'
    },
];

export default function BrandSpotlight() {
    return (
        <div className="py-20">
            <div className="flex flex-col gap-2 mb-10 text-center">
                <h2 className="text-3xl font-black text-[#1E293B] uppercase tracking-tight">Premium <span className="text-primary">Brands</span></h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Official Partners & Authorized Sellers</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px] lg:h-[400px]">
                {BRANDS.map((brand, idx) => (
                    <Link
                        href={brand.link}
                        key={idx}
                        className="group relative h-full rounded-[2rem] overflow-hidden flex flex-col justify-end p-8 cursor-pointer"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img src={brand.image} alt={brand.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 w-fit px-4 py-2 rounded-lg mb-4">
                                <span className="text-white font-black uppercase tracking-widest text-[10px]">{brand.name} Authorized</span>
                            </div>

                            <h3 className="text-2xl font-black text-white italic mb-2">{brand.description}</h3>

                            <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span>Explore Store</span>
                                <FaArrowRight className="w-3 h-3" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
