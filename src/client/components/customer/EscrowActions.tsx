'use client';

import React, { useState } from 'react';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineShieldCheck } from 'react-icons/hi';
import { apiClient } from '../../../lib/api/client';
import { useSnackbar } from '../../context/SnackbarContext';

interface EscrowActionsProps {
    order: any;
    onUpdate: () => void;
}

export default function EscrowActions({ order, onUpdate }: EscrowActionsProps) {
    const { showSnackbar } = useSnackbar();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundReason, setRefundReason] = useState('');

    const canConfirmDelivery = order.status === 'DELIVERED' && order.escrow?.status === 'HOLD';
    const canRequestRefund = order.escrow?.status === 'HOLD' && order.status !== 'SETTLED';

    const handleConfirmDelivery = async () => {
        if (!window.confirm('Confirm that you have received your order? This will release payment to the seller.')) {
            return;
        }

        setIsProcessing(true);
        try {
            const res = await apiClient.post<any>('/escrow/confirm-delivery', {
                orderId: order.id
            });

            if (res.success) {
                showSnackbar('Delivery confirmed! Funds released to seller.', 'success');
                onUpdate();
            } else {
                showSnackbar(res.error || 'Failed to confirm delivery', 'error');
            }
        } catch (error: any) {
            showSnackbar(error.message || 'Failed to confirm delivery', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRequestRefund = async () => {
        if (!refundReason.trim()) {
            showSnackbar('Please provide a reason for refund', 'warning');
            return;
        }

        setIsProcessing(true);
        try {
            const res = await apiClient.post<any>('/escrow/request-refund', {
                orderId: order.id,
                reason: refundReason
            });

            if (res.success) {
                showSnackbar('Refund request submitted. Admin will review.', 'success');
                setShowRefundModal(false);
                setRefundReason('');
                onUpdate();
            } else {
                showSnackbar(res.error || 'Failed to request refund', 'error');
            }
        } catch (error: any) {
            showSnackbar(error.message || 'Failed to request refund', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Escrow Status Card */}
            <div className={`rounded-2xl p-6 border-2 ${order.escrow?.status === 'HOLD' ? 'bg-yellow-50 border-yellow-200' :
                order.escrow?.status === 'RELEASED' ? 'bg-green-50 border-green-200' :
                    order.escrow?.status === 'REFUNDED' ? 'bg-blue-50 border-blue-200' :
                        'bg-gray-50 border-gray-200'
                }`}>
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${order.escrow?.status === 'HOLD' ? 'bg-yellow-500/20 text-yellow-700' :
                        order.escrow?.status === 'RELEASED' ? 'bg-green-500/20 text-green-700' :
                            order.escrow?.status === 'REFUNDED' ? 'bg-blue-500/20 text-blue-700' :
                                'bg-gray-500/20 text-gray-700'
                        }`}>
                        <HiOutlineShieldCheck className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-black text-foreground uppercase tracking-tight mb-1">
                            Escrow Status: {order.escrow?.status || 'N/A'}
                        </h4>
                        <p className="text-xs text-foreground/60 font-bold leading-relaxed">
                            {order.escrow?.status === 'HOLD' && 'Your payment is secured in escrow. Funds will be released to seller after delivery confirmation.'}
                            {order.escrow?.status === 'RELEASED' && 'Funds have been released to the seller. Thank you for confirming delivery!'}
                            {order.escrow?.status === 'REFUNDED' && 'Refund has been processed. Amount will be credited to your account.'}
                            {order.escrow?.status === 'FROZEN' && 'Escrow is frozen pending dispute resolution.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {canConfirmDelivery && (
                    <button
                        onClick={handleConfirmDelivery}
                        disabled={isProcessing}
                        className="bg-green-600 text-white py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <HiOutlineCheckCircle className="w-5 h-5" />
                        Confirm Delivery
                    </button>
                )}

                {canRequestRefund && (
                    <button
                        onClick={() => setShowRefundModal(true)}
                        disabled={isProcessing}
                        className="bg-red-600 text-white py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <HiOutlineExclamationCircle className="w-5 h-5" />
                        Request Refund
                    </button>
                )}
            </div>

            {/* Refund Modal */}
            {showRefundModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-black text-foreground mb-4">Request Refund</h3>
                        <p className="text-sm text-foreground/60 font-bold mb-6">
                            Please provide a reason for requesting a refund. Our admin team will review your request.
                        </p>

                        <textarea
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            placeholder="Describe the issue with your order..."
                            className="w-full p-4 border-2 border-foreground/10 rounded-xl resize-none font-bold text-sm mb-6"
                            rows={4}
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowRefundModal(false)}
                                className="flex-1 bg-gray-200 text-foreground py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-300 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRequestRefund}
                                disabled={isProcessing || !refundReason.trim()}
                                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                                {isProcessing ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
