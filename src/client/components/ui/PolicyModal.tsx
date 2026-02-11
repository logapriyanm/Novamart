'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { policyContent, PolicyKey } from '../../data/sitePolicies';

interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    policyKey: PolicyKey | null;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, policyKey }) => {
    if (!policyKey) return null;

    const content = policyContent[policyKey];

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
                        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl bg-background rounded-[10px] shadow-2xl z-[160] overflow-hidden border border-foreground/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 md:px-10 py-6 md:py-8 border-b border-foreground/5">
                            <h2 className="text-xl md:text-3xl font-black text-foreground tracking-tight italic uppercase">
                                {content.title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 rounded-full hover:bg-foreground/5 transition-colors text-foreground/40 hover:text-black touch-target"
                            >
                                <FaTimes className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 md:px-10 py-8 md:py-12 max-h-[75vh] md:max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <div
                                className="prose prose-sm md:prose-base max-w-none text-foreground/70"
                                dangerouslySetInnerHTML={{ __html: content.content }}
                            />
                        </div>

                        {/* Footer */}
                        <div className="px-6 md:px-10 py-6 md:py-8 border-t border-foreground/5 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-[10px] hover:scale-[1.02] transition-all shadow-xl shadow-black/20 touch-target"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
