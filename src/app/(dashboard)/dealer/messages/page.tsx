'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch,
    FaFilter,
    FaCommentDots,
    FaPaperPlane,
    FaClock,
    FaUserCircle,
    FaBox,
    FaShieldAlt,
    FaRegClock,
    FaCheckCircle,
    FaInfoCircle
} from 'react-icons/fa';
import { chatService, Chat, Message } from '@/lib/api/services/chat.service';
import { useAuth } from '@/client/context/AuthContext';
// import { useSnackbar } from '@/client/context/SnackbarContext';
import { apiClient } from '@/lib/api/client';
import { io } from 'socket.io-client';

// Use current origin for socket if developing locally
const SOCKET_URL = typeof window !== 'undefined' ? window.location.origin.replace('3000', '5000') : 'http://localhost:5000';

export default function DealerMessagingCenter() {
    const { user } = useAuth();
    // const { showSnackbar } = useSnackbar();
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {
        const token = apiClient.getToken();
        const s = io(SOCKET_URL, {
            auth: { token }
        });
        setSocket(s);
        fetchChats();
        return () => { s.disconnect(); };
    }, []);

    const fetchChats = async () => {
        try {
            const data = await chatService.getChats();
            setChats(data);
        } catch (error) {
            console.error('Failed to fetch chats');
        }
    };

    useEffect(() => {
        if (selectedChat && socket) {
            socket.emit('join-room', selectedChat._id || selectedChat.id);
            fetchMessages(selectedChat._id || selectedChat.id);
        }
    }, [selectedChat, socket]);

    const fetchMessages = async (chatId: string) => {
        try {
            const data = await chatService.getMessages(chatId);
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages');
        }
    };

    useEffect(() => {
        if (!socket) return;
        const handleMsg = (msg: any) => {
            if (selectedChat && (msg.chatId === selectedChat._id || msg.chatId === selectedChat.id)) {
                setMessages(prev => [...prev, msg]);
            }
        };
        socket.on('chat:message', handleMsg);
        return () => { socket.off('chat:message', handleMsg); };
    }, [selectedChat, socket]);

    const sendMessage = () => {
        if (!input.trim() || !selectedChat || !socket) return;

        const payload = {
            chatId: selectedChat._id || selectedChat.id,
            message: input,
            senderId: user?.id,
            senderRole: 'DEALER'
        };

        socket.emit('chat:message', payload);
        setInput('');
    };

    return (
        <div className="h-[calc(100vh-180px)] flex flex-col gap-8 animate-fade-in text-[#1E293B]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">Message <span className="text-[#10367D]">Gateway</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Contextual Communication • Dealer Management</p>
                </div>
                <div className="flex items-center gap-4 py-3 px-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
                    <FaRegClock className="text-[#10367D] w-4 h-4" />
                    <span className="text-[10px] font-black uppercase text-[#1E293B]">Avg Reply Time: <span className="text-[#10367D]">14 Minutes</span></span>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-12 overflow-hidden">
                {/* Chat List */}
                <div className="col-span-4 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                            <input type="text" placeholder="SEARCH FILTERS..." className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-[9px] font-black uppercase tracking-widest focus:border-[#10367D] transition-colors" />
                        </div>
                        <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#10367D] transition-colors"><FaFilter className="w-4 h-4" /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
                        {chats.map((chat: any) => {
                            const otherParticipant = chat.participants.find((p: any) => p.userId !== user?.id);
                            return (
                                <div
                                    key={chat._id || chat.id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`p-8 hover:bg-slate-50 transition-all cursor-pointer group flex items-start gap-6 relative ${(selectedChat?._id === chat._id || selectedChat?.id === chat.id) ? 'bg-blue-50/30' : ''}`}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-[#10367D] group-hover:text-white transition-all shadow-sm">
                                        <FaCommentDots className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-sm font-black text-[#1E293B] italic leading-tight">{otherParticipant?.name || 'User'}</h4>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase">{new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 truncate mb-2 uppercase">{chat.lastMessage?.text || 'No messages'}</p>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${chat.type === 'ORDER' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>{chat.type}</span>
                                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{chat.contextId}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="col-span-8 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <AnimatePresence mode="wait">
                        {selectedChat ? (
                            <motion.div
                                key={selectedChat.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="h-full flex flex-col"
                            >
                                {/* Active Header */}
                                <div className="p-8 border-b border-slate-50 bg-[#1E293B] text-white flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-full bg-[#10367D] flex items-center justify-center border-2 border-white/10 shadow-xl">
                                            <FaUserCircle className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black italic tracking-tight">{selectedChat.user}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest italic">{selectedChat.type} CHAT</span>
                                                <div className="w-1 h-1 rounded-full bg-slate-600" />
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Context: <span className="text-white">{selectedChat.contextId}</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button className="py-2.5 px-6 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                                            <FaBox className="w-3 h-3" /> View Context Asset
                                        </button>
                                        <button className="py-2.5 px-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Report Issue</button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar bg-slate-50/30">
                                    {messages.map((m, i) => (
                                        <div key={i} className={`flex ${m.senderRole === 'DEALER' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-6 rounded-[2rem] text-[11px] font-medium leading-relaxed shadow-sm ${m.senderRole === 'DEALER' ? 'bg-[#10367D] text-white' : 'bg-white text-[#1E293B] border border-slate-100'
                                                }`}>
                                                {m.message}
                                                <div className={`text-[8px] mt-2 font-bold uppercase opacity-50 ${m.senderRole === 'DEALER' ? 'text-right' : 'text-left'}`}>
                                                    Feb 06, 14:23
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions & Input */}
                                <div className="p-10 border-t border-slate-50 space-y-8">
                                    <div className="flex items-center gap-4">
                                        {['Is this available?', 'Shipment delayed', 'Refund processing'].map((q) => (
                                            <button key={q} className="px-5 py-2.5 bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest rounded-xl hover:border-[#10367D] hover:text-[#10367D] transition-all">
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-6 bg-slate-50 border border-slate-200 rounded-[2rem] p-3 pl-8">
                                        <input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                            type="text"
                                            placeholder="Translate business intent into message..."
                                            className="flex-1 bg-transparent text-[11px] font-black uppercase tracking-widest focus:outline-none"
                                        />
                                        <button
                                            onClick={sendMessage}
                                            className="py-4 px-10 bg-[#10367D] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-[#10367D]/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-3"
                                        >
                                            Send <FaPaperPlane className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none" />
                                <div className="w-32 h-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-200 mb-8 shadow-sm">
                                    <FaCommentDots className="w-12 h-12" />
                                </div>
                                <h3 className="text-xl font-black text-slate-400 uppercase tracking-[0.2em] italic">Select Transmission</h3>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-4 max-w-[300px] leading-relaxed">
                                    Select an active contextual session to manage role-restricted communications and resolve business inquiries.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

