'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPaperPlane, FaCheckCircle, FaTimes, FaIndustry,
    FaStore, FaBoxOpen, FaCoins, FaSpinner, FaArrowLeft
} from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import { useSnackbar } from '@/client/context/SnackbarContext';
import { useRouter } from 'next/navigation';

interface ChatRoomProps {
    negotiationId: string;
    userRole: 'DEALER' | 'MANUFACTURER';
}

export default function ChatRoom({ negotiationId, userRole }: ChatRoomProps) {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
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
        try {
            const data = await apiClient.get<any>(`/negotiation/${negotiationId}`);
            setNegotiation(data);
        } catch (error: any) {
            showSnackbar(error.message || 'Failed to load negotiation', 'error');
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
            showSnackbar('Message sent', 'success');
        } catch (error: any) {
            showSnackbar(error.message || 'Failed to send message', 'error');
        } finally {
            setSending(false);
        }
    };

    const handleStatusChange = async (status: 'ACCEPTED' | 'REJECTED') => {
        setSending(true);
        try {
            await apiClient.put(`/negotiation/${negotiationId}`, { status });
            await fetchNegotiation();
            showSnackbar(`Negotiation ${status.toLowerCase()}`, 'success');

            // Redirect after successful action
            setTimeout(() => {
                router.push(userRole === 'DEALER' ? '/dealer/negotiations' : '/manufacturer/negotiations');
            }, 2000);
        } catch (error: any) {
            showSnackbar(error.message || 'Failed to update status', 'error');
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
    const statusColor = negotiation.status === 'OPEN' ? 'blue' : negotiation.status === 'ACCEPTED' ? 'green' : 'red';

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
                        {negotiation.status}
                    </span>
                </div>
            </div>

            {/* Chat Messages */}
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
                                    Accept & Allocate Stock
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
                    </div>
                )}
            </div>
        </div>
    );
}
