'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaHistory, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

interface ContinueViewingProps {
    data: any[];
}

export default function ContinueViewing({ data }: ContinueViewingProps) {
    if (!data || data.length === 0) return null;

    return (
        <section className="mb-16">
            <div className="flex items-center gap-3 mb-6 opacity-70">
                <FaHistory className="text-slate-400" />
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Continue where you left off</h3>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {data.map((product, idx) => (
                    <Link href={`/products/${product.id}`} key={product.id} className="min-w-[280px]">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-3 border border-slate-100 flex items-center gap-4 hover:border-[#10367D] transition-colors group cursor-pointer shadow-sm hover:shadow-md"
                        >
                            <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden shrink-0">
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/100'}
                                    alt={product.name}
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform p-2"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-black text-[#1E293B] truncate mb-1">{product.name}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-[#10367D]">₹{Number(product.basePrice).toLocaleString()}</span>
                                    <span className="text-[9px] font-bold text-slate-400 line-through">₹{(Number(product.basePrice) * 1.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#10367D]/5 flex items-center justify-center group-hover:bg-[#10367D] transition-colors">
                                <FaArrowRight className="w-3 h-3 text-[#10367D] group-hover:text-white transition-colors" />
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
