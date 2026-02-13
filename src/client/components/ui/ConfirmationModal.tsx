'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaExclamationCircle, FaInfoCircle, FaTimes, FaCheck } from 'react-icons/fa';

export type ConfirmationVariant = 'danger' | 'warning' | 'info';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ConfirmationVariant;
    isLoading?: boolean;
}

const VARIANT_STYLES = {
    danger: {
        icon: FaExclamationTriangle,
        headerBg: 'bg-danger/10',
        headerText: 'text-danger',
        buttonBg: 'bg-danger hover:bg-danger/90',
        buttonText: 'text-white',
        iconBg: 'bg-danger/20',
    },
    warning: {
        icon: FaExclamationCircle,
        headerBg: 'bg-warning/10',
        headerText: 'text-warning',
        buttonBg: 'bg-warning hover:bg-warning/90',
        buttonText: 'text-white',
        iconBg: 'bg-warning/20',
    },
    info: {
        icon: FaInfoCircle,
        headerBg: 'bg-primary/10',
        headerText: 'text-primary',
        buttonBg: 'bg-primary hover:bg-primary/90',
        buttonText: 'text-white',
        iconBg: 'bg-primary/20',
    },
};

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    isLoading = false,
}: ConfirmationModalProps) {
    const styles = VARIANT_STYLES[variant];
    const Icon = styles.icon;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={!isLoading ? onClose : undefined}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-md bg-white rounded-[10px] shadow-2xl overflow-hidden border border-foreground/10"
                >
                    {/* Header Icon Area */}
                    <div className={`p-6 flex flex-col items-center justify-center text-center border-b border-foreground/5 ${styles.headerBg}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${styles.iconBg} ${styles.headerText}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <h3 className={`text-lg font-bold tracking-tight ${styles.headerText}`}>
                            {title}
                        </h3>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center">
                        <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                            {description}
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 bg-slate-50 border-t border-foreground/5 flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-white border border-foreground/10 rounded-[10px] text-sm font-semibold text-foreground/60 hover:bg-slate-50 hover:text-foreground transition-colors disabled:opacity-50"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 py-3 px-4 rounded-[10px] text-sm font-semibold shadow-lg transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${styles.buttonBg} ${styles.buttonText}`}
                        >
                            {isLoading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <FaCheck className="w-3 h-3" />
                                    {confirmLabel}
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
