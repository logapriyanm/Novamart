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

    // Only hide for admins or if no role is present (though guests might want a manual)
    if (user?.role === 'ADMIN') return null;

    let tooltipText = "Help Guide";
    if (user?.role === 'CUSTOMER') tooltipText = "Customer Manual";
    else if (user?.role === 'DEALER') tooltipText = "Dealer Manual";
    else if (user?.role === 'MANUFACTURER') tooltipText = "Manufacturer Manual";

    return (
        <>
            <div className="fixed bottom-6 right-6 z-[9997] flex flex-col items-end gap-2 pointer-events-none">
                <AnimatePresence>
                    {showTooltip && (
                        <motion.div
                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            className="pointer-events-auto bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl mb-1 mr-2 whitespace-nowrap border border-slate-700 backdrop-blur-sm"
                        >
                            {tooltipText}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                        scale: 1,
                        rotate: 0,
                        boxShadow: "0px 10px 20px rgba(0,0,0,0.2)"
                    }}
                    whileHover={{
                        scale: 1.1,
                        rotate: 15,
                        boxShadow: "0px 15px 30px rgba(59, 130, 246, 0.4)" // Blue glow
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setIsOpen(true)}
                    className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 bg-white text-slate-900 border border-slate-100 rounded-full flex items-center justify-center transition-colors group relative overflow-hidden"
                >
                    {/* Pulsing ring behind (if needed, currently shadow handles it) */}

                    <span className="relative z-10 flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600 fill-blue-50" strokeWidth={2.5} />
                    </span>

                    {/* Subtle pulse animation inside */}
                    <motion.div
                        className="absolute inset-0 bg-blue-100 rounded-full opacity-0"
                        animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    />
                </motion.button>
            </div>

            <InstructionManual isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default InstructionButton;
