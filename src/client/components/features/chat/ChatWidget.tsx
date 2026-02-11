'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentAlt, FaTimes, FaPaperPlane, FaStore, FaLock } from 'react-icons/fa';
import { Socket, io } from 'socket.io-client';

interface Message {
    senderId: string;
    senderRole: string;
    message: string;
    messageType?: 'TEXT' | 'SYSTEM' | 'FILE';
    createdAt: string;
}

export default function ChatWidget({ productId, dealerId, dealerName, contextType = 'PRE_PURCHASE' }: { productId: string, dealerId: string, dealerName: string, contextType?: 'PRE_PURCHASE' | 'ORDER' | 'NEGOTIATION' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [chatId, setChatId] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // Lazy Socket Connection
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const socketUrl = window.location.origin.replace('3000', '5000');
            const token = localStorage.getItem('auth_token');

            if (!socketRef.current) {
                socketRef.current = io(socketUrl, {
                    auth: { token },
                    transports: ['websocket', 'polling']
                });

                socketRef.current.on('connect', () => {
                    // Socket connected
                });

                socketRef.current.on('connect_error', (err) => {
                    console.error('❌ Socket Connection Error:', err.message);
                });

                socketRef.current.on('chat:message', (msg: Message) => {
                    setMessages(prev => [...prev, msg]);
                });
            }
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (isOpen && chatId && socketRef.current) {
            socketRef.current.emit('join-room', chatId);
        }
    }, [isOpen, chatId]);

    useEffect(scrollToBottom, [messages]);

    const startChat = async () => {
        setIsOpen(true);
        if (chatId) return;

        try {
            const token = localStorage.getItem('auth_token');
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
        if (!input.trim() || !chatId || sending || !socketRef.current) return;

        setSending(true);
        const payload = {
            chatId,
            message: input,
            messageType: 'TEXT'
        };

        socketRef.current.emit('chat:message', payload);
        setInput('');
        setTimeout(() => setSending(false), 500); // Debounce
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="w-[380px] h-[550px] bg-white rounded-[10px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 bg-[#10367D] text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[10px] bg-white/10 flex items-center justify-center text-white">
                                    <FaStore className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest">{dealerName}</h4>
                                    <p className="text-[8px] font-bold text-blue-200 uppercase tracking-widest">Dealer • Online</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-[10px] bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                                <FaTimes className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Context Header */}
                        <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FaLock className="text-slate-300 w-2 h-2" />
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">ID: {productId}</p>
                            </div>
                            <span className="text-[8px] bg-blue-50 text-[#10367D] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                                {contextType.replace('_', ' ')}
                            </span>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#F8FAFC]">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-[10px] flex items-center justify-center mb-4">
                                        <FaCommentAlt className="text-blue-200 w-6 h-6" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                        No messages yet.<br />Start the conversation below.
                                    </p>
                                </div>
                            )}
                            {messages.map((m, i) => {
                                if (m.messageType === 'SYSTEM') {
                                    return (
                                        <div key={i} className="flex justify-center">
                                            <span className="bg-slate-100 text-slate-400 text-[8px] font-black px-3 py-1 rounded-[10px] uppercase tracking-widest">
                                                {m.message}
                                            </span>
                                        </div>
                                    );
                                }

                                const isMe = m.senderRole === 'CUSTOMER';
                                return (
                                    <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] p-4 rounded-[10px] text-[11px] font-medium leading-relaxed shadow-sm ${isMe ? 'bg-[#10367D] text-white rounded-tr-none' : 'bg-white text-[#1E293B] rounded-tl-none border border-slate-100'
                                            }`}>
                                            {m.message}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 px-1">
                                            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest italic opacity-50">
                                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {!isMe && (
                                                <span className="text-[7px] font-black text-[#10367D] uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded-[4px]">
                                                    {m.senderRole}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-100 bg-white">
                            <div className="flex items-center gap-3 bg-slate-50 rounded-[10px] p-1.5 pl-4 border border-slate-100 focus-within:border-blue-200 transition-colors">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent text-[11px] font-bold focus:outline-none py-2 text-slate-700"
                                    disabled={sending}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || sending}
                                    className="w-10 h-10 rounded-[10px] bg-[#10367D] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#10367D]/20 disabled:grayscale disabled:opacity-50"
                                >
                                    <FaPaperPlane className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startChat}
                        className="w-16 h-16 bg-[#10367D] rounded-[10px] flex items-center justify-center text-white shadow-2xl shadow-[#10367D]/30 group"
                    >
                        <FaCommentAlt className="w-6 h-6" />
                        <span className="absolute -top-12 right-0 bg-white text-[#10367D] text-[10px] font-black py-2.5 px-5 rounded-[10px] shadow-2xl border border-blue-50 opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest whitespace-nowrap pointer-events-none translate-y-2 group-hover:translate-y-0">
                            Chat with Seller
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
