'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentAlt, FaTimes, FaPaperPlane, FaUserCircle, FaStore, FaLock } from 'react-icons/fa';
import io from 'socket.io-client';

// Use current origin for socket if developing locally
const socket = io(typeof window !== 'undefined' ? window.location.origin.replace('3000', '5000') : 'http://localhost:5000', {
    auth: {
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : null
    }
});

interface Message {
    senderId: string;
    senderRole: string;
    message: string;
    createdAt: string;
}

export default function ChatWidget({ productId, dealerId, dealerName, contextType = 'PRE_PURCHASE' }: { productId: string, dealerId: string, dealerName: string, contextType?: 'PRE_PURCHASE' | 'ORDER' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [chatId, setChatId] = useState<string | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        if (isOpen && chatId) {
            socket.emit('join-room', chatId);
        }
    }, [isOpen, chatId]);

    useEffect(() => {
        const handleMessage = (msg: Message) => {
            setMessages(prev => {
                // Prevent duplicate display for local messages if we wanted optimistic UI,
                // but for now simple append is fine.
                return [...prev, msg];
            });
        };
        socket.on('chat:message', handleMessage);
        return () => { socket.off('chat:message', handleMessage); };
    }, []);

    useEffect(scrollToBottom, [messages]);

    const startChat = async () => {
        setIsOpen(true);
        if (chatId) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/chat/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: contextType,
                    contextId: productId,
                    receiverId: dealerId,
                    receiverRole: 'DEALER'
                })
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.message);

            const chat = result.data;
            setChatId(chat._id);

            // Fetch previous history
            const histRes = await fetch(`/api/chat/${chat._id}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const histResult = await histRes.json();
            setMessages(histResult.data || []);
        } catch (err) {
            console.error('Failed to start chat:', err);
        }
    };

    const sendMessage = () => {
        if (!input.trim() || !chatId) return;

        const payload = {
            chatId,
            message: input
            // senderId and senderRole derived via Socket's token on backend
        };

        socket.emit('chat:message', payload);
        setInput('');
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="w-[380px] h-[550px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 bg-[#1E293B] text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#10367D] flex items-center justify-center text-white">
                                    <FaStore className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest">{dealerName}</h4>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Dealer • Online</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                                <FaTimes className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Audit Banner */}
                        <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                            <FaLock className="text-slate-300 w-2 h-2" />
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Auditable Context: {productId}</p>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.senderRole === 'CUSTOMER' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm ${m.senderRole === 'CUSTOMER' ? 'bg-[#10367D] text-white' : 'bg-slate-50 text-[#1E293B]'
                                        }`}>
                                        {m.message}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-6 border-t border-slate-50">
                            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-2 pl-4 border border-slate-100">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    type="text"
                                    placeholder="Inquire about product..."
                                    className="flex-1 bg-transparent text-[11px] font-black focus:outline-none py-2"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="w-10 h-10 rounded-xl bg-[#10367D] text-white flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-[#10367D]/20"
                                >
                                    <FaPaperPlane className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={startChat}
                        className="w-16 h-16 bg-[#10367D] rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-[#10367D]/30 group"
                    >
                        <FaCommentAlt className="w-6 h-6" />
                        <span className="absolute -top-12 right-0 bg-white text-[#10367D] text-[10px] font-black py-2 px-4 rounded-xl shadow-xl border border-blue-50 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest whitespace-nowrap">Chat with Seller</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

