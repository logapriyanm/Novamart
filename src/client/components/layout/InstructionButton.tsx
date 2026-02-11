'use client';

import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/client/context/AuthContext';
import InstructionManual from './InstructionManual';

const InstructionButton: React.FC = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    let buttonText = "How NovaMart Works";
    if (user?.role === 'CUSTOMER') buttonText = "Customer User Manual";
    else if (user?.role === 'DEALER') buttonText = "Dealer / Seller User Manual";
    else if (user?.role === 'MANUFACTURER') buttonText = "Manufacturer User Manual";
    else if (user?.role === 'ADMIN') return null;

    return (
        <>
            <div className="fixed bottom-6 right-6 z-[9997] flex flex-col items-end gap-2">
                <AnimatePresence>
                    {showTooltip && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl mb-1 mr-1 whitespace-nowrap"
                        >
                            Open Help Manual
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#171717' }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setIsOpen(true)}
                    className="h-12 px-6 bg-primary text-white rounded-[10px] shadow-lg shadow-black/20 flex items-center justify-center transition-all group relative overflow-hidden"
                >
                    <span className="font-bold text-sm tracking-wide relative z-10 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        {buttonText}
                    </span>

                    {/* Animated background pulse */}
                    <div className="absolute inset-0 bg-white/5 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full" />
                </motion.button>
            </div>

            <InstructionManual isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default InstructionButton;
