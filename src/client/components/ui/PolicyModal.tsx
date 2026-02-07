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
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-background rounded-3xl shadow-2xl z-[160] overflow-hidden border border-foreground/5"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-foreground/5 bg-surface">
                            <h2 className="text-xl font-black text-foreground tracking-tight">
                                {content.title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 rounded-full hover:bg-foreground/5 transition-colors text-foreground/40 hover:text-foreground"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div
                                className="prose prose-sm max-w-none text-foreground/70"
                                dangerouslySetInnerHTML={{ __html: content.content }}
                            />
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-6 bg-surface border-t border-foreground/5 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 bg-primary text-background text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
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
