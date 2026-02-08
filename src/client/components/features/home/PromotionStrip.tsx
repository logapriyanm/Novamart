'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaBullhorn, FaArrowRight } from 'react-icons/fa';

interface PromotionStripProps {
    message: string;
}

export default function PromotionStrip({ message }: PromotionStripProps) {
    if (!message) return null;

    return (
        <div className="bg-primary overflow-hidden py-3 relative border-y border-white/10 group">
            <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="flex whitespace-nowrap items-center gap-12"
            >
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                <FaBullhorn className="text-white w-3 h-3" />
                            </div>
                            <span className="text-white font-black text-sm uppercase tracking-widest">
                                {message}
                            </span>
                        </div>
                        <FaArrowRight className="text-white/40 group-hover:translate-x-2 transition-transform" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
