'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaGift } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

import { useAuth } from '../../../context/AuthContext';

const GUEST_SLIDES = [
    {
        id: 1,
        tag: 'Energy Efficient Refrigerators',
        title: "Buy Smart",
        highlight: "Refrigerators",
        description:
            "Shop the best refrigerators online with advanced cooling technology, large storage capacity, and energy‑efficient performance. Perfect for modern homes.",
        discount: "Up to 35% OFF",
        subText: "Double Door & Smart Inverter Models",
        ctaText: "Buy Refrigerators Online",
        ctaLink: "/products?category=refrigerators",
        secondaryCta: "Refrigerator Buying Guide",
        image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        tag: 'Best Washing Machines',
        title: "Smart",
        highlight: "Laundry Care",
        description:
            "Discover top‑rated washing machines with powerful cleaning, low water usage, and smart fabric care. Compare prices and features before you buy.",
        discount: "Flat 25% OFF",
        subText: "Front Load & Fully Automatic",
        ctaText: "Buy Washing Machines",
        ctaLink: "/products?category=washing-machines",
        secondaryCta: "Compare Washing Machines",
        image: "https://images.unsplash.com/photo-1582735689369-aa669e38f6b0?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        tag: '5‑Star Air Conditioners',
        title: "Powerful",
        highlight: "Cooling",
        description:
            "Buy energy‑efficient air conditioners with fast cooling, silent operation, and inverter technology. Save electricity while staying comfortable.",
        discount: "Free Installation",
        subText: "5‑Star Inverter ACs",
        ctaText: "Shop Air Conditioners",
        ctaLink: "/products?category=air-conditioners",
        secondaryCta: "AC Power & Energy Calculator",
        image: "https://images.unsplash.com/photo-1590794144662-790113c1c8ea?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 4,
        tag: 'Smart Kitchen Appliances',
        title: "Modern",
        highlight: "Kitchen",
        description:
            "Upgrade your kitchen with smart ovens, microwaves, and cooking appliances. Enjoy precise temperature control and faster cooking results.",
        discount: "Bundle Offers Available",
        subText: "Oven & Microwave Combos",
        ctaText: "Shop Kitchen Appliances",
        ctaLink: "/products?category=kitchen-appliances",
        secondaryCta: "Kitchen Appliance Recipes",
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop"
    }
];

const LOGGED_IN_SLIDES = [
    {
        id: 1,
        tag: 'Welcome Back',
        title: "Exclusive",
        highlight: "Deals For You",
        description: "Explore personalized recommendations and huge savings on the products you love. Don't miss our daily member-only deals.",
        discount: "Up to 50% OFF",
        subText: "Member Exclusive Deals",
        ctaText: "View My Deals",
        ctaLink: "/products?deals=exclusive",
        secondaryCta: "My Orders",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        tag: 'Business Solutions',
        title: "Wholesale",
        highlight: "Bulk Orders",
        description: "Streamline your business procurement with our dedicated B2B portal. Get volume discounts and priority shipping.",
        discount: "Volume Discounts",
        subText: "On Orders Over ₹50k",
        ctaText: "Shop Wholesale",
        ctaLink: "/products?mode=wholesale",
        secondaryCta: "Request A Quote",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        tag: 'New Arrivals',
        title: "Latest",
        highlight: "Technology",
        description: "Stay ahead with the newest tech in home appliances. From smart refrigerators to AI-powered washing machines.",
        discount: "Early Access",
        subText: "For Premium Members",
        ctaText: "Shop New Arrivals",
        ctaLink: "/products?sort=newest",
        secondaryCta: "View Catalog",
        image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2057&auto=format&fit=crop"
    }
];

export default function HeroSection() {
    const { isAuthenticated } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = isAuthenticated ? LOGGED_IN_SLIDES : GUEST_SLIDES;

    // Reset index when auth state changes to avoid out of bounds
    useEffect(() => {
        setCurrentIndex(0);
    }, [isAuthenticated]);

    const slideNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const slidePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    // Auto-advance
    useEffect(() => {
        const interval = setInterval(slideNext, 5000);
        return () => clearInterval(interval);
    }, [slideNext, currentIndex]);

    const currentSlide = slides[currentIndex];

    return (
        <section className="w-full pt-8 pb-12">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">


                {/* Main Carousel Card */}
                <div className="relative w-full aspect-[16/16] md:aspect-[16/8] lg:aspect-[21/9] rounded-[32px] overflow-hidden group shadow-2xl">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={`${isAuthenticated ? 'auth' : 'guest'}-${currentIndex}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 w-full h-full flex flex-col md:flex-row bg-gradient-to-r from-slate-50 to-slate-100/50"
                        >
                            {/* Content Side (Left) */}
                            <div className="relative z-20 w-full md:w-[55%] p-8 md:p-12 lg:p-16 flex flex-col justify-center items-start space-y-6">

                                {/* Tag */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/50 backdrop-blur-sm border border-white/40 text-slate-800"
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
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
                                        {currentSlide.title} <br />
                                        <span className="text-[#10367D]">
                                            {currentSlide.highlight}
                                        </span>
                                    </h1>
                                    <p className="mt-4 text-sm md:text-base font-medium text-slate-600 max-w-lg leading-relaxed">
                                        {currentSlide.description}
                                    </p>
                                </motion.div>

                                {/* Discount Block */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex items-center gap-4 py-2"
                                >
                                    <div>
                                        <div className="text-2xl font-black text-[#10367D]">
                                            {currentSlide.discount}
                                        </div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                            {currentSlide.subText}
                                        </div>
                                    </div>
                                    {/* Social Proof / Avatars */}
                                    <div className="hidden lg:flex -space-x-3 pl-4 border-l border-slate-200/50">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                                        ))}
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-black flex items-center justify-center text-[8px] font-bold text-white">
                                            +4k
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Buttons */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-wrap gap-4 pt-2"
                                >
                                    <Link href={currentSlide.ctaLink} className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white shadow-lg shadow-[#10367D]/30 transition-transform hover:scale-105 active:scale-95 bg-[#10367D]">
                                        {currentSlide.ctaText}
                                    </Link>
                                    <button className="px-8 py-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-600 hover:bg-white transition-colors">
                                        {currentSlide.secondaryCta}
                                    </button>
                                </motion.div>
                            </div>

                            {/* Image Side (Right) */}
                            <div className="relative w-full md:w-[45%] h-64 md:h-full overflow-hidden">
                                {/* The Gradient Mask/Blur Effect */}
                                <div className="absolute inset-y-0 left-0 w-32 md:w-64 z-10 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent"></div>

                                <motion.div
                                    key={`${isAuthenticated ? 'auth' : 'guest'}-${currentIndex}-img`}
                                    initial={{ scale: 1.1, x: 20, opacity: 0 }}
                                    animate={{ scale: 1, x: 0, opacity: 1 }}
                                    transition={{ duration: 0.7 }}
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
                                    className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg flex items-center gap-2 shadow-xl border border-white/50"
                                >
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Free Premium Shipping</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <button
                        onClick={slidePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-white/50 flex items-center justify-center text-slate-800 hover:bg-white hover:scale-110 shadow-lg transition-all"
                    >
                        <FaChevronLeft className="w-4 h-4 ml-[-2px]" />
                    </button>
                    <button
                        onClick={slideNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-white/50 flex items-center justify-center text-slate-800 hover:bg-white hover:scale-110 shadow-lg transition-all"
                    >
                        <FaChevronRight className="w-4 h-4 mr-[-2px]" />
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