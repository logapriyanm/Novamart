'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarContextType {
    showSnackbar: (message: string, type?: SnackbarType) => void;
    hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<SnackbarType>('info');
    const [isVisible, setIsVisible] = useState(false);

    const showSnackbar = useCallback((msg: string, t: SnackbarType = 'info') => {
        setMessage(msg);
        setType(t);
        setIsVisible(true);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            setIsVisible(false);
        }, 5000);
    }, []);

    const hideSnackbar = useCallback(() => {
        setIsVisible(false);
    }, []);

    return (
        <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
            {children}
            {/* The Snackbar component itself will be rendered here to avoid nesting issues */}
            <SnackbarUI
                message={message}
                type={type}
                isVisible={isVisible}
                onClose={hideSnackbar}
            />
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

// UI Component (Internal to this file or separate, I'll keep it internal for now but can move if it gets complex)
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface SnackbarUIProps {
    message: string | null;
    type: SnackbarType;
    isVisible: boolean;
    onClose: () => void;
}

const SnackbarUI = ({ message, type, isVisible, onClose }: SnackbarUIProps) => {
    const icons = {
        success: <FaCheckCircle className="w-5 h-5" />,
        error: <FaExclamationCircle className="w-5 h-5" />,
        warning: <FaExclamationTriangle className="w-5 h-5" />,
        info: <FaInfoCircle className="w-5 h-5" />,
    };

    const colors = {
        success: 'bg-emerald-500 text-white shadow-emerald-500/20',
        error: 'bg-rose-500 text-white shadow-rose-500/20',
        warning: 'bg-amber-500 text-white shadow-amber-500/20',
        info: 'bg-[#10367D] text-white shadow-primary/20',
    };

    return (
        <AnimatePresence>
            {isVisible && message && (
                <motion.div
                    initial={{ opacity: 0, y: -20, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, x: 20, scale: 0.95 }}
                    className="fixed top-24 right-6 z-[99999] min-w-[350px] max-w-[90vw]"
                >
                    <div className={`${colors[type]} px-6 py-4 rounded-xl flex items-center justify-between gap-4 border border-white/20 shadow-2xl backdrop-blur-xl transition-all duration-300`}>
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                {icons[type]}
                            </div>
                            <p className="text-sm font-black tracking-tight leading-tight">{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 hover:bg-white/10 p-1.5 rounded-full transition-colors"
                        >
                            <FaTimes className="w-3 h-3" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
