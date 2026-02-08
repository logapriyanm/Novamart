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
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-blue-600 text-lg">✨</span>
                    <h3 className="font-black text-slate-800 text-sm tracking-tight">Recommended for You</h3>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mb-6 leading-relaxed">
                    Based on your "Home Office" wishlist and recent saves.
                </p>

                <div className="space-y-6">
                    {recommendations.map((item) => (
                        <Link href={`/products/${item.id}`} key={item.id} className="flex gap-4 group">
                            <div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100 group-hover:border-blue-200 transition-colors">
                                <OptimizedImage
                                    src={item.image}
                                    alt={item.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                    {item.name}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-medium mb-1">From ${item.price.toFixed(2)}</p>
                                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                                    Quick Add <FaPlus className="w-2 h-2" />
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>

                <Link href="/recommendations" className="block w-full py-3 mt-6 border border-blue-100 text-blue-600 text-center rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors">
                    View All Recommendations
                </Link>
            </div>

            {/* Wishlist Overview */}
            <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100">
                <h3 className="font-black text-blue-900 text-sm tracking-tight mb-4">Wishlist Overview</h3>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Total Collections</span>
                        <span className="font-black text-slate-800">4</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Items Pending Dealer</span>
                        <span className="font-black text-slate-800">8</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-3 border-t border-blue-200/50">
                        <span className="text-slate-500 font-medium">Estimated Total Value</span>
                        <span className="font-black text-slate-800 text-sm">$4,856.00</span>
                    </div>
                </div>

                <button
                    onClick={handleShare}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    <FaShareAlt className="w-3 h-3" />
                    Share List with Team
                </button>
            </div>
        </aside>
    );
}
