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
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl bg-zinc-900 rounded-[10px] shadow-2xl z-[160] overflow-hidden border border-white/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 md:px-10 py-6 md:py-8 border-b border-white/10">
                            <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight">
                                {content.title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white touch-target"
                            >
                                <FaTimes className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 md:px-10 py-8 md:py-12 max-h-[75vh] md:max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <div
                                className="prose prose-sm md:prose-base max-w-none text-gray-300 prose-headings:text-white prose-strong:text-white prose-a:text-primary hover:prose-a:text-primary/80"
                                dangerouslySetInnerHTML={{ __html: content.content }}
                            />
                        </div>

                        {/* Footer */}
                        <div className="px-6 md:px-10 py-6 md:py-8 border-t border-white/10 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-8 py-4 bg-white text-black text-sm font-semibold rounded-[10px] hover:scale-[1.02] transition-all shadow-xl shadow-white/5 touch-target"
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
