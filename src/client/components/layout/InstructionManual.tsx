'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, ChevronRight, Search } from 'lucide-react';
import Lottie from 'lottie-react';
import scrollDownAnimation from '../../../../public/scroll-down.json';
import { useAuth } from '@/client/context/AuthContext';
import {
    GUEST_MANUAL,
    CUSTOMER_MANUAL,
    SELLER_MANUAL,
    MANUFACTURER_MANUAL,
    RoleManual
} from '@/client/data/manualContent';

interface InstructionManualProps {
    isOpen: boolean;
    onClose: () => void;
}

const InstructionManual: React.FC<InstructionManualProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [showScrollIndicator, setShowScrollIndicator] = React.useState(true);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        // Hide indicator if user is within 20px of the bottom
        if (scrollTop + clientHeight >= scrollHeight - 20) {
            setShowScrollIndicator(false);
        } else {
            setShowScrollIndicator(true);
        }
    };

    let manual: RoleManual = GUEST_MANUAL;
    if (user?.role === 'CUSTOMER') manual = CUSTOMER_MANUAL;
    else if (user?.role === 'SELLER') manual = SELLER_MANUAL;
    else if (user?.role === 'MANUFACTURER') manual = MANUFACTURER_MANUAL;
    else if (user?.role === 'ADMIN') return null; // Admin manual not exposed

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
                    />

                    {/* Side Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-[450px] bg-white dark:bg-slate-900 shadow-2xl z-[9999] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <HelpCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{manual.title}</h2>
                                    <p className="text-sm text-slate-400 opacity-90">NovaMart User Guide</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar relative"
                        >
                            <section className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                    "{manual.welcomeMessage}"
                                </p>
                            </section>

                            <div className="space-y-10">
                                {manual.sections.map((section, sIdx) => (
                                    <div key={sIdx} className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            {section.icon && (
                                                <div className="p-2 bg-slate-100 dark:bg-slate-800 text-primary dark:text-slate-200 rounded-lg">
                                                    <section.icon className="w-5 h-5" />
                                                </div>
                                            )}
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                                {section.title}
                                            </h3>
                                        </div>

                                        <p className="text-sm text-slate-500 dark:text-slate-400 pl-11">
                                            {section.description}
                                        </p>

                                        {section.items && (
                                            <div className="pl-11 space-y-4">
                                                {section.items.map((item, iIdx) => (
                                                    <div key={iIdx} className="flex gap-3 group">
                                                        <div className="mt-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-primary group-hover:scale-150 transition-all" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                                {item.title}
                                                            </h4>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Scroll Down Animation */}
                            <AnimatePresence>
                                {showScrollIndicator && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="sticky bottom-0 left-0 right-0 flex justify-center pointer-events-none pb-2"
                                    >
                                        <div className="w-12 h-12 invert brightness-0">
                                            <Lottie animationData={scrollDownAnimation} loop={true} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer / CTA */}
                        {!user && (
                            <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                                <button
                                    onClick={() => window.location.href = '/auth/login'}
                                    className="w-full py-3 bg-primary hover:bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-black/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Get Started with NovaMart
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default InstructionManual;
