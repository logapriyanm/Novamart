import React from 'react';
import Link from 'next/link';
import { FaChevronRight as ChevronRight } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

interface TrendingBarProps {
    categories?: { name: string; image: string }[];
}

export default function TrendingBar({ categories = [] }: TrendingBarProps) {
    const { user, isLoading } = useAuth();

    // Hide component strictly for logged-out users
    // We wait for loading to finish to prevent content flash (optional, but good UX)
    if (isLoading) return null;
    if (categories.length === 0) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 xs:px-6 mt-20 xs:mt-32 md:mt-40">
            {/* Trending Categories Section */}
            <div id="trending-appliances" className="bg-white rounded-[10px] p-6 xs:p-8 lg:p-12 border border-foreground/10 relative -mt-12 xs:-mt-16 md:-mt-20 z-40 shadow-xl shadow-black/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-12 gap-6 sm:gap-0">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight uppercase italic">Trending Appliances <span className="text-black/40 font-bold text-lg ml-2 block sm:inline">in Your Location</span></h2>

                    </div>
                    <Link href="/products" className="group self-start sm:self-auto flex items-center gap-2 text-black text-[10px] font-black uppercase tracking-widest border-2 border-black px-6 py-4 rounded-[10px] hover:bg-black hover:text-white transition-all shadow-lg hover:shadow-black/20">
                        Explore All
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
                    {categories.map((cat, i) => (
                        <Link key={i} href={`/products?q=${cat.name}`} className="group flex flex-col items-center text-center">
                            <div className="w-full aspect-square rounded-[10px] bg-white border border-foreground/5 overflow-hidden mb-4 group-hover:border-black/20 transition-all p-3 shadow-sm group-hover:shadow-md">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <span className="text-[11px] font-black text-foreground/50 group-hover:text-black transition-colors uppercase tracking-tight leading-tight px-2">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

