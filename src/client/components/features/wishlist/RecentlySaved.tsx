'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import OptimizedImage from '../../ui/OptimizedImage';

const savedItems: any[] = [];

export default function RecentlySaved({ onMoveToCart }: { onMoveToCart: (id: string) => void }) {
    if (savedItems.length === 0) return null;
    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Recently Saved for Later</h3>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1">
                    Move all to cart <span className="text-lg">›</span>
                </button>
            </div>

            <div className="space-y-4">
                {savedItems.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 p-2">
                            <OptimizedImage
                                src={item.image}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-black text-slate-800 text-sm mb-1 line-clamp-1">{item.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                Moved from cart on {item.date}
                            </p>
                            <div className="text-lg font-black text-blue-600 mt-1">
                                ${item.price.toFixed(2)}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all">
                                <FaTrash className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onMoveToCart(item.id)}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                            >
                                Move to Cart
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
