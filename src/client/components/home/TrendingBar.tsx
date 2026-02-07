import React from 'react';
import Link from 'next/link';
import { FaChevronRight as ChevronRight } from 'react-icons/fa';

const categories = [
    { name: 'Refrigerators', image: 'https://images.unsplash.com/photo-1571175449180-f8b4d0201d9f?q=80&w=400&auto=format&fit=crop' },
    { name: 'Washing Machines', image: 'https://images.unsplash.com/photo-1626806819282-2c1dc61a0e0c?q=80&w=400&auto=format&fit=crop' },
    { name: 'Air Conditioners', image: 'https://images.unsplash.com/photo-1631545729916-46c23a563c77?q=80&w=400&auto=format&fit=crop' },
    { name: 'Microwave Ovens', image: 'https://images.unsplash.com/photo-1574265353392-0b29c9ccf6bc?q=80&w=400&auto=format&fit=crop' },
    { name: 'Smart TVs', image: 'https://images.unsplash.com/photo-1593359677759-543733a69271?q=80&w=400&auto=format&fit=crop' },
    { name: 'Vacuum Cleaners', image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=400&auto=format&fit=crop' },
    { name: 'Water Purifiers', image: 'https://images.unsplash.com/photo-1585837554808-a19e1371360d?q=80&w=400&auto=format&fit=crop' },
    { name: 'Kitchen Chimneys', image: 'https://images.unsplash.com/photo-1556911220-ebd537d8609a?q=80&w=400&auto=format&fit=crop' },
    { name: 'Mixer Grinders', image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=400&auto=format&fit=crop' },
    { name: 'Steam Irons', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=400&auto=format&fit=crop' },
    { name: 'Dishwashers', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop' },
    { name: 'Air Purifiers', image: 'https://images.unsplash.com/photo-1585771724684-2827df306856?q=80&w=400&auto=format&fit=crop' },
];

export default function TrendingBar() {
    return (
        <div className="max-w-7xl mx-auto px-6 mt-40">
            {/* Trending Categories Section */}
            <div id="trending-appliances" className="bg-surface rounded-3xl p-8 lg:p-12 shadow-2xl shadow-primary/5 border border-foreground/5 relative -mt-28 z-30">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-foreground tracking-tight">Trending Appliances <span className="text-primary font-medium text-lg ml-2 italic">in Your Location</span></h2>
                        <p className="text-foreground/40 text-sm font-bold uppercase tracking-widest mt-2">Verified Direct Factory Supply</p>
                    </div>
                    <Link href="/products" className="group flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest border-2 border-primary/10 px-6 py-3 rounded-2xl hover:bg-primary hover:text-background transition-all">
                        Explore All
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    {categories.map((cat, i) => (
                        <Link key={i} href={`/products?q=${cat.name}`} className="group flex flex-col items-center text-center">
                            <div className="w-full aspect-square rounded-2xl bg-background border border-foreground/5 overflow-hidden mb-4 group-hover:shadow-xl group-hover:shadow-primary/5 transition-all p-4">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <span className="text-xs font-black text-foreground/60 group-hover:text-primary transition-colors">{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

