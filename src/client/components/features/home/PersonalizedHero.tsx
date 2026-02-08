'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import Link from 'next/link';

interface PersonalizedHeroProps {
    data: any;
}

export default function PersonalizedHero({ data }: PersonalizedHeroProps) {
    if (!data || !data.category) return null;

    const { category, product } = data;

    return (
        <section className="relative w-full h-[500px] rounded-[3rem] overflow-hidden bg-white shadow-2xl shadow-blue-900/10 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F6CBD] to-[#10367D] opacity-90 z-0" />

            <div className="absolute inset-0 z-0 opacity-20" style={{
                backgroundImage: `url('https://source.unsplash.com/1600x900/?${category}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                mixBlendMode: 'overlay'
            }} />

            <div className="relative z-10 h-full flex flex-col md:flex-row items-center px-12 md:px-20 gap-12">
                <div className="flex-1 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <FaStar className="text-yellow-400" />
                        Selected for you
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-[1.1]"
                    >
                        Top Picks in <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                            {category}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-blue-100 text-lg font-medium max-w-lg mb-8 leading-relaxed"
                    >
                        Based on your recent interests, we've curated a selection of premium {category.toLowerCase()} items just for you.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link href={`/categories/${category.toLowerCase()}`} className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0F6CBD] rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-900/20">
                            Explore Category
                            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {product && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex-1 relative hidden md:block"
                    >
                        <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
                            <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden mb-6 relative">
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/400'}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                />
                                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
                                    Best Match
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-white mb-2 line-clamp-1">{product.name}</h3>
                            <div className="flex items-center justify-between">
                                <p className="text-2xl font-black text-blue-200">₹{parseFloat(product.basePrice).toLocaleString()}</p>
                                <Link
                                    href={`/products/${product.id}`}
                                    className="px-4 py-2 bg-white text-[#0F6CBD] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
