'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaLock } from 'react-icons/fa';

const bestsellers = [
    {
        id: 1,
        title: "The 'Bureaucrat' Chair",
        category: "Office",
        image: "/assets/BestSeller.png",
        price: "₹899",
        status: "In Stock"
    },
    {
        id: 2,
        title: "The 'Classic' Chair",
        category: "Living",
        image: "/assets/BestSeller2.png",
        price: "₹1,299",
        status: "Low Stock"
    },
    {
        id: 3,
        title: "The 'Classic' Chair",
        category: "Royal",
        image: "/assets/BestSeller3.png",
        price: "₹1,589",
        status: "Sold Out",
        locked: true
    },
    {
        id: 4,
        title: "The 'Diplomat' Chair",
        category: "Executive",
        image: "/assets/BestSeller4.png",
        price: "₹1,150",
        status: "Pre-order"
    },
    {
        id: 5,
        title: "The 'Intelligent' Chair",
        category: "Modern",
        image: "/assets/BestSeller5.png",
        price: "₹950",
        status: "In Stock"
    }
];

export default function BestsellerSlider() {
    // Center index starts at 2 (the 3rd item)
    const [currentIndex, setCurrentIndex] = useState(2);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % bestsellers.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + bestsellers.length) % bestsellers.length);
    };

    // Auto-play effect
    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    // Calculate the position of each slide relative to the current index
    const getPosition = (index: number) => {
        const diff = (index - currentIndex + bestsellers.length) % bestsellers.length;

        if (diff === 0) return 'center';
        if (diff === 1) return 'right1';
        if (diff === 2) return 'right2';
        if (diff === bestsellers.length - 1) return 'left1';
        if (diff === bestsellers.length - 2) return 'left2';
        return 'hidden';
    };

    const variants = {
        center: {
            x: 0,
            scale: 1.2,
            zIndex: 50,
            opacity: 1,
            rotateY: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        },
        left1: {
            x: -220,
            scale: 0.9,
            zIndex: 40,
            opacity: 0.8,
            rotateY: 25,
            transition: { duration: 0.5, ease: "easeOut" }
        },
        left2: {
            x: -400,
            scale: 0.7,
            zIndex: 30,
            opacity: 0.5,
            rotateY: 45,
            transition: { duration: 0.5, ease: "easeOut" }
        },
        right1: {
            x: 220,
            scale: 0.9,
            zIndex: 40,
            opacity: 0.8,
            rotateY: -25,
            transition: { duration: 0.5, ease: "easeOut" }
        },
        right2: {
            x: 400,
            scale: 0.7,
            zIndex: 30,
            opacity: 0.5,
            rotateY: -45,
            transition: { duration: 0.5, ease: "easeOut" }
        },
        hidden: {
            x: 0,
            scale: 0,
            zIndex: 0,
            opacity: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section className="py-20 overflow-hidden relative min-h-[700px] flex flex-col justify-center">
            <div className="max-w-[1600px] mx-auto px-8 w-full">
               

                <div className="relative h-[500px] flex items-center justify-center perspective-1000">
                    {bestsellers.map((item, index) => {
                        const position = getPosition(index);
                        const isCenter = position === 'center';

                        return (
                            <motion.div
                                key={item.id}
                                variants={variants as any}
                                initial="hidden"
                                animate={position}
                                className="absolute w-[300px] h-[420px] rounded-[30px] shadow-2xl overflow-hidden cursor-pointer bg-white"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    perspective: '1000px',
                                    backgroundImage: `url(${item.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    boxShadow: isCenter ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none'
                                } as any}
                                onClick={() => {
                                    if (position === 'left1') handlePrev();
                                    if (position === 'right1') handleNext();
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                                {item.locked && (
                                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                                        <FaLock className="w-3 h-3 text-white" />
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 w-full p-8">
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-1">{item.title}</h3>
                                    {isCenter && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="text-xl font-bold text-white">{item.price}</span>
                                            <span className="text-[10px] font-bold text-white/60 line-through uppercase tracking-widest">{item.status}</span>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Pagination Dots */}
                <div className="flex items-center justify-center gap-3 mt-12">
                    {bestsellers.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`transition-all duration-300 rounded-full ${idx === currentIndex
                                ? 'w-8 h-2 bg-black'
                                : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </section>
    );
}
