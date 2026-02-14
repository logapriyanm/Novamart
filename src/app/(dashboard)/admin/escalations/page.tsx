'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaShieldAlt,
    FaGavel,
    FaExclamationTriangle,
    FaLock,
    FaUnlock,
    FaEye,
    FaSearch,
    FaFilter,
    FaRegHandPaper,
    FaCheckCircle,
    FaBan
} from 'react-icons/fa';
import io from 'socket.io-client';
import { toast } from 'sonner';

const SOCKET_URL = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api').replace('/api', '') : 'http://localhost:5002';

const mockEscalations = [
    { id: 'esc_1', chatId: 'chat_123', type: 'REFUND_DISPUTE', reason: 'Seller not responding to warranty claim', priority: 'HIGH', status: 'OPEN', context: 'ORD-8821' },
    { id: 'esc_2', chatId: 'chat_456', type: 'QUALITY_ISSUE', reason: 'Bulk order batch mismatch', priority: 'MEDIUM', status: 'OPEN', context: 'SRC-2022' },
];

export default function AdminEscalationMonitor() {
    const [selectedEscalation, setSelectedEscalation] = useState<any>(null);
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [isFrozen, setIsFrozen] = useState(false);
    // const { showSnackbar } = useSnackbar();

    useEffect(() => {
        if (selectedEscalation) {
            const token = localStorage.getItem('auth_token');
            const socket = io(SOCKET_URL, {
                auth: { token }
            });

            // Join as Admin (Super-viewer)
            socket.emit('join-room', selectedEscalation.chatId);

            // Cleanup
            return () => {
                socket.disconnect();
            };
        }
    }, [selectedEscalation]);

    const resolveDispute = () => {
        // Resolve logic...
        toast.success('Dispute Resolved: Refund initiated to Customer');
    };

    const freezeChat = () => {
        setIsFrozen(!isFrozen);
        // Emit system message to chat...
    };

    return (
        <div className="h-[calc(100vh-180px)] flex flex-col gap-8 animate-fade-in text-[#1E293B]">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight uppercase italic">Governance <span className="text-rose-600">Escalations</span></h1>
                    <p className="text-slate-400 font-medium text-sm mt-1">High-Priority Intervention Queue</p>
                </div>
                <div className="flex items-center gap-4 py-3 px-6 bg-rose-50 border border-rose-100 rounded-[10px]">
                    <FaExclamationTriangle className="text-rose-600 w-4 h-4 animate-pulse" />
                    <span className="text-sm font-black text-rose-900">Active Disputes: <span className="text-rose-600">08 Critical</span></span>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-12 overflow-hidden">
                {/* Escalation Queue */}
                <div className="col-span-4 bg-white rounded-[10px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                            <input type="text" placeholder="PRIORITY FILTERS..." className="w-full bg-white border border-slate-200 rounded-[10px] py-3 pl-10 pr-4 text-sm font-black outline-none" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
                        {mockEscalations.map((esc) => (
                            <div
                                key={esc.id}
                                onClick={() => setSelectedEscalation(esc)}
                                className={`p-8 hover:bg-slate-50 transition-all cursor-pointer relative group ${selectedEscalation?.id === esc.id ? 'bg-rose-50/30' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-black px-2 py-0.5 rounded-[10px] border ${esc.priority === 'HIGH' ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-amber-100 text-amber-600 border-amber-200'
                                        }`}>{esc.priority} PRIORITY</span>
                                    <span className="text-sm font-black text-[#067FF9]">{esc.context}</span>
                                </div>
                                <h4 className="text-sm font-black text-[#1E293B] italic leading-tight mb-1">{esc.type.replace('_', ' ')}</h4>
                                <p className="text-sm font-bold text-slate-400 truncate">{esc.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mediation Terminal */}
                <div className="col-span-8 bg-white rounded-[10px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <AnimatePresence mode="wait">
                        {selectedEscalation ? (
                            <motion.div
                                key={selectedEscalation.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col"
                            >
                                {/* Admin Actions */}
                                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-[10px] bg-slate-900 flex items-center justify-center text-white shadow-xl">
                                            <FaGavel className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black italic tracking-tight">{selectedEscalation.type.replace('_', ' ')}</h3>
                                            <p className="text-sm font-black text-rose-500 mt-1">Status: Mediation in Progress</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={freezeChat}
                                            className={`py-2.5 px-6 rounded-[10px] text-sm font-black transition-all flex items-center gap-2 ${isFrozen ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                }`}
                                        >
                                            {isFrozen ? <><FaUnlock /> Unfreeze Room</> : <><FaLock /> Freeze Transmission</>}
                                        </button>
                                        <button
                                            onClick={resolveDispute}
                                            className="py-2.5 px-6 bg-emerald-500 text-white rounded-[10px] text-sm font-black hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                                        >
                                            Resolve & Close
                                        </button>
                                    </div>
                                </div>

                                {/* Audit Log View */}
                                <div className="flex-1 overflow-y-auto p-12 space-y-6 bg-slate-50/50">
                                    <div className="flex justify-center mb-8">
                                        <div className="px-6 py-2 bg-white rounded-[10px] border border-slate-200 flex items-center gap-3">
                                            <FaShieldAlt className="text-[#067FF9] w-3 h-3" />
                                            <span className="text-sm font-black text-[#1E293B] italic">Immutable Narrative Audit</span>
                                        </div>
                                    </div>
                                    {chatHistory.map((m, i) => (
                                        <div key={i} className={`flex ${m.senderRole === 'CUSTOMER' ? 'justify-start' : 'justify-end'}`}>
                                            <div className="max-w-[80%] p-6 bg-white border border-slate-100 rounded-[10px] shadow-sm">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-sm font-black text-[#067FF9] uppercase">{m.senderRole}</span>
                                                    <span className="text-xs font-bold text-slate-300">{m.createdAt}</span>
                                                </div>
                                                <p className="text-sm font-medium text-[#1E293B] leading-relaxed">{m.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Internal Admin Notes */}
                                <div className="p-10 border-t border-slate-50 bg-slate-50/30">
                                    <div className="flex items-center gap-6 bg-white border border-slate-200 rounded-[10px] p-3 pl-8">
                                        <FaRegHandPaper className="text-rose-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="LOG GOVERNANCE ACTIONS / INTERNAL NOTES..."
                                            className="flex-1 bg-transparent text-sm font-black focus:outline-none"
                                        />
                                        <button className="py-4 px-10 bg-slate-900 text-white rounded-[10px] font-black text-sm shadow-xl">
                                            Log Decision
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                                <FaShieldAlt className="w-20 h-20 text-slate-100 mb-8" />
                                <h3 className="text-xl font-black text-slate-300 uppercase tracking-[0.2em] italic">Governance Protocol Required</h3>
                                <p className="text-sm font-bold text-slate-300 mt-4">Select an escalation ticket to initiate mediation.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
