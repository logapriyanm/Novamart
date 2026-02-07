'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTrophy } from 'react-icons/fa';

const CAROUSEL_IMAGES = [
    {
        url: '/assets/Carousal1.png',
        title: "Modern Kitchen Excellence",
        description: "Transform your culinary experience with our state-of-the-art appliances."
    },
    {
        url: '/assets/Carousal2.png',
        title: "Smart Living Solutions",
        description: "Innovative technology designed for a seamless and comfortable lifestyle."
    },
    {
        url: '/assets/Carousal3.png',
        title: "Eco-Friendly Efficiency",
        description: "Sustainable choices that don't compromise on power or performance."
    },
    {
        url: '/assets/Carousal4.png',
        title: "Premium Design Aesthetics",
        description: "Elegance meets functionality in every detail of our latest collection."
    },
    {
        url: '/assets/Carousal5.png',
        title: "Reliable Performance",
        description: "Engineered for longevity and consistent results you can trust day after day."
    }
];

export default function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideNext = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, []);

    const slidePrev = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(slideNext, 6000);
        return () => clearInterval(timer);
    }, [slideNext]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 1.1
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.9,
            transition: {
                opacity: { duration: 0.4 },
                scale: { duration: 0.6 }
            }
        })
    };

    return (
        <section className="relative w-full  py-8 lg:py-0">
            <div className="max-w-7xl mx-auto px-6 relative">
                {/* Main Carousel Wrapper */}
                <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-[2rem] lg:rounded-[3.5rem] overflow-hidden group  border-4 border-surface/30">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.5 },
                                scale: { duration: 0.8 }
                            }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {/* Background Image */}
                            <img
                                src={CAROUSEL_IMAGES[currentIndex].url}
                                alt={`Carousel Slide ${currentIndex + 1}`}
                                className="w-full h-full object-cover select-none"
                            />

                            {/* Subtle Ambient Overlay */}
                            <div className="absolute inset-0 bg-black/5 z-10" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className="absolute inset-0 z-30 flex items-center justify-between px-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={(e) => { e.stopPropagation(); slidePrev(); }}
                            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white pointer-events-auto hover:bg-primary transition-all active:scale-95"
                        >
                            <FaChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); slideNext(); }}
                            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white pointer-events-auto hover:bg-primary transition-all active:scale-95"
                        >
                            <FaChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Pagination Progress */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex gap-3 px-4 py-2 rounded-2xl bg-black/20 backdrop-blur-lg border border-white/10">
                        {CAROUSEL_IMAGES.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => { setDirection(index > currentIndex ? 1 : -1); setCurrentIndex(index); }}
                                className={`h-1.5 transition-all duration-500 rounded-full ${index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-white/30 hover:bg-white/50'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

