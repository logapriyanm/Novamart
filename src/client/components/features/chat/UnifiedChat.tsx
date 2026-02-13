'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch, FaFilter, FaCommentDots, FaPaperPlane,
    FaUserCircle, FaBox, FaShieldAlt, FaRegClock,
    FaCheckCircle, FaInfoCircle, FaLock, FaTimes
} from 'react-icons/fa';
import Loader from '@/client/components/ui/Loader';
import { io } from 'socket.io-client';
import { apiClient } from '@/lib/api/client';
import { chatService } from '@/lib/api/services/chat.service';
import { useSearchParams } from 'next/navigation';
import VerifiedBadge from '@/client/components/common/VerifiedBadge';

const SOCKET_URL = typeof window !== 'undefined' ? window.location.origin.replace('3000', '5000') : 'http://localhost:5000';

interface UnifiedChatProps {
    currentUserRole: 'SELLER' | 'MANUFACTURER' | 'ADMIN';
    currentUserId: string;
}

export default function UnifiedChat({ currentUserRole, currentUserId }: UnifiedChatProps) {
    const [chats, setChats] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchParams = useSearchParams();
    const initialChatId = searchParams?.get('chatId') || searchParams?.get('id');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const s = io(SOCKET_URL, { auth: { token } });
        setSocket(s);
        fetchChats();
        return () => { s.disconnect(); };
    }, []);

    useEffect(() => {
        if (chats.length > 0 && initialChatId && !selectedChat) {
            const chat = chats.find(c => (c._id || c.id) === initialChatId || c.contextId === initialChatId);
            if (chat) setSelectedChat(chat);
        }
    }, [chats, initialChatId]);

    useEffect(() => {
        if (selectedChat && socket) {
            const chatId = selectedChat._id || selectedChat.id;
            socket.emit('join-room', chatId);
            fetchMessages(chatId);
        }
    }, [selectedChat, socket]);

    useEffect(() => {
        if (!socket) return;
        const handleMsg = (msg: any) => {
            const currentChatId = selectedChat?._id || selectedChat?.id;
            if (msg.chatId === currentChatId) {
                setMessages(prev => [...prev, msg]);
            }
            // Update last message in chat list
            setChats(prev => prev.map(c => {
                if ((c._id || c.id) === msg.chatId) {
                    return { ...c, lastMessage: { text: msg.message, createdAt: msg.createdAt }, updatedAt: msg.createdAt };
                }
                return c;
            }));
        };
        socket.on('chat:message', handleMsg);
        return () => { socket.off('chat:message', handleMsg); };
    }, [selectedChat, socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchChats = async () => {
        setLoading(true);
        try {
            const data = await chatService.getChats();
            setChats(data);
        } catch (error) {
            console.error('Failed to fetch chats');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (chatId: string) => {
        try {
            const data = await chatService.getMessages(chatId);
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages');
        }
    };

    const sendMessage = () => {
        if (!input.trim() || !selectedChat || !socket || sending) return;

        setSending(true);
        const payload = {
            chatId: selectedChat._id || selectedChat.id,
            message: input,
            messageType: 'TEXT'
        };

        socket.emit('chat:message', payload);
        setInput('');
        setTimeout(() => setSending(false), 500);
    };

    const filteredChats = chats.filter(chat => {
        const otherParticipant = chat.participants.find((p: any) => p.userId !== currentUserId);
        const name = otherParticipant?.name || 'User';
        return name.toLowerCase().includes(searchQuery.toLowerCase()) || chat.contextId.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="h-[calc(100vh-200px)] grid grid-cols-12 gap-6 overflow-hidden">
            {/* Left Panel: Chat List */}
            <div className="col-span-4 bg-white rounded-[10px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                        <input
                            type="text"
                            placeholder="Search contacts or IDs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-[10px] py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest focus:border-[#10367D] transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-50">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader size="md" variant="primary" />
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">No transmissions found</p>
                        </div>
                    ) : (
                        filteredChats.map((chat: any) => {
                            const otherParticipants = chat.participants.filter((p: any) => p.userId !== currentUserId);
                            const participantName = otherParticipants.length > 0
                                ? otherParticipants.map((p: any) => p.name).join(', ')
                                : chat.participants[0]?.name || 'Unknown Partner';

                            const isSelected = (selectedChat?._id || selectedChat?.id) === (chat._id || chat.id);

                            return (
                                <div
                                    key={chat._id || chat.id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`p-6 hover:bg-slate-50 transition-all cursor-pointer group flex items-start gap-4 relative ${isSelected ? 'bg-blue-50/50' : ''}`}
                                >
                                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                                    <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center transition-all shadow-sm ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-primary group-hover:text-white'}`}>
                                        <FaCommentDots className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-xs font-black text-[#1E293B] uppercase tracking-tight truncate flex items-center gap-2">
                                                {participantName}
                                                {otherParticipants.length === 1 && otherParticipants[0].role && (
                                                    <VerifiedBadge type={otherParticipants[0].role} size="sm" showText={false} />
                                                )}
                                            </h4>
                                            <span className="text-[7px] font-bold text-slate-400 uppercase">{new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-500 truncate mb-2 uppercase tracking-tight">
                                            {chat.lastMessage?.text || 'No history recorded'}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-[4px] border uppercase tracking-widest ${chat.type === 'ORDER' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                chat.type === 'NEGOTIATION' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-slate-50 text-slate-600 border-slate-100'
                                                }`}>
                                                {chat.type}
                                            </span>
                                            <span className="text-[7px] font-bold text-slate-300 uppercase tracking-widest truncate">ID: {chat.contextId}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Panel: Chat Window */}
            <div className="col-span-8 bg-white rounded-[10px] border border-slate-100 shadow-sm flex flex-col overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {selectedChat ? (
                        <motion.div
                            key={selectedChat._id || selectedChat.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="h-full flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-slate-50 bg-slate-900 text-white flex items-center justify-between shadow-xl z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[10px] bg-white/10 flex items-center justify-center border border-white/10 font-black">
                                        <FaUserCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                            {selectedChat.participants.filter((p: any) => p.userId !== currentUserId).map((p: any) => p.name).join(', ') || 'Partners'}
                                            {selectedChat.participants.filter((p: any) => p.userId !== currentUserId).length === 1 &&
                                                selectedChat.participants.find((p: any) => p.userId !== currentUserId)?.role && (
                                                    <div className="bg-white/10 rounded-full">
                                                        <VerifiedBadge
                                                            type={selectedChat.participants.find((p: any) => p.userId !== currentUserId)?.role}
                                                            size="sm"
                                                            showText={true}
                                                        />
                                                    </div>
                                                )}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[8px] font-black text-blue-200 uppercase tracking-widest">{selectedChat.type}</span>
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            <span className="text-[8px] font-bold text-white/60 uppercase tracking-widest">Context ID: {selectedChat.contextId}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="h-10 px-4 bg-white/10 hover:bg-white/20 rounded-[10px] text-[8px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center gap-2">
                                        <FaBox className="w-3 h-3" /> View Context
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[#F8FAFC]">
                                {messages.map((m, i) => {
                                    if (m.messageType === 'SYSTEM') {
                                        return (
                                            <div key={i} className="flex justify-center">
                                                <span className="bg-white border border-slate-100 text-slate-400 text-[8px] font-black px-4 py-1.5 rounded-[10px] uppercase tracking-widest shadow-sm">
                                                    {m.message}
                                                </span>
                                            </div>
                                        );
                                    }

                                    const isMe = m.senderId === currentUserId;
                                    return (
                                        <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div className={`max-w-[75%] p-4 rounded-[10px] text-[11px] font-medium leading-relaxed shadow-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-md'
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

                            {/* Input Area */}
                            {currentUserRole !== 'ADMIN' ? (
                                <div className="p-6 bg-white border-t border-slate-100">
                                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-[10px] p-2 pl-6 focus-within:border-blue-200 transition-all">
                                        <input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                            type="text"
                                            placeholder="Resolve requirement or respond to inquiry..."
                                            className="flex-1 bg-transparent text-[11px] font-bold focus:outline-none text-slate-700 placeholder:text-slate-300"
                                            disabled={sending}
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!input.trim() || sending}
                                            className="w-12 h-12 bg-primary text-white rounded-[10px] flex items-center justify-center hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:grayscale disabled:opacity-50"
                                        >
                                            <FaPaperPlane className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 bg-amber-50 border-t border-amber-100 flex items-center justify-center gap-3">
                                    <FaShieldAlt className="text-amber-600 w-4 h-4" />
                                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Admin Monitoring Mode • Read Only</span>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white relative">
                            <div className="w-24 h-24 bg-slate-50 rounded-[10px] flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                                <FaCommentDots className="w-8 h-8" />
                            </div>
                            <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">Select Channel</h3>
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-4 max-w-[280px] leading-loose">
                                Please select an active contextual transmission to manage business communications.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
