import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaShieldAlt } from 'react-icons/fa';

interface UserVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (isVerified: boolean) => Promise<void>;
    user: any;
    type: 'MANUFACTURER' | 'DEALER';
}

export default function UserVerificationModal({
    isOpen,
    onClose,
    onConfirm,
    user,
    type
}: UserVerificationModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen || !user) return null;

    const handleAction = async (isVerified: boolean) => {
        setIsLoading(true);
        try {
            await onConfirm(isVerified);
            onClose();
        } catch (error) {
            console.error('Verification failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[10px] shadow-2xl w-full max-w-md overflow-hidden border border-foreground/10"
                >
                    <div className="bg-black p-8 text-center text-white relative">
                        <div className="w-16 h-16 bg-white/10 rounded-[10px] mx-auto flex items-center justify-center mb-4">
                            <FaShieldAlt className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight italic">Verify Identity</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">
                            {type} Protocol Initiation
                        </p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="text-center space-y-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Entity</p>
                            <p className="text-lg font-black text-[#1E293B]">
                                {user.name || user.companyName || user.businessName}
                            </p>
                            <p className="text-sm text-slate-500 font-medium italic">
                                {user.email}
                            </p>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-[10px] border border-amber-100 text-[10px] font-bold text-amber-700 leading-relaxed text-center">
                            Action sends automated notification. Verified entities gain immediate platform access.
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={() => handleAction(false)}
                                disabled={isLoading}
                                className="flex-1 py-4 bg-rose-50 text-rose-600 rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-rose-100"
                            >
                                <FaTimesCircle /> Reject
                            </button>
                            <button
                                onClick={() => handleAction(true)}
                                disabled={isLoading}
                                className="btn-primary flex-1 py-4"
                            >
                                <FaCheckCircle /> Verify
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
