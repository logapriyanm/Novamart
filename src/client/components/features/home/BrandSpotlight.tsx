'use client';

import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

interface BrandSpotlightProps {
    setups?: { name: string; description: string; image: string; link: string }[];
}

export default function BrandSpotlight({ setups = [] }: BrandSpotlightProps) {
    if (setups.length === 0) return null;

    return (
        <div className="py-3">
            <div className="flex flex-col gap-2 mb-10 text-center">
                <h2 className="text-3xl font-black text-black uppercase tracking-tight italic">Premium <span className="text-black/40">Setups</span></h2>
                <p className="text-black/40 font-bold text-xs uppercase tracking-[0.2em]">Curated Collections for Your Modern Home</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px] lg:h-[400px]">
                {setups.map((setup, idx) => (
                    <Link
                        href={setup.link}
                        key={idx}
                        className="group relative h-full rounded-[10px] overflow-hidden flex flex-col justify-end p-8 cursor-pointer border border-foreground/10"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img src={setup.image} alt={setup.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 w-fit px-4 py-2 rounded-[10px] mb-4">
                                <span className="text-white font-black uppercase tracking-widest text-[10px]">{setup.name} Collection</span>
                            </div>

                            <h3 className="text-2xl font-black text-white italic mb-2 uppercase">{setup.description}</h3>

                            <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span>Explore Collection</span>
                                <FaArrowRight className="w-3 h-3" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
