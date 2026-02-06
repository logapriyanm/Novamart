'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaStar as Star, FaQuoteLeft as Quote } from 'react-icons/fa';

export type TestimonialVariant = 'CENTRIC' | 'QUOTE_FEATURE' | 'HORIZONTAL' | 'CLEAN';

interface TestimonialProps {
    name: string;
    role: string;
    company?: string;
    content: string;
    avatar: string;
    rating?: number;
    variant?: TestimonialVariant;
    className?: string;
}

export const TestimonialCard = ({
    name,
    role,
    company,
    content,
    avatar,
    rating = 5,
    variant = 'CENTRIC',
    className = ''
}: TestimonialProps) => {
    const renderStars = () => (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-3 h-3 ${i < rating ? 'fill-[#10367D] text-[#10367D]' : 'text-slate-200'}`}
                />
            ))}
        </div>
    );

    switch (variant) {
        case 'QUOTE_FEATURE':
            return (
                <motion.div
                    whileHover={{ y: -5 }}
                    className={`bg-white/40 backdrop-blur-md border border-[#10367D]/10 rounded-[2.5rem] p-8 relative overflow-hidden group ${className}`}
                >
                    <Quote className="absolute top-6 right-8 w-12 h-12 text-[#10367D]/10 transition-transform group-hover:scale-110" />
                    <div className="flex flex-col h-full">
                        <p className="text-[#1E293B]/80 text-sm leading-relaxed mb-6 italic relative z-10">
                            "{content}"
                        </p>
                        <div className="mt-auto flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                <img src={avatar} alt={name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#10367D]">{name}</h4>
                                <p className="text-[10px] text-[#1E293B]/60 font-bold uppercase tracking-wider">{role} {company && `• ${company}`}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            );

        case 'HORIZONTAL':
            return (
                <motion.div
                    whileHover={{ y: -5 }}
                    className={`bg-white/40 backdrop-blur-md border border-[#10367D]/10 rounded-3xl p-6 flex gap-6 items-start ${className}`}
                >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shrink-0 shadow-xl">
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <div className="mb-3">{renderStars()}</div>
                        <p className="text-[#1E293B]/80 text-sm leading-relaxed mb-4">
                            {content}
                        </p>
                        <div className="flex items-center justify-between border-t border-[#10367D]/5 pt-4">
                            <div className="flex flex-col">
                                <h4 className="text-sm font-bold text-[#1E293B]">{name}</h4>
                                <span className="text-[10px] text-[#10367D]/60 font-medium">{role}</span>
                            </div>
                            <span className="text-[10px] font-black text-[#10367D]/20 uppercase italic">{company}</span>
                        </div>
                    </div>
                </motion.div>
            );

        case 'CLEAN':
            return (
                <motion.div
                    whileHover={{ y: -5 }}
                    className={`bg-white/40 backdrop-blur-md border border-[#10367D]/10 rounded-[2rem] p-8 text-center ${className}`}
                >
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white mx-auto -mt-16 mb-4 shadow-xl">
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm font-bold text-[#10367D] mb-3 leading-tight">"{content}"</p>
                    {renderStars()}
                    <div className="mt-4 pt-4 border-t border-[#10367D]/5">
                        <h4 className="text-xs font-black text-[#1E293B] uppercase tracking-wide">{name}</h4>
                        <p className="text-[10px] text-[#10367D]/60 font-bold">{role}</p>
                    </div>
                </motion.div>
            );

        default: // CENTRIC
            return (
                <motion.div
                    whileHover={{ y: -5 }}
                    className={`bg-white/40 backdrop-blur-md border border-[#10367D]/10 rounded-3xl p-8 flex flex-col items-center text-center ${className}`}
                >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden mb-6 border-2 border-white shadow-2xl rotate-3 translate-x-1 group-hover:rotate-0 transition-transform">
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div className="mb-4">{renderStars()}</div>
                    <p className="text-[#1E293B]/70 text-sm leading-relaxed mb-6 font-medium">
                        {content}
                    </p>
                    <h4 className="text-lg font-bold text-[#10367D] leading-none mb-1">{name}</h4>
                    <span className="text-[10px] font-bold text-[#10367D]/40 uppercase tracking-widest">{role}</span>
                    {company && <span className="text-[9px] text-[#1E293B]/40 font-bold mt-1">{company}</span>}
                </motion.div>
            );
    }
};

