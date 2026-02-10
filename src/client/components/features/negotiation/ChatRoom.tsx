'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPaperPlane, FaCheckCircle, FaTimes, FaIndustry,
    FaStore, FaBoxOpen, FaCoins, FaSpinner, FaArrowLeft
} from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
// import { useSnackbar } from '@/client/context/SnackbarContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ChatRoomProps {
    negotiationId: string;
    userRole: 'DEALER' | 'MANUFACTURER';
}

export default function ChatRoom({ negotiationId, userRole }: ChatRoomProps) {
    const router = useRouter();
    // const { showSnackbar } = useSnackbar();
    const chatEndRef = useRef<HTMLDivElement>(null);

    const [negotiation, setNegotiation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [newOffer, setNewOffer] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchNegotiation();
    }, [negotiationId]);

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [negotiation?.chatLog]);

    const fetchNegotiation = async () => {
        if (!negotiationId || negotiationId === 'undefined') return;

        try {
            const data = await apiClient.get<any>(`/negotiation/${negotiationId}`);
            setNegotiation(data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load negotiation');
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!message.trim() && !newOffer) return;

        setSending(true);
        try {
            await apiClient.put(`/negotiation/${negotiationId}`, {
                message: message.trim(),
                newOffer: newOffer ? parseFloat(newOffer) : null
            });

            setMessage('');
            setNewOffer('');
            await fetchNegotiation(); // Refresh data
            toast.success('Message sent');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleStatusChange = async (status: 'ACCEPTED' | 'REJECTED') => {
        setSending(true);
        try {
            await apiClient.put(`/negotiation/${negotiationId}`, { status });
            await fetchNegotiation();
            toast.success(`Negotiation ${status.toLowerCase()}`);

            // Redirect after successful action
            setTimeout(() => {
                router.push(userRole === 'DEALER' ? '/dealer/negotiations' : '/manufacturer/negotiations');
            }, 2000);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update status');
        } finally {
            setSending(false);
        }
    };

    const handlePlaceOrder = async () => {
        setSending(true);
        try {
            await apiClient.put(`/negotiation/${negotiationId}`, {
                status: 'ORDER_REQUESTED',
                message: 'Requesting purchase order...'
            });
            await fetchNegotiation();
            toast.success('Purchase Order Sent!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send order request');
        } finally {
            setSending(false);
        }
    };

    const handleOrderFulfillment = async () => {
        setSending(true);
        try {
            await apiClient.put(`/negotiation/${negotiationId}`, {
                status: 'ORDER_FULFILLED',
                message: 'Processing Order...'
            });
            await fetchNegotiation();
            toast.success('Order Approved & Stock Allocated');
        } catch (error: any) {
            toast.error(error.message || 'Failed to fulfill order');
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <FaSpinner className="w-8 h-8 text-[#0F6CBD] animate-spin" />
            </div>
        );
    }

    if (!negotiation) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500 font-bold">Negotiation not found</p>
            </div>
        );
    }

    const isDealer = userRole === 'DEALER';
    const partnerName = isDealer ? negotiation.manufacturer.companyName : negotiation.dealer.businessName;
    const statusColorMap: Record<string, string> = {
        'OPEN': 'blue',
        'ACCEPTED': 'green',
        'REJECTED': 'red',
        'ORDER_REQUESTED': 'amber',
        'ORDER_FULFILLED': 'emerald'
    };

    const statusLabelMap: Record<string, string> = {
        'OPEN': 'Negotiating',
        'ACCEPTED': 'Terms Accepted',
        'REJECTED': 'Rejected',
        'ORDER_REQUESTED': 'Order Requested',
        'ORDER_FULFILLED': 'Order Fulfilled'
    };

    const statusColor = statusColorMap[negotiation.status] || 'slate';
    const statusLabel = statusLabelMap[negotiation.status] || negotiation.status;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#0F6CBD] font-bold text-sm mb-4 transition-colors"
                >
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Negotiations
                </button>

                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                            {isDealer ? <FaIndustry className="text-[#0F6CBD] text-2xl" /> : <FaStore className="text-[#0F6CBD] text-2xl" />}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800">{partnerName}</h1>
                            <p className="text-sm text-slate-500 font-bold mt-1">{negotiation.product.name}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs font-bold text-slate-600">
                                <span className="flex items-center gap-1">
                                    <FaBoxOpen className="text-[#0F6CBD]" />
                                    {negotiation.quantity} units
                                </span>
                                <span className="flex items-center gap-1">
                                    <FaCoins className="text-[#0F6CBD]" />
                                    Current Offer: ₹{negotiation.currentOffer}
                                </span>
                            </div>
                        </div>
                    </div>

                    <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-${statusColor}-50 text-${statusColor}-600 border border-${statusColor}-100`}>
                        {statusLabel}
                    </span>
                </div>
            </div>


            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                    {negotiation.chatLog?.map((chat: any, idx: number) => {
                        const isCurrentUser = (isDealer && chat.sender === 'DEALER') || (!isDealer && chat.sender === 'MANUFACTURER');

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-md ${isCurrentUser ? 'bg-[#0F6CBD] text-white' : 'bg-slate-100 text-slate-800'} rounded-2xl px-4 py-3`}>
                                    <p className="text-xs font-black uppercase tracking-wider opacity-70 mb-1">
                                        {chat.sender}
                                    </p>
                                    <p className="font-medium">{chat.message}</p>
                                    <p className="text-[10px] opacity-70 mt-2">
                                        {new Date(chat.time).toLocaleString()}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                {negotiation.status === 'OPEN' && (
                    <div className="space-y-4 border-t border-slate-100 pt-6">
                        {/* New Offer Input */}
                        <div className="flex gap-3">
                            <input
                                type="number"
                                value={newOffer}
                                onChange={(e) => setNewOffer(e.target.value)}
                                placeholder="New offer amount (₹)"
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]/20 focus:border-[#0F6CBD] font-medium"
                            />
                        </div>

                        {/* Message Input */}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]/20 focus:border-[#0F6CBD] font-medium"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={sending || (!message.trim() && !newOffer)}
                                className="px-6 py-3 bg-[#0F6CBD] text-white rounded-xl font-black text-sm hover:bg-[#0F6CBD]/90 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
                            >
                                {sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                                Send
                            </button>
                        </div>

                        {/* Action Buttons (Manufacturer only) */}
                        {!isDealer && (
                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => handleStatusChange('REJECTED')}
                                    disabled={sending}
                                    className="flex-1 py-3 px-4 border border-rose-100 text-rose-600 rounded-xl font-black text-sm hover:bg-rose-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <FaTimes />
                                    Reject Deal
                                </button>
                                <button
                                    onClick={() => handleStatusChange('ACCEPTED')}
                                    disabled={sending}
                                    className="flex-1 py-3 px-4 bg-green-600 text-white rounded-xl font-black text-sm hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <FaCheckCircle />
                                    Accept Terms
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {negotiation.status !== 'OPEN' && (
                    <div className="text-center py-4 bg-slate-50 rounded-xl">
                        <p className="text-sm font-bold text-slate-600">
                            This negotiation has been {negotiation.status.toLowerCase()}.
                        </p>

                        {/* Dealer: Place Order Action */}
                        {negotiation.status === 'ACCEPTED' && isDealer && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <button
                                    onClick={handlePlaceOrder}
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-200"
                                >
                                    <FaCheckCircle />
                                    Raise Purchase Order
                                </button>
                                <p className="text-[10px] text-center text-slate-400 mt-2">
                                    Request purchase of {negotiation.quantity} units at ₹{negotiation.currentOffer}.
                                </p>
                            </div>
                        )}

                        {/* Manufacturer: Fulfill Order Action */}
                        {negotiation.status === 'ORDER_REQUESTED' && !isDealer && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <button
                                    onClick={handleOrderFulfillment}
                                    disabled={sending}
                                    className="w-full py-3 bg-[#10367D] hover:bg-blue-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                                >
                                    <FaBoxOpen />
                                    Approve & Allocate Stock
                                </button>
                                <p className="text-[10px] text-center text-slate-400 mt-2">
                                    This will automatically allocate inventory to the dealer.
                                </p>
                            </div>
                        )}

                        {/* Order Confirmed State */}
                        {negotiation.status === 'ORDER_FULFILLED' && (
                            <div className="mt-4 pt-4 border-t border-slate-200 bg-emerald-50 rounded-xl p-4 text-center">
                                <p className="text-emerald-700 font-bold flex items-center justify-center gap-2">
                                    <FaCheckCircle /> Order Processed
                                </p>
                                <p className="text-[10px] text-emerald-600 mt-1">
                                    Inventory has been allocated.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
