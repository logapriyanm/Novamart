'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import ReviewForm from './ReviewForm';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'PRODUCT' | 'SELLER';
    orderId: string;
    targetId: string; // productId or sellerId
    targetName?: string; // Product name or Seller business name for display
    orderItemId?: string; // Only for product reviews
}

export default function ReviewModal({ isOpen, onClose, type, orderId, targetId, targetName, orderItemId }: ReviewModalProps) {
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto rounded-2xl shadow-2xl custom-scrollbar relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur text-slate-800 hover:bg-white/40 flex items-center justify-center transition-colors"
                            >
                                <FaTimes />
                            </button>

                            <ReviewForm
                                type={type}
                                orderId={orderId}
                                targetId={targetId}
                                orderItemId={orderItemId}
                                onSuccess={() => {
                                    onClose();
                                    // Ideally refresh page or update UI state
                                    window.location.reload();
                                }}
                                onCancel={onClose}
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
