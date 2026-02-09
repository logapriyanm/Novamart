'use client';

import React from 'react';
import Link from 'next/link';
import { FaPlus, FaShareAlt } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { useSnackbar } from '../../../context/SnackbarContext';
import { useCart } from '../../../context/CartContext';
import OptimizedImage from '../../ui/OptimizedImage';

const recommendations = [
    {
        id: 'r1',
        name: 'Silent Mechanical Keyboard',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=200&auto=format&fit=crop'
    },
    {
        id: 'r2',
        name: 'Height Adjustable Converter',
        price: 199.00,
        image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=200&auto=format&fit=crop'
    },
    {
        id: 'r3',
        name: 'USB-C 12-in-1 Docking Station',
        price: 149.00,
        image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?q=80&w=200&auto=format&fit=crop'
    }
];

export default function WishlistSidebar() {
    const { showSnackbar } = useSnackbar();

    const handleShare = () => {
        showSnackbar('Wishlist shared successfully', 'success');
    };

    return (
        <aside className="w-full lg:w-80 space-y-8">
            {/* Recommendations */}
            <div className="bg-white rounded-[10px] p-6 border border-foreground/5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-black text-lg">✨</span>
                    <h3 className="font-black text-black text-[11px] uppercase tracking-widest italic">Recommended for You</h3>
                </div>
                <p className="text-[9px] text-foreground/40 font-black uppercase tracking-widest mb-6 leading-relaxed italic">
                    Based on your "Home Office" wishlist and recent saves.
                </p>

                <div className="space-y-6">
                    {recommendations.map((item) => (
                        <Link href={`/products/${item.id}`} key={item.id} className="flex gap-4 group">
                            <div className="w-12 h-12 bg-background rounded-[5px] overflow-hidden shrink-0 border border-foreground/5 group-hover:border-black/10 transition-colors">
                                <OptimizedImage
                                    src={item.image}
                                    alt={item.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[10px] font-black text-black uppercase tracking-widest line-clamp-1 group-hover:text-black/60 transition-colors italic">
                                    {item.name}
                                </h4>
                                <p className="text-[9px] text-foreground/40 font-black uppercase tracking-widest mb-1 italic">From ${item.price.toFixed(2)}</p>
                                <button className="text-[9px] font-black text-black uppercase tracking-widest flex items-center gap-1 hover:underline">
                                    Quick Add <FaPlus className="w-2 h-2" />
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>

                <Link href="/recommendations" className="block w-full py-3 mt-6 border border-foreground/5 text-black text-center rounded-[10px] text-[9px] font-black uppercase tracking-widest hover:bg-background transition-colors italic">
                    View All Recommendations
                </Link>
            </div>

            {/* Wishlist Overview */}
            <div className="bg-black/5 rounded-[10px] p-6 border border-black/10">
                <h3 className="font-black text-black text-[11px] uppercase tracking-widest italic mb-4">Wishlist Overview</h3>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-foreground/40 italic">Total Collections</span>
                        <span className="text-black">4</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-foreground/40 italic">Items Pending Dealer</span>
                        <span className="text-black">8</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest pt-3 border-t border-black/10">
                        <span className="text-foreground/40 italic">Estimated Total Value</span>
                        <span className="text-black text-sm">$4,856.00</span>
                    </div>
                </div>

                <button
                    onClick={handleShare}
                    className="w-full py-3 bg-black text-white rounded-[10px] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 italic"
                >
                    <FaShareAlt className="w-3 h-3" />
                    Share List with Team
                </button>
            </div>
        </aside>
    );
}
