'use client';

import React from 'react';
import { useAuth } from '@/client/context/AuthContext';
import UnifiedChat from '@/client/components/features/chat/UnifiedChat';
import { FaRegClock } from 'react-icons/fa';

export default function DealerMessagingCenter() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="flex flex-col gap-8 animate-fade-in text-[#1E293B] h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">Message <span className="text-[#10367D]">Gateway</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Contextual Communication • Dealer Management</p>
                </div>
                <div className="hidden md:flex items-center gap-4 py-3 px-6 bg-blue-50/50 border border-blue-100 rounded-[10px]">
                    <FaRegClock className="text-[#10367D] w-4 h-4" />
                    <span className="text-[10px] font-black uppercase text-[#1E293B]">Avg Reply Time: <span className="text-[#10367D]">14 Minutes</span></span>
                </div>
            </div>

            <UnifiedChat currentUserRole="DEALER" currentUserId={user.id} />
        </div>
    );
}

