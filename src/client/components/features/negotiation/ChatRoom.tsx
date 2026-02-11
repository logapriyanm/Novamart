'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPaperPlane, FaCheckCircle, FaTimes, FaIndustry,
    FaStore, FaBoxOpen, FaCoins, FaSpinner, FaArrowLeft, FaCommentAlt
} from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';

const socket = io(typeof window !== 'undefined' ? window.location.origin.replace('3000', '5000') : 'http://localhost:5000', {
    auth: {
        token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    }
});

interface ChatRoomProps {
    negotiationId: string;
    userRole: 'DEALER' | 'MANUFACTURER';
}

interface Message {
    _id?: string;
    senderId: string;
    senderRole: string;
    message: string;
    messageType?: 'TEXT' | 'SYSTEM' | 'FILE';
    createdAt: string;
}

export default function ChatRoom({ negotiationId, userRole }: ChatRoomProps) {
    const router = useRouter();
    const chatEndRef = useRef<HTMLDivElement>(null);

    const [negotiation, setNegotiation] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatId, setChatId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [newOffer, setNewOffer] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchNegotiation();
    }, [negotiationId]);

    useEffect(() => {
        if (negotiation) {
            initializeChat();
        }
    }, [negotiation]);

    useEffect(() => {
        if (chatId) {
            socket.emit('join-room', chatId);
        }
    }, [chatId]);

    useEffect(() => {
        const handleMessage = (msg: Message) => {
            setMessages(prev => [...prev, msg]);
        };
        socket.on('chat:message', handleMessage);
        return () => { socket.off('chat:message', handleMessage); };
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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

    const initializeChat = async () => {
        if (!negotiation) return;

        try {
            // Determine receiver based on current user role
            const receiverId = userRole === 'DEALER'
                ? (typeof negotiation.manufacturerId === 'object' ? negotiation.manufacturerId.userId : negotiation.manufacturerId)
                : (typeof negotiation.dealerId === 'object' ? negotiation.dealerId.userId : negotiation.dealerId);

            const res = await apiClient.post<any>('/chat/create', {
                type: 'NEGOTIATION',
                contextId: negotiationId,
                receiverId: receiverId,
                receiverRole: userRole === 'DEALER' ? 'MANUFACTURER' : 'DEALER'
            });

            if (res && res._id) {
                setChatId(res._id);
                // Fetch chat history
                try {
                    const msgs = await apiClient.get<any>(`/chat/${res._id}/messages`);
                    setMessages(msgs || []);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (historyError) {
                    console.warn('Failed to fetch chat history');
                }
            }
        } catch (err) {
            console.error('Failed to initialize chat:', err);
        }
    };

    const sendMessage = async () => {
        if (!message.trim() && !newOffer) return;

        setSending(true);
        try {
            // 1. Update Negotiation State (Prisma)
            await apiClient.put(`/negotiation/${negotiationId}`, {
                message: message.trim(),
                counterPrice: newOffer ? parseFloat(newOffer) : null
            });

            // 2. Emit via Socket if regular text message
            if (message.trim() && chatId) {
                socket.emit('chat:message', {
                    chatId,
                    message: message.trim(),
                    messageType: 'TEXT'
                });
            }

            setMessage('');
            setNewOffer('');
            await fetchNegotiation(); // Refresh header data
            toast.success('Response sent');
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
                <FaSpinner className="w-8 h-8 text-[#10367D] animate-spin" />
            </div>
        );
    }

    if (!negotiation) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500 font-bold underline decoration-rose-500">Negotiation not found</p>
            </div>
        );
    }

    const isDealer = userRole === 'DEALER';
    const partnerName = isDealer
        ? (negotiation.manufacturerId?.companyName || 'Manufacturer')
        : (negotiation.dealerId?.businessName || 'Dealer');
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
        <div className="space-y-6 max-w-6xl mx-auto p-4 lg:p-8">
            {/* Header */}
            <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm p-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-[#10367D] font-black text-[10px] uppercase tracking-widest mb-6 transition-all"
                >
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Negotiations
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-blue-50 rounded-[10px] flex items-center justify-center border border-blue-100">
                            {isDealer ? <FaIndustry className="text-[#10367D] text-2xl" /> : <FaStore className="text-[#10367D] text-2xl" />}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{partnerName}</h1>
                            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">{negotiation.productId?.name || 'Product'}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-100">
                                    <FaBoxOpen className="text-[#10367D] w-3 h-3" />
                                    {negotiation.quantity} units
                                </span>
                                <span className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full text-[10px] font-black text-[#10367D] uppercase tracking-widest border border-blue-100 shadow-sm">
                                    <FaCoins className="w-3 h-3" />
                                    Offer: ₹{negotiation.currentOffer}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`px-5 py-2.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest bg-${statusColor}-50 text-${statusColor}-600 border border-${statusColor}-100 shadow-sm self-start md:self-center`}>
                        {statusLabel}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat Section */}
                <div className="lg:col-span-2 bg-white rounded-[10px] border border-slate-100 shadow-sm flex flex-col h-[600px] overflow-hidden">
                    <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Negotiation Thread</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Real-time Connected</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#F8FAFC]">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center opacity-50">
                                <FaCommentAlt className="w-12 h-12 text-slate-200 mb-4" />
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No messages yet</p>
                            </div>
                        )}
                        {messages.map((m, idx) => {
                            if (m.messageType === 'SYSTEM') {
                                return (
                                    <div key={idx} className="flex justify-center">
                                        <span className="bg-white border border-slate-100 text-slate-400 text-[9px] font-black px-4 py-1.5 rounded-[10px] uppercase tracking-widest shadow-sm">
                                            {m.message}
                                        </span>
                                    </div>
                                );
                            }

                            const isMe = (isDealer && m.senderRole === 'DEALER') || (!isDealer && m.senderRole === 'MANUFACTURER');

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: isMe ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className="max-w-[80%] flex flex-col items-end gap-1">
                                        <div className={`${isMe ? 'bg-[#10367D] text-white rounded-tr-none shadow-blue-900/10' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'} rounded-[10px] px-5 py-3.5 shadow-xl`}>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1.5 flex items-center gap-2">
                                                {m.senderRole}
                                                {!isMe && <span className="w-1 h-1 rounded-full bg-blue-400" />}
                                            </p>
                                            <p className="text-[13px] font-medium leading-relaxed tracking-tight">{m.message}</p>
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-50 px-1">
                                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    {negotiation.status === 'OPEN' ? (
                        <div className="p-6 bg-white border-t border-slate-50 space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1 group">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block group-focus-within:text-[#10367D] transition-colors">New Offer (₹)</label>
                                    <input
                                        type="number"
                                        value={newOffer}
                                        onChange={(e) => setNewOffer(e.target.value)}
                                        placeholder="Update price..."
                                        className="w-full px-4 py-3.5 rounded-[10px] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#10367D] font-black text-sm transition-all text-slate-700"
                                    />
                                </div>
                                <div className="flex-[2] group">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block group-focus-within:text-[#10367D] transition-colors">Message</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                            placeholder="Type your message..."
                                            className="flex-1 px-4 py-3.5 rounded-[10px] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#10367D] font-bold text-sm transition-all"
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={sending || (!message.trim() && !newOffer)}
                                            className="px-6 py-3.5 bg-[#10367D] text-white rounded-[10px] font-black text-[10px] uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 flex items-center gap-2 transform active:scale-95"
                                        >
                                            {sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 bg-slate-50 text-center border-t border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                                This negotiation thread is currently <span className="text-[#10367D]">{negotiation.status.replace('_', ' ')}</span>.<br />No further messages can be sent.
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm p-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-3">Available Actions</h4>

                        {negotiation.status === 'OPEN' && !isDealer && (
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleStatusChange('REJECTED')}
                                    disabled={sending}
                                    className="w-full py-4 px-4 bg-white border-2 border-rose-50 text-rose-600 rounded-[10px] font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <FaTimes />
                                    Reject Deal
                                </button>
                                <button
                                    onClick={() => handleStatusChange('ACCEPTED')}
                                    disabled={sending}
                                    className="w-full py-4 px-4 bg-green-600 text-white rounded-[10px] font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-green-900/20"
                                >
                                    <FaCheckCircle />
                                    Accept Terms
                                </button>
                            </div>
                        )}

                        {negotiation.status === 'OPEN' && isDealer && (
                            <div className="text-center py-6 px-4 bg-blue-50/50 rounded-[10px] border border-blue-100/50">
                                <p className="text-[10px] font-black text-[#10367D] uppercase tracking-widest leading-relaxed">
                                    Waiting for manufacturer response or terms approval.
                                </p>
                            </div>
                        )}

                        {negotiation.status === 'ACCEPTED' && isDealer && (
                            <div className="space-y-4">
                                <button
                                    onClick={handlePlaceOrder}
                                    className="w-full py-4 bg-[#10367D] text-white rounded-[10px] font-black text-[10px] uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2"
                                >
                                    <FaCheckCircle />
                                    Raise Purchase Order
                                </button>
                                <p className="text-[8px] text-center text-slate-400 font-bold uppercase tracking-widest leading-tight">
                                    Confirms purchase of {negotiation.quantity} units @ ₹{negotiation.currentOffer}.
                                </p>
                            </div>
                        )}

                        {negotiation.status === 'ORDER_REQUESTED' && !isDealer && (
                            <div className="space-y-4">
                                <button
                                    onClick={handleOrderFulfillment}
                                    disabled={sending}
                                    className="w-full py-4 bg-[#10367D] text-white rounded-[10px] font-black text-[10px] uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2"
                                >
                                    <FaBoxOpen />
                                    Approve & Allocate Stock
                                </button>
                                <p className="text-[8px] text-center text-slate-400 font-bold uppercase tracking-widest">
                                    Inventory will be automatically allocated to dealer account.
                                </p>
                            </div>
                        )}

                        {negotiation.status === 'ORDER_FULFILLED' && (
                            <div className="bg-emerald-50 rounded-[10px] p-6 text-center border border-emerald-100 border-dashed">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <FaCheckCircle className="text-emerald-500 w-6 h-6" />
                                </div>
                                <p className="text-[#10367D] font-black text-[10px] uppercase tracking-widest">Order Processed</p>
                                <p className="text-[8px] text-emerald-600 font-bold uppercase tracking-widest mt-2">
                                    Inventory has been successfully allocated.
                                </p>
                            </div>
                        )}

                        {negotiation.status === 'REJECTED' && (
                            <div className="bg-rose-50 rounded-[10px] p-6 text-center border border-rose-100 border-dashed">
                                <p className="text-rose-600 font-black text-[10px] uppercase tracking-widest">Negotiation Terminated</p>
                            </div>
                        )}

                        {/* Summary Card */}
                        <div className="mt-8 pt-8 border-t border-slate-50">
                            <h5 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-4">Deal Summary</h5>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-[10px]">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Base Value</span>
                                    <span className="text-sm font-black text-slate-800 tracking-tighter">₹{(negotiation.currentOffer * negotiation.quantity).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center bg-blue-50/30 p-3 rounded-[10px] border border-blue-100/30">
                                    <span className="text-[9px] font-black text-[#10367D] uppercase tracking-widest">Per Unit</span>
                                    <span className="text-sm font-black text-[#10367D] tracking-tighter">₹{negotiation.currentOffer}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
