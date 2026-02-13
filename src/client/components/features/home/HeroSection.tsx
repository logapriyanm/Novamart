'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaGift } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

import { useAuth } from '../../../context/AuthContext';

interface HeroSectionProps {
    slides?: any[];
}

export default function HeroSection({ slides = [] }: HeroSectionProps) {
    const { isAuthenticated } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 1
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 1
        })
    };

    const slideNext = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const slidePrev = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    // Auto-advance
    useEffect(() => {
        const interval = setInterval(slideNext, 5000);
        return () => clearInterval(interval);
    }, [slideNext]); // Removed currentIndex dependency to prevent continuous re-renders/timing issues

    const currentSlide = slides[currentIndex];

    // Early return if no slides provided to reach this point
    if (!currentSlide || slides.length === 0) {
        return null;
    }

    return (
        <section className="w-full pt-0 pb-0">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
                {/* Main Carousel Card */}
                <div className="relative w-full aspect-[16/16] md:aspect-[16/8] lg:aspect-[21/8] rounded-[32px] overflow-hidden group border border-slate-100/50 shadow-sm">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "tween", ease: "easeInOut", duration: 0.5 },
                                opacity: { duration: 0.2 }
                            }}
                            className="absolute inset-0 w-full h-full flex flex-col md:flex-row bg-white"
                        >
                            {/* Content Side (Left) */}
                            <div className="relative z-20 w-full md:w-[55%] p-6 xs:p-8 md:p-12 lg:p-16 flex flex-col justify-center items-start space-y-4 xs:space-y-6">

                                {/* Tag */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-white/50 backdrop-blur-sm border border-white/40 text-slate-800"
                                >
                                    <FaGift className="w-3 h-3" />
                                    {currentSlide.tag}
                                </motion.div>

                                {/* Title */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h1 className="text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                        {currentSlide.title} <br />
                                        <span className="text-[#10367D]">
                                            {currentSlide.highlight}
                                        </span>
                                    </h1>
                                    <p className="mt-4 text-xs xs:text-sm md:text-base font-medium text-slate-600 max-w-lg leading-relaxed line-clamp-2 xs:line-clamp-none">
                                        {currentSlide.description}
                                    </p>
                                </motion.div>

                                {/* Discount Block */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex items-center gap-4 py-1 xs:py-2"
                                >
                                    <div>
                                        <div className="text-xl xs:text-2xl font-black text-[#10367D]">
                                            {currentSlide.discount}
                                        </div>
                                        <div className="text-sm font-medium text-slate-400">
                                            {currentSlide.subText}
                                        </div>
                                    </div>

                                </motion.div>

                                {/* Buttons */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-wrap gap-3 xs:gap-4 pt-2"
                                >
                                    <Link href={currentSlide.ctaLink} className="px-6 xs:px-8 py-3 xs:py-4 rounded-[10px] font-semibold text-sm text-white shadow-lg shadow-[#10367D]/30 transition-transform hover:scale-105 active:scale-95 bg-[#10367D]">
                                        {currentSlide.ctaText}
                                    </Link>
                                    <button className="px-6 xs:px-8 py-3 xs:py-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-[10px] font-semibold text-sm text-slate-600 hover:bg-white transition-colors">
                                        {currentSlide.secondaryCta}
                                    </button>
                                </motion.div>
                            </div>

                            {/* Image Side (Right) */}
                            <div className="relative w-full md:w-[45%] h-48 xs:h-64 md:h-full overflow-hidden">
                                {/* The Gradient Mask/Blur Effect */}
                                <div className="absolute inset-y-0 left-0 w-32 md:w-64 z-10 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent"></div>

                                <motion.div
                                    key={`${isAuthenticated ? 'auth' : 'guest'}-${currentIndex}-img`}
                                    initial={{ scale: 1.1, x: 20, opacity: 0 }}
                                    animate={{ scale: 1, x: 0, opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 w-full h-full"
                                >
                                    <Image
                                        src={currentSlide.image}
                                        alt={currentSlide.title}
                                        fill
                                        priority
                                        className="object-cover object-center"
                                        sizes="(max-width: 768px) 100vw, 45vw"
                                    />
                                </motion.div>

                                {/* Floating Badge */}
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="absolute top-4 right-4 xs:top-6 xs:right-6 z-20 bg-white/90 backdrop-blur-md px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg flex items-center gap-2 shadow-xl border border-white/50"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-sm font-medium text-slate-800">Free premium shipping</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    {/* Navigation Controls - Premium Glass Effect */}
                    <button
                        onClick={slidePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-slate-900 transition-all duration-300 group"
                    >
                        <FaChevronLeft className="w-4 h-4 ml-[-2px] group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                        onClick={slideNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-slate-900 transition-all duration-300 group"
                    >
                        <FaChevronRight className="w-4 h-4 mr-[-2px] group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 p-2 rounded-full bg-white/30 backdrop-blur-sm">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.id}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-[#10367D]' : 'w-2 bg-slate-400/50 hover:bg-slate-500'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}